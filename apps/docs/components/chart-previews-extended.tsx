"use client";

import { ComponentPreview } from "@/components/component-preview";
import { FunnelChart } from "@/components/ui/funnel-chart";
import { HeatmapChart } from "@/components/ui/heatmap-chart";
import { ScatterChart } from "@/components/ui/scatter-chart";
import { LivePriceChart } from "@/components/ui/live-price-chart";
import { OrderBook } from "@/components/ui/order-book";
import { DepthChart } from "@/components/ui/depth-chart";
import { TradesFeed } from "@/components/ui/trades-feed";
import { MarketMovers } from "@/components/ui/market-movers";

export {
  WaterfallChartPreview,
  WaterfallChartExamples,
  CandlestickChartPreview,
  CandlestickChartExamples,
  ChartReactionsPreview,
  ChartReactionsExamples,
  FunnelConversionExamples,
} from "@/components/financial-chart-previews";

export const funnelStages = [
  { key: "visitors", label: "Visitors", value: 12400 },
  { key: "leads", label: "Leads", value: 6800 },
  { key: "qualified", label: "Qualified", value: 3200 },
  { key: "proposals", label: "Proposals", value: 1500 },
  { key: "closed", label: "Closed", value: 620 },
];

export const funnelConfig = {
  visitors: { label: "Visitors", color: "var(--chart-2)" },
  leads: { label: "Leads", color: "var(--chart-2)" },
  qualified: { label: "Qualified", color: "var(--chart-2)" },
  proposals: { label: "Proposals", color: "var(--chart-2)" },
  closed: { label: "Closed", color: "var(--chart-2)" },
};

export const heatmapWeeks = Array.from({ length: 52 }, (_, week) => {
  const date = new Date(Date.UTC(2023, 9, 1 + week * 7));
  return date.toISOString().slice(0, 10);
});

export const heatmapCells = heatmapWeeks.flatMap((x, week) =>
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((y, day) => {
    const seed = (week * 37 + day * 19 + week * day * 7) % 101;
    const value = seed < 30 ? 0 : seed < 53 ? 2 : seed < 74 ? 5 : seed < 90 ? 8 : 12;
    return { x, y, value };
  }),
);

export const heatmapConfig = {
  value: { label: "Contributions", color: "var(--chart-2)" },
};

export const scatterCohorts = [
  { x: 4, y: 22, series: "organic", label: "Cohort A" },
  { x: 8, y: 41, series: "organic", label: "Cohort B" },
  { x: 12, y: 55, series: "organic", label: "Cohort C" },
  { x: 16, y: 72, series: "organic", label: "Cohort D" },
  { x: 5, y: 30, series: "paid", label: "Cohort E" },
  { x: 9, y: 34, series: "paid", label: "Cohort F" },
  { x: 14, y: 48, series: "paid", label: "Cohort G" },
  { x: 18, y: 60, series: "paid", label: "Cohort H" },
];

