"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/chart-reactions";
import { formatPrice, mulberry32, type ChartReactionOptions } from "@/components/ui/crypto-feed";
import { cn } from "@/lib/utils";

export type BookLevel = { price: number; amount: number; total: number };

function buildBook(seed: number, mid: number, rows: number, tick: number): { asks: BookLevel[]; bids: BookLevel[] } {
  const rand = mulberry32(seed);
  const asks: BookLevel[] = [];
  const bids: BookLevel[] = [];
  let askTotal = 0;
  let bidTotal = 0;
  for (let index = 1; index <= rows; index++) {
    const askAmount = 0.05 + rand() * 2.4 + (index === 3 ? 4.5 : 0);
    const bidAmount = 0.05 + rand() * 2.4 + (index === 2 ? 5.2 : 0);
    askTotal += askAmount;
    bidTotal += bidAmount;
    asks.push({ price: mid + index * tick, amount: askAmount, total: askTotal });
    bids.push({ price: mid - index * tick, amount: bidAmount, total: bidTotal });
  }
  return { asks: [...asks].reverse(), bids };
}

function Row({ level, max, side, index }: { level: BookLevel; max: number; side: "bid" | "ask"; index: number }) {
  return (
    <div
      role="row"
      aria-label={`${side === "bid" ? "Bid" : "Ask"} ${level.price} amount ${level.amount.toFixed(4)}`}
      className="relative grid grid-cols-[1fr_1fr_1fr] px-2 py-[3px] font-mono text-[11px] tabular-nums"
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-[1px] right-0 rounded-sm", side === "bid" ? "bg-chart-up/15" : "bg-destructive/15")}
        style={{ width: `${Math.max(2, (level.total / max) * 100)}%` }}
      />
      <span className={cn("relative", side === "bid" ? "text-chart-up" : "text-destructive")}>${formatPrice(level.price)}</span>
      <span className="relative text-right text-foreground">{level.amount.toFixed(4)}</span>
      <span className="relative text-right text-muted-foreground">{level.total.toFixed(4)}</span>
    </div>
  );
}

export function OrderBook({
  symbol = "BTC/USDT",
  basePrice = 97500,
  tickSize = 10,
  rows = 9,
  seed = 21,
  tickMs = 1500,
  className,
  isLoading,
  reaction,
}: {
  symbol?: string;
  basePrice?: number;
  tickSize?: number;
  rows?: number;
  seed?: number;
  tickMs?: number;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const [nonce, setNonce] = React.useState(0);
  const book = React.useMemo(() => buildBook(seed + nonce * 101, basePrice, rows, tickSize), [seed, nonce, basePrice, rows, tickSize]);
  const drift = React.useRef(mulberry32(seed));

  React.useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      drift.current();
      setNonce((value) => value + 1);
    }, tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  const bestAsk = book.asks[book.asks.length - 1]!;
  const bestBid = book.bids[0]!;
  const spread = bestAsk.price - bestBid.price;
  const max = Math.max(...book.asks.map((level) => level.total), ...book.bids.map((level) => level.total));
  const bidVolume = book.bids.reduce((sum, level) => sum + level.amount, 0);
  const askVolume = book.asks.reduce((sum, level) => sum + level.amount, 0);
  const bidShare = (bidVolume / (bidVolume + askVolume)) * 100;

  void reaction;

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={`${symbol} order book`}>
      <ChartSkeleton isLoading={isLoading}>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[15px] font-medium tracking-tight">Order book</p>
          <p className="font-mono text-[11px] text-muted-foreground">{symbol}</p>
        </div>
        <div className="mt-1 grid grid-cols-[1fr_1fr_1fr] px-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground" aria-hidden>
          <span>Price</span><span className="text-right">Amount</span><span className="text-right">Total</span>
        </div>
        <div role="table" aria-label="Asks" className="mt-1">
          {book.asks.map((level, index) => (
            <Row key={`ask-${level.price}`} level={level} max={max} side="ask" index={index} />
          ))}
        </div>
        <div className="flex items-center gap-2 border-y border-border px-2 py-1.5" role="status">
          <p className="font-mono text-sm font-semibold tabular-nums text-foreground">${formatPrice((bestAsk.price + bestBid.price) / 2)}</p>
          <p className="font-mono text-[11px] tabular-nums text-muted-foreground">Spread ${formatPrice(spread)}</p>
        </div>
        <div role="table" aria-label="Bids">
          {book.bids.map((level, index) => (
            <Row key={`bid-${level.price}`} level={level} max={max} side="bid" index={index} />
          ))}
        </div>
        <div className="mt-3">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-destructive/25" role="img" aria-label={`Bid ${bidShare.toFixed(0)} percent, ask ${(100 - bidShare).toFixed(0)} percent`}>
            <span className="h-full bg-chart-up" style={{ width: `${bidShare}%` }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
            <span className="text-chart-up">B {bidShare.toFixed(1)}%</span>
            <span className="text-destructive">A {(100 - bidShare).toFixed(1)}%</span>
          </div>
        </div>
      </ChartSkeleton>
    </Card>
  );
}
