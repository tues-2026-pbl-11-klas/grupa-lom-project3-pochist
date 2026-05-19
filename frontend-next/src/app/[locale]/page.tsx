import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-6">
      <h1 className="text-accent-pink text-6xl tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
        {t("title")}
      </h1>
      <p className="text-text-2 text-sm tracking-wider uppercase">{t("subtitle")}</p>
    </main>
  );
}
