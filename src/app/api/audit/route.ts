import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAuditEngine } from "../../../lib/audit-engine";
import { generateAISummary } from "../../../lib/ai-summary";
import { saveAudit } from "../../../lib/db";
import { checkRateLimit, getClientIp } from "../../../lib/rate-limit";
import { AuditFormData } from "../../../types";

const toolEntrySchema = z.object({
  toolId: z.enum([
    "cursor", "github_copilot", "claude", "chatgpt",
    "anthropic_api", "openai_api", "gemini", "windsurf",
  ]),
  planId: z.string().min(1),
  seats: z.number().int().positive(),
  monthlySpend: z.number().nonnegative(),
});

const auditRequestSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
  teamSize: z.number().int().positive(),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  companyName: z.string().optional(),
  // Honeypot field — must be empty
  website: z.string().max(0, "Bot detected").optional(),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in an hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot check
  if (parsed.data.website) {
    return NextResponse.json({ error: "Bot detected" }, { status: 400 });
  }

  const formData: AuditFormData = {
    tools: parsed.data.tools,
    teamSize: parsed.data.teamSize,
    useCase: parsed.data.useCase,
    companyName: parsed.data.companyName,
  };

  // Run audit engine
  const summary = runAuditEngine(formData);

  // Generate AI summary (with graceful fallback)
  summary.aiSummary = await generateAISummary(formData, summary);

  // Persist to DB
  const auditId = await saveAudit(formData, summary);
  summary.id = auditId;

  return NextResponse.json({ auditId, summary }, { status: 200 });
}
