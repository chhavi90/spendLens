"use client";

import { useState } from "react";
import { AuditForm } from "../components/form/AuditForm";
import { AuditResults } from "../components/audit/AuditResults";
import { AuditFormData, AuditSummary } from "../types";
import { Header } from "../components/layout/Header";
import { Hero } from "../components/layout/Hero";

export default function HomePage() {
  const [auditResult, setAuditResult] = useState<{
    summary: AuditSummary;
    auditId: string;
    formData: AuditFormData;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setAuditResult({ summary: data.summary, auditId: data.auditId, formData });
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById("audit-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {!auditResult && (
        <Hero />
      )}

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
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
