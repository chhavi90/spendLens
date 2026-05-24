import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveLeadCapture } from "../../../lib/db";
import { sendAuditConfirmationEmail } from "../../../lib/email";
import { getAuditById } from "../../../lib/db";
import { checkRateLimit, getClientIp } from "../../../lib/rate-limit";

const leadSchema = z.object({
  email: z.string().email("Invalid email address"),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().int().positive().optional(),
  auditId: z.string().uuid("Invalid audit ID"),
  // Honeypot
  phone2: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.phone2) {
    return NextResponse.json({ error: "Bot detected" }, { status: 400 });
  }

  const audit = await getAuditById(parsed.data.auditId);
  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const lead = {
    email: parsed.data.email,
    companyName: parsed.data.companyName,
    role: parsed.data.role,
    teamSize: parsed.data.teamSize,
    auditId: parsed.data.auditId,
    totalSavings: audit.summary.totalMonthlySavings,
    createdAt: new Date().toISOString(),
  };

  await saveLeadCapture(lead);

  // Send confirmation email
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://spendlens.app"}/share/${parsed.data.auditId}`;
  await sendAuditConfirmationEmail(
    parsed.data.email,
    audit.summary,
    shareUrl,
    audit.summary.highSavingsCase
  );

  return NextResponse.json({ success: true }, { status: 200 });
}
