import { getSessionToken, MOCK_DEV_TOKEN } from "@/lib/auth/session";
import { logout } from "@/lib/actions/auth";
import { usersApi, reportsApi, isUnauthorized } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

interface ApiUser {
  id: string;
  username: string;
  points: number;
  reports: number;
  cleanings: number;
}

interface ApiReport {
  reportId: string;
  description: string;
  district: string;
  status: string;
  severity: string;
}

export default async function ReportsPlaceholder({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const token = await getSessionToken();
  const isMock = token === MOCK_DEV_TOKEN;

  let me: ApiUser | null = null;
  let reports: ApiReport[] = [];
  let fetchError: string | null = null;
  try {
    [me, reports] = await Promise.all([
      usersApi.getMe() as Promise<ApiUser>,
      reportsApi.list() as Promise<ApiReport[]>,
    ]);
  } catch (err) {
    if (isUnauthorized(err)) {
      redirect(`/${locale}/login`);
    }
    fetchError = err instanceof Error ? err.message : "Unknown error";
  }

  const logoutAction = logout.bind(null, locale);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 py-16">
      <h1 className="text-accent-pink text-5xl tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
        CHIST
      </h1>
      <p className="text-text-3 text-xs uppercase tracking-wider">
        {isMock ? "Mock session" : "Real session"}
      </p>

      {fetchError && (
        <p className="text-status-red text-sm">Fetch error: {fetchError}</p>
      )}

      {me && (
        <div className="text-text-1 text-center">
          <p className="text-lg">@{me.username}</p>
          <p className="text-text-2 text-sm">
            {me.points} pts · {me.reports} reports · {me.cleanings} cleanings
          </p>
        </div>
      )}

      {reports.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <p className="text-text-3 text-xs uppercase tracking-wider mb-2">
            {reports.length} reports
          </p>
          <ul className="flex flex-col gap-2">
            {reports.map((r) => (
              <li key={r.reportId} className="rounded-lg border border-brand-border bg-bg-card px-3 py-2">
                <div className="text-text-1 text-sm">{r.description}</div>
                <div className="text-text-3 text-[10px] uppercase tracking-wider mt-1">
                  {r.district} · {r.status} · {r.severity}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-text-3 text-xs mt-4">Full reports UI lands in Phase 4.</p>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">Log out</Button>
      </form>
    </main>
  );
}
