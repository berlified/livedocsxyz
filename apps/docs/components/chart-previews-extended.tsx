"use client";

import { ComponentPreview } from "@/components/component-preview";
import { FunnelChart } from "@/components/ui/funnel-chart";
import { HeatmapChart } from "@/components/ui/heatmap-chart";
import { ScatterChart } from "@/components/ui/scatter-chart";

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
  { key: "visitors", label: "Visitors", value: 12480 },
  { key: "signups", label: "Signups", value: 3960 },
  { key: "activated", label: "Activated", value: 2180 },
  { key: "paid", label: "Paid", value: 860 },
];

export const funnelConfig = {
  visitors: { label: "Visitors", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
  signups: { label: "Signups", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
  activated: { label: "Activated", colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] } },
  paid: { label: "Paid", colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] } },
};

export const heatmapCells = [
  { x: "Mon", y: "9am", value: 12 },
  { x: "Tue", y: "9am", value: 18 },
  { x: "Wed", y: "9am", value: 9 },
  { x: "Thu", y: "9am", value: 24 },
  { x: "Fri", y: "9am", value: 31 },
  { x: "Sat", y: "9am", value: 6 },
  { x: "Sun", y: "9am", value: null },
  { x: "Mon", y: "12pm", value: 44 },
  { x: "Tue", y: "12pm", value: 52 },
  { x: "Wed", y: "12pm", value: 38 },
  { x: "Thu", y: "12pm", value: 61 },
  { x: "Fri", y: "12pm", value: 72 },
  { x: "Sat", y: "12pm", value: 19 },
  { x: "Sun", y: "12pm", value: 8 },
  { x: "Mon", y: "3pm", value: 28 },
  { x: "Tue", y: "3pm", value: 35 },
  { x: "Wed", y: "3pm", value: null },
  { x: "Thu", y: "3pm", value: 41 },
  { x: "Fri", y: "3pm", value: 47 },
  { x: "Sat", y: "3pm", value: 22 },
  { x: "Sun", y: "3pm", value: 11 },
  { x: "Mon", y: "6pm", value: 16 },
  { x: "Tue", y: "6pm", value: 21 },
  { x: "Wed", y: "6pm", value: 14 },
  { x: "Thu", y: "6pm", value: 26 },
  { x: "Fri", y: "6pm", value: 33 },
  { x: "Sat", y: "6pm", value: 15 },
  { x: "Sun", y: "6pm", value: 7 },
];

export const heatmapConfig = {
  value: { label: "Orders", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
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
      description="Visitors to paid conversion"
      config={funnelConfig}
      stages={funnelStages}
    />
  );
}

export function HeatmapChartPreview() {
  return (
    <HeatmapChart
      title="Orders by hour"
      description="Sales activity across the week"
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
      <ComponentPreview label="Missing values" className="p-4">
        <HeatmapChart
          title="Sparse activity"
          data={heatmapCells.filter((cell) => cell.value !== null)}
          config={heatmapConfig}
        />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Empty</h2>
      <ComponentPreview label="No data" className="p-4">
        <HeatmapChart data={[]} config={heatmapConfig} emptyLabel="No orders in this period" />
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
