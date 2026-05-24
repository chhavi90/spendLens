import Anthropic from "@anthropic-ai/sdk";
import { AuditFormData, AuditSummary } from "../types";
import { formatCurrency } from "./audit-engine";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * The full prompt is documented in PROMPTS.md
 */
function buildPrompt(formData: AuditFormData, summary: AuditSummary): string {
  const toolSummaries = summary.toolResults
    .map(
      (r) =>
        `- ${r.toolDef.name} ${r.currentPlan.name}: $${r.currentMonthlyCost}/mo → Best action: ${r.bestRecommendation.action} (saves $${r.bestRecommendation.monthlySavings.toFixed(0)}/mo): ${r.bestRecommendation.reason}`
    )
    .join("\n");

  return `You are an expert financial advisor specializing in SaaS and AI tool spend optimization for startups. A company has just completed an AI spend audit. Write a concise, personalized ~100-word summary of their audit results.

CONTEXT:
- Team size: ${formData.teamSize} people
- Primary use case: ${formData.useCase}
- Total monthly AI spend: ${formatCurrency(summary.totalCurrentMonthly)}
- Total potential monthly savings: ${formatCurrency(summary.totalMonthlySavings)}
- Total potential annual savings: ${formatCurrency(summary.totalAnnualSavings)}

TOOL-BY-TOOL FINDINGS:
${toolSummaries}

INSTRUCTIONS:
- Be specific and reference their actual tools, plans, and numbers
- Sound like a CFO advisor, not a salesperson
- If savings are substantial, be clear about the opportunity without hyperbole
- If they're already spending well, say so honestly and briefly
- Do NOT mention Credex or any specific vendor by name in a promotional way
- Tone: direct, knowledgeable, helpful, no fluff
- Length: exactly 80-120 words
- Format: plain paragraph, no bullet points`;
}

function buildFallbackSummary(formData: AuditFormData, summary: AuditSummary): string {
  if (summary.isAlreadyOptimal) {
    return `Your team of ${formData.teamSize} is spending ${formatCurrency(summary.totalCurrentMonthly)}/month on AI tools, and the audit finds you're already reasonably optimized for a ${formData.useCase}-focused workflow. Your current tool selection aligns well with team size and usage patterns. That said, as your team grows or your use cases shift, revisit this audit — the AI tooling landscape changes quickly, and even a 10–15% reduction in spend adds up over time.`;
  }

  return `Your team of ${formData.teamSize} is spending ${formatCurrency(summary.totalCurrentMonthly)}/month on AI tools. The audit identified ${formatCurrency(summary.totalMonthlySavings)}/month (${formatCurrency(summary.totalAnnualSavings)}/year) in potential savings across ${summary.toolResults.length} tool(s). The biggest opportunity: ${summary.toolResults.sort((a, b) => b.bestRecommendation.monthlySavings - a.bestRecommendation.monthlySavings)[0]?.toolDef.name ?? "your top tool"}. These optimizations require no change in workflow quality — they're plan-level or vendor switches where equivalent capability exists at lower cost.`;
}

export async function generateAISummary(
  formData: AuditFormData,
  summary: AuditSummary
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackSummary(formData, summary);
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: buildPrompt(formData, summary),
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return buildFallbackSummary(formData, summary);
    }

    return textBlock.text.trim();
  } catch (error) {
    console.error("Anthropic API error:", error);
    return buildFallbackSummary(formData, summary);
  }
}

export { buildFallbackSummary };
