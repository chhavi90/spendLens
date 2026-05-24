import { NextRequest, NextResponse } from "next/server";
import { getAuditById } from "../../../../lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const audit = await getAuditById(params.id);

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  // Strip PII from public response
  const publicSummary = {
    ...audit.summary,
  };

  const publicFormData = {
    tools: audit.formData.tools,
    teamSize: audit.formData.teamSize,
    useCase: audit.formData.useCase,
    // omit companyName intentionally
  };

  return NextResponse.json({
    id: audit.id,
    summary: publicSummary,
    formData: publicFormData,
    createdAt: audit.createdAt,
  });
}
