"use client";

interface HeaderProps {
  isShowingResults?: boolean;
  onGoHome?: () => void;
}

export function Header({ isShowingResults = false, onGoHome }: HeaderProps) {

  const handleLogoClick = () => {
    if (isShowingResults && onGoHome) {
      onGoHome();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRunAuditClick = () => {
    if (isShowingResults && onGoHome) {
      onGoHome();
    } else {
      const formEl = document.getElementById("audit-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 bg-foreground rounded flex items-center justify-center">
            <span className="text-background text-xs font-bold font-mono">S</span>
          </div>
          <span className="font-semibold tracking-tight">SpendLens</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">by Credex</span>
        </button>

        <nav className="flex items-center gap-4 text-sm">

          {/* Run Audit */}
          <button
            onClick={handleRunAuditClick}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {isShowingResults ? "Run Audit" : "Run Audit"}
          </button>

          {/* Credex */}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-background px-3 py-1.5 rounded-md text-xs font-medium hover:bg-foreground/80 transition-colors"
          >
            Credex →
          </a>

        </nav>
      </div>
    </header>
  );
}