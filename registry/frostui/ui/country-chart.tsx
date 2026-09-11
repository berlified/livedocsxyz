"use client";

import * as React from "react";

import { ChartContainer, colorVar, type ChartConfig } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type CountryRow = {
  region: string;
  code?: string;
  current: number;
  previous?: number;
};

function formatCompact(value: number) {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toLocaleString("en-US")}`;
}

function CountryChartRoot({
  title,
  rows,
  config,
  className,
  currency = true,
}: {
  title?: string;
  rows: CountryRow[];
  config: ChartConfig;
  className?: string;
  currency?: boolean;
}) {
  const max = Math.max(...rows.flatMap((row) => [row.current, row.previous ?? 0]), 1);
  const [selected, setSelected] = React.useState<string>();

  return (
    <Card className={cn("p-5", className)}>
      <ChartContainer
        config={config}
        data={rows as unknown as Record<string, unknown>[]}
        className="w-full justify-start"
      >
        {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-sm" style={{ background: colorVar("current") }} />
            {config.current?.label ?? "This period"}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-1 rounded-full bg-foreground"
              aria-hidden
            />
            {config.previous?.label ?? "Last period"}
          </span>
        </div>
        <ul className="mt-4 space-y-3">
          {rows.map((row) => {
            const muted = selected && selected !== row.region;
            const currentPct = (row.current / max) * 100;
            const previousPct =
              row.previous == null ? null : (row.previous / max) * 100;
            return (
              <li key={row.region}>
                <button
                  type="button"
                  onClick={() =>
                    setSelected((current) =>
                      current === row.region ? undefined : row.region
                    )
                  }
                  className={cn(
                    "grid w-full grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-left transition-opacity",
                    muted && "opacity-35"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {row.code ? (
                      <span className="rounded border border-border bg-background px-1 py-px font-mono text-[10px] text-muted-foreground">
                        {row.code}
                      </span>
                    ) : null}
                    <span className="truncate text-sm text-foreground">{row.region}</span>
                  </span>
                  <span className="relative h-3.5 overflow-visible rounded-full bg-muted">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${currentPct}%`,
                        background: colorVar("current"),
                      }}
                    />
                    {previousPct != null ? (
                      <span
                        className="absolute top-1/2 z-10 h-3.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-sm"
                        style={{ left: `${previousPct}%` }}
                        title="Last period"
                      />
                    ) : null}
                  </span>
                  <span className="text-right font-mono text-xs text-foreground">
                    {currency ? formatCompact(row.current) : row.current.toLocaleString("en-US")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </ChartContainer>
    </Card>
  );
}

export const CountryChart = Object.assign(CountryChartRoot, {});
