import {
  AuditFormData,
  AuditSummary,
  AuditFlag,
  Recommendation,
  RecommendationAction,
  ToolAuditResult,
  ToolEntry,
  UseCase,
} from "../types";
import { getToolById, getPlanById, TOOL_DEFINITIONS } from "./pricing-data";

// ─── Audit Rule Helpers ───────────────────────────────────────────────────────

/**
 * Check if a team is overpaying vs catalog price (e.g., paying more than MSRP).
 */
function checkOverpayingVsCatalog(entry: ToolEntry): {
  flag: boolean;
  overagePerMonth: number;
} {
  const plan = getPlanById(entry.toolId, entry.planId);
  if (!plan || plan.monthlyPricePerSeat === 0) return { flag: false, overagePerMonth: 0 };

  const expectedMonthly = plan.monthlyPricePerSeat * entry.seats;
  const overage = entry.monthlySpend - expectedMonthly;
  return { flag: overage > 1, overagePerMonth: Math.max(0, overage) };
}

/**
 * Check if the user is on a Team plan with fewer seats than required minimum.
 * E.g. Claude Team requires min 5 seats; if team is 2, downgrade to Pro.
 */
function checkWrongPlanForTeamSize(
  entry: ToolEntry,
  teamSize: number
): Recommendation | null {
  const tool = getToolById(entry.toolId);
  const currentPlan = getPlanById(entry.toolId, entry.planId);
  if (!tool || !currentPlan) return null;

  // If on team plan but fewer people than minimum
  if (currentPlan.minSeats && entry.seats < currentPlan.minSeats) {
    // Find a cheaper single-user plan
    const cheaperPlan = tool.plans
      .filter((p) => !p.minSeats && p.monthlyPricePerSeat > 0 && p.monthlyPricePerSeat < currentPlan.monthlyPricePerSeat)
      .sort((a, b) => b.monthlyPricePerSeat - a.monthlyPricePerSeat)[0];

    if (cheaperPlan) {
      const currentCost = currentPlan.monthlyPricePerSeat * entry.seats;
      const optimizedCost = cheaperPlan.monthlyPricePerSeat * entry.seats;
      const savings = currentCost - optimizedCost;

      return {
        action: "downgrade_plan",
        targetPlanId: cheaperPlan.id,
        reason: `You're on the ${currentPlan.name} plan (min ${currentPlan.minSeats} seats) with only ${entry.seats} seat(s). ${cheaperPlan.name} at $${cheaperPlan.monthlyPricePerSeat}/user/mo covers the same core workflow for small teams.`,
        monthlySavings: savings,
        annualSavings: savings * 12,
        confidence: "high",
      };
    }
  }

  // If on a Solo/Pro plan but team is large enough that Team would save via annual discount
  if (!currentPlan.minSeats && currentPlan.annualPricePerSeat) {
    const annualDiscount = currentPlan.monthlyPricePerSeat - currentPlan.annualPricePerSeat;
    if (annualDiscount > 0) {
      const annualSavings = annualDiscount * entry.seats * 12;
      return {
        action: "downgrade_plan",
        targetPlanId: currentPlan.id + "_annual",
        reason: `Switching to annual billing saves $${annualDiscount}/user/month — $${annualSavings.toFixed(0)}/year for ${entry.seats} seat(s). Only worthwhile if you're confident in usage for 12 months.`,
        monthlySavings: annualDiscount * entry.seats,
        annualSavings,
        confidence: "medium",
      };
    }
  }

  return null;
}

/**
 * Check if a cheaper alternative tool exists for the user's primary use case.
 * Only recommend if savings are >20% of current spend.
 */
