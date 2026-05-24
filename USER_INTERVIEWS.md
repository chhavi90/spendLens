# User Interviews

Three interviews conducted between Day 3 and Day 5 of the build week.
Each was 10–15 minutes via Google Meet or Twitter DM voice call.

---

## Interview 1

**Name:** Rohan M. (initials used at his request)
**Role:** Co-founder & CTO
**Company Stage:** Seed-stage SaaS startup, 8 engineers
**Date:** Day 3
**Format:** 12-minute Google Meet call

### Notes

Rohan's team uses Cursor Business (8 seats), ChatGPT Team (8 seats), and
the Anthropic API directly for their product. Combined AI spend is roughly
$900/month. He said he looks at the bill every month, knows it feels high,
but has never sat down to benchmark it against anything.

**Direct quotes:**

> "I literally just approved the Cursor Business renewal last week without
> checking if we still needed all 8 seats. Two of those engineers barely
> open it."

> "I don't know what a normal AI spend per engineer looks like for a team
> our size. Is $100/month per dev high? I have no idea."

> "The problem isn't that I don't want to optimize it. It's that optimizing
> it feels like a whole project, and there's always something more urgent."

**Most surprising thing he said:**
He didn't know Claude Team required a minimum of 5 seats. He'd been paying
for 8 ChatGPT Team seats partly because "switching felt complicated" — but
had never actually looked at whether Claude Team would serve the same
workflow at the same price. The friction wasn't cost, it was inertia.

**What it changed about the design:**
Added the "catalog price" display below the monthly spend input in
`ToolRow`. If the user is paying more than catalog, it shows in small
muted text: "Catalog: $320/mo" next to their input of $360/mo. Surfaces
the gap without lecturing them.

---

## Interview 2

**Name:** Divya S.
**Role:** Engineering Manager
**Company Stage:** Series A, 22 engineers
**Date:** Day 4
**Format:** 15-minute Twitter DM voice call

### Notes

Divya manages a team that uses GitHub Copilot Enterprise ($39/seat × 22 =
$858/mo), ChatGPT Plus for 6 non-engineering staff ($120/mo), and OpenAI
API for their internal tooling (~$400/mo variable). Total: ~$1,400/mo.

She described the process of approving SaaS spend as "whoever asks loudest
gets the tool." There's no central inventory of what AI tools the team
actually uses — she suspects there are personal subscriptions she doesn't
know about.

**Direct quotes:**

> "I approved Copilot Enterprise because someone said we needed it for the
> PR summary feature. I don't think anyone actually uses that feature."

> "The variable API spend is the part that scares me. It can spike $200
> in a week and I only find out when the invoice arrives."

> "If you could show me what the benchmark spend is for a 20-person
> engineering team, I'd forward that to my VP of Engineering immediately."

**Most surprising thing she said:**
She asked whether the tool could flag "zombie seats" — people who have a
paid seat but haven't logged in for 30 days. She assumed this data was
available via API from the vendors. (It's not, at least not for most.)
This was a feature request I genuinely hadn't considered, and it's more
valuable than most things on the MVP list.

**What it changed about the design:**
Added the "notify me when new optimizations apply to your stack" signup
option for already-optimal cases. Divya's situation is "already paying
roughly correct prices, but no monitoring." The email capture for
already-optimal users now has different copy: "We'll alert you when new
savings apply to your stack" rather than "get this report."

---

## Interview 3

**Name:** Arjun K.
**Role:** Founder (solo)
**Company Stage:** Pre-revenue indie project, 1 person
**Date:** Day 5
**Format:** 12-minute Google Meet

### Notes

Arjun is building a solo project and uses Claude Pro ($20/mo), Cursor Pro
($20/mo), and ChatGPT Plus ($20/mo). Total: $60/mo. He keeps all three
because he "hasn't had time to figure out which one to drop."

He found the interview framing interesting — he'd never thought of his
personal subscriptions as a "stack" to audit.

**Direct quotes:**

> "I pay for all three because they're each good at different things, but
> honestly I'm probably only using one of them 80% of the time."

> "Twenty dollars a month feels small enough that I never think about
> cancelling it. But $240 a year for a tool I barely use — that actually
> lands differently when you say it that way."

> "I would 100% share a tool like this in the IndieHackers Slack if it
> told me I could cut $40/month. That's two months of hosting."

**Most surprising thing he said:**
The reframe from monthly to annual was genuinely impactful for him — he
said "$20/month feels negligible but $240/year feels real." This is a
psychological insight, not just a display choice. It validated the
decision to show annual savings prominently in the results hero (not just
monthly) — and to show annual first for the already-optimal case too
("you're spending $720/year on AI tools, and you're spending it well").

**What it changed about the design:**
Made the annual savings number larger than the monthly number in the
results hero for high-savings cases. Previously both were the same size.
Also added the annual equivalent to the already-optimal confirmation
message.
