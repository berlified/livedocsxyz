"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer, colorVar, type ChartConfig } from "@/components/ui/chart";
import { useChartReactions, useChartReducedMotion, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type HeatmapCell = { x: string; y: string; value: number | null };

export type HeatmapChartProps = {
  data: HeatmapCell[];
  columns?: string[];
  rows?: string[];
  layout?: "calendar" | "matrix";
  title?: string;
  description?: string;
  config?: ChartConfig;
  formatValue?: (value: number) => string;
  onCellClick?: (cell: HeatmapCell) => void;
  emptyLabel?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
};

const defaultConfig = { value: { label: "Activity", color: "var(--chart-2, var(--primary))" } } satisfies ChartConfig;
const formatNumber = (value: number) => value.toLocaleString("en-US");
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const amounts = [8, 28, 48, 70, 95];
const parseWeek = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`));
const monthName = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });

export function HeatmapChart({
  data,
  columns,
  rows,
  layout,
  title = "Activity heatmap",
  description,
  config = defaultConfig,
  formatValue = formatNumber,
  onCellClick,
  emptyLabel = "No activity data available",
  className,
  isLoading,
  reaction,
}: HeatmapChartProps) {
  const id = React.useId();
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [focused, setFocused] = React.useState<number | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = React.useState<number | null>(null);
  const [focusedLevel, setFocusedLevel] = React.useState<number | null>(null);
  const settings = useChartReactions();
  const reducedMotion = useChartReducedMotion();
  const animate = !reducedMotion && settings.animationsEnabled !== false;
  const loading = Boolean(isLoading || settings.isLoading);
  const xLabels = Array.from(new Set(columns ?? data.map((cell) => cell.x)));
  const calendar = layout === "calendar" || (layout !== "matrix" && xLabels.length > 0 && xLabels.every(parseWeek) && (rows ?? data.map((cell) => cell.y)).every((label) => weekdays.includes(label)));
  const yLabels = Array.from(new Set(rows ?? (calendar ? weekdays : data.map((cell) => cell.y))));
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
  const level = (cell: HeatmapCell) => cell.value === null ? null : high === low || cell.value / scale === low ? 0 : Math.min(4, Math.max(1, Math.ceil((cell.value / scale - low) / (high - low) * 4)));
  const fill = (index: number) => `color-mix(in oklab, ${colorVar("value")} ${amounts[index]}%, var(--card))`;
  const activeLevel = hoveredLevel ?? focusedLevel ?? selectedLevel;
  const activeIndex = dismissed ? null : hovered ?? focused;
  const active = activeIndex === null ? undefined : cells[activeIndex];
  const tabStop = Math.min(cursor, Math.max(0, cells.length - 1));
  const template = `${calendar ? "2rem" : "4.5rem"} repeat(${xLabels.length}, minmax(0, 1fr))`;
  const describe = (cell: HeatmapCell) => {
    let label = `${cell.y}, ${cell.x}`;
    if (calendar && parseWeek(cell.x) && weekdays.includes(cell.y)) {
      const date = new Date(`${cell.x}T00:00:00Z`);
      date.setUTCDate(date.getUTCDate() + (weekdays.indexOf(cell.y) - date.getUTCDay() + 7) % 7);
      label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    }
    return `${label}: ${cell.value === null ? "No data" : formatValue(cell.value)}`;
  };
  const describeLevel = (index: number) => index === 0 ? formatValue(low * scale) : `${formatValue((low + (high - low) * (index - 1) / 4) * scale)}–${formatValue((low + (high - low) * index / 4) * scale)}`;
  const gridSignature = JSON.stringify([xLabels, yLabels]);

  React.useEffect(() => {
    if (!animate || loading || !finite.length) return;
    const animations = Array.from(gridRef.current?.querySelectorAll<HTMLElement>("[data-cell-index]") ?? []).map((element) => {
      const index = Number(element.dataset.cellIndex);
      return element.animate?.(
        [{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "scale(1)" }],
        { duration: 350, delay: Math.min(600, index % xLabels.length * 9 + Math.floor(index / xLabels.length) * 18), easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
      );
    });
    return () => animations.forEach((animation) => animation?.cancel());
  }, [animate, loading, gridSignature, finite.length, xLabels.length, settings.replayKey]);

  function navigate(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    const column = index % xLabels.length;
    if (event.key === "ArrowRight") next = column < xLabels.length - 1 ? index + 1 : index;
    else if (event.key === "ArrowLeft") next = column > 0 ? index - 1 : index;
    else if (event.key === "ArrowDown") next = index + xLabels.length < cells.length ? index + xLabels.length : index;
    else if (event.key === "ArrowUp") next = index >= xLabels.length ? index - xLabels.length : index;
    else if (event.key === "Home") next = event.ctrlKey ? 0 : index - column;
    else if (event.key === "End") next = event.ctrlKey ? cells.length - 1 : index - column + xLabels.length - 1;
    else if (event.key === "Escape") { setDismissed(true); setSelectedLevel(null); return; }
    else return;
    event.preventDefault();
    setCursor(next);
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell-index="${next}"]`)?.focus();
  }

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-labelledby={`${id}-title`} aria-busy={loading}>
      <h3 id={`${id}-title`} className="text-sm font-medium tracking-tight">{title}</h3>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <ChartContainer isLoading={isLoading} loadingVariant="heatmap" reaction={reaction} config={{ ...defaultConfig, ...config }} data={cells} variant="plain" className="mt-5">
        {!finite.length ? <p className="flex min-h-44 items-center justify-center text-sm text-muted-foreground" role="status">{emptyLabel}</p> : (
          <>
            <p id={`${id}-help`} className="sr-only">Use arrow keys to explore cells, Home and End to move within a row. Press Escape to dismiss details. Use the legend to highlight an intensity level.</p>
            <div className="overflow-x-auto p-1">
              <div ref={gridRef} role="grid" aria-label={title} aria-describedby={`${id}-help`} aria-rowcount={yLabels.length + 1} aria-colcount={xLabels.length + 1} className={cn("grid", calendar ? "gap-[3px]" : "gap-1.5")} style={{ minWidth: Math.max(240, xLabels.length * (calendar ? 12 : 30) + (calendar ? 36 : 72)) }}>
                <div role="row" className={cn("grid items-end", calendar ? "gap-[3px]" : "gap-1.5")} style={{ gridTemplateColumns: template }}>
                  <span role="columnheader"><span className="sr-only">{calendar ? "Day" : "Row"}</span></span>
                  {xLabels.map((label, index) => {
                    const month = calendar && parseWeek(label) ? monthName(label) : label;
                    const show = !calendar || index === 0 || month !== (parseWeek(xLabels[index - 1]!) ? monthName(xLabels[index - 1]!) : xLabels[index - 1]);
                    return <span key={label} role="columnheader" className={cn("h-6 pb-2 text-[10px] text-muted-foreground", !calendar && "truncate text-center")} aria-label={calendar ? `Week of ${label}` : label}><span aria-hidden className={cn(calendar && "block w-max", !show && "invisible")}>{show ? month : ""}</span></span>;
                  })}
                </div>
                {yLabels.map((label, rowIndex) => (
                  <div key={label} role="row" className={cn("grid items-center", calendar ? "gap-[3px]" : "gap-1.5")} style={{ gridTemplateColumns: template }}>
                    <span role="rowheader" className="truncate pr-1 text-[10px] text-muted-foreground" title={label}><span className={cn(calendar && !["Mon", "Wed", "Fri"].includes(label) && "sr-only")}>{label}</span></span>
                    {xLabels.map((x, columnIndex) => {
                      const index = rowIndex * xLabels.length + columnIndex;
                      const cell = cells[index]!;
                      const intensity = level(cell);
                      return (
                        <div key={x} role="gridcell" className="min-w-0">
                          <Button
                            type="button"
                            variant="ghost"
                            data-cell-index={index}
                            tabIndex={index === tabStop ? 0 : -1}
                            aria-label={describe(cell)}
                            aria-describedby={activeIndex === index ? `${id}-detail` : undefined}
                            className={cn("relative block w-full border border-border/30 p-0 hover:z-10 hover:ring-1 hover:ring-ring focus-visible:z-10", calendar ? "aspect-square h-auto rounded-[3px]" : "h-8 rounded-md", animate ? "transition-[opacity,box-shadow] duration-200" : "transition-none", activeIndex === index && "z-10 ring-2 ring-ring ring-offset-2 ring-offset-card")}
                            style={{ backgroundColor: intensity === null ? "var(--muted)" : fill(intensity), opacity: activeLevel !== null && intensity !== activeLevel && activeIndex !== index ? 0.2 : 1 }}
                            onMouseEnter={() => { setHovered(index); setDismissed(false); }}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => { setFocused(index); setCursor(index); setDismissed(false); }}
                            onBlur={() => setFocused(null)}
                            onKeyDown={(event) => navigate(event, index)}
                            onClick={() => { setFocused(index); setDismissed(false); onCellClick?.(cell); }}
                          >
                            {cell.value === null ? <span aria-hidden className={cn("text-muted-foreground", calendar && "sr-only")}>–</span> : null}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <p id={`${id}-detail`} role="status" aria-live="polite" className="min-h-4">{active ? describe(active) : activeLevel !== null ? `Highlighting ${describeLevel(activeLevel)}` : `Hover or focus a ${calendar ? "day" : "cell"} to explore`}</p>
              <div role="group" className="ml-auto flex items-center gap-0.5" aria-label={`Intensity: ${formatValue(low * scale)} to ${formatValue(high * scale)}`}>
                <span className="mr-1.5">Less</span>
                {amounts.map((amount, index) => (
                  <Button key={amount} type="button" variant="ghost" aria-label={`Highlight intensity ${index + 1} of 5: ${describeLevel(index)}`} aria-pressed={selectedLevel === index}
                    className={cn("size-6 rounded-sm p-1", !animate && "transition-none", activeLevel === index && "bg-accent ring-1 ring-ring")}
                    onMouseEnter={() => setHoveredLevel(index)} onMouseLeave={() => setHoveredLevel(null)}
                    onFocus={() => setFocusedLevel(index)} onBlur={() => setFocusedLevel(null)}
                    onKeyDown={(event) => { if (event.key === "Escape") { setSelectedLevel(null); setHoveredLevel(null); setFocusedLevel(null); } }}
                    onClick={() => setSelectedLevel((current) => current === index ? null : index)}>
                    <span aria-hidden className="block size-3.5 rounded-[3px] border border-border/30" style={{ backgroundColor: fill(index) }} />
                  </Button>
                ))}
                <span className="ml-1.5">More</span>
              </div>
            </div>
          </>
        )}
      </ChartContainer>
    </Card>
  );
}