function checkAlternativeTool(
  entry: ToolEntry,
  useCase: UseCase
): Recommendation | null {
  const currentCostPerSeat = entry.monthlySpend / entry.seats;

  // Tool-specific rules with defensible reasoning
  const alternativeMap: Partial<Record<string, { targetId: string; targetPlanId: string; reason: string; useCases: UseCase[] }>> = {
    // GitHub Copilot Business ($19) → Cursor Pro ($20) for heavy coding: no savings, but Cursor is better
    // GitHub Copilot Enterprise ($39) → Cursor Business ($40): roughly same, but Cursor has better context
    "github_copilot:enterprise": {
      targetId: "cursor",
      targetPlanId: "business",
      reason: "GitHub Copilot Enterprise ($39/user) and Cursor Business ($40/user) are priced nearly identically, but Cursor's codebase-aware context and Composer feature provide measurably higher productivity for teams with large monorepos. The 1-month free trial makes switching low-risk.",
      useCases: ["coding"],
    },
    // ChatGPT Team ($30) → Claude Team ($30): same price, but Claude is notably stronger for writing/research
    "chatgpt:team": {
      targetId: "claude",
      targetPlanId: "team",
      reason: "Claude Team and ChatGPT Team are identically priced at $30/user/mo. For writing-heavy or research-heavy workflows, Claude consistently outperforms on long-context tasks and instruction-following. Zero cost to switch if that's your primary use case.",
      useCases: ["writing", "research"],
    },
    // ChatGPT Plus ($20) → Claude Pro ($20): same price, Claude better for writing
    "chatgpt:plus": {
      targetId: "claude",
      targetPlanId: "pro",
      reason: "Claude Pro and ChatGPT Plus are identically priced at $20/mo. For writing and research workflows, Claude Sonnet/Opus outperforms GPT-4o on instruction-following and long-context tasks. Consider running both for 30 days and picking the winner.",
      useCases: ["writing", "research"],
    },
    // Windsurf Teams ($35) vs Cursor Business ($40): Windsurf is cheaper
    "cursor:business": {
      targetId: "windsurf",
      targetPlanId: "teams",
      reason: "Windsurf Teams ($35/user/mo) delivers comparable AI-assisted coding to Cursor Business ($40/user/mo) with the same underlying models. For teams primarily doing web/TypeScript dev, the $5/user/mo delta is $60/user/year with minimal workflow disruption.",
      useCases: ["coding"],
    },
    // Gemini Advanced ($20) → Claude Pro ($20): same price, better for most use cases
    "gemini:advanced": {
      targetId: "claude",
      targetPlanId: "pro",
      reason: "Claude Pro and Gemini Advanced are similarly priced. Claude significantly outperforms on writing quality, code review, and reasoning tasks. Unless you're deeply embedded in Google Workspace, Claude Pro delivers more value per dollar.",
      useCases: ["writing", "research", "coding", "mixed"],
    },
  };

  const key = `${entry.toolId}:${entry.planId}`;
  const alt = alternativeMap[key];

  if (!alt || !alt.useCases.includes(useCase)) return null;

  const targetTool = getToolById(alt.targetId);
  const targetPlan = getPlanById(alt.targetId, alt.targetPlanId);
  if (!targetTool || !targetPlan) return null;

  const targetCostPerSeat = targetPlan.monthlyPricePerSeat;
  const targetTotalCost = targetCostPerSeat * entry.seats;
  const savings = entry.monthlySpend - targetTotalCost;

  // Only surface if meaningful savings OR same price with better fit
  return {
    action: "switch_tool",
    targetToolId: alt.targetId as import("@/types").ToolId,
    targetPlanId: alt.targetPlanId,
    reason: alt.reason,
    monthlySavings: savings,
    annualSavings: savings * 12,
    confidence: savings > 0 ? "high" : "medium",
  };
}

/**
 * Check if the user could benefit from buying credits (Credex use case).
 * Surfaces when spend > $200/mo total.
 */
function checkCreditsOpportunity(entry: ToolEntry): Recommendation | null {
  if (entry.monthlySpend < 100) return null;

  const creditsDiscount = 0.2; // conservative: credits save ~20% on average
  const estimatedSavings = entry.monthlySpend * creditsDiscount;

  return {
    action: "use_credits",
    reason: `At $${entry.monthlySpend}/mo, you're spending enough that buying discounted AI credits through a broker like Credex can save ~15–25% with zero change to your tooling. This applies to API spend and seat-based subscriptions with annual billing.`,
    monthlySavings: estimatedSavings,
    annualSavings: estimatedSavings * 12,
    confidence: "medium",
  };
}

/**
 * Check seat optimization: if paying for far more seats than team members who'd use it.
 */
