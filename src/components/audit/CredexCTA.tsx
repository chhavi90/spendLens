import { formatCurrency } from "../../lib/audit-engine";
import { ExternalLink, Zap } from "lucide-react";

interface CredexCTAProps {
  monthlySavings: number;
}

export function CredexCTA({ monthlySavings }: CredexCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-foreground bg-foreground text-background p-6">
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium opacity-70 uppercase tracking-wide">
            Capture More Savings
          </span>
        </div>

        <h3 className="font-display text-2xl mb-3">
          You&apos;re leaving {formatCurrency(monthlySavings * 12)}/year on the table.
        </h3>

        <p className="text-sm opacity-80 leading-relaxed mb-5 max-w-xl">
          Credex sells discounted AI infrastructure credits — Cursor, Claude, ChatGPT Enterprise, and others —
          sourced from companies that overforecast or pivoted. The discount is real: typically 15–30% off
          retail, with the same tools, same access, zero disruption.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Book a Credex Consultation
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-xs opacity-50">Free 20-min call · No commitment</span>
        </div>
      </div>
    </div>
  );
}
