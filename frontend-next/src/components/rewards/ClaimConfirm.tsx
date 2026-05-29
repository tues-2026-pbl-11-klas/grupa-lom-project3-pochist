"use client";

import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Reward } from "@/lib/data/rewards";

interface Props {
  reward: Reward | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClaimConfirm({ reward, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={reward != null} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent>
        {reward && (
          <>
            <DialogHeader>
              <DialogTitle>Потвърди награда</DialogTitle>
            </DialogHeader>
            <div className="text-2xl">★</div>
            <div className="text-text-1 text-sm">
              <strong>{reward.name}</strong>
              <p className="mt-1 text-text-2">{reward.desc}</p>
              <p className="mt-2 text-text-3 text-xs">Партньор: {reward.partner}</p>
            </div>
            <div className="flex items-center gap-1.5 text-text-1">
              <Star size={14} strokeWidth={2} /> {reward.cost.toLocaleString()} точки
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={onCancel}>Отказ</Button>
              <Button onClick={onConfirm}>Вземи</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