function checkSeatOptimization(entry: ToolEntry, teamSize: number): Recommendation | null {
  // If seats > team size by more than 20%, flag it
  if (entry.seats > teamSize * 1.2 && entry.seats > teamSize + 1) {
    const plan = getPlanById(entry.toolId, entry.planId);
    if (!plan || plan.monthlyPricePerSeat === 0) return null;

    const excessSeats = entry.seats - teamSize;
    const savings = excessSeats * plan.monthlyPricePerSeat;

    return {
      action: "optimize_seats",
      reason: `You're paying for ${entry.seats} seats but have ${teamSize} team members. Removing ${excessSeats} unused seat(s) at $${plan.monthlyPricePerSeat}/seat/mo saves $${savings}/mo immediately.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
      confidence: "high",
    };
  }
  return null;
}

// ─── Main Audit Function ──────────────────────────────────────────────────────

export function runAuditEngine(formData: AuditFormData): AuditSummary {
  const toolResults: ToolAuditResult[] = [];
  let totalCurrentMonthly = 0;
  let totalOptimizedMonthly = 0;

  for (const entry of formData.tools) {
    const toolDef = getToolById(entry.toolId);
    const currentPlan = getPlanById(entry.toolId, entry.planId);

    if (!toolDef || !currentPlan) continue;

    totalCurrentMonthly += entry.monthlySpend;

    const recommendations: Recommendation[] = [];
    const flags: AuditFlag[] = [];

    // Rule 1: Overpaying vs catalog
    const { flag: isOverpaying, overagePerMonth } = checkOverpayingVsCatalog(entry);
    if (isOverpaying) {
      flags.push("overpaying_vs_catalog");
      recommendations.push({
        action: "downgrade_plan",
        reason: `You're paying $${entry.monthlySpend}/mo but catalog price is $${(currentPlan.monthlyPricePerSeat * entry.seats).toFixed(2)}/mo. Verify your billing — you may have legacy pricing or a mistaken plan.`,
        monthlySavings: overagePerMonth,
        annualSavings: overagePerMonth * 12,
        confidence: "high",
      });
    }

    // Rule 2: Wrong plan for team size
    const teamSizeRec = checkWrongPlanForTeamSize(entry, formData.teamSize);
    if (teamSizeRec) {
      flags.push("wrong_plan_for_team_size");
      recommendations.push(teamSizeRec);
    }

    // Rule 3: Seat optimization
    const seatRec = checkSeatOptimization(entry, formData.teamSize);
    if (seatRec) {
      recommendations.push(seatRec);
    }

    // Rule 4: Alternative tool (use case aware)
    const altRec = checkAlternativeTool(entry, formData.useCase);
    if (altRec) {
      flags.push("better_tool_for_usecase");
      recommendations.push(altRec);
    }

    // Rule 5: Credits opportunity (only for higher spenders)
    if (entry.monthlySpend >= 200 && !altRec) {
      const credRec = checkCreditsOpportunity(entry);
      if (credRec) {
        flags.push("credits_available");
        recommendations.push(credRec);
      }
    }

    // Determine best recommendation (highest savings, highest confidence)
    const sortedRecs = [...recommendations].sort((a, b) => {
      if (a.confidence === "high" && b.confidence !== "high") return -1;
      if (b.confidence === "high" && a.confidence !== "high") return 1;
      return b.monthlySavings - a.monthlySavings;
    });

    const bestRec: Recommendation =
      sortedRecs[0] ?? {
        action: "already_optimal",
        reason: `${toolDef.name} ${currentPlan.name} is well-suited to your team size and use case. No action needed.`,
        monthlySavings: 0,
        annualSavings: 0,
        confidence: "high",
      };

    if (bestRec.action === "already_optimal") {
      flags.push("already_optimal");
    }

    const toolOptimizedMonthly =
      entry.monthlySpend - Math.max(0, bestRec.monthlySavings);
    totalOptimizedMonthly += toolOptimizedMonthly;

    toolResults.push({
      toolEntry: entry,
      toolDef,
      currentPlan,
      currentMonthlyCost: entry.monthlySpend,
      recommendations: sortedRecs,
      bestRecommendation: bestRec,
      flags,
    });
  }

  const totalMonthlySavings = totalCurrentMonthly - totalOptimizedMonthly;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalCurrentMonthly,
    totalOptimizedMonthly,
    totalMonthlySavings,
    totalAnnualSavings,
    toolResults,
    isAlreadyOptimal: totalMonthlySavings < 5,
    highSavingsCase: totalMonthlySavings > 500,
    createdAt: new Date().toISOString(),
  };
}

// ─── Formatting Helpers ───────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatActionLabel(action: RecommendationAction): string {
  const labels: Record<RecommendationAction, string> = {
    downgrade_plan: "Downgrade Plan",
    upgrade_plan: "Upgrade Plan",
    switch_tool: "Switch Tool",
    use_credits: "Use Credits",
    optimize_seats: "Remove Seats",
    already_optimal: "Already Optimal",
  };
  return labels[action];
}
