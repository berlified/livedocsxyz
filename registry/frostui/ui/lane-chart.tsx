"use client";

import * as React from "react";

import { ChartContainer, colorVar, pixelFillStyle, type ChartConfig } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type LaneRow = { key: string; label: string; value: number };

function LaneChartRoot({
  title,
  rows,
  config,
  className,
}: {
  title?: string;
  rows: LaneRow[];
  config: ChartConfig;
  className?: string;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const [selected, setSelected] = React.useState<string>();

  return (
    <Card className={cn("p-5", className)}>
      <ChartContainer
        config={config}
        data={rows as unknown as Record<string, unknown>[]}
        className="w-full justify-start"
        variant="plain"
      >
        {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
        <ul className="mt-4 space-y-3">
          {rows.map((row) => {
            const muted = selected && selected !== row.key;
            return (
              <li key={row.key}>
                <button
                  type="button"
                  onClick={() =>
                    setSelected((current) => (current === row.key ? undefined : row.key))
                  }
                  className={cn(
                    "grid w-full grid-cols-[7rem_1fr_3rem] items-center gap-3 rounded-lg text-left transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    muted && "opacity-35"
                  )}
                >
                  <span className="truncate text-sm text-muted-foreground">
                    {config[row.key]?.label ?? row.label}
                  </span>
                  <span className="h-3 overflow-hidden rounded-full bg-muted">
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
              </li>
            );
          })}
        </ul>
      </ChartContainer>
    </Card>
  );
}

export const LaneChart = Object.assign(LaneChartRoot, {});
