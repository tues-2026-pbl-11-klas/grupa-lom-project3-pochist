"use client";

import { useState } from "react";
import type { User } from "@/lib/api/mappers";
import { ProfileHero } from "./ProfileHero";
import { XpBar } from "./XpBar";
import { StatCards } from "./StatCards";
import { StatBars } from "./StatBars";
import { BadgeGrid } from "./BadgeGrid";
import { ActivityChart } from "./ActivityChart";
import { SettingsPanel } from "./SettingsPanel";

type Tab = "stats" | "badges" | "activity" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "stats",    label: "СТАТИСТИКИ" },
  { id: "badges",   label: "БЕЙДЖОВЕ" },
  { id: "activity", label: "АКТИВНОСТ" },
  { id: "settings", label: "НАСТРОЙКИ" },
];

export function ProfileClient({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("stats");

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <ProfileHero user={user} />

      <div className="flex bg-bg-card rounded-md p-1 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded text-xs uppercase tracking-wider transition ${
              tab === t.id ? "bg-accent-pink text-bg-base" : "text-text-2 hover:text-text-1"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <XpBar user={user} />
      <StatCards user={user} />

      {tab === "stats"    && <StatBars user={user} />}
      {tab === "badges"   && <BadgeGrid user={user} />}
      {tab === "activity" && <ActivityChart />}
      {tab === "settings" && <SettingsPanel />}
    </main>
  );
}
