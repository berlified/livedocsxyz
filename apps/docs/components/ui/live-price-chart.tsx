"use client";

import * as React from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  GradientFill,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/chart-reactions";
import { formatCompactUsd, formatPrice, movingAverage, useLiveTicks, type ChartReactionOptions } from "@/components/ui/crypto-feed";
import { cn } from "@/lib/utils";

const timeframes = [
  { label: "1m", points: 120, vol: 0.004, drift: 0.0002 },
  { label: "5m", points: 120, vol: 0.008, drift: 0.0004 },
  { label: "15m", points: 120, vol: 0.012, drift: 0.0006 },
  { label: "1H", points: 96, vol: 0.016, drift: 0.0008 },
  { label: "4H", points: 84, vol: 0.022, drift: 0.001 },
  { label: "1D", points: 90, vol: 0.03, drift: 0.0012 },
] as const;

const defaultConfig = {
  price: { label: "Price", color: "var(--chart-1)" },
  ma: { label: "MA 20", color: "var(--muted-foreground)" },
  volume: { label: "Volume", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function LivePriceChart({
  symbol = "BTC/USDT",
  basePrice = 97500,
  seed = 11,
  tickMs = 1200,
  drift,
  vol,
  showMA = true,
  showVolume = true,
  config = defaultConfig,
  className,
  isLoading,
  reaction,
}: {
  symbol?: string;
  basePrice?: number;
  seed?: number;
  tickMs?: number;
  drift?: number;
  vol?: number;
  showMA?: boolean;
  showVolume?: boolean;
  config?: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const [frame, setFrame] = React.useState<(typeof timeframes)[number]>(timeframes[1]);
  const { ticks, last, change, streaming, setStreaming } = useLiveTicks({ seed, points: frame.points, start: basePrice, drift: drift ?? frame.drift, vol: vol ?? frame.vol, intervalMs: tickMs });
  const up = change >= 0;
  const rows = React.useMemo(() => {
    const prices = ticks.map((tick) => tick.price);
    const ma = movingAverage(prices, 20);
    return ticks.map((tick, index) => ({
      time: new Date(tick.t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      price: tick.price,
      ma: ma[index],
      volume: tick.volume,
    }));
  }, [ticks]);
  const high = React.useMemo(() => Math.max(...ticks.map((tick) => tick.price)), [ticks]);
  const low = React.useMemo(() => Math.min(...ticks.map((tick) => tick.price)), [ticks]);
  const volume = React.useMemo(() => ticks.reduce((sum, tick) => sum + tick.volume, 0), [ticks]);

  return (
    <Card className={cn("min-w-0 w-full p-5 sm:p-6", className)} role="region" aria-label={`${symbol} live price`}>
      <ChartSkeleton isLoading={isLoading}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 truncate text-[15px] font-medium tracking-tight">
              {symbol}
              <span className="flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <span className={cn("size-1.5 rounded-full", streaming ? "animate-pulse bg-chart-up" : "bg-muted-foreground")} aria-hidden />
                {streaming ? "LIVE" : "PAUSED"}
              </span>
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <p className="tabular-nums text-5xl font-medium tracking-tight" aria-live="off">
                {last ? `$${formatPrice(last.price)}` : "—"}
              </p>
              <span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-semibold tabular-nums", up ? "bg-chart-up/15 text-chart-up" : "bg-destructive/15 text-destructive")}>
                {up ? "▲" : "▼"} {up ? "+" : ""}{change.toFixed(2)}%
              </span>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
              <span>H <span className="font-mono tabular-nums text-foreground">${formatPrice(high)}</span></span>
              <span>L <span className="font-mono tabular-nums text-foreground">${formatPrice(low)}</span></span>
              <span>Vol <span className="font-mono tabular-nums text-foreground">{formatCompactUsd(volume * (last?.price ?? 0))}</span></span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div role="group" aria-label="Timeframe" className="flex rounded-full border border-border bg-card p-1">
              {timeframes.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={frame.label === item.label}
                  onClick={() => setFrame(item)}
                  className={cn("h-7 rounded-full px-2.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", frame.label === item.label ? "bg-accent font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={streaming}
              onClick={() => setStreaming((value) => !value)}
              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {streaming ? "Pause feed" : "Resume feed"}
            </button>
          </div>
        </div>
        <ChartContainer isLoading={isLoading} reaction={reaction} config={{ ...defaultConfig, ...config }} data={rows} variant="plain" className="mt-3 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsComposedChart data={rows} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <GradientFill id="live-price-fill" color={colorVar("price")} />
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={64} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <YAxis yAxisId="price" orientation="right" width={64} tickLine={false} axisLine={false} domain={["auto", "auto"]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value: number) => `$${formatPrice(value)}`} />
              <YAxis yAxisId="volume" hide domain={[0, "dataMax"]} />
              <Tooltip
                cursor={{ stroke: "var(--chart-cursor)", strokeWidth: 1 }}
                content={<ChartTooltipContent labelFormatter={(label) => String(label)} />}
              />
              {showVolume ? <Bar yAxisId="volume" dataKey="volume" fill={colorVar("volume")} fillOpacity={0.25} radius={[2, 2, 0, 0]} maxBarSize={10} isAnimationActive={false} /> : null}
              <Area yAxisId="price" type="monotone" dataKey="price" stroke={colorVar("price")} strokeWidth={2.5} fill="url(#live-price-fill)" fillOpacity={1} dot={false} activeDot={{ r: 4, fill: colorVar("price"), stroke: "var(--background)", strokeWidth: 2 }} isAnimationActive={false} />
              {showMA ? <Line yAxisId="price" type="monotone" dataKey="ma" stroke={colorVar("ma")} strokeWidth={1.5} strokeDasharray="5 4" dot={false} connectNulls isAnimationActive={false} /> : null}
            </RechartsComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartSkeleton>
    </Card>
  );
}
