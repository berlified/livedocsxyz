"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltipSurface, type ChartConfig } from "@/components/ui/chart";
import { ChartSkeleton, useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type CandlestickDatum = { label: string; open: number; high: number; low: number; close: number; volume?: number };
export type CandlestickChartProps = {
  data: CandlestickDatum[];
  title?: string;
  description?: string;
  config?: ChartConfig;
  showVolume?: boolean;
  formatValue?: (value: number) => string;
  formatVolume?: (value: number) => string;
  onCandleClick?: (datum: CandlestickDatum, index: number) => void;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  emptyLabel?: string;
  className?: string;
};

const defaultConfig = { up: { label: "Close ≥ open", color: "var(--chart-2)" }, down: { label: "Close < open", color: "var(--chart-3)" } } satisfies ChartConfig;
const formatNumber = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });
const validCandle = (row: CandlestickDatum) => [row.open, row.high, row.low, row.close].every(Number.isFinite) && row.low <= Math.min(row.open, row.close) && row.high >= Math.max(row.open, row.close);
const validVolume = (value: number | undefined): value is number => value !== undefined && Number.isFinite(value) && value >= 0;

export function CandlestickChart({ data, title = "Price action", description, config = defaultConfig, showVolume = true, formatValue = formatNumber, formatVolume = formatNumber, onCandleClick, isLoading, reaction, emptyLabel = "No valid OHLC data available", className }: CandlestickChartProps) {
  const id = React.useId();
  const plot = React.useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [focused, setFocused] = React.useState<number | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const active = dismissed ? null : hovered ?? focused;
  const tooltipHost = React.useRef<HTMLDivElement>(null);
  const [tooltipPoint, setTooltipPoint] = React.useState({ left: 0, top: 0 });
  const placeTooltip = (element: SVGGElement) => {
    const host = tooltipHost.current?.getBoundingClientRect();
    const bounds = element.getBoundingClientRect();
    if (host) setTooltipPoint({ left: Math.max(0, Math.min(bounds.left - host.left + bounds.width + 8, host.width - 224)), top: bounds.top - host.top + 8 });
    setDismissed(false);
  };
  React.useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") setDismissed(true); };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, []);
  const reducedMotion = useChartReducedMotion();
  const settings = useChartReactions();
  const animate = !reducedMotion && settings.animationsEnabled !== false;
  const rows = data.map((row) => ({ ...row, valid: validCandle(row) }));
  const validRows = rows.filter((row) => row.valid);
  const magnitude = validRows.reduce((max, row) => Math.max(max, Math.abs(row.high), Math.abs(row.low)), 1);
  const lower = validRows.reduce((min, row) => Math.min(min, row.low / magnitude), Infinity);
  const upper = validRows.reduce((max, row) => Math.max(max, row.high / magnitude), -Infinity);
  const padding = upper === lower ? Math.max(Math.abs(upper) * 0.05, 0.05) : (upper - lower) * 0.08;
  const low = lower - padding;
  const high = upper + padding;
  const y = (value: number) => 24 + (high - value / magnitude) / (high - low) * 192;
  const maxVolume = rows.reduce((max, row) => validVolume(row.volume) ? Math.max(max, row.volume) : max, 0) || 1;
  const hasVolume = showVolume && rows.some((row) => validVolume(row.volume));
  const chartWidth = Math.max(560, rows.length * 42 + 96);
  const chartHeight = hasVolume ? 316 : 256;
  const step = (chartWidth - 100) / Math.max(rows.length, 1);
  const candleWidth = Math.min(20, step * 0.52);
  const x = (index: number) => 78 + index * step + step / 2;
  const selected = active === null ? undefined : rows[active];
  const describe = (row: typeof rows[number]) => row.valid ? `${row.label}: open ${formatValue(row.open)}, high ${formatValue(row.high)}, low ${formatValue(row.low)}, close ${formatValue(row.close)}${validVolume(row.volume) ? `, volume ${formatVolume(row.volume)}` : ""}` : `${row.label}: unavailable OHLC data`;

  function navigate(event: React.KeyboardEvent<SVGGElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(index + 1, rows.length - 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = rows.length - 1;
    else if (event.key === "Escape") { setDismissed(true); return; }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setFocused(index); setDismissed(false); if (rows[index]?.valid) onCandleClick?.(data[index]!, index); return; }
    else return;
    event.preventDefault();
    setCursor(next);
    plot.current?.querySelector<SVGGElement>(`[data-candle="${next}"]`)?.focus();
  }

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={title} aria-busy={isLoading || settings.isLoading}>
      <ChartSkeleton isLoading={isLoading}>
      <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <ChartContainer config={{ ...defaultConfig, ...config }} data={rows} variant="plain" isLoading={isLoading} loadingVariant="candlestick" reaction={reaction} className="mt-5 min-h-64">
        {!validRows.length ? <p role="status" className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</p> : (
          <>
            <div className="mb-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground"><span>Hollow: close ≥ open</span><span>Filled: close &lt; open</span>{hasVolume ? <span>Volume below</span> : null}</div>
            <p id={`${id}-help`} className="sr-only">Use arrow keys, Home, and End to explore candles. Enter activates a candle; Escape dismisses details. Invalid OHLC records are shown as gaps.</p>
            <div ref={tooltipHost} className="relative">
            <div className="overflow-x-auto p-1" onScroll={() => setDismissed(true)}>
              <svg ref={plot} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="block w-full overflow-visible" style={{ minWidth: chartWidth }} role="group" aria-label={title} aria-describedby={`${id}-help`}>
                {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                  const normalized = high - (high - low) * fraction;
                  const value = normalized * magnitude;
                  return <g key={fraction} aria-hidden><line x1={64} x2={chartWidth - 12} y1={24 + fraction * 192} y2={24 + fraction * 192} stroke="var(--border)" strokeDasharray="3 5" /><text x={56} y={28 + fraction * 192} textAnchor="end" className="fill-muted-foreground text-[10px]">{Number.isFinite(value) ? formatValue(value) : "—"}</text></g>;
                })}
                {hasVolume ? <line x1={64} x2={chartWidth - 12} y1={238} y2={238} stroke="var(--border)" aria-hidden /> : null}
                {rows.map((row, index) => {
                  const up = row.close >= row.open;
                  const color = `var(--color-${up ? "up" : "down"})`;
                  const bodyTop = row.valid ? Math.min(y(row.open), y(row.close)) : 120;
                  const bodyHeight = row.valid ? Math.max(1.5, Math.abs(y(row.open) - y(row.close))) : 0;
                  return <g key={index}>
                    <g data-candle={index} tabIndex={index === Math.min(cursor, rows.length - 1) ? 0 : -1} role={onCandleClick ? "button" : "img"} aria-label={describe(row)} aria-describedby={active === index ? `${id}-tooltip` : undefined}
                      onFocus={(event) => { setFocused(index); setCursor(index); placeTooltip(event.currentTarget); }} onBlur={() => setFocused(null)} onMouseEnter={(event) => { setHovered(index); placeTooltip(event.currentTarget); }} onMouseLeave={() => setHovered(null)} onKeyDown={(event) => navigate(event, index)} onClick={(event) => { event.currentTarget.focus(); placeTooltip(event.currentTarget); if (row.valid) onCandleClick?.(data[index]!, index); }}
                      opacity={active !== null && active !== index ? 0.6 : 1}
                      className={cn("cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", animate && "transition-opacity duration-150")}>
                      <rect x={x(index) - step / 2 + 2} y={18} width={step - 4} height={hasVolume ? 269 : 206} rx={4} fill="var(--accent)" fillOpacity={active === index ? 0.7 : 0} className={cn(animate && "transition-[fill-opacity] duration-150")} />
                      {row.valid ? <>
                        <line x1={x(index)} x2={x(index)} y1={y(row.high)} y2={y(row.low)} stroke={color} strokeWidth={1.5} />
                        <rect x={x(index) - candleWidth / 2} y={bodyTop - (bodyHeight === 1.5 ? 0.75 : 0)} width={candleWidth} height={bodyHeight} rx={2} fill={up ? "var(--card)" : color} stroke={color} strokeWidth={1.5} />
                      </> : <text x={x(index)} y={124} textAnchor="middle" className="fill-muted-foreground text-xs" aria-hidden>—</text>}
                      {hasVolume && validVolume(row.volume) ? <rect x={x(index) - candleWidth / 2} y={286 - row.volume / maxVolume * 36} width={candleWidth} height={row.volume / maxVolume * 36} rx={2} fill={row.valid ? color : "var(--muted-foreground)"} fillOpacity={0.3} /> : null}
                    </g>
                    {index % Math.max(1, Math.ceil(rows.length / 10)) === 0 || index === rows.length - 1 ? <text x={x(index)} y={chartHeight - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]" aria-hidden>{row.label.length > 10 ? `${row.label.slice(0, 9)}…` : row.label}</text> : null}
                  </g>;
                })}
                {selected?.valid && active !== null ? <g pointerEvents="none" aria-hidden>
                  <line x1={x(active)} x2={x(active)} y1={18} y2={hasVolume ? 286 : 216} stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeOpacity={0.65} />
                  <line x1={64} x2={chartWidth - 12} y1={y(selected.close)} y2={y(selected.close)} stroke="var(--muted-foreground)" strokeDasharray="4 4" strokeOpacity={0.65} />
                  <circle cx={x(active)} cy={y(selected.close)} r={3} fill="var(--card)" stroke="var(--foreground)" />
                </g> : null}
              </svg>
            </div>
            {selected ? <div className="pointer-events-none absolute z-50 w-56 max-w-full" style={tooltipPoint}>
              <ChartTooltipSurface id={`${id}-tooltip`} title={selected.label}>
                {selected.valid ? (["open", "high", "low", "close"] as const).map((key) => <div key={key} className="flex items-center justify-between gap-6"><span className="capitalize text-muted-foreground">{key}</span><span className="font-mono font-bold tabular-nums">{formatValue(selected[key])}</span></div>) : <p className="text-muted-foreground">Unavailable OHLC data</p>}
                <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Volume</span><span className="font-mono font-bold tabular-nums">{validVolume(selected.volume) ? formatVolume(selected.volume) : "Unavailable"}</span></div>
              </ChartTooltipSurface>
            </div> : null}
            </div>
            <p id={`${id}-detail`} role="status" className="mt-3 min-h-9 rounded-lg border border-border bg-accent/40 px-3 py-2 text-xs">{selected ? describe(selected) : "Hover or focus a candle to inspect OHLC and volume."}</p>
            <details className="mt-3 text-xs text-muted-foreground"><summary className="w-fit cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">View data</summary><div className="mt-2 overflow-x-auto"><table className="w-full text-left"><caption className="sr-only">{title}</caption><thead><tr>{["Period", "Open", "High", "Low", "Close", "Volume"].map((label) => <th key={label} className="p-2">{label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-border"><th scope="row" className="p-2 font-normal">{row.label}{!row.valid ? " (unavailable)" : ""}</th>{[row.open, row.high, row.low, row.close].map((value, column) => <td key={column} className="p-2 font-mono">{Number.isFinite(value) ? formatValue(value) : "—"}</td>)}<td className="p-2 font-mono">{validVolume(row.volume) ? formatVolume(row.volume) : "—"}</td></tr>)}</tbody></table></div></details>
          </>
        )}
      </ChartContainer>
      </ChartSkeleton>
    </Card>
  );
}
