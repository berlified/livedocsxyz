"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/chart-reactions";
import { Sparkline } from "@/components/ui/sparkline";
import { formatCompactUsd, formatPrice, genTicks, type ChartReactionOptions } from "@/components/ui/crypto-feed";
import { cn } from "@/lib/utils";

export type MoverToken = { symbol: string; name: string; price: number; change24h: number; volume24h: number; seed: number };

const tokens: MoverToken[] = [
  { symbol: "BTC", name: "Bitcoin", price: 97500, change24h: 2.4, volume24h: 48_200_000_000, seed: 101 },
  { symbol: "ETH", name: "Ethereum", price: 3840, change24h: 3.1, volume24h: 21_400_000_000, seed: 102 },
  { symbol: "SOL", name: "Solana", price: 214, change24h: 6.8, volume24h: 5_800_000_000, seed: 103 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.3214, change24h: -2.2, volume24h: 2_900_000_000, seed: 104 },
  { symbol: "AVAX", name: "Avalanche", price: 42.8, change24h: 4.5, volume24h: 1_100_000_000, seed: 105 },
  { symbol: "LINK", name: "Chainlink", price: 22.4, change24h: -1.4, volume24h: 860_000_000, seed: 106 },
  { symbol: "ARB", name: "Arbitrum", price: 1.84, change24h: 8.9, volume24h: 720_000_000, seed: 107 },
  { symbol: "PEPE", name: "Pepe", price: 0.00001842, change24h: -5.6, volume24h: 1_900_000_000, seed: 108 },
];

function TokenSpark({ seed, up }: { seed: number; up: boolean }) {
  const data = React.useMemo(() => genTicks(seed, 28, 100, 0.001, 0.02).map((tick) => tick.price), [seed]);
  return <Sparkline data={data} size="sm" tone={up ? "up" : "down"} interactive={false} showValue={false} className="w-28" />;
}

export function MarketMovers({
  title = "Market movers",
  tickMs = 2000,
  bias = 0,
  className,
  isLoading,
  reaction,
}: {
  title?: string;
  tickMs?: number;
  bias?: number;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const [tab, setTab] = React.useState<"gainers" | "losers">("gainers");
  const [nonce, setNonce] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setNonce((value) => value + 1);
    }, tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  const rows = React.useMemo(() => {
    return tokens.map((token, index) => {
      const wobble = Math.round(Math.sin(nonce * 0.7 + index * 1.7) * 3500) / 10000;
      const change = token.change24h + wobble + bias;
      return { ...token, change, price: token.price * (1 + (wobble + bias) / 100) };
    }).filter((token) => (tab === "gainers" ? token.change >= 0 : token.change < 0))
      .sort((a, b) => (tab === "gainers" ? b.change - a.change : a.change - b.change));
  }, [tab, nonce, bias]);

  void reaction;

  return (
    <Card className={cn("min-w-0 w-full p-5 sm:p-6", className)} role="region" aria-label={title}>
      <ChartSkeleton isLoading={isLoading}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="truncate text-[15px] font-medium tracking-tight">{title}</p>
          <div role="group" aria-label="Movers" className="flex rounded-full border border-border bg-card p-1">
            {(["gainers", "losers"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tab === item}
                onClick={() => setTab(item)}
                className={cn("h-7 rounded-full px-3 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", tab === item ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 hidden grid-cols-[1fr_96px_88px_112px_96px] gap-3 px-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground sm:grid" aria-hidden>
          <span>Asset</span><span className="text-right">Price</span><span className="text-right">24h %</span><span className="text-right">Last 7d</span><span className="text-right">Volume</span>
        </div>
        <ul className="mt-1 divide-y divide-border/60">
          {rows.map((token) => {
            const up = token.change >= 0;
            return (
              <li key={token.symbol} className="grid grid-cols-[1fr_auto] items-center gap-3 py-2.5 sm:grid-cols-[1fr_96px_88px_112px_96px]">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-bold text-foreground" aria-hidden>
                    {token.symbol.slice(0, 3)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{token.name}</span>
                    <span className="block font-mono text-[11px] text-muted-foreground">{token.symbol}/USDT</span>
                  </span>
                </span>
                <span className="font-mono text-[13px] tabular-nums text-foreground sm:text-right">${formatPrice(token.price)}</span>
                <span className={cn("hidden rounded-md px-2 py-0.5 font-mono text-xs font-semibold tabular-nums sm:block sm:justify-self-end", up ? "bg-chart-up/15 text-chart-up" : "bg-destructive/15 text-destructive")}>
                  {up ? "+" : ""}{token.change.toFixed(2)}%
                </span>
                <span className="hidden justify-self-end sm:block"><TokenSpark seed={token.seed} up={up} /></span>
                <span className="hidden text-right font-mono text-xs tabular-nums text-muted-foreground sm:block">{formatCompactUsd(token.volume24h)}</span>
              </li>
            );
          })}
          {!rows.length ? <li className="py-6 text-center text-sm text-muted-foreground">{tab === "gainers" ? "No gainers right now." : "No losers right now. Bull market."}</li> : null}
        </ul>
      </ChartSkeleton>
    </Card>
  );
}
