import { getSessionToken, MOCK_DEV_TOKEN } from "@/lib/auth/session";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default async function ReportsPlaceholder({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const token = await getSessionToken();
  const isMock = token === MOCK_DEV_TOKEN;

  const logoutAction = logout.bind(null, locale);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-accent-pink text-5xl tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
        CHIST
      </h1>
      <p className="text-text-1 text-base">Logged in.</p>
      <p className="text-text-3 text-xs uppercase tracking-wider">
        {isMock ? "Mock session — no backend" : "Real session"}
      </p>
      <p className="text-text-3 text-xs">Reports list arrives in Phase 4.</p>
      <form action={logoutAction} className="mt-4">
        <Button type="submit" variant="outline">Log out</Button>
      </form>
    </main>
  );
}
