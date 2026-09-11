"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function UsageMeterRoot({
  title,
  value,
  max,
  remainingLabel,
  resetLabel,
  className,
}: {
  title: string;
  value: number;
  max: number;
  remainingLabel?: string;
  resetLabel?: string;
  className?: string;
}) {
  const used = max === 0 ? 0 : Math.min(1, value / max) * 100;
  const left = Math.max(0, max - value);

  return (
    <Card className={cn("p-5", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 font-mono text-3xl font-semibold tracking-tight">
        {left.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      {remainingLabel ? (
        <p className="mt-1 text-xs text-muted-foreground">{remainingLabel}</p>
      ) : null}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${used}%` }}
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
