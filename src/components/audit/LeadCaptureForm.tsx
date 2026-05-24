"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

interface LeadCaptureFormProps {
  auditId: string;
  totalSavings: number;
  isAlreadyOptimal: boolean;
  onSuccess: () => void;
}

export function LeadCaptureForm({
  auditId,
  totalSavings,
  isAlreadyOptimal,
  onSuccess,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          auditId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center flex-shrink-0">
          <Mail className="w-4 h-4 text-background" />
        </div>
        <div>
          <p className="font-semibold">
            {isAlreadyOptimal
              ? "Get notified when optimizations apply to your stack"
              : "Email me this report"}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAlreadyOptimal
              ? "We'll reach out if new savings opportunities emerge for your tools."
              : `Get the full breakdown + ${totalSavings > 0 ? `$${Math.round(totalSavings * 12)}/year savings plan` : "recommendations"} in your inbox.`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot */}
        <input type="text" name="phone2" tabIndex={-1} aria-hidden="true" style={{ display: "none" }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <input
            type="text"
            placeholder="Company (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            placeholder="Your role (optional)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send Report"
          )}
        </button>

        <p className="text-[11px] text-muted-foreground text-center">
          No spam. Unsubscribe anytime. We only reach out about your specific tools.
        </p>
      </form>
    </div>
  );
}
