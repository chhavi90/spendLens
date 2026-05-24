# SpendLens — Free AI Spend Audit for Startups

SpendLens is a free web tool that audits your AI tool stack in 60 seconds and surfaces exactly where you're overspending — wrong plans, excess seats, better alternatives — with defensible numbers. Built as a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Live:** https://spendlens.app | **Repo:** github.com/yourusername/spendlens

---

## Screenshots

![Hero and Audit Form](docs/screenshot-form.png)
*The audit form — clean, persistent across reloads, takes 60 seconds to fill*

![Audit Results](docs/screenshot-results.png)
*Results page — per-tool breakdown, hero savings metric, AI-generated summary*

![Share View](docs/screenshot-share.png)
*Shareable public URL — no PII, OG tags for clean previews*

> Or watch the 30-second walkthrough: https://loom.com/share/your-recording-id

---

## Quick Start

```bash
# Install
npm install

# Configure environment
cp .env.example .env.local
# Fill in: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
#           NEXT_PUBLIC_SUPABASE_ANON_KEY, RESEND_API_KEY, NEXT_PUBLIC_APP_URL

# Run locally
npm run dev
# → http://localhost:3000

# Run tests
npm test

# Build for production
npm run build
```

### Deploy to Vercel

```bash
npx vercel
# Set environment variables in Vercel dashboard
```

### Supabase Setup

Run the SQL in `src/lib/db.ts` (at the bottom, in the comment block) against your Supabase project to create the `audits` and `leads` tables.

---

## Decisions

1. **Next.js App Router over Vite + Express** — Server components let us handle the shared `/share/[id]` page with proper OG metadata server-side without a separate API server. The trade-off: slightly more complex mental model, but unified deployment on Vercel is worth it.

2. **Hardcoded audit rules over LLM-driven audit logic** — The brief explicitly tests "knowing when NOT to use AI." Audit math is deterministic and needs to be defensible to a finance person. LLMs hallucinate prices. Rules + cited sources are verifiably correct. Only the 100-word summary paragraph uses the Anthropic API, and it gracefully falls back to a template.

3. **In-memory rate limiting over Redis** — Redis adds a deployment dependency. For launch-scale traffic (hundreds of daily audits), in-memory per-dyno limiting is sufficient. The comment in `rate-limit.ts` documents the migration path to Upstash when needed.

4. **Supabase over self-hosted Postgres** — Free tier covers our launch needs (500MB, 50k rows), hosted in us-east-1, and the JS SDK is excellent. Trade-off: vendor lock-in on Postgres extensions and auth if we expand. Acceptable for an MVP.

5. **Form state persisted to localStorage** — Users often close a tab mid-form. Persisting to localStorage (with `usePersistedForm` hook) means they return to their exact state. The trade-off: state can go stale if pricing changes. We clear stale state on schema version mismatch via a storage key version suffix (`_v1`).

---

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md)

## Dev Log

See [DEVLOG.md](DEVLOG.md)
