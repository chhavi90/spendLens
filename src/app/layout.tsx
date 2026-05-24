import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — Free AI Spend Audit for Startups",
  description:
    "Stop overpaying for AI tools. SpendLens audits your AI stack in 60 seconds and shows you exactly where you're wasting money.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://spendlens.app"),
  openGraph: {
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out exactly how much you're overspending on AI tools. Free, instant audit.",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out exactly how much you're overspending on AI tools.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
