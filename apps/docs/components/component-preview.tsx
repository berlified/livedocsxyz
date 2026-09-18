"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChartReactionsProvider, type ChartEmotion } from "@/components/ui/chart-reactions";

export function ComponentPreview({
  children,
  className,
  label = "Preview",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const [state, setState] = React.useState<ChartEmotion | "data">("data");
  const [replay, setReplay] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const replayChart = () => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setState((current) => current === "loading" ? "data" : current);
      setReplay((current) => current + 1);
    }, 900);
  };
  const selectState = (next: ChartEmotion | "data") => {
    if (timer.current) clearTimeout(timer.current);
    setState(next);
    if (next === "loading") {
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setReplay((current) => current + 1);
    }, 900);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-3 py-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
            <select aria-label="Preview reaction state" value={state} onChange={(event) => selectState(event.target.value as ChartEmotion | "data")} className="h-7 rounded-full border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {(["data", "loading", "neutral", "sad", "disappointed", "happy", "surprised", "proud"] as const).map((value) => <option key={value} value={value}>{value === "data" ? "Actual data" : value.charAt(0).toUpperCase() + value.slice(1)}</option>)}
          </select>
          <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs" onClick={replayChart} disabled={loading}>Replay</Button>
        </div>
      </div>
      <ChartReactionsProvider isLoading={loading || state === "loading"} reaction={state === "data" || state === "loading" ? undefined : { emotion: state }} replayKey={replay}>
        <div key={replay} className={cn("preview-canvas p-3 sm:p-6", className)}>{children}</div>
      </ChartReactionsProvider>
    </div>
  );
}

export function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="preview-section">
      <p className="preview-section-title">{title}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