export const scatterConfig = {
  organic: { label: "Organic", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
  paid: { label: "Paid", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
};

export function FunnelChartPreview() {
  return (
    <FunnelChart
      className="w-full"
      title="Acquisition funnel"
      description="Visitors to closed deals"
      config={funnelConfig}
      stages={funnelStages}
    />
  );
}

export function HeatmapChartPreview() {
  return (
    <HeatmapChart
      title="Contributions"
      description="A year of activity · Oct 2023 – Sep 2024"
      layout="calendar"
      data={heatmapCells}
      config={heatmapConfig}
    />
  );
}

export function ScatterChartPreview() {
  return (
    <ScatterChart
      title="Spend vs retention"
      description="Weekly cohort performance"
      data={scatterCohorts}
      config={scatterConfig}
      xLabel="Spend ($)"
      yLabel="Retention (%)"
      meanLine
    />
  );
}

export function HeatmapChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Last quarter" className="p-4">
        <HeatmapChart
          title="Recent contributions"
          description="Last 13 weeks"
          layout="calendar"
          data={heatmapCells.slice(-91)}
          config={heatmapConfig}
        />
      </ComponentPreview>
      <ComponentPreview label="High activity" className="p-4">
        <HeatmapChart
          title="Launch week intensity"
          layout="calendar"
          columns={heatmapWeeks.slice(0, 26)}
          data={heatmapWeeks.slice(0, 26).flatMap((x, week) =>
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((y, day) => {
              const seed = (week * 53 + day * 29) % 101;
              return { x, y, value: seed < 12 ? 0 : seed < 30 ? 4 : seed < 55 ? 9 : seed < 80 ? 16 : 24 };
            }),
          )}
          config={heatmapConfig}
        />
      </ComponentPreview>
      <ComponentPreview label="Missing values" className="p-4">
        <HeatmapChart
          title="Sparse activity"
          layout="calendar"
          columns={heatmapWeeks}
          data={heatmapCells.filter((_, index) => index % 9 !== 0)}
          config={heatmapConfig}
        />
      </ComponentPreview>
      <ComponentPreview label="Categorical matrix" className="p-4">
        <HeatmapChart
          title="Activity by time of day"
          layout="matrix"
          data={["Morning", "Afternoon", "Evening", "Night"].flatMap((y, row) =>
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x, column) => ({ x, y, value: (row * 13 + column * 7) % 40 })),
          )}
          config={heatmapConfig}
        />
      </ComponentPreview>
      <ComponentPreview label="Click to inspect" className="p-4">
        <HeatmapChart
          title="Review throughput"
          description="Select any day to log it"
          layout="calendar"
          data={heatmapCells.slice(0, 182)}
          config={{ value: { label: "Reviews", color: "var(--chart-2)" } }}
          onCellClick={(cell) => console.log("heatmap cell", cell)}
        />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Empty</h2>
      <ComponentPreview label="No data" className="p-4">
        <HeatmapChart data={[]} config={heatmapConfig} emptyLabel="No activity in this period" />
      </ComponentPreview>
    </section>
  );
}

export function FunnelChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Conversion</h2>
      <ComponentPreview label="With conversion labels" className="p-4">
        <FunnelChartPreview />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Empty</h2>
      <ComponentPreview label="No data" className="p-4">
        <FunnelChart stages={[]} config={funnelConfig} emptyLabel="No funnel stages yet" />
      </ComponentPreview>
    </section>
  );
}

export function ScatterChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Quadrants" className="p-4">
        <ScatterChart
          data={scatterCohorts}
          config={scatterConfig}
          xLabel="Spend ($)"
          yLabel="Retention (%)"
          quadrantLines
        />
      </ComponentPreview>
      <ComponentPreview label="Bubbles" className="p-4">
        <ScatterChart
          data={scatterCohorts.map((p, i) => ({ ...p, size: (i % 4 + 1) * 12 }))}
          config={scatterConfig}
          xLabel="Spend ($)"
          yLabel="Retention (%)"
          bubbleKey="size"
        />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Empty</h2>
      <ComponentPreview label="No points" className="p-4">
        <ScatterChart data={[]} config={scatterConfig} emptyLabel="No cohort data yet" />
      </ComponentPreview>
    </section>
  );
}

export function LivePriceChartPreview() {
  return <LivePriceChart symbol="BTC/USDT" basePrice={97500} className="w-full" />;
}

export function OrderBookPreview() {
  return <OrderBook symbol="BTC/USDT" basePrice={97500} className="w-full" />;
}

export function DepthChartPreview() {
  return <DepthChart symbol="BTC/USDT" basePrice={97500} className="w-full" />;
}

export function TradesFeedPreview() {
  return <TradesFeed symbol="BTC/USDT" basePrice={97500} className="w-full" />;
}

export function MarketMoversPreview() {
  return <MarketMovers className="w-full" />;
}

export function LivePriceChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="No volume or MA" className="p-4">
        <LivePriceChart symbol="ETH/USDT" basePrice={3840} showMA={false} showVolume={false} className="w-full" />
      </ComponentPreview>
      <ComponentPreview label="Loading" className="p-4">
        <LivePriceChart symbol="SOL/USDT" basePrice={214} isLoading className="w-full" />
      </ComponentPreview>
    </section>
  );
}
