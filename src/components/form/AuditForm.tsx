"use client";

import { useState } from "react";
import { AuditFormData, ToolEntry, UseCase, ToolId } from "../../types";
import { TOOL_DEFINITIONS } from "../../lib/pricing-data";
import { usePersistedForm } from "../../hooks/usePersistedForm";
import { ToolRow } from "./ToolRow";
import { cn } from "../../lib/utils";
import { Plus, Loader2, AlertCircle } from "lucide-react";

interface AuditFormProps {
  onSubmit: (formData: AuditFormData) => void;
  isLoading: boolean;
  error: string | null;
}

const USE_CASES: { value: UseCase; label: string; description: string }[] = [
  { value: "coding", label: "Coding", description: "Building software, writing code" },
  { value: "writing", label: "Writing", description: "Docs, marketing, content" },
  { value: "data", label: "Data", description: "Analysis, pipelines, reporting" },
  { value: "research", label: "Research", description: "Summarizing, synthesizing info" },
  { value: "mixed", label: "Mixed", description: "Combination of the above" },
];

export function AuditForm({ onSubmit, isLoading, error }: AuditFormProps) {
  const { formData, setFormData, isLoaded } = usePersistedForm();

  const addTool = () => {
    const usedToolIds = formData.tools.map((t) => t.toolId);
    const nextTool = TOOL_DEFINITIONS.find((t) => !usedToolIds.includes(t.id));
    if (!nextTool) return;

    const firstPlan = nextTool.plans[0];
    const defaultEntry: ToolEntry = {
      toolId: nextTool.id,
      planId: firstPlan.id,
      seats: 1,
      monthlySpend: firstPlan.monthlyPricePerSeat,
    };

    setFormData((prev) => ({ ...prev, tools: [...prev.tools, defaultEntry] }));
  };

  const updateTool = (index: number, entry: ToolEntry) => {
    setFormData((prev) => {
      const tools = [...prev.tools];
      tools[index] = entry;
      return { ...prev, tools };
    });
  };

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tools.length === 0) return;
    onSubmit(formData);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Team context */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-xl mb-5">Your Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Team Size
              <span className="text-muted-foreground font-normal ml-1">(people using AI tools)</span>
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={formData.teamSize}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  teamSize: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Use Case</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {USE_CASES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, useCase: value }))}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    formData.useCase === value
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-input hover:border-foreground/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tool list */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl">AI Tools</h2>
          <span className="text-xs text-muted-foreground font-mono">
            {formData.tools.length} / {TOOL_DEFINITIONS.length} tools
          </span>
        </div>

        {formData.tools.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="mb-3">No tools added yet.</p>
            <button
              type="button"
              onClick={addTool}
              className="text-foreground font-medium underline underline-offset-2 text-sm"
            >
              Add your first tool
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.tools.map((entry, i) => (
              <ToolRow
                key={`${entry.toolId}-${i}`}
                entry={entry}
                usedToolIds={formData.tools
                  .filter((_, idx) => idx !== i)
                  .map((t) => t.toolId)}
                onChange={(updated) => updateTool(i, updated)}
                onRemove={() => removeTool(i)}
              />
            ))}
          </div>
        )}

        {formData.tools.length < TOOL_DEFINITIONS.length && (
          <button
            type="button"
            onClick={addTool}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-dashed border-input rounded-lg py-3 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add another tool
          </button>
        )}
      </div>

      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
      />

      {error && (
        <div className="flex items-center gap-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || formData.tools.length === 0}
        className="w-full bg-foreground text-background py-4 rounded-xl font-semibold text-base hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing your stack…
          </>
        ) : (
          "Run My Free Audit →"
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No account required. Your data is never sold.
      </p>
    </form>
  );
}
