"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer, colorVar, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type HeatmapCell = { x: string; y: string; value: number | null };

export type HeatmapChartProps = {
  data: HeatmapCell[];
  columns?: string[];
  rows?: string[];
  title?: string;
  description?: string;
  config?: ChartConfig;
  formatValue?: (value: number) => string;
  onCellClick?: (cell: HeatmapCell) => void;
  emptyLabel?: string;
  className?: string;
};

const defaultConfig = { value: { label: "Activity", color: "var(--chart-1)" } } satisfies ChartConfig;
const formatNumber = (value: number) => value.toLocaleString("en-US");

export function HeatmapChart({
  data,
  columns,
  rows,
  title = "Activity heatmap",
  description,
  config = defaultConfig,
  formatValue = formatNumber,
  onCellClick,
  emptyLabel = "No activity data available",
  className,
}: HeatmapChartProps) {
  const id = React.useId();
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [focused, setFocused] = React.useState<number | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const xLabels = Array.from(new Set(columns ?? data.map((cell) => cell.x)));
  const yLabels = Array.from(new Set(rows ?? data.map((cell) => cell.y)));
  const lookup = new Map<string, Map<string, HeatmapCell>>();
  for (const cell of data) {
    if (!lookup.has(cell.y)) lookup.set(cell.y, new Map());
    lookup.get(cell.y)!.set(cell.x, cell);
  }
  const cells = yLabels.flatMap((y) => xLabels.map((x) => {
    const value = lookup.get(y)?.get(x)?.value;
    return { x, y, value: typeof value === "number" && Number.isFinite(value) ? value : null };
  }));
  const finite = cells.filter((cell) => cell.value !== null);
  const scale = finite.reduce((max, cell) => Math.max(max, Math.abs(cell.value!)), 0) || 1;
  const low = finite.reduce((min, cell) => Math.min(min, cell.value! / scale), 0);
  const high = finite.reduce((max, cell) => Math.max(max, cell.value! / scale), 0);
  const activeIndex = dismissed ? null : hovered ?? focused;
  const active = activeIndex === null ? undefined : cells[activeIndex];
  const tabStop = Math.min(cursor, Math.max(0, cells.length - 1));
  const describe = (cell: HeatmapCell) => `${cell.y}, ${cell.x}: ${cell.value === null ? "No data" : formatValue(cell.value)}`;

  function navigate(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    const column = index % xLabels.length;
    if (event.key === "ArrowRight") next = column < xLabels.length - 1 ? index + 1 : index;
    else if (event.key === "ArrowLeft") next = column > 0 ? index - 1 : index;
    else if (event.key === "ArrowDown") next = Math.min(cells.length - 1, index + xLabels.length);
    else if (event.key === "ArrowUp") next = Math.max(0, index - xLabels.length);
    else if (event.key === "Home") next = event.ctrlKey ? 0 : index - column;
    else if (event.key === "End") next = event.ctrlKey ? cells.length - 1 : index - column + xLabels.length - 1;
    else if (event.key === "Escape") { setDismissed(true); return; }
    else return;
    event.preventDefault();
    setCursor(next);
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell-index="${next}"]`)?.focus();
  }

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="text-sm font-medium tracking-tight">{title}</h3>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <ChartContainer config={{ ...defaultConfig, ...config }} data={cells} variant="plain" className="mt-5">
        {!finite.length ? <p className="flex min-h-44 items-center justify-center text-sm text-muted-foreground" role="status">{emptyLabel}</p> : (
          <>
            <p id={`${id}-help`} className="sr-only">Use arrow keys to explore cells, Home and End to move within a row. Press Escape to dismiss details.</p>
            <div className="overflow-x-auto p-1">
              <div ref={gridRef} role="grid" aria-label={title} aria-describedby={`${id}-help`} aria-rowcount={yLabels.length + 1} aria-colcount={xLabels.length + 1} className="grid gap-1.5" style={{ minWidth: Math.max(240, xLabels.length * 30 + 72) }}>
                <div role="row" className="grid items-center gap-1.5" style={{ gridTemplateColumns: `4.5rem repeat(${xLabels.length}, minmax(0, 1fr))` }}>
                  <span role="columnheader" className="sr-only">Row</span>
                  <span aria-hidden />
                  {xLabels.map((label) => <span key={label} role="columnheader" className="truncate pb-1 text-center text-[10px] text-muted-foreground" title={label}>{label}</span>)}
                </div>
                {yLabels.map((label, rowIndex) => (
                  <div key={label} role="row" className="grid items-center gap-1.5" style={{ gridTemplateColumns: `4.5rem repeat(${xLabels.length}, minmax(0, 1fr))` }}>
                    <span role="rowheader" className="truncate pr-2 text-xs text-muted-foreground" title={label}>{label}</span>
                    {xLabels.map((x, columnIndex) => {
                      const index = rowIndex * xLabels.length + columnIndex;
                      const cell = cells[index]!;
                      const intensity = cell.value === null ? 0 : high === low ? 0 : (cell.value / scale - low) / (high - low);
                      return (
                        <div key={x} role="gridcell" className="min-w-0">
                          <Button
                            type="button"
                            variant="ghost"
                            data-cell-index={index}
                            tabIndex={index === tabStop ? 0 : -1}
                            aria-label={describe(cell)}
                            aria-describedby={activeIndex === index ? `${id}-detail` : undefined}
                            className={cn("h-8 w-full rounded-md border border-border/50 p-0 transition-shadow hover:ring-1 hover:ring-ring", activeIndex === index && "ring-2 ring-ring ring-offset-2 ring-offset-card")}
                            style={{ backgroundColor: cell.value === null ? "var(--muted)" : `color-mix(in oklab, ${colorVar("value")} ${8 + intensity * 82}%, var(--card))` }}
                            onMouseEnter={() => { setHovered(index); setDismissed(false); }}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => { setFocused(index); setCursor(index); setDismissed(false); }}
                            onBlur={() => setFocused(null)}
                            onKeyDown={(event) => navigate(event, index)}
                            onClick={() => { setFocused(index); setDismissed(false); onCellClick?.(cell); }}
                          >
                            {cell.value === null ? <span aria-hidden className="text-muted-foreground">–</span> : null}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
              <p id={`${id}-detail`} role="status" aria-live="polite" className="min-h-4">{active ? describe(active) : "Hover or focus a cell to explore"}</p>
              <div className="flex items-center gap-1.5" aria-label={`Scale: ${formatValue(low * scale)} to ${formatValue(high * scale)}`}>
                <span>Less</span>
                {[8, 28, 48, 68, 90].map((amount) => <span key={amount} aria-hidden className="size-2.5 rounded-sm border border-border/50" style={{ backgroundColor: `color-mix(in oklab, ${colorVar("value")} ${amount}%, var(--card))` }} />)}
                <span>More</span>
              </div>
            </div>
          </>
        )}
      </ChartContainer>
    </Card>
  );
}
