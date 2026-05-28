import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewReportForm } from "@/components/reports/NewReportForm";

export default async function NewReportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
      <Link href={`/${locale}/reports`} className="text-text-3 text-xs uppercase tracking-wider hover:text-text-1 flex items-center gap-1.5 w-fit">
        <ArrowLeft size={14} /> back
      </Link>
      <div className="rounded-2xl border border-brand-border bg-bg-card p-6">
        <h1 className="text-text-1 text-xl tracking-widest mb-4" style={{ fontFamily: "var(--font-display)" }}>
          NEW SIGNAL
        </h1>
        <NewReportForm />
      </div>
    </main>
  );
}
