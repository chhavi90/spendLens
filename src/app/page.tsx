"use client";

import { useState } from "react";
import { AuditForm } from "@/components/form/AuditForm";
import { AuditResults } from "@/components/audit/AuditResults";
import { AuditFormData, AuditSummary } from "@/types";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";

export default function HomePage() {
  const [auditResult, setAuditResult] = useState<{
    summary: AuditSummary;
    auditId: string;
    formData: AuditFormData;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isShowingResults = auditResult !== null;

  const handleSubmit = async (formData: AuditFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to run audit");
      }
      const data = await response.json();
      setAuditResult({
        summary: data.summary,
        auditId: data.auditId,
        formData,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    setAuditResult(null);
    setError(null);
    setTimeout(() => {
      const formEl = document.getElementById("audit-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isShowingResults={isShowingResults}
        onGoHome={handleGoHome}
      />

      {!auditResult && <Hero />}

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {!auditResult ? (
          <div id="audit-form">
            <AuditForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        ) : (
          <div id="audit-results">
            <AuditResults
              summary={auditResult.summary}
              formData={auditResult.formData}
              auditId={auditResult.auditId}
              onReset={handleGoHome}
            />
          </div>
        )}
      </main>
    </div>
  );
}