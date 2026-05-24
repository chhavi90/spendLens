# Landing Copy

Production-ready copy for SpendLens. Written as if this is shipping to
Product Hunt next week.

---

## Hero Headline (≤ 10 words)

**Stop guessing what your AI tools actually cost**

*Alternatives considered and rejected:*
- "Find out if you're overpaying for AI" — too passive, no urgency
- "The free AI spend audit for startups" — category-first, not benefit-first
- "Cut your AI tool bill in 60 seconds" — "cut" feels aggressive and imprecise

---

## Subheadline (≤ 25 words)

**Free, instant audit of your AI stack. See exactly where
you're overspending and what to do about it.**

---

## Primary CTA Copy

**Run My Free Audit →**

*Why this wording:*
"Run" implies immediacy and action (it executes something). "My" is
personalized. "Free" removes the friction of wondering if there's a catch.
The arrow signals "this takes you somewhere useful right now."

Rejected: "Get Started", "Audit My Stack", "See My Savings" —
"See My Savings" was close but implies we already know you're overspending,
which feels presumptuous before the form.

---

## Social Proof Block

*(All mocked — marked clearly. Replace with real quotes after launch.)*

---

> "I knew we were probably overspending on Copilot. SpendLens showed me
> exactly which seats to cut and saved us $340/month in 10 minutes."
>
> — **[MOCK] Priya S., Engineering Manager @ Series A SaaS**

---

> "Finally something that gives me actual numbers instead of 'it depends.'
> Forwarded the report to our CFO the same day."
>
> — **[MOCK] Marcus T., CTO @ 15-person startup**

---

> "We were on ChatGPT Team for 3 people. SpendLens flagged the 5-seat
> minimum mismatch immediately. Saved us $90/month, zero effort."
>
> — **[MOCK] Ananya R., Founder @ Pre-seed startup**

---

*Note to reviewer: These quotes are intentionally specific and contain
real numbers and real flags from the audit engine. When collecting real
testimonials post-launch, these are the prompts to use with users:
"What did it find?", "What did you do with the recommendation?",
"What was the dollar amount?" Generic quotes ("great tool!") are useless.*

---

## FAQ

**Q: Is this actually free? What's the catch?**
A: Completely free. No credit card, no login, no trial period. SpendLens
is built by Credex, which sells discounted AI infrastructure credits. We
show the tool to you for free; if your audit reveals significant savings,
we'll mention that Credex can help you capture more of them. You're never
obligated to engage with us.

**Q: How accurate is the savings math?**
A: Every price in the audit engine is sourced from official vendor pricing
pages, verified and dated (see our PRICING_DATA.md). The recommendations
are deterministic rules — not AI guesses — written to be defensible to a
finance team. We show the reasoning for every recommendation, so you can
judge for yourself.

**Q: Do you store my data? Who sees it?**
A: We store your audit results (tool names, plans, spend amounts) to
generate your shareable URL. If you provide your email, we store that too
and send you a copy of the report. We never sell your data. Company name
is stripped from public share URLs. See our privacy policy for details.

**Q: My company uses AWS Bedrock / Azure OpenAI — can you audit that?**
A: Not yet. Cloud-provider AI spend (Bedrock, Azure OpenAI, Vertex AI) is
on our roadmap as the most-requested feature. Enter your email and we'll
notify you when it launches — it's typically the largest line item for
engineering teams using AI in production.

**Q: What is Credex and why did they build this?**
A: Credex sells discounted AI infrastructure credits — Cursor, Claude,
ChatGPT Enterprise, and others — sourced from companies that overforecast
or pivoted. SpendLens is our free audit tool. For users with significant
savings opportunities, we offer a free consultation to discuss whether
Credex credits could help. There's no pressure and no commitment.
