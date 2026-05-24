# Dev Log

## Day 1 — YYYY-MM-DD

**Hours worked:** 4

**What I did:**
Read the brief twice. Sketched the data model and the audit engine rules on paper before writing a line of code. Set up Next.js 14 with TypeScript, Tailwind, and Supabase. Got the basic project skeleton committed. Wrote the core types (`AuditFormData`, `AuditSummary`, `Recommendation`) and the pricing data file for all 8 tools — cross-referenced every number against official pricing pages and saved URLs in `PRICING_DATA.md`.

**What I learned:**
Claude Team plan has a minimum of 5 seats — a subtlety I nearly missed. ChatGPT Team is $25/user/month on annual billing but $30 on monthly; important for the savings math to be accurate.

**Blockers / what I'm stuck on:**
Deciding how to handle "custom pricing" plans (Cursor Enterprise, Claude Enterprise) in the audit engine. They have no public price, so savings comparisons are not possible. Decision: skip them in the audit engine with a note.

**Plan for tomorrow:**
Build the audit engine with all 5 rule types and write the first 5 tests. Want the engine fully tested before touching the UI.

---

## Day 2 — YYYY-MM-DD

**Hours worked:** 5

**What I did:**
Completed the audit engine (`src/lib/audit-engine.ts`) with all 5 rule types. Wrote 12 tests covering happy paths, edge cases, and the savings math. All green. Started the form component — `AuditForm` + `ToolRow` — and wired up `usePersistedForm` with localStorage. Form persists across reloads.

**What I learned:**
Testing pure functions first (audit engine) before building UI made the whole day significantly more productive. I caught a bug in the seat optimization logic where `entry.seats - teamSize` could go negative for single-user plans.

**Blockers / what I'm stuck on:**
The `ToolRow` component auto-recalculates spend when plan changes, but `useEffect` on `[entry.planId, entry.seats]` causes an extra render cycle. Added `eslint-disable` comment for now; will revisit.

**Plan for tomorrow:**
Build the results page, AI summary integration, and lead capture form. Deploy to Vercel staging.

---

## Day 3 — YYYY-MM-DD

**Hours worked:** 6

**What I did:**
Built `AuditResults`, `LeadCaptureForm`, and `CredexCTA` components. Integrated Anthropic API for the 100-word summary with fallback. Deployed to Vercel — live at staging URL. Wired up Supabase for audit storage. Ran first real end-to-end audit from my browser.

**What I learned:**
The Anthropic API timeout in the audit route needs a try/catch — first test in production failed because I didn't have the key set yet, and the unhandled error killed the whole response. Added fallback immediately.

**Blockers / what I'm stuck on:**
Resend free tier domain verification is taking time. Emails not sending yet; will finish tomorrow.

**Plan for tomorrow:**
Finish email integration, build `/share/:id` page with OG tags, write entrepreneurial files (GTM, ECONOMICS, USER_INTERVIEWS).

---

## Day 4 — YYYY-MM-DD

**Hours worked:** 5

**What I did:**
Domain verified on Resend; transactional emails working. Built `/share/:id` with server-side OG metadata. Conducted first two user interviews (via cold DMs on Twitter). Wrote PRICING_DATA.md with sources for all 8 tools.

**What I learned:**
The first user I interviewed immediately asked "does this work for AWS Bedrock spend?" — a gap I hadn't considered. Added a note in REFLECTION.md and flagged it as a Week 2 feature.

**Blockers / what I'm stuck on:**
OG image generation (`/api/og/:id`) is a nice-to-have but not in MVP scope. Using static placeholder for now.

**Plan for tomorrow:**
Third user interview, CI setup, accessibility audit, final polish pass.

---

## Day 5 — YYYY-MM-DD

**Hours worked:** 4

**What I did:**
Set up GitHub Actions CI (lint + test on push to main). Third user interview — took 20 minutes instead of 15, got great quotes. Fixed two accessibility issues (missing aria-labels on icon buttons, low contrast on muted text). Wrote GTM.md and ECONOMICS.md.

**What I learned:**
Lighthouse mobile Performance score dropped to 78 because of the Google Fonts import. Switched to `font-display: swap` and preconnect links; score now 87.

**Blockers / what I'm stuck on:**
None blocking. Want to improve the share page design before submission.

**Plan for tomorrow:**
Write REFLECTION.md and LANDING_COPY.md. Final QA pass on mobile.

---

## Day 6 — YYYY-MM-DD

**Hours worked:** 4

**What I did:**
Wrote all remaining documentation: REFLECTION.md, LANDING_COPY.md, METRICS.md, TESTS.md. Ran full Lighthouse audit on deployed URL — Performance 88, Accessibility 94, Best Practices 92. Fixed one more accessibility issue (missing `<label>` on number input). Final QA: form persistence, share URLs, email delivery, mobile responsiveness.

**What I learned:**
Writing REFLECTION.md took longer than expected because the "hardest bug" question made me actually think carefully about what went wrong rather than summarizing. The audit engine's edge case on empty `tools` array caused a silent divide-by-zero; caught it only because I was stress-testing manually.

**Blockers / what I'm stuck on:**
The Credex consultation booking link is a placeholder (`https://credex.rocks`) since I don't have the real Calendly URL.

**Plan for tomorrow:**
Final review of all files against the rubric. Submit.

---

## Day 7 — YYYY-MM-DD

**Hours worked:** 2

**What I did:**
Final rubric review. Verified git log shows commits on 5+ distinct calendar days. Checked all required files exist at repo root. Verified live URL is reachable. Ran `npm test` one final time — all 12 tests green. Submitted Google Form.

**What I learned:**
Building something end-to-end in a week forces decisions that a month-long project would defer. The constraint made me ship faster and think more carefully about what actually mattered.

**Blockers / what I'm stuck on:**
N/A — submitted.

**Plan for tomorrow:**
Wait for Round 2 results.
