"use client";

import { Star, Lock, Flame, Sparkles } from "lucide-react";
import type { Reward } from "@/lib/data/rewards";

interface Props {
  reward: Reward;
  userPoints: number;
  claimed: boolean;
  onClaim: (r: Reward) => void;
}

export function RewardCard({ reward, userPoints, claimed, onClaim }: Props) {
  const canAfford = userPoints >= reward.cost;
  const isLocked = !canAfford && !claimed;
  const progress = Math.min((userPoints / reward.cost) * 100, 100);
  const needMore = reward.cost - userPoints;

  return (
    <div
      onClick={() => !isLocked && !claimed && onClaim(reward)}
      className={`relative rounded-xl border p-4 flex flex-col gap-2 transition cursor-pointer ${
        claimed ? "border-brand-border bg-bg-card opacity-60" :
        isLocked ? "border-brand-border bg-bg-card opacity-70 cursor-not-allowed" :
        "border-brand-border bg-bg-card hover:bg-bg-card-hover hover:border-accent-pink-border"
      } ${reward.featured ? "border-accent-pink-border bg-accent-pink-dim" : ""}`}
    >
      {reward.hot && (
        <span className="absolute top-2 right-2 text-[0.625rem] uppercase tracking-wider text-status-red flex items-center gap-1">
          <Flame size={10} strokeWidth={2} /> HOT
        </span>
      )}
      {reward.newBadge && (
        <span className="absolute top-2 right-2 text-[0.625rem] uppercase tracking-wider text-accent-pink flex items-center gap-1">
          <Sparkles size={10} strokeWidth={2} /> NEW
        </span>
      )}
      <div className="text-2xl">★</div>
      <div className="text-text-1 text-sm">{reward.name}</div>
      <div className="text-text-3 text-xs leading-snug">{reward.desc}</div>
      <div className="text-text-3 text-[0.625rem] uppercase tracking-wider">{reward.partner}</div>
      {isLocked && (
        <div>
          <div className="h-1 rounded-full bg-brand-primary-dim overflow-hidden">
            <div className="h-full bg-text-2" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-text-3 text-[0.625rem] uppercase tracking-wider mt-1">
            Още {needMore.toLocaleString()} точки
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className={`flex items-center gap-1 text-sm ${isLocked ? "text-text-3" : "text-text-1"}`}>
          <Star size={12} strokeWidth={2} /> {reward.cost.toLocaleString()}
        </span>
        {claimed && <span className="text-text-3 text-[0.625rem] uppercase tracking-wider">ВЗЕТО</span>}
        {isLocked && <Lock size={14} strokeWidth={2} className="text-text-3" />}
      </div>
    </div>
  );
}
