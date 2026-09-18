"use client";

import * as React from "react";

import { ChartContainer, ChartHoverTooltip, ChartTooltipSurface, colorVar, pixelFillStyle, type ChartConfig } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type LaneRow = { key: string; label: string; value: number };

function LaneChartRoot({
  title,
  rows,
  config,
  className,
  isLoading,
  reaction,
}: {
  title?: string;
  rows: LaneRow[];
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const [selected, setSelected] = React.useState<string>();
  const [active, setActive] = React.useState<string>();

  return (
    <Card className={cn("p-5", className)}>
      <ChartContainer
        isLoading={isLoading}
        loadingVariant="lane"
        reaction={reaction}
        config={config}
        data={rows as unknown as Record<string, unknown>[]}
        className="w-full justify-start"
        variant="plain"
      >
        {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
        <ul className="mt-4 space-y-3">
          {rows.map((row) => {
            const emphasized = active ?? selected;
            const muted = emphasized !== undefined && emphasized !== row.key;
            return (
              <li key={row.key} onKeyDown={(event) => { if (event.key === "Escape") setSelected(undefined); }}>
                <ChartHoverTooltip
                  onActiveChange={(next: boolean) => setActive((current) => next ? row.key : current === row.key ? undefined : current)}
                  content={<ChartTooltipSurface title={config[row.key]?.label ?? row.label}><div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Value</span><span className="font-mono font-bold tabular-nums">{row.value.toLocaleString("en-US", { maximumFractionDigits: 20 })}</span></div></ChartTooltipSurface>}
                >
                <button
                  type="button"
                  aria-pressed={selected === row.key}
                  onClick={() =>
                    setSelected((current) => (current === row.key ? undefined : row.key))
                  }
                  className={cn(
                    "grid w-full grid-cols-[7rem_1fr_3rem] items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <span className="truncate text-sm text-muted-foreground">
                    {config[row.key]?.label ?? row.label}
                  </span>
                  <span className={cn("h-3 overflow-hidden rounded-full bg-muted transition-opacity motion-reduce:transition-none", muted && "opacity-60")}>
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${(row.value / max) * 100}%`,
                        ...pixelFillStyle(colorVar(row.key)),
                      }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-xs">{row.value}</span>
                </button>
                </ChartHoverTooltip>
              </li>
            );
          })}
        </ul>
      </ChartContainer>
    </Card>
  );
}

export const LaneChart = Object.assign(LaneChartRoot, {});
