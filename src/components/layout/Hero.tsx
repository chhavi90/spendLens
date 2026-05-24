"use client";

export function Hero() {
  return (
    <section className="border-b border-border/50 bg-gradient-to-b from-background to-secondary/30">
      <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary text-muted-foreground text-xs font-mono px-3 py-1.5 rounded-full mb-6 border border-border">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
            Free · No login required · Takes 60 seconds
          </div>

          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mb-5 text-foreground">
            Stop guessing what your AI tools actually cost
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            SpendLens audits your AI stack and shows you exactly where you&apos;re overspending,
            what to switch, and how much you&apos;d save. No fluff, just numbers.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {[
              "Cursor, Copilot, Claude, ChatGPT",
              "Plan-level analysis",
              "Defensible savings math",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
