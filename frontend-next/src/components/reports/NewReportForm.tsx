"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createReport } from "@/lib/actions/reports";

export function NewReportForm() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "bg";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      await createReport(fd);
      router.push(`/${locale}/reports`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description" className="text-text-2 text-xs uppercase tracking-wider">Description</Label>
        <Textarea id="description" name="description" required rows={4} placeholder="What did you see?" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="latitude" className="text-text-2 text-xs uppercase tracking-wider">Latitude</Label>
          <Input id="latitude" name="latitude" type="number" step="any" required defaultValue="42.6977" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="longitude" className="text-text-2 text-xs uppercase tracking-wider">Longitude</Label>
          <Input id="longitude" name="longitude" type="number" step="any" required defaultValue="23.3219" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="severity" className="text-text-2 text-xs uppercase tracking-wider">Severity</Label>
        <select id="severity" name="severity" className="h-9 rounded-md border border-brand-border bg-bg-input text-text-1 px-3 text-sm" defaultValue="medium">
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="photo" className="text-text-2 text-xs uppercase tracking-wider">Photo (optional)</Label>
        <Input id="photo" name="photo" type="file" accept="image/*" />
      </div>

      {error && <p className="text-status-red text-sm">{error}</p>}

      <Button type="submit" disabled={submitting} className="mt-2">
        {submitting ? "Submitting..." : "Submit report"}
      </Button>
    </form>
  );
}
