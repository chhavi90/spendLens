# Tests

## How to Run

```bash
# Run all tests
npm test

# Run in watch mode (re-runs on file save)
npm run test:watch

# Run with coverage report
npx jest --coverage
```

All tests are located in `src/lib/audit-engine.test.ts`.

---

## Test List

### File: `src/lib/audit-engine.test.ts`

| # | Test Name | What It Covers |
|---|---|---|
| 1 | `detects when user pays more than catalog price` | Flags `overpaying_vs_catalog` when `monthlySpend > catalogPrice × seats` |
| 2 | `does NOT flag overpayment when spend matches catalog price` | No false positive when spend exactly matches catalog |
| 3 | `flags Claude Team plan for a 2-person team (min is 5 seats)` | `wrong_plan_for_team_size` rule fires when seats < plan minimum |
| 4 | `does NOT flag Claude Team plan for a 6-person team` | No false positive for valid team size |
| 5 | `flags excess seats when paying for significantly more than team size` | Seat optimization recommendation generated when seats > teamSize × 1.2 |
| 6 | `does NOT flag seats when seats equal team size` | No seat optimization false positive |
| 7 | `suggests Windsurf Teams as alternative to Cursor Business for coding` | Alternative tool recommendation fires for coding use case |
| 8 | `suggests Claude Pro as alternative to ChatGPT Plus for writing use case` | Alternative tool recommendation is use-case aware |
| 9 | `does NOT suggest wrong alternative for mismatched use case` | Writing-specific rule does not fire for coding use case |
| 10 | `correctly sums total monthly and annual savings across tools` | `totalAnnualSavings === totalMonthlySavings × 12`, totals are additive |
| 11 | `marks audit as already_optimal when no savings found` | `isAlreadyOptimal` flag set correctly |
| 12 | `flags highSavingsCase when savings exceed $500/mo` | `highSavingsCase: true` when `totalMonthlySavings > 500` |
| 13 | `returns empty toolResults for empty tools array` | Engine handles empty input gracefully, no divide-by-zero |
| 14 | `surfaces credits recommendation for high API spend` | Credits opportunity fires for spend ≥ $200/mo |
| 15 | `does NOT surface credits recommendation for low API spend` | No credits recommendation for spend < $100/mo |

---

## What the Tests Specifically Cover

**Audit Engine Rules (all 5 rules tested):**
- Rule 1: Overpayment vs catalog price → Tests 1, 2
- Rule 2: Wrong plan for team size → Tests 3, 4
- Rule 3: Seat optimization → Tests 5, 6
- Rule 4: Alternative tool recommendations (use-case aware) → Tests 7, 8, 9
- Rule 5: Credits opportunity → Tests 14, 15

**Summary Math:**
- Savings addition across multiple tools → Test 10
- Annual = monthly × 12 → Test 10
- `isAlreadyOptimal` flag → Test 11
- `highSavingsCase` flag → Test 12

**Edge Cases:**
- Empty tools array → Test 13
- Use-case gating on recommendations → Test 9

---

## What Is NOT Tested (and Why)

- **API routes** (`/api/audit`, `/api/leads`) — These require a running Next.js server and Supabase connection. Integration tests for these would use a test database; out of scope for this submission but documented as a Week 2 improvement.
- **UI components** — The audit engine is the business logic. UI tests would be snapshot tests with low signal; skipped in favor of more meaningful engine tests.
- **Anthropic API integration** — The `generateAISummary` function is tested implicitly through the fallback path. Mocking the Anthropic SDK would add complexity without testing real behavior.
