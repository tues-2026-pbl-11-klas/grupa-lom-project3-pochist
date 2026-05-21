import { reportsApi, isUnauthorized } from "@/lib/api";
import { mapApiReport, type Report } from "@/lib/api/mappers";
import { ReportsClient } from "@/components/reports/ReportsClient";
import { redirect } from "next/navigation";

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let reports: Report[] = [];
  try {
    const raw = (await reportsApi.list()) as Record<string, unknown>[];
    reports = (raw ?? []).map(mapApiReport);
  } catch (err) {
    if (isUnauthorized(err)) {
      redirect(`/${locale}/login`);
    }
    // For other errors, show an empty list — better than crashing the page.
  }

  return <ReportsClient initialReports={reports} locale={locale} />;
}
