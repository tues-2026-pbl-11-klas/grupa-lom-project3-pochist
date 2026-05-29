"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useApp } from "@/context/AppContext";
import { ReportCard } from "./ReportCard";
import type { Report } from "@/lib/api/mappers";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] grid place-items-center bg-bg-card text-text-3 text-sm">
      Loading map…
    </div>
  ),
});

interface ReportsClientProps {
  initialReports: Report[];
  locale: string;
}

export function ReportsClient({ initialReports, locale }: ReportsClientProps) {
  const t = useTranslations("Reports");
  const { selectedReportId, selectReport, filters } = useApp();

  const filtered = initialReports.filter((r) => {
    if (filters.severity && r.severity !== filters.severity) return false;
    if (filters.status && r.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-3.5rem)] p-4">
      <aside className="w-full md:w-[360px] flex flex-col gap-2 overflow-y-auto">
        <div className="text-text-3 text-xs uppercase tracking-wider px-1">
          {t("signalsCount", { n: filtered.length })}
        </div>
        {filtered.map((r) => (
          <ReportCard
            key={r.id}
            report={r}
            selected={selectedReportId === r.id}
            onSelect={() => selectReport(r.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-text-3 text-sm text-center py-8">
            {t("noMatch")}
          </div>
        )}
      </aside>
      <div className="flex-1 rounded-2xl overflow-hidden border border-brand-border bg-bg-card">
        <MapView
          reports={filtered}
          selectedId={selectedReportId}
          onSelectReport={selectReport}
          locale={locale}
        />
      </div>
    </div>
  );
}
