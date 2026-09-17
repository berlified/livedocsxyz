"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartReaction, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

function UsageMeterRoot({
  title,
  value,
  max,
  remainingLabel,
  resetLabel,
  className,
  isLoading,
  reaction,
}: {
  title: string;
  value: number;
  max: number;
  remainingLabel?: string;
  resetLabel?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const settings = useChartReactions();
  isLoading = isLoading || Boolean(settings.isLoading);
  const used = max <= 0 ? 0 : Math.max(0, Math.min(1, value / max)) * 100;
  const left = Math.max(0, max - value);

  if (isLoading) {
    return <Card aria-busy="true" className={cn("min-h-40 p-5", className)}><ChartReaction isLoading loadingVariant="meter" reaction={reaction} /></Card>;
  }

  return (
    <Card className={cn("p-5", className)}>
      <ChartReaction reaction={reaction} />
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 tabular-nums text-3xl font-semibold tracking-tight">
        {left.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      {remainingLabel ? (
        <p className="mt-1 text-xs text-muted-foreground">{remainingLabel}</p>
      ) : null}
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${used}%`, backgroundColor: "var(--primary)" }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>{used.toFixed(0)}% used</span>
        {resetLabel ? <span>{resetLabel}</span> : null}
      </div>
    </Card>
  );
}

export const UsageMeter = Object.assign(UsageMeterRoot, {});
