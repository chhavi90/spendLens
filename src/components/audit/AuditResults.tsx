"use client";

import { useState } from "react";
import { AuditFormData, AuditSummary } from "../../types";
import { formatCurrency, formatActionLabel } from "../../lib/audit-engine";
import { getToolById, getPlanById } from "../../lib/pricing-data";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { CredexCTA } from "./CredexCTA";
import { cn } from "../../lib/utils";
import {
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Share2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

interface AuditResultsProps {
  summary: AuditSummary;
  formData: AuditFormData;
  auditId: string;
  onReset: () => void;
}

export function AuditResults({ summary, formData, auditId, onReset }: AuditResultsProps) {
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share/${auditId}`;

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Your Audit Results</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-sm border border-input px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Audit
          </button>
        </div>
      </div>

      {/* Hero metrics */}
      <div className={cn(
        "rounded-xl p-6 md:p-8",
        summary.isAlreadyOptimal
          ? "bg-green-50 border border-green-200"
          : "bg-foreground text-background"
      )}>
        {summary.isAlreadyOptimal ? (
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lg text-green-800">You&apos;re spending well.</p>
              <p className="text-green-700 mt-1">
                Your ${formatCurrency(summary.totalCurrentMonthly)}/mo stack is optimized for your team size and use case. No major actions required.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm opacity-60 mb-1">Current Monthly</p>
              <p className="text-3xl font-bold font-mono">
                {formatCurrency(summary.totalCurrentMonthly)}
              </p>
            </div>
            <div className="sm:text-center">
              <p className="text-sm opacity-60 mb-1">Monthly Savings</p>
              <p className="text-3xl font-bold font-mono text-green-400">
                {formatCurrency(summary.totalMonthlySavings)}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm opacity-60 mb-1">Annual Savings</p>
              <p className="text-3xl font-bold font-mono text-green-400">
                {formatCurrency(summary.totalAnnualSavings)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI Summary */}
      {summary.aiSummary && (
        <div className="stagger-1 animate-in bg-card border border-border rounded-xl p-6">
          <p className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">Analysis</p>
          <p className="text-base leading-relaxed text-foreground">
            {summary.aiSummary}
          </p>
        </div>
      )}

      {/* Per-tool breakdown */}
      <div className="stagger-2 animate-in space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Tool-by-Tool Breakdown
        </h3>
        {summary.toolResults.map((result, i) => {
          const isOptimal = result.bestRecommendation.action === "already_optimal";
          const targetTool = result.bestRecommendation.targetToolId
            ? getToolById(result.bestRecommendation.targetToolId)
            : null;
          const targetPlan = result.bestRecommendation.targetPlanId && result.bestRecommendation.targetToolId
            ? getPlanById(result.bestRecommendation.targetToolId, result.bestRecommendation.targetPlanId)
            : null;

          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border p-5 transition-all",
                isOptimal
                  ? "border-border bg-card"
                  : "border-border bg-card hover:border-foreground/20"
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="font-semibold">{result.toolDef.name}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    {result.currentPlan.name} · {result.toolEntry.seats} seat{result.toolEntry.seats !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-mono font-medium">
                    {formatCurrency(result.currentMonthlyCost)}/mo
                  </span>
                  {!isOptimal && result.bestRecommendation.monthlySavings > 0 && (
                    <p className="text-xs text-green-600 font-mono">
                      Save {formatCurrency(result.bestRecommendation.monthlySavings)}/mo
                    </p>
                  )}
                </div>
              </div>

              <div className={cn(
                "rounded-lg p-3 text-sm",
                isOptimal ? "bg-secondary/50" : "bg-amber-50 border border-amber-200"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  {isOptimal ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                  <span className={cn(
                    "font-medium text-xs uppercase tracking-wide",
                    isOptimal ? "text-green-700" : "text-amber-700"
                  )}>
                    {formatActionLabel(result.bestRecommendation.action)}
                    {targetTool && targetPlan && ` → ${targetTool.name} ${targetPlan.name}`}
                  </span>
                </div>
                <p className={cn(
                  "text-sm leading-relaxed",
                  isOptimal ? "text-muted-foreground" : "text-amber-800"
                )}>
                  {result.bestRecommendation.reason}
                </p>

                {result.recommendations.length > 1 && (
                  <details className="mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      {result.recommendations.length - 1} more recommendation{result.recommendations.length > 2 ? "s" : ""}
                    </summary>
                    <div className="mt-2 space-y-2">
                      {result.recommendations.slice(1).map((rec, j) => (
                        <div key={j} className="pl-3 border-l-2 border-border">
                          <p className="text-xs font-medium text-muted-foreground uppercase">
                            {formatActionLabel(rec.action)}
                            {rec.monthlySavings > 0 && ` · Save ${formatCurrency(rec.monthlySavings)}/mo`}
                          </p>
                          <p className="text-xs text-muted-foreground">{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Credex CTA for high-savings cases */}
      {summary.highSavingsCase && (
        <div className="stagger-3 animate-in">
          <CredexCTA monthlySavings={summary.totalMonthlySavings} />
        </div>
      )}

      {/* Lead capture */}
      <div className="stagger-4 animate-in">
        {!leadCaptured ? (
          <LeadCaptureForm
            auditId={auditId}
            totalSavings={summary.totalMonthlySavings}
            isAlreadyOptimal={summary.isAlreadyOptimal}
            onSuccess={() => setLeadCaptured(true)}
          />
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-green-800">Report sent!</p>
            <p className="text-sm text-green-700 mt-1">
              Check your inbox for the full audit. We&apos;ll reach out with savings opportunities for your stack.
            </p>
          </div>
        )}
      </div>

      {/* Share CTA */}
      <div className="stagger-5 animate-in bg-secondary/50 border border-border rounded-xl p-6 text-center">
        <p className="font-semibold mb-2">Share this audit</p>
        <p className="text-sm text-muted-foreground mb-4">
          Your unique public URL — no identifying info included
        </p>
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground"
          />
          <button
            onClick={handleShare}
            className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-foreground/80 transition-colors flex-shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
