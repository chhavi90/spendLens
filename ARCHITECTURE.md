# Architecture

## System Diagram

```mermaid
graph TD
    A[User: Browser] -->|Fill form + Submit| B[Next.js App Router]
    B -->|POST /api/audit| C[Audit Engine\nPure TypeScript Functions]
    C -->|Deterministic rules| D[AuditSummary]
    D -->|POST to Anthropic API| E[Claude claude-sonnet-4\n~100-word summary]
    E -->|Fallback on error| F[Template Summary]
    D --> G[Supabase: audits table\nStores formData + summary]
    G -->|Returns UUID| H[AuditResults Component]
    H -->|User enters email| I[POST /api/leads]
    I --> J[Supabase: leads table]
    I --> K[Resend: Transactional email\nwith report + share URL]
    H -->|Share button| L[/share/:id page]
    L -->|GET /api/share/:id| M[Strip PII, return public summary]
    M -->|OG meta tags| N[Twitter/Slack/LinkedIn\nLink Preview]
```

## Data Flow

1. **Input**: User fills the form (`AuditFormData`): list of tool entries (toolId, planId, seats, monthlySpend), teamSize, useCase.
2. **Persistence**: `usePersistedForm` hook writes form state to `localStorage` on every change. On reload, state is restored.
3. **Submission**: `POST /api/audit` — validates with Zod, runs honeypot check, checks rate limit.
4. **Audit Engine** (`src/lib/audit-engine.ts`): Pure functions. For each tool entry, runs 5 deterministic rules in order: (1) overpayment vs catalog, (2) wrong plan for team size, (3) seat optimization, (4) alternative tool recommendation (use-case aware), (5) credits opportunity. Returns scored, ranked recommendations per tool.
5. **AI Summary**: `POST` to Anthropic API with a structured prompt. On any failure (network, rate limit, missing key), falls back to a template paragraph. Result appended to `AuditSummary`.
6. **Storage**: Full `AuditFormData` + `AuditSummary` written to Supabase `audits` table. Returns UUID.
7. **Results page**: Rendered client-side from the API response. No additional DB read needed for first view.
8. **Lead capture**: On email submit, `POST /api/leads` writes to `leads` table, marks audit as `email_captured`, and sends a transactional email via Resend.
9. **Share URL**: `/share/:id` fetches from `/api/share/:id` (server component). PII stripped (no company name/email). OG meta tags generated server-side from the summary numbers.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components for OG tags, unified API routes, Vercel-native |
| Language | TypeScript | Required for defensible type safety in the audit engine |
| Styling | Tailwind CSS | Fastest path to production-quality UI; no runtime overhead |
| UI Primitives | Radix UI | Accessible, unstyled, composable |
| Database | Supabase (Postgres) | Free tier sufficient for MVP; hosted, instant setup |
| Email | Resend | Best DX among transactional email services; generous free tier |
| AI | Anthropic SDK (claude-sonnet-4) | First-party client; streaming-ready if we upgrade the summary feature |
| Testing | Jest + Testing Library | Standard Next.js testing stack |
| CI | GitHub Actions | Runs lint + tests on every push to main |
| Deploy | Vercel | Zero-config Next.js deploy; edge CDN for the share pages |

## Scaling to 10k Audits/Day

1. **Rate limiting**: Replace in-memory map with [Upstash Redis](https://upstash.com) — `@upstash/ratelimit` drops in with no API changes.
2. **AI summary**: Move to async queue (Inngest or BullMQ). Emit audit ID after saving, generate summary in background, stream result to client via Server-Sent Events or poll endpoint.
3. **Database**: Supabase scales to millions of rows; add indexes on `leads.audit_id` and `audits.created_at`. At very high scale, add read replicas.
4. **CDN**: `/share/:id` pages are already `cache: no-store` (fresh data). At scale, switch to `revalidate: 60` and serve from Vercel's Edge Cache — share pages are public and change rarely.
5. **Pricing data**: Move from hardcoded TypeScript to a JSON file in a private S3 bucket, refreshed nightly by a cron job that scrapes + diffs official pricing pages. Alert on change.
