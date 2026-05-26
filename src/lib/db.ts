import { createClient } from "@supabase/supabase-js";
import { AuditFormData, AuditSummary, LeadCapture, SavedAudit } from "../types";
import { v4 as uuidv4 } from "uuid";

//  Client 

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables not configured");
  }
   const cleanUrl = url.replace(/\/$/, '');
  return createClient(url, key);
}

//  Audit CRUD 

export async function saveAudit(
  formData: AuditFormData,
  summary: AuditSummary
): Promise<string> {
  const id = uuidv4();

  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("audits").insert({
      id,
      form_data: formData,
      summary: summary,
      created_at: new Date().toISOString(),
      email_captured: false,
    });

    if (error) throw error;
    return id;
  } catch (error) {
    console.error("Failed to save audit:", error);
    // Return a local ID so the app still works without Supabase
    return id;
  }
}

export async function getAuditById(id: string): Promise<SavedAudit | null> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      formData: data.form_data,
      summary: data.summary,
      createdAt: data.created_at,
      emailCaptured: data.email_captured,
    };
  } catch {
    return null;
  }
}

export async function saveLeadCapture(lead: LeadCapture): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("leads").insert({
      email: lead.email,
      company_name: lead.companyName,
      role: lead.role,
      team_size: lead.teamSize,
      audit_id: lead.auditId,
      total_savings: lead.totalSavings,
      created_at: lead.createdAt,
    });

    if (error) throw error;

    // Mark audit as having email captured
    await supabase
      .from("audits")
      .update({ email_captured: true })
      .eq("id", lead.auditId);

    return true;
  } catch (error) {
    console.error("Failed to save lead:", error);
    return false;
  }
}

//  SQL Schema (run once in Supabase dashboard) 
/*
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  form_data JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email_captured BOOLEAN DEFAULT FALSE
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INTEGER,
  audit_id UUID REFERENCES audits(id),
  total_savings NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE rate_limits (
  ip TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read for audits (for shareable URLs)
CREATE POLICY "Public read audits" ON audits FOR SELECT USING (true);
-- Only service role can write
CREATE POLICY "Service insert audits" ON audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Service insert leads" ON leads FOR INSERT WITH CHECK (true);
*/
