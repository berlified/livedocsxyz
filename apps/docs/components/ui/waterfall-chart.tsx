"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type WaterfallDatum = { label: string; value: number; kind?: "change" | "total" };
export type WaterfallChartProps = {
  data: WaterfallDatum[];
  title?: string;
  description?: string;
  config?: ChartConfig;
  formatValue?: (value: number) => string;
  onBarClick?: (datum: WaterfallDatum, index: number) => void;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  emptyLabel?: string;
  className?: string;
};

const defaultConfig = {
  increase: { label: "Increase", color: "var(--chart-2)" },
  decrease: { label: "Decrease", color: "var(--chart-3)" },
  total: { label: "Total", color: "var(--chart-1)" },
} satisfies ChartConfig;
const formatNumber = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });

export function WaterfallChart({ data, title = "Balance movement", description, config = defaultConfig, formatValue = formatNumber, onBarClick, isLoading, reaction, emptyLabel = "No changes to display", className }: WaterfallChartProps) {
  const id = React.useId();
  const plot = React.useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = React.useState(0);
  const [active, setActive] = React.useState<number | null>(null);
  const reducedMotion = useChartReducedMotion();
  const settings = useChartReactions();
  const animate = !reducedMotion && settings.animationsEnabled !== false;
  let balance = 0;
  const rows = data.map((datum, index) => {
    const start = datum.kind === "total" ? 0 : balance;
    const end = datum.kind === "total" ? datum.value : balance + datum.value;
    const valid = Number.isFinite(datum.value) && Number.isFinite(end);
    if (valid) balance = end;
    return { ...datum, index, start, end, valid, series: datum.kind === "total" ? "total" : datum.value < 0 ? "decrease" : "increase" };
  });
  const validRows = rows.filter((row) => row.valid);
  const magnitude = validRows.reduce((max, row) => Math.max(max, Math.abs(row.start), Math.abs(row.end)), 1);
  const low = validRows.reduce((min, row) => Math.min(min, row.start / magnitude, row.end / magnitude), 0);
  const high = validRows.reduce((max, row) => Math.max(max, row.start / magnitude, row.end / magnitude), 0);
  const span = high - low || 1;
  const y = (value: number) => 28 + (high - value / magnitude) / span * 208;
  const chartWidth = Math.max(560, rows.length * 78 + 96);
  const step = (chartWidth - 100) / Math.max(rows.length, 1);
  const x = (index: number) => 78 + index * step;
  const barWidth = Math.min(44, step * 0.6);
  const describe = (row: typeof rows[number]) => row.valid ? `${row.label}: ${row.kind === "total" ? "total" : "change"} ${formatValue(row.value)}; balance ${formatValue(row.end)}` : `${row.label}: unavailable; balance unchanged`;
  const activeRow = active === null ? undefined : rows[active];
  const tabStop = Math.min(cursor, Math.max(rows.length - 1, 0));

  function navigate(event: React.KeyboardEvent<SVGGElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(index + 1, rows.length - 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = rows.length - 1;
    else if (event.key === "Escape") { setActive(null); return; }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActive(index); if (rows[index]?.valid) onBarClick?.(data[index]!, index); return; }
    else return;
    event.preventDefault();
    setCursor(next);
    plot.current?.querySelector<SVGGElement>(`[data-bar="${next}"]`)?.focus();
  }

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={title} aria-busy={isLoading}>
      <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <ChartContainer config={{ ...defaultConfig, ...config }} data={rows} variant="plain" className="mt-5 min-h-64" isLoading={isLoading} reaction={reaction}>
        {!validRows.length ? <p role="status" className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</p> : (
          <>
            <div className="mb-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
              {Object.keys(defaultConfig).map((key) => <span key={key} className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: `var(--color-${key})` }} aria-hidden />{config[key]?.label ?? defaultConfig[key as keyof typeof defaultConfig].label}</span>)}
            </div>
            <p id={`${id}-help`} className="sr-only">Use arrow keys, Home, and End to explore bars. Enter activates a bar. Escape dismisses details. Total bars set the running balance; unavailable changes leave it unchanged.</p>
            <div className="overflow-x-auto p-1">
              <svg ref={plot} viewBox={`0 0 ${chartWidth} 280`} className="block w-full overflow-visible" style={{ minWidth: chartWidth }} role="group" aria-label={title} aria-describedby={`${id}-help`}>
                {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                  const value = (high - span * fraction) * magnitude;
                  return <g key={fraction} aria-hidden><line x1={62} x2={chartWidth - 12} y1={28 + fraction * 208} y2={28 + fraction * 208} stroke="var(--border)" strokeDasharray="3 5" /><text x={54} y={32 + fraction * 208} textAnchor="end" className="fill-muted-foreground text-[10px]">{formatValue(value)}</text></g>;
                })}
                <line x1={62} x2={chartWidth - 12} y1={y(0)} y2={y(0)} stroke="var(--muted-foreground)" strokeOpacity={0.5} aria-hidden />
                {rows.map((row, index) => {
                  const top = row.valid ? Math.min(y(row.start), y(row.end)) : y(0);
                  const height = row.valid ? Math.max(2, Math.abs(y(row.start) - y(row.end))) : 2;
                  const next = rows[index + 1];
                  return <g key={index}>
                    {row.valid && next?.valid && next.kind !== "total" ? <line x1={x(index) + barWidth} x2={x(index + 1)} y1={y(row.end)} y2={y(row.end)} stroke="var(--muted-foreground)" strokeOpacity={0.5} strokeDasharray="3 3" aria-hidden /> : null}
                    <g data-bar={index} tabIndex={index === tabStop ? 0 : -1} role={onBarClick ? "button" : "img"} aria-label={describe(row)} aria-describedby={active === index ? `${id}-detail` : undefined}
                      onFocus={() => { setCursor(index); setActive(index); }} onBlur={() => setActive(null)} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onKeyDown={(event) => navigate(event, index)} onClick={() => { setActive(index); if (row.valid) onBarClick?.(data[index]!, index); }}
                      className="cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                      <rect x={x(index) - 6} y={20} width={barWidth + 12} height={226} fill="transparent" />
                      <rect x={x(index)} y={top - (height === 2 ? 1 : 0)} width={barWidth} height={height} rx={3} fill={row.valid ? `var(--color-${row.series})` : "var(--muted)"} fillOpacity={active === index ? 1 : 0.75} className={cn(animate && "transition-[fill-opacity] duration-150")} />
                    </g>
                    <text x={x(index) + barWidth / 2} y={263} textAnchor="middle" className="fill-muted-foreground text-[10px]" aria-hidden>{row.label.length > 11 ? `${row.label.slice(0, 10)}…` : row.label}</text>
                  </g>;
                })}
              </svg>
            </div>
            <p id={`${id}-detail`} role="status" className="mt-3 min-h-9 rounded-lg border border-border bg-accent/40 px-3 py-2 text-xs">{activeRow ? describe(activeRow) : `Closing balance ${formatValue(balance)}`}</p>
            <details className="mt-3 text-xs text-muted-foreground"><summary className="w-fit cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">View data</summary><div className="mt-2 overflow-x-auto"><table className="w-full text-left"><caption className="sr-only">{title}</caption><thead><tr><th className="p-2">Stage</th><th className="p-2">Type</th><th className="p-2">Value</th><th className="p-2">Balance</th></tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-border"><th scope="row" className="p-2 font-normal">{row.label}</th><td className="p-2">{row.kind ?? "change"}</td><td className="p-2 font-mono">{row.valid ? formatValue(row.value) : "Unavailable"}</td><td className="p-2 font-mono">{row.valid ? formatValue(row.end) : "Unchanged"}</td></tr>)}</tbody></table></div></details>
          </>
        )}
      </ChartContainer>
    </Card>
  );
}
