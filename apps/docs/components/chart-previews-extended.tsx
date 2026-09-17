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
          data={["Morning", "Afternoon", "Evening"].flatMap((y, row) =>
            ["Mon", "Tue", "Wed", "Thu", "Fri"].map((x, column) => ({ x, y, value: (row * 13 + column * 7) % 40 })),
          )}
          config={heatmapConfig}
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
