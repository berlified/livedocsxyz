"use client";

import * as React from "react";

export type { ChartReactionOptions } from "@/components/ui/chart-reactions";

export type CryptoTick = { t: number; price: number; volume: number };

export function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let word = Math.imul(state ^ (state >>> 15), 1 | state);
    word = (word + Math.imul(word ^ (word >>> 7), 61 | word)) ^ word;
    return ((word ^ (word >>> 14)) >>> 0) / 4294967296;
  };
}

export function genTicks(seed: number, points: number, start: number, drift: number, vol: number, stepMs = 60000): CryptoTick[] {
  const rand = mulberry32(seed);
  const now = Date.now();
  let price = start;
  return Array.from({ length: points }, (_, index) => {
    price = Math.max(start * 0.2, price * (1 + drift + (rand() - 0.5) * vol));
    return { t: now - (points - 1 - index) * stepMs, price, volume: Math.round(20 + rand() * 180) };
  });
}

export function nextTick(previous: CryptoTick, seedRef: { rand: () => number }, drift: number, vol: number, stepMs = 60000): CryptoTick {
  const price = Math.max(previous.price * 0.2, previous.price * (1 + drift + (seedRef.rand() - 0.5) * vol));
  return { t: previous.t + stepMs, price, volume: Math.round(20 + seedRef.rand() * 180) };
}

export function movingAverage(values: number[], window: number): (number | null)[] {
  return values.map((_, index) => {
    if (index < window - 1) return null;
    let sum = 0;
    for (let offset = 0; offset < window; offset++) sum += values[index - offset]!;
    return sum / window;
  });
}

export function formatPrice(value: number) {
  const digits = value >= 1000 ? 2 : value >= 10 ? 2 : 4;
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatCompactUsd(value: number) {
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function useLiveTicks({
  seed = 7,
  points = 120,
  start = 100,
  drift = 0.0004,
  vol = 0.006,
  intervalMs = 1200,
  live = true,
}: {
  seed?: number;
  points?: number;
  start?: number;
  drift?: number;
  vol?: number;
  intervalMs?: number;
  live?: boolean;
} = {}) {
  const randRef = React.useRef<() => number>(mulberry32(seed ^ 0x9e3779b9));
  const [ticks, setTicks] = React.useState<CryptoTick[]>(() => genTicks(seed, points, start, drift, vol));
  const [streaming, setStreaming] = React.useState(live);

  React.useEffect(() => {
    setTicks(genTicks(seed, points, start, drift, vol));
    randRef.current = mulberry32(seed ^ 0x9e3779b9);
  }, [seed, points, start, drift, vol]);

  React.useEffect(() => {
    if (!live || !streaming) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const id = window.setInterval(() => {
      setTicks((current) => {
        if (!current.length) return current;
        const next = nextTick(current[current.length - 1]!, { rand: randRef.current }, drift, vol);
        return [...current.slice(-points + 1), next];
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [live, streaming, intervalMs, points, drift, vol]);

  const last = ticks[ticks.length - 1];
  const first = ticks[0];
  const change = last && first ? (last.price / first.price - 1) * 100 : 0;
  return { ticks, last, change, streaming, setStreaming };
}
