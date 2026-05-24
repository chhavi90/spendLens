import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SharedAuditView } from "../../../components/audit/SharedAuditView";
import { Header } from "../../../components/layout/Header";

interface PageProps {
  params: { id: string };
}

async function getAudit(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/share/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const audit = await getAudit(params.id);
  if (!audit) return { title: "Audit Not Found" };

  const savings = audit.summary.totalMonthlySavings;
  const title = savings > 0
    ? `AI Spend Audit — $${Math.round(savings)}/mo in potential savings found`
    : "AI Spend Audit — SpendLens";

  return {
    title,
    description: `See this AI tool spend audit. Current spend: $${Math.round(audit.summary.totalCurrentMonthly)}/mo.`,
    openGraph: {
      title,
      description: `Current spend: $${Math.round(audit.summary.totalCurrentMonthly)}/mo. Potential savings: $${Math.round(savings)}/mo.`,
      type: "website",
      images: [{
        url: `/api/og/${params.id}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
    },
  };
}

export default async function SharedAuditPage({ params }: PageProps) {
  const audit = await getAudit(params.id);
  if (!audit) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 p-4 bg-secondary rounded-lg text-sm text-muted-foreground">
          📊 This is a shared audit result. <a href="/" className="text-foreground font-medium underline underline-offset-2">Run your own audit →</a>
        </div>
        <SharedAuditView audit={audit} />
      </main>
    </div>
  );
}
