"use client";

import { AuditFormData, AuditSummary } from "./../../types";
import { formatCurrency, formatActionLabel } from "../../lib/audit-engine";
import { CheckCircle2, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SharedAuditViewProps {
  audit: {
    id: string;
    summary: AuditSummary;
    formData: Omit<AuditFormData, "companyName">;
    createdAt: string;
  };
}

export function SharedAuditView({ audit }: SharedAuditViewProps) {
  const { summary } = audit;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">AI Spend Audit</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {audit.formData.teamSize}-person team · {audit.formData.useCase} focused ·{" "}
            {new Date(audit.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className={cn(
        "rounded-xl p-6",
        summary.isAlreadyOptimal
          ? "bg-green-50 border border-green-200"
          : "bg-foreground text-background"
      )}>
        {summary.isAlreadyOptimal ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
            <p className="font-semibold text-green-800">This team is already spending well on AI tools.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs opacity-60 mb-1">Monthly Spend</p>
              <p className="text-2xl font-bold font-mono">{formatCurrency(summary.totalCurrentMonthly)}</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">Monthly Savings</p>
              <p className="text-2xl font-bold font-mono text-green-400">{formatCurrency(summary.totalMonthlySavings)}</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-1">Annual Savings</p>
              <p className="text-2xl font-bold font-mono text-green-400">{formatCurrency(summary.totalAnnualSavings)}</p>
            </div>
          </div>
        )}
      </div>

      {summary.aiSummary && (
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Analysis</p>
          <p className="text-sm leading-relaxed">{summary.aiSummary}</p>
        </div>
      )}

      <div className="space-y-3">
        {summary.toolResults.map((result, i) => {
          const isOptimal = result.bestRecommendation.action === "already_optimal";
          return (
            <div key={i} className="border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <span className="font-semibold">{result.toolDef.name}</span>
                <span className="font-mono font-medium">{formatCurrency(result.currentMonthlyCost)}/mo</span>
              </div>
              <div className={cn(
                "text-sm rounded-lg p-3",
                isOptimal ? "bg-secondary" : "bg-amber-50 border border-amber-200"
              )}>
                <p className={cn(
                  "font-medium text-xs mb-1",
                  isOptimal ? "text-muted-foreground" : "text-amber-700"
                )}>
                  {formatActionLabel(result.bestRecommendation.action)}
                  {result.bestRecommendation.monthlySavings > 0 &&
                    ` — Save ${formatCurrency(result.bestRecommendation.monthlySavings)}/mo`}
                </p>
                <p className={cn(isOptimal ? "text-muted-foreground" : "text-amber-800")}>
                  {result.bestRecommendation.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center py-6 border-t border-border">
        <p className="text-muted-foreground text-sm mb-3">Want to audit your own AI stack?</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-foreground/80 transition-colors"
        >
          Run My Free Audit →
        </a>
      </div>
    </div>
  );
}
