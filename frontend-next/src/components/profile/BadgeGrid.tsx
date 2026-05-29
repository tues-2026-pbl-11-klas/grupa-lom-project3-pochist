"use client";

import { BADGES } from "@/lib/data/badges";
import { deriveBadges } from "@/lib/api/mappers";
import type { User } from "@/lib/api/mappers";

export function BadgeGrid({ user }: { user: User }) {
  const earned = new Set(deriveBadges(user).map((b) => b.id));
  return (
    <div className="animate-fade-up">
      <div className="text-text-3 text-xs uppercase tracking-wider mb-3">
        {earned.size} / {BADGES.length} ОТКЛЮЧЕНИ
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BADGES.map((b) => {
          const got = earned.has(b.id);
          return (
            <div
              key={b.id}
              title={b.desc}
              className={`relative rounded-xl border p-3 flex flex-col items-center gap-1 transition ${
                got ? "border-accent-pink-border bg-accent-pink-dim" : "border-brand-border bg-bg-card opacity-50"
              }`}
            >
              <div className="text-2xl">★</div>
              <div className={got ? "text-text-1 text-xs text-center" : "text-text-3 text-xs text-center"}>{b.name}</div>
              {got && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-pink" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
