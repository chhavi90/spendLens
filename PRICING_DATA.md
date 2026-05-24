# Pricing Data

All prices used in the audit engine. Every number traces to an official vendor pricing page.
Last verified: 2025-05-21

---

## Cursor
Source: https://cursor.sh/pricing

- Hobby: $0/user/month (free tier, 2000 completions, 50 slow premium requests)
- Pro: $20/user/month | $16/user/month (annual)
- Business: $40/user/month
- Enterprise: Custom pricing (excluded from audit comparisons)

---

## GitHub Copilot
Source: https://github.com/features/copilot#pricing

- Individual: $10/user/month | $100/user/year (~$8.33/mo)
- Business: $19/user/month
- Enterprise: $39/user/month

---

## Claude (Anthropic)
Source: https://www.anthropic.com/pricing

- Free: $0/user/month
- Pro: $20/user/month
- Max: $100/user/month
- Team: $30/user/month (minimum 5 seats)
- Enterprise: Custom pricing (excluded from comparisons)
- API Direct: Usage-based (see Anthropic API section below)

---

## ChatGPT (OpenAI)
Source: https://openai.com/chatgpt/pricing/

- Free: $0/user/month
- Plus: $20/user/month
- Team: $30/user/month (monthly) | $25/user/month (annual, min 2 seats)
- Enterprise: Custom pricing
- API Direct: Usage-based (see OpenAI API section below)

---

## Anthropic API
Source: https://www.anthropic.com/pricing#api

Usage-based pricing (per million tokens):

| Model | Input | Output |
|---|---|---|
| Claude Haiku 3.5 | $0.80 | $4.00 |
| Claude Sonnet 4 | $3.00 | $15.00 |
| Claude Opus 4 | $15.00 | $75.00 |

Prompt caching available (reduces costs 80–90% for repeated context).

---

## OpenAI API
Source: https://openai.com/api/pricing/

Usage-based pricing (per million tokens):

| Model | Input | Output |
|---|---|---|
| GPT-4o mini | $0.15 | $0.60 |
| GPT-4o | $2.50 | $10.00 |
| o3 | $10.00 | $40.00 |
| o4-mini | $1.10 | $4.40 |

---

## Gemini (Google)
Source: https://one.google.com/about/ai-premium | https://ai.google.dev/pricing

- Free: $0/user/month (Gemini 1.5 Flash, limited Pro access)
- Advanced / Google One AI Premium: $19.99/user/month (includes 2TB storage)
- API: Usage-based via Google AI Studio / Vertex AI

---

## Windsurf (Codeium)
Source: https://windsurf.com/pricing

- Free: $0/user/month (basic completions, 5 Flow actions/day)
- Pro: $15/user/month (unlimited completions, unlimited Flow, GPT-4o + Claude)
- Teams: $35/user/month (min 5 seats, admin controls)
- Enterprise: Custom pricing

---

## Audit Engine Price Constants

The following constants are hardcoded in `src/lib/pricing-data.ts` and used by the audit engine:

```
cursor.pro.monthlyPricePerSeat       = 20
cursor.pro.annualPricePerSeat        = 16
cursor.business.monthlyPricePerSeat  = 40
github_copilot.individual            = 10
github_copilot.business              = 19
github_copilot.enterprise            = 39
claude.pro                           = 20
claude.max                           = 100
claude.team                          = 30   (min 5 seats)
chatgpt.plus                         = 20
chatgpt.team                         = 30   (monthly), 25 (annual)
gemini.advanced                      = 19.99
windsurf.pro                         = 15
windsurf.teams                       = 35   (min 5 seats)
```

All values in USD per user per month unless noted.
