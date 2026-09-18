"use client";

import * as React from "react";

import { ComponentPreview } from "@/components/component-preview";
import { useShapedRecords } from "@/components/emotion-data";
import { Button } from "@/components/ui/button";
import { CandlestickChart, type CandlestickDatum } from "@/components/ui/candlestick-chart";
import { ChartReactionsProvider, type ChartEmotion } from "@/components/ui/chart-reactions";
import { FunnelChart } from "@/components/ui/funnel-chart";
import { WaterfallChart, type WaterfallDatum } from "@/components/ui/waterfall-chart";

export const revenueBridge: WaterfallDatum[] = [
  { label: "Opening", value: 48000, kind: "total" },
  { label: "New", value: 18500 },
  { label: "Expansion", value: 7200 },
  { label: "Churn", value: -5400 },
  { label: "Credits", value: -2100 },
  { label: "Closing", value: 66200, kind: "total" },
];

export const priceSessions: CandlestickDatum[] = [
  { label: "Sep 01", open: 142, high: 149, low: 140, close: 147, volume: 12000 },
  { label: "Sep 02", open: 147, high: 151, low: 143, close: 145, volume: 17000 },
  { label: "Sep 03", open: 145, high: 153, low: 144, close: 151, volume: 21500 },
  { label: "Sep 04", open: 151, high: 155, low: 147, close: 149, volume: 14300 },
  { label: "Sep 05", open: 149, high: 152, low: 146, close: 149, volume: 9800 },
  { label: "Sep 08", open: 150, high: 158, low: 148, close: 156, volume: 26700 },
  { label: "Sep 09", open: 156, high: 161, low: 154, close: 159, volume: 19400 },
  { label: "Sep 10", open: 159, high: 162, low: 152, close: 154, volume: 28500 },
  { label: "Sep 11", open: 154, high: 158, low: 151, close: 157, volume: 17600 },
  { label: "Sep 12", open: 157, high: 166, low: 155, close: 164, volume: 31000 },
];

const currency = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function WaterfallChartPreview() {
  const { data } = useShapedRecords(revenueBridge, ["value"], false, true);
  return <WaterfallChart title="What moved revenue" description="Monthly recurring revenue · September" data={data} formatValue={currency} />;
}

export function CandlestickChartPreview() {
  const { data } = useShapedRecords(priceSessions, ["open", "high", "low", "close", "volume"], false, true);
  return <CandlestickChart title="Daily price range" description="Illustrative sessions · OHLC with traded volume" data={data} formatValue={currency} />;
}

export function WaterfallChartExamples() {
  return <section className="space-y-6">
    <h2 className="text-xl font-semibold">Balances, not just bars</h2>
    <p className="text-sm text-muted-foreground">Changes accumulate from zero. A total sets an absolute balance, including negative balances. Invalid changes keep their position but do not alter the balance.</p>
    <ComponentPreview label="Crossing zero" className="p-4"><WaterfallChart data={[{ label: "Start", value: 20, kind: "total" }, { label: "Costs", value: -35 }, { label: "Unchanged", value: 0 }, { label: "Recovery", value: 25 }, { label: "End", value: 10, kind: "total" }]} /></ComponentPreview>
    <ComponentPreview label="Unavailable change" className="p-4"><WaterfallChart data={[{ label: "Start", value: 10 }, { label: "Pending", value: NaN }, { label: "Final", value: -4 }]} /></ComponentPreview>
    <ComponentPreview label="Zero balance" className="p-4"><WaterfallChart data={[{ label: "Opening", value: 0, kind: "total" }, { label: "Change", value: 0 }]} /></ComponentPreview>
    <ComponentPreview label="Empty" className="p-4"><WaterfallChart data={[]} /></ComponentPreview>
    <ComponentPreview label="Loading" className="p-4"><WaterfallChart data={[]} isLoading /></ComponentPreview>
  </section>;
}

export function CandlestickChartExamples() {
  return <section className="space-y-6">
    <h2 className="text-xl font-semibold">OHLC and volume</h2>
    <p className="text-sm text-muted-foreground">Input order is preserved. Each high must contain open and close; each low must be below them. Invalid sessions appear as gaps. Negative prices and doji candles are supported; invalid or negative volume is omitted.</p>
    <ComponentPreview label="Price only" className="p-4"><CandlestickChart data={priceSessions} showVolume={false} /></ComponentPreview>
    <ComponentPreview label="Negative prices, doji, and a missing session" className="p-4"><CandlestickChart data={[{ label: "Mon", open: -8, high: -2, low: -12, close: -4, volume: 0 }, { label: "Tue", open: 0, high: 0, low: 0, close: 0 }, { label: "Wed", open: 2, high: NaN, low: 1, close: 3 }, { label: "Thu", open: 3, high: 6, low: 2, close: 5, volume: 20 }]} /></ComponentPreview>
    <ComponentPreview label="Single flat session" className="p-4"><CandlestickChart data={[{ label: "Today", open: 0, high: 0, low: 0, close: 0, volume: 0 }]} /></ComponentPreview>
    <ComponentPreview label="Empty" className="p-4"><CandlestickChart data={[]} /></ComponentPreview>
    <ComponentPreview label="Loading" className="p-4"><CandlestickChart data={[]} isLoading /></ComponentPreview>
  </section>;
}

