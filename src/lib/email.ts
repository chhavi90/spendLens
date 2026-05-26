import { Resend } from "resend";
import { AuditSummary } from "../types";
import { formatCurrency } from "./audit-engine";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendAuditConfirmationEmail(
  email: string,
  summary: AuditSummary,
  shareUrl: string,
  highSavingsCase: boolean
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend not configured — skipping confirmation email");
    return false;
  }

  const subject = summary.isAlreadyOptimal
    ? "Your SpendLens AI Audit — You're Spending Well 👍"
    : `Your SpendLens AI Audit — ${formatCurrency(summary.totalMonthlySavings)}/mo in potential savings found`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
</head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <div style="margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">SpendLens</h1>
    <p style="color: #666; margin: 0;">Your AI Spend Audit</p>
  </div>

  <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="font-size: 14px; color: #666; margin: 0 0 4px;">CURRENT MONTHLY SPEND</p>
    <p style="font-size: 32px; font-weight: 700; margin: 0;">${formatCurrency(summary.totalCurrentMonthly)}</p>
  </div>

  ${
    !summary.isAlreadyOptimal
      ? `
  <div style="background: #0a0a0a; color: #fff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="font-size: 14px; color: #888; margin: 0 0 4px;">POTENTIAL SAVINGS</p>
    <p style="font-size: 32px; font-weight: 700; margin: 0 0 4px; color: #4ade80;">${formatCurrency(summary.totalMonthlySavings)}<span style="font-size: 18px; color: #888;">/mo</span></p>
    <p style="font-size: 18px; color: #888; margin: 0;">${formatCurrency(summary.totalAnnualSavings)}/year</p>
  </div>
  `
      : `
  <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <p style="font-size: 16px; font-weight: 600; color: #166534; margin: 0;">✓ You're already spending well on AI tools.</p>
  </div>
  `
  }

  ${
    summary.aiSummary
      ? `<div style="margin-bottom: 24px;">
      <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 8px;">Analysis</h2>
      <p style="color: #444; line-height: 1.6; margin: 0;">${summary.aiSummary}</p>
    </div>`
      : ""
  }

  <div style="margin-bottom: 24px;">
    <a href="${shareUrl}" style="display: inline-block; background: #0a0a0a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Full Audit →</a>
  </div>

  ${
    highSavingsCase
      ? `
  <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 8px;">Capture More Savings with Credex</h2>
    <p style="color: #444; line-height: 1.6; margin: 0 0 16px;">Your audit shows significant potential savings. Credex offers discounted AI infrastructure credits for Cursor, Claude, ChatGPT Enterprise, and more. Our team will reach out to discuss options for your specific stack.</p>
    <a href="https://credex.rocks" style="color: #0a0a0a; font-weight: 600; font-size: 14px;">Learn about Credex →</a>
  </div>
  `
      : ""
  }

  <p style="color: #999; font-size: 12px;">SpendLens by Credex · <a href="https://credex.rocks" style="color: #999;">credex.rocks</a></p>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: "SpendLens <onboarding@resend.dev>",
      to: email,
      subject,
      html: htmlBody,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
