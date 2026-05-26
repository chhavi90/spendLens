# Prompts

## AI Summary Prompt

Used in: `src/lib/ai-summary.ts` → `generateAISummary()`
Model: `claude-sonnet-4-20250514`
Max tokens: 256

### Full Prompt (as sent to the API)

```
You are an expert financial advisor specializing in SaaS and AI tool spend
optimization for startups. A company has just completed an AI spend audit.
Write a concise, personalized ~100-word summary of their audit results.

CONTEXT:
- Team size: {teamSize} people
- Primary use case: {useCase}
- Total monthly AI spend: {totalCurrentMonthly}
- Total potential monthly savings: {totalMonthlySavings}
- Total potential annual savings: {totalAnnualSavings}

TOOL-BY-TOOL FINDINGS:
{toolSummaries}  ← one line per tool: "- ToolName Plan: $X/mo → action (saves $Y/mo): reason"

INSTRUCTIONS:
- Be specific and reference their actual tools, plans, and numbers
- Sound like a CFO advisor, not a salesperson
- If savings are substantial, be clear about the opportunity without hyperbole
- If they're already spending well, say so honestly and briefly
- Do NOT mention Credex or any specific vendor by name in a promotional way
- Tone: direct, knowledgeable, helpful, no fluff
- Length: exactly 80-120 words
- Format: plain paragraph, no bullet points
```

### Why I Wrote It This Way

**"CFO advisor, not a salesperson"** — The biggest failure mode for AI-generated summaries in this context is sounding promotional. Adding this instruction dramatically reduces filler phrases like "exciting opportunity" or "significant potential."

**Explicit length constraint (80–120 words)** — Without this, Claude tends to write 200+ words. The summary is displayed in a UI card; it needs to be scannable.

**"Do NOT mention Credex"** — The Credex CTA is a separate UI component that shows up based on savings threshold. Mixing promotion into the AI summary would feel inauthentic and reduce trust in the audit.

**"Reference their actual tools, plans, and numbers"** — Forces the model to use the structured CONTEXT data rather than generating generic AI advice. Early versions without this produced advice like "consider consolidating your AI tools" with no specifics.

**No bullet points instruction** — The summary renders in a `<p>` tag. Markdown bullets in the output would display as literal asterisks.

---

### What I Tried That Didn't Work

**Version 1 — Too vague:**

```
Summarize this AI spend audit in 100 words.
```

Result: Generated generic advice ("consider reviewing your AI tool subscriptions")
with no reference to actual tools or numbers. Useless.

**Version 2 — Too prescriptive on structure:**

```
Write a 3-sentence summary: sentence 1 = current spend,
sentence 2 = savings, sentence 3 = recommendation.
```

Result: Mechanically correct but robotic. Sounded like a template, not an advisor.

**Version 3 — Missing the tone instruction:**
Without "sound like a CFO advisor, not a salesperson," the model defaulted to
marketing language ("unlock significant savings," "transform your AI investment").
Adding the persona instruction fixed this entirely.

---

## Fallback Template

When the Anthropic API is unavailable (no key, rate limit, network error),
`buildFallbackSummary()` in `ai-summary.ts` generates a deterministic paragraph:

**For high-savings case:**

> "Your team of {N} is spending {$X}/month on AI tools. The audit identified {$Y}/month
> ({$Z}/year) in potential savings across {N} tool(s). The biggest opportunity: {tool name}.
> These optimizations require no change in workflow quality — they're plan-level or vendor
> switches where equivalent capability exists at lower cost."

**For already-optimal case:**

> "Your team of {N} is spending {$X}/month on AI tools, and the audit finds you're already
> reasonably optimized for a {useCase}-focused workflow..."

The fallback is intentionally honest and specific — it uses the actual numbers from the
audit engine, so it's never generic even without the API.
