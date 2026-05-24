# Metrics

## North Star Metric

**Qualified leads generated per week**
(defined as: email captured from an audit showing ≥ $200/mo in potential savings)

### Why this metric, not others

SpendLens is a lead-generation asset for Credex. Its success is not measured
by pageviews or even audit completions — it's measured by how many people
with real savings potential hand over their email and become reachable by
the Credex sales team.

"Qualified" is the key word. An audit from a solo developer spending $20/mo
is not a Credex lead. An audit from an engineering manager with $800/mo in
identified savings is. The $200/mo threshold is conservative — it maps to
$2,400/year in potential savings, which is a meaningful enough number that
the person has reason to talk to Credex.

DAU or total audit completions are vanity metrics for this product. People
use this tool once per quarter at most — optimizing for retention or
engagement would be the wrong direction entirely.

---

## 3 Input Metrics That Drive the North Star

### 1. Audit completion rate
**Definition:** (audits submitted) / (users who add at least one tool)
**Why it matters:** Users who start the form but don't submit represent
conversion leakage. If this rate drops below 60%, the form is too long,
too confusing, or asking for information people don't have handy.
**Target:** ≥ 70%

### 2. High-savings rate
**Definition:** (audits showing ≥ $200/mo savings) / (total audits completed)
**Why it matters:** This is the denominator for the North Star. If only
5% of audits show meaningful savings, we're attracting the wrong audience
(solo devs on $20/mo plans instead of engineering managers with real
budgets). The GTM strategy should be tuned to attract higher-spend users.
**Target:** ≥ 30% of completed audits

### 3. Email capture rate (post-audit)
**Definition:** (emails captured) / (audits completed)
**Why it matters:** The email gate comes after value is shown. If people
complete the audit but don't leave their email, either the audit results
didn't feel credible, or the CTA copy is wrong.
**Target:** ≥ 40% for high-savings audits, ≥ 15% for already-optimal audits

---

## What I'd Instrument First

On day one of launch, before anything else:

1. **Audit submitted event** — with properties: `tool_count`, `total_spend`,
   `use_case`, `team_size`. This gives us the distribution of user profiles
   immediately.

2. **Audit result viewed event** — with `total_monthly_savings`,
   `high_savings_case` boolean. Tells us what % of our traffic has real
   savings potential.

3. **Email captured event** — with `total_savings`, `company_name_provided`
   boolean. The actual conversion event.

4. **Share link copied** — with `audit_savings`. Measures the viral loop.

I would not instrument UI micro-interactions (hover states, scroll depth)
in week one. The signal-to-noise ratio is too low and the instrumentation
cost is too high relative to what we'd learn.

Tool: Posthog (open source, self-hostable, generous free tier) over
Mixpanel or Amplitude — lower cost at launch scale and simpler setup.

---

## What Number Triggers a Pivot Decision

**If after 500 audit completions:**

- Email capture rate < 15% overall → The audit results are not credible
  or the value proposition isn't landing. Pivot: add "how we calculated
  this" explainers, cite sources inline, add a confidence indicator per
  recommendation.

- High-savings rate < 15% → We're attracting the wrong audience. The
  product is working for individual developers, not the engineering
  managers and CTOs who are Credex's real buyers. Pivot: change
  distribution channels — stop posting in indie hacker communities,
  focus entirely on CTO/EM Twitter and Slack groups.

- Audit completion rate < 40% → The form is too long or asks for
  information people don't have. Pivot: reduce to 3 required fields
  (tool, plan, seats) and make spend optional with a "use catalog
  price" toggle.

- Qualified leads per week = 0 after 4 weeks → The savings math is not
  compelling enough to drive the Credex consultation step. Pivot: add
  the benchmark feature ("companies your size spend $X/dev") to make
  the savings feel more concrete and comparative.
