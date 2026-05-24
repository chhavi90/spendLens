# Reflection

## 1. The Hardest Bug

The hardest bug was in the `ToolRow` component — specifically the `useEffect` that auto-recalculates `monthlySpend` when `planId` or `seats` changes.

The symptom: every time a user changed the plan dropdown, the monthly spend field would flicker twice — first showing the correct value, then reverting, then showing the correct value again. On slower machines it caused a visible double-render flash.

**Hypothesis 1:** The parent component's `updateTool` callback was creating a new function reference on every render, causing the `useEffect` to re-fire unnecessarily. I tried wrapping `updateTool` in `useCallback` in `AuditForm.tsx`. The flickering continued.

**Hypothesis 2:** The `useEffect` dependency array was wrong. It listed `[entry.planId, entry.seats]` but `entry` itself was also changing (because `onChange` was being called inside the effect, which triggered a state update, which re-rendered the parent, which passed a new `entry` prop, which triggered the effect again). Classic loop.

**What worked:** I moved the spend calculation out of `useEffect` entirely and into the `handleToolChange` function in `ToolRow`. When the user selects a new plan, `handleToolChange` immediately computes the new spend and calls `onChange` once with both the new `planId` and the new `monthlySpend`. No effect loop, no double render. The `useEffect` is still there for the seats case (changing seat count should update spend) but the dependency array is now minimal and the loop can't form.

**Lesson:** `useEffect` that calls a prop callback is almost always the wrong pattern. Compute and call once in the event handler instead.

---

## 2. A Decision I Reversed

I initially designed the audit engine to use the Anthropic API for the per-tool recommendations — giving Claude a description of the tool, plan, and team size and asking it to recommend an action. It felt elegant: one AI call to rule them all, no hardcoded rules.

I reversed this on Day 2 after writing the prompt and testing it.

**Why:** The outputs were not defensible. When I asked Claude (via API) "is Cursor Business at $40/user/mo the right plan for a 5-person coding team?" it gave different answers on different runs. Sometimes it said yes, sometimes it said switch to GitHub Copilot, sometimes it mentioned tools I hadn't listed. The reasoning sounded plausible but wasn't traceable to a specific number or rule.

The assignment brief explicitly says "the logic must be defensible — a finance person should read your reasoning and agree." LLM outputs don't meet that bar for financial recommendations. Hardcoded rules with cited pricing sources do.

Reversed decision: the audit engine is 100% deterministic TypeScript. The only AI call is the 100-word summary paragraph, which is labelled as an "analysis" — interpretation, not math. This is also what the brief was testing.

---

## 3. What I Would Build in Week 2

**AWS Bedrock / Azure OpenAI spend tracking** — Every user I interviewed either asked about this or mentioned it unprompted. Enterprise teams running models through cloud providers are spending 5–10× more than SaaS users, and none of them have a benchmark. This is a bigger TAM than the SaaS seat market.

**Benchmark mode** — "Your AI spend per developer is $87/mo. Companies your size (10–50 engineers) average $52/mo." This is the single feature that makes the tool shareable and discussion-worthy. It requires aggregating data from real audits, which we'd have after Week 1 launch.

**Embeddable widget** — A `<script>` tag that bloggers and newsletters can embed. "How does your AI spend compare?" with a mini 3-question form. This is the distribution flywheel — 100 embeds means 100 traffic sources.

**PDF export** — Polished one-page PDF report suitable for sending to a CFO or board. This is the artifact that justifies the email capture — people want something they can forward.

**Slack integration** — Monthly digest: "Your team spent $X on AI tools last month. Here's what changed." Recurring touchpoint that keeps Credex top-of-mind.

---

## 4. How I Used AI Tools

**Tools used:** Claude (claude.ai), GitHub Copilot in VS Code.

**What I used Claude for:**
- Drafting the initial TypeScript interfaces in `types/index.ts` — I described the data model in prose and Claude produced the first draft. I rewrote about 40% of it.
- Boilerplate for the Resend email HTML — tedious table-based email layout. Claude did the first pass, I edited the copy and fixed the styling.
- Checking my ECONOMICS.md math — I described my assumptions and asked if the unit economics logic held. It caught one error: I had used monthly LTV where I should have used annual in the payback period calculation.

**What I used Copilot for:**
- Inline autocomplete for repetitive TypeScript patterns (the `switch` statement in `formatActionLabel`, the `grid-cols-*` Tailwind class variations).
- Completing `import` statements.

**What I didn't trust AI with:**
- The audit engine rules. I wrote every rule by hand because the logic needs to be traceable and correct. AI-generated rules contained subtle errors — one version suggested downgrading from Cursor Pro to Hobby for teams of 3, ignoring that Hobby has a hard cap of 50 premium requests/month that would be hit immediately by active developers.
- The pricing data. Every number in `PRICING_DATA.md` was verified against the official pricing page. I did not trust AI to know current prices.
- The git history. I committed manually at real points of work, not just at the end.

**One specific time the AI was wrong:**
I asked Claude to suggest alternative tools for the `checkAlternativeTool` function. It suggested "Codeium as a free alternative to GitHub Copilot." Codeium is the company behind Windsurf — it no longer offers a standalone free coding assistant. The product is now Windsurf. If I had used this suggestion unchecked, the audit engine would have recommended a product that doesn't exist as described.

---

## 5. Self-Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Committed on 6 of 7 days. Day 3 had a 3-hour gap where I got stuck on the useEffect bug and walked away — in retrospect I should have written it down and moved on. |
| Code quality | 8/10 | Types are clean, audit engine is fully tested, no `any` types. Would improve: the `ToolRow` component is still doing too much — the spend recalculation logic should probably move to a custom hook. |
| Design sense | 7/10 | The results page is clean and readable. The form works. What's missing is delight — the hero savings number should animate counting up, the tool rows could have logos. Functional but not memorable. |
| Problem-solving | 8/10 | Caught the "don't use AI for audit math" trap early. The rate limiting and honeypot decisions were correct for the scale. |
| Entrepreneurial thinking | 7/10 | The GTM and ECONOMICS documents have real numbers and specific channels. The user interviews surfaced a genuine gap (cloud spend). What I underinvested in: thinking about the Credex sales motion more concretely — I described the lead funnel but not how a Credex rep would actually close someone who completes an audit. |