export function FunnelConversionExamples() {
  return <section className="space-y-6">
    <h2 className="text-xl font-semibold">Connected stages</h2>
    <p className="text-sm text-muted-foreground">Widths share one scale. Zero counts remain visible in the metrics; negative and nonfinite counts are unavailable. Stages are never silently removed or reordered.</p>
    <ComponentPreview label="Checkout conversion" className="p-4"><FunnelChart stages={[{ key: "visit", label: "Product views", value: 18400, meta: "Unique product page visitors" }, { key: "cart", label: "Added to cart", value: 6800, meta: "36.9% of product views" }, { key: "checkout", label: "Checkout", value: 4200 }, { key: "paid", label: "Purchased", value: 2940 }]} /></ComponentPreview>
    <ComponentPreview label="Zero and unavailable stages" className="p-4"><FunnelChart stages={[{ key: "first", label: "Started", value: 100 }, { key: "second", label: "Pending", value: NaN }, { key: "third", label: "Completed", value: 0 }]} /></ComponentPreview>
  </section>;
}

const emotions: ChartEmotion[] = ["neutral", "sad", "disappointed", "happy", "surprised", "proud", "loading"];
const metrics: Record<ChartEmotion, { current: number; previous: number; goal?: number }> = {
  neutral: { current: 100, previous: 100 },
  sad: { current: 65, previous: 100 },
  disappointed: { current: 92, previous: 100 },
  happy: { current: 112, previous: 100 },
  surprised: { current: 135, previous: 100 },
  proud: { current: 150, previous: 100, goal: 150 },
  loading: { current: 0, previous: 100 },
};

export function ChartReactionsPreview() {
  const [emotion, setEmotion] = React.useState<ChartEmotion>("happy");
  const [automatic, setAutomatic] = React.useState(true);
  const [animations, setAnimations] = React.useState(true);
  const metric = metrics[emotion];
  return <div className="w-full space-y-4">
    <div role="group" aria-label="Reaction scenario" className="flex flex-wrap gap-2">
      {emotions.map((mode) => <Button key={mode} type="button" variant={emotion === mode ? "secondary" : "outline"} size="sm" aria-pressed={emotion === mode} onClick={() => setEmotion(mode)}>{mode}</Button>)}
    </div>
    <div className="flex flex-wrap gap-2"><Button type="button" variant="ghost" size="sm" aria-pressed={automatic} onClick={() => setAutomatic(!automatic)}>Metric resolver: {automatic ? "on" : "off"}</Button><Button type="button" variant="ghost" size="sm" aria-pressed={animations} onClick={() => setAnimations(!animations)}>Motion: {animations ? "system preference" : "off"}</Button></div>
    <ChartReactionsProvider animationsEnabled={animations}>
      <WaterfallChart title="Revenue vs last period" description={`Previous: ${metric.previous} · Current: ${metric.current}${metric.goal ? ` · Goal: ${metric.goal}` : ""}`} data={[{ label: "Previous", value: metric.previous, kind: "total" }, { label: "Change", value: metric.current - metric.previous }, { label: "Current", value: metric.current, kind: "total" }]} isLoading={emotion === "loading"} reaction={automatic ? { metric } : { emotion }} />
    </ChartReactionsProvider>
  </div>;
}

export function ChartReactionsExamples() {
  return <section className="space-y-6"><h2 className="text-xl font-semibold">Global assets, local meaning</h2><p className="text-sm text-muted-foreground">Mount ChartReactionsProvider once around your dashboard. Supply your own asset paths and static posters. Charts inherit assets and motion settings; reaction.metric resolves an emotion or reaction.emotion overrides it. Loading uses the loading asset. Reduced motion uses a static poster or text fallback.</p><ComponentPreview label="Reactions disabled" className="p-4"><ChartReactionsProvider enabled={false} animationsEnabled={false}><WaterfallChart data={revenueBridge} reaction={{ metric: { current: 120, previous: 100 } }} /></ChartReactionsProvider></ComponentPreview></section>;
}
