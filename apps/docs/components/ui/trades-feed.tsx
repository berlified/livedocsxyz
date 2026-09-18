"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartReaction, ChartSkeleton } from "@/components/ui/chart-reactions";
import { formatPrice, mulberry32, type ChartReactionOptions } from "@/components/ui/crypto-feed";
import { cn } from "@/lib/utils";

export type TradePrint = { id: number; t: number; price: number; amount: number; side: "buy" | "sell" };

function nextPrint(id: number, previous: number, rand: () => number): TradePrint {
  const side = rand() > 0.48 ? "buy" : "sell";
  const drift = (rand() - 0.5) * previous * 0.0012;
  return {
    id,
    t: Date.now(),
    price: Math.max(previous * 0.5, previous + drift),
    amount: 0.001 + rand() * rand() * 3.5,
    side,
  };
}

export function TradesFeed({
  symbol = "BTC/USDT",
  basePrice = 97500,
  seed = 41,
  tickMs = 900,
  rows = 16,
  className,
  isLoading,
  reaction,
}: {
  symbol?: string;
  basePrice?: number;
  seed?: number;
  tickMs?: number;
  rows?: number;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const randRef = React.useRef<() => number>(mulberry32(seed));
  const idRef = React.useRef(1);
  const [prints, setPrints] = React.useState<TradePrint[]>([]);

  React.useEffect(() => {
    randRef.current = mulberry32(seed);
    idRef.current = 1;
    const out: TradePrint[] = [];
    let price = basePrice;
    const now = Date.now();
    for (let index = 0; index < rows; index++) {
      const print = nextPrint(idRef.current++, price, randRef.current);
      print.t = now - (rows - index) * tickMs;
      price = print.price;
      out.push(print);
    }
    setPrints([...out].reverse());
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setPrints((current) => {
        const currentPrice = current[0]?.price ?? basePrice;
        return [nextPrint(idRef.current++, currentPrice, randRef.current), ...current].slice(0, rows);
      });
    }, tickMs);
    return () => window.clearInterval(id);
  }, [seed, tickMs, rows, basePrice]);

  void reaction;

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={`${symbol} latest trades`}>
      <ChartSkeleton isLoading={isLoading}>
        <style>{`@keyframes trade-in { from { background-color: var(--accent); } to { background-color: transparent; } }`}</style>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[15px] font-medium tracking-tight">Latest trades</p>
          {!isLoading ? <ChartReaction reaction={reaction} /> : <p className="font-mono text-[11px] text-muted-foreground">{symbol}</p>}
        </div>
        <div className="mt-2 grid grid-cols-[1fr_1fr_1fr] px-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground" aria-hidden>
          <span>Price</span><span className="text-right">Amount</span><span className="text-right">Time</span>
        </div>
        <ul className="mt-1 space-y-[1px]" aria-live="off" aria-label="Recent prints">
          {prints.map((print, index) => (
            <li
              key={print.id}
              style={index === 0 ? { animation: "trade-in 900ms ease-out" } : undefined}
              className="grid grid-cols-[1fr_1fr_1fr] rounded px-1 py-[3px] font-mono text-[11px] tabular-nums"
            >
              <span className={print.side === "buy" ? "text-chart-up" : "text-destructive"}>${formatPrice(print.price)}</span>
              <span className="text-right text-foreground">{print.amount.toFixed(4)}</span>
              <span className="text-right text-muted-foreground">{new Date(print.t).toLocaleTimeString("en-US", { hour12: false })}</span>
            </li>
          ))}
        </ul>
      </ChartSkeleton>
    </Card>
  );
}
