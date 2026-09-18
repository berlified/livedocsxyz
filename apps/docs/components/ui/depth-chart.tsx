"use client";

import * as React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/chart-reactions";
import { formatPrice, mulberry32, type ChartReactionOptions } from "@/components/ui/crypto-feed";
import { cn } from "@/lib/utils";

const defaultConfig = {
  bids: { label: "Bids", color: "var(--chart-up)" },
  asks: { label: "Asks", color: "var(--destructive)" },
} satisfies ChartConfig;

function buildDepth(seed: number, mid: number, levels: number, step: number) {
  const rand = mulberry32(seed);
  let bidTotal = 0;
  let askTotal = 0;
  const bids = Array.from({ length: levels }, (_, index) => {
    bidTotal += 0.2 + rand() * 3 + (index === 4 ? 9 : 0);
    return { price: mid - (levels - index) * step, bids: bidTotal, asks: null as number | null };
  });
  const asks = Array.from({ length: levels }, (_, index) => {
    askTotal += 0.2 + rand() * 3 + (index === 6 ? 11 : 0);
    return { price: mid + (index + 1) * step, bids: null as number | null, asks: askTotal };
  });
  return { rows: [...bids, ...asks], mid, max: Math.max(bidTotal, askTotal) };
}

export function DepthChart({
  symbol = "BTC/USDT",
  basePrice = 97500,
  tickSize = 25,
  levels = 24,
  seed = 31,
  tickMs = 2500,
  className,
  isLoading,
  reaction,
}: {
  symbol?: string;
  basePrice?: number;
  tickSize?: number;
  levels?: number;
  seed?: number;
  tickMs?: number;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const [nonce, setNonce] = React.useState(0);
  const depth = React.useMemo(() => buildDepth(seed + nonce * 131, basePrice, levels, tickSize), [seed, nonce, basePrice, levels, tickSize]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setNonce((value) => value + 1);
    }, tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return (
    <Card className={cn("min-w-0 w-full p-5 sm:p-6", className)} role="region" aria-label={`${symbol} market depth`}>
      <ChartSkeleton isLoading={isLoading}>
        <p className="truncate text-[15px] font-medium tracking-tight">Market depth</p>
        <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
          Mid <span className="text-foreground">${formatPrice(depth.mid)}</span>
        </p>
        <ChartContainer isLoading={isLoading} reaction={reaction} config={defaultConfig} data={depth.rows} variant="plain" className="mt-3 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsComposedChart data={depth.rows} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
              <XAxis dataKey="price" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={64} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value: number) => `$${Math.round(value).toLocaleString("en-US")}`} />
              <YAxis orientation="right" width={44} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Tooltip
                cursor={{ stroke: "var(--chart-cursor)", strokeWidth: 1 }}
                content={<ChartTooltipContent labelFormatter={(label) => `$${formatPrice(Number(label))}`} />}
              />
              <ReferenceLine x={depth.mid} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              <Area type="stepAfter" dataKey="bids" stroke={colorVar("bids")} strokeWidth={2} fill={colorVar("bids")} fillOpacity={0.22} dot={false} connectNulls isAnimationActive={false} />
              <Area type="stepBefore" dataKey="asks" stroke={colorVar("asks")} strokeWidth={2} fill={colorVar("asks")} fillOpacity={0.22} dot={false} connectNulls isAnimationActive={false} />
            </RechartsComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-[2px] bg-chart-up" aria-hidden />Bids</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-[2px] bg-destructive" aria-hidden />Asks</span>
        </div>
      </ChartSkeleton>
    </Card>
  );
}
