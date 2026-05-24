"use client";

import { useEffect } from "react";
import { ToolEntry, ToolId } from "../../types";
import { TOOL_DEFINITIONS, getPlanById } from "../../lib/pricing-data";
import { Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToolRowProps {
  entry: ToolEntry;
  usedToolIds: ToolId[];
  onChange: (entry: ToolEntry) => void;
  onRemove: () => void;
}

export function ToolRow({ entry, usedToolIds, onChange, onRemove }: ToolRowProps) {
  const availableTools = TOOL_DEFINITIONS.filter(
    (t) => t.id === entry.toolId || !usedToolIds.includes(t.id)
  );

  const selectedTool = TOOL_DEFINITIONS.find((t) => t.id === entry.toolId);
  const currentPlan = getPlanById(entry.toolId, entry.planId);

  // Auto-calculate spend from plan price when plan changes
  useEffect(() => {
    if (currentPlan && currentPlan.monthlyPricePerSeat > 0) {
      onChange({
        ...entry,
        monthlySpend: parseFloat(
          (currentPlan.monthlyPricePerSeat * entry.seats).toFixed(2)
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.planId, entry.seats]);

  const handleToolChange = (toolId: ToolId) => {
    const tool = TOOL_DEFINITIONS.find((t) => t.id === toolId);
    if (!tool) return;
    const firstPlan = tool.plans[0];
    onChange({
      toolId,
      planId: firstPlan.id,
      seats: entry.seats,
      monthlySpend: firstPlan.monthlyPricePerSeat * entry.seats,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start p-4 bg-secondary/30 rounded-lg border border-border/50">
      {/* Tool selector */}
      <div className="sm:col-span-3">
        <label className="block text-xs text-muted-foreground mb-1">Tool</label>
        <select
          value={entry.toolId}
          onChange={(e) => handleToolChange(e.target.value as ToolId)}
          className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {availableTools.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Plan selector */}
      <div className="sm:col-span-3">
        <label className="block text-xs text-muted-foreground mb-1">Plan</label>
        <select
          value={entry.planId}
          onChange={(e) =>
            onChange({ ...entry, planId: e.target.value })
          }
          className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {selectedTool?.plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.monthlyPricePerSeat > 0 ? ` — $${p.monthlyPricePerSeat}/mo` : " — Custom"}
            </option>
          ))}
        </select>
      </div>

      {/* Seats */}
      <div className="sm:col-span-2">
        <label className="block text-xs text-muted-foreground mb-1">Seats</label>
        <input
          type="number"
          min={1}
          value={entry.seats}
          onChange={(e) =>
            onChange({ ...entry, seats: Math.max(1, parseInt(e.target.value) || 1) })
          }
          className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Monthly spend */}
      <div className="sm:col-span-3">
        <label className="block text-xs text-muted-foreground mb-1">
          Monthly Spend
          <span className="ml-1 text-[10px]">(actual bill)</span>
        </label>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={entry.monthlySpend}
            onChange={(e) =>
              onChange({ ...entry, monthlySpend: parseFloat(e.target.value) || 0 })
            }
            className="w-full border border-input rounded-md pl-6 pr-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {currentPlan && currentPlan.monthlyPricePerSeat > 0 && (
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">
            Catalog: ${(currentPlan.monthlyPricePerSeat * entry.seats).toFixed(2)}/mo
          </p>
        )}
      </div>

      {/* Remove */}
      <div className="sm:col-span-1 flex items-end justify-end pb-0.5">
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded"
          aria-label={`Remove ${selectedTool?.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
