"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartHoverTooltip, ChartTooltipSurface } from "@/components/ui/chart";
import { ChartReaction, ChartSkeleton, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
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
  const [active, setActive] = React.useState<"used" | "remaining">();
  const formatAmount = (amount: number) => amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const tooltip = <ChartTooltipSurface title={title}>
    <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Used</span><span className="font-mono font-bold tabular-nums">{formatAmount(value)}</span></div>
    <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Remaining</span><span className="font-mono font-bold tabular-nums">{formatAmount(left)}</span></div>
    <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Limit</span><span className="font-mono font-bold tabular-nums">{formatAmount(max)}</span></div>
  </ChartTooltipSurface>;

  return (
    <Card className={cn("p-5", className)}>
      {!isLoading ? <ChartReaction reaction={reaction} /> : null}
      <ChartSkeleton isLoading={isLoading}>
        <p className="text-[15px] font-medium tracking-tight">{title}</p>
        <p className="mt-1 tabular-nums text-4xl font-medium tracking-tight">
          {left.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        {remainingLabel ? (
          <p className="mt-1 text-xs text-muted-foreground">{remainingLabel}</p>
        ) : null}
        <div className="mt-4 flex h-3 rounded-full bg-muted" role="group" aria-label={`${title} usage`}>
          {(["used", "remaining"] as const).map((part) => (
            <div key={part} className="h-full" style={{ width: `${part === "used" ? used : 100 - used}%` }}>
              <ChartHoverTooltip className="h-full" content={tooltip} onActiveChange={(next: boolean) => setActive((current) => next ? part : current === part ? undefined : current)}>
                <div
                  tabIndex={(part === "used" ? used : 100 - used) > 0 ? 0 : -1}
                  role="img"
                  aria-label={`${part === "used" ? "Used" : "Remaining"}: ${formatAmount(part === "used" ? value : left)} of ${formatAmount(max)}`}
                  className={cn("h-full transition-opacity motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", part === "used" ? "rounded-full bg-primary" : "rounded-r-full bg-muted", active && active !== part && "opacity-60")}
                />
              </ChartHoverTooltip>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span>{used.toFixed(0)}% used</span>
          {resetLabel ? <span>{resetLabel}</span> : null}
        </div>
      </ChartSkeleton>
    </Card>
  );
}

export const UsageMeter = Object.assign(UsageMeterRoot, {});
