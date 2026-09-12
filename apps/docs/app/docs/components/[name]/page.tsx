import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { components, getComponent } from "@frostui/registry";

import { ComponentDocLayout } from "@/components/component-doc-layout";
import {
  AreaChartExamples,
  AreaChartPreview,
  BarChartExamples,
  BarChartPreview,
  ChartExamples,
  ChartPreview,
  ComposedChartExamples,
  ComposedChartPreview,
  LineChartExamples,
  LineChartPreview,
  PieChartExamples,
  PieChartPreview,
  RadarChartExamples,
  RadarChartPreview,
  RadialChartExamples,
  RadialChartPreview,
  SankeyChartPreview,
  SparklineExamples,
  SparklinePreview,
  TrendCardPreview,
  TrendCardExamples,
  MetricChartPreview,
  ComparisonChartPreview,
  BreakdownChartPreview,
  RangeChartPreview,
  CountryChartPreview,
  RingMetricPreview,
  CashflowChartPreview,
  SpotlightChartPreview,
  LaneChartPreview,
  UsageMeterPreview,
} from "@/components/chart-previews";

const usageByName: Record<string, string> = {
  chart: `import { monthlyData, trafficConfig } from "@/components/ui/chart"
import { AreaChart } from "@/components/ui/area-chart"

export function Example() {
  return (
    <AreaChart data={monthlyData} config={trafficConfig}>
      <AreaChart.Grid />
      <AreaChart.Tooltip />
      <AreaChart.Legend isClickable />
      <AreaChart.Area dataKey="desktop" variant="gradient" isClickable />
    </AreaChart>
  )
}`,
  sparkline: `import { Sparkline } from "@/components/ui/sparkline"

export function Example() {
  return (
    <Sparkline
      size="lg"
      tone="up"
      format={(value) =>
        value.toLocaleString("en-US", { style: "currency", currency: "USD" })
      }
    />
  )
}`,
  "area-chart": `import { monthlyData, trafficConfig } from "@/components/ui/chart"
import { AreaChart } from "@/components/ui/area-chart"

export function Example() {
  return (
    <AreaChart data={monthlyData} config={trafficConfig}>
      <AreaChart.Grid />
      <AreaChart.Tooltip />
      <AreaChart.Legend isClickable />
      <AreaChart.Area dataKey="desktop" variant="gradient" isClickable />
      <AreaChart.Area dataKey="mobile" variant="gradient" isClickable />
    </AreaChart>
  )
}`,
  "line-chart": `import { monthlyData, trafficConfig } from "@/components/ui/chart"
import { LineChart } from "@/components/ui/line-chart"

export function Example() {
  return (
    <LineChart data={monthlyData} config={trafficConfig}>
      <LineChart.Grid />
      <LineChart.Tooltip />
      <LineChart.Legend isClickable />
      <LineChart.Line dataKey="desktop" isClickable />
      <LineChart.Line dataKey="mobile" strokeVariant="dashed" />
    </LineChart>
  )
}`,
  "bar-chart": `import { monthlyData, trafficConfig } from "@/components/ui/chart"
import { BarChart } from "@/components/ui/bar-chart"

export function Example() {
  return (
    <BarChart data={monthlyData} config={trafficConfig}>
      <BarChart.Grid />
      <BarChart.Tooltip />
      <BarChart.Legend isClickable />
      <BarChart.Bar dataKey="desktop" variant="default" isClickable />
      <BarChart.Bar dataKey="mobile" isClickable />
    </BarChart>
  )
}`,
  "composed-chart": `import { monthlyData, trafficConfig } from "@/components/ui/chart"
import { ComposedChart } from "@/components/ui/composed-chart"

export function Example() {
  return (
    <ComposedChart data={monthlyData} config={trafficConfig}>
      <ComposedChart.Grid />
      <ComposedChart.Tooltip />
      <ComposedChart.Bar dataKey="desktop" />
      <ComposedChart.Area dataKey="mobile" />
      <ComposedChart.Line dataKey="tablet" />
    </ComposedChart>
  )
}`,
  "pie-chart": `import { shareData, shareConfig } from "@/components/ui/chart"
import { PieChart } from "@/components/ui/pie-chart"

export function Example() {
  return (
    <PieChart
      data={shareData}
      config={shareConfig}
      dataKey="visitors"
      nameKey="browser"
      innerRadius={64}
    >
      <PieChart.Tooltip />
      <PieChart.Legend isClickable />
    </PieChart>
  )
}`,
  "radar-chart": `import { radarData, radarConfig } from "@/components/ui/chart"
import { RadarChart } from "@/components/ui/radar-chart"

export function Example() {
  return (
    <RadarChart data={radarData} config={radarConfig}>
      <RadarChart.Tooltip />
      <RadarChart.Legend isClickable />
      <RadarChart.Radar dataKey="current" isClickable />
      <RadarChart.Radar dataKey="previous" variant="lines" />
    </RadarChart>
  )
}`,
  "radial-chart": `import { radialData, shareConfig } from "@/components/ui/chart"
import { RadialChart } from "@/components/ui/radial-chart"

export function Example() {
  return (
    <RadialChart data={radialData} config={shareConfig} nameKey="browser">
      <RadialChart.Tooltip />
      <RadialChart.RadialBar dataKey="visitors" showBackground isClickable />
    </RadialChart>
  )
}`,
  "sankey-chart": `import { sankeyNodes, sankeyLinks, sankeyConfig } from "@/components/ui/chart"
import { SankeyChart } from "@/components/ui/sankey-chart"

export function Example() {
  return (
    <SankeyChart
      nodes={sankeyNodes}
      links={sankeyLinks}
      config={sankeyConfig}
    />
  )
}`,
  "trend-card": `import { dailyOverlay, overlayConfig } from "@/components/ui/chart"
import { TrendCard } from "@/components/ui/trend-card"

export function Example() {
  return (
    <TrendCard
      title="Gross volume"
      value="$48,210"
      baseline="$11,640"
      delta="+$940"
      data={dailyOverlay}
      config={overlayConfig}
    />
  )
}`,
  "metric-chart": `import { metricSeries, metricConfig } from "@/components/ui/chart"
import { MetricChart } from "@/components/ui/metric-chart"

export function Example() {
  return (
    <MetricChart
      title="Active members"
      value="272"
      delta="+24"
      data={metricSeries}
      config={metricConfig}
      series={[
        { key: "period", label: "Current period" },
        { key: "today", label: "Today" },
      ]}
    />
  )
}`,
  "comparison-chart": `import { yearCompare, yearCompareConfig } from "@/components/ui/chart"
import { ComparisonChart } from "@/components/ui/comparison-chart"

export function Example() {
  return (
    <ComparisonChart
      title="Revenue"
      value="$83,151"
      delta="+12.8%"
      data={yearCompare}
      config={yearCompareConfig}
    />
  )
}`,
  "breakdown-chart": `import { paymentMix, mixConfig } from "@/components/ui/chart"
import { BreakdownChart } from "@/components/ui/breakdown-chart"

export function Example() {
  return (
    <BreakdownChart
      title="Settlements"
      items={paymentMix}
      config={mixConfig}
    />
  )
}`,
  "range-chart": `import { rangeBand, rangeConfig } from "@/components/ui/chart"
import { RangeChart } from "@/components/ui/range-chart"

export function Example() {
  return <RangeChart title="Expected vs actual" data={rangeBand} config={rangeConfig} />
}`,
  "country-chart": `import { marketRank, marketConfig } from "@/components/ui/chart"
import { CountryChart } from "@/components/ui/country-chart"

export function Example() {
  return <CountryChart title="Revenue by market" rows={marketRank} config={marketConfig} />
}`,
  "ring-metric": `import { ringMembers, ringConfig } from "@/components/ui/chart"
import { RingMetric } from "@/components/ui/ring-metric"

export function Example() {
  return (
    <RingMetric
      title="Members"
      centerLabel="Total"
      data={ringMembers}
      config={ringConfig}
    />
  )
}`,
  "cashflow-chart": `import { cashflowMonths, cashflowConfig } from "@/components/ui/chart"
import { CashflowChart } from "@/components/ui/cashflow-chart"

export function Example() {
  return (
    <CashflowChart
      title="Cash movement"
      inflowValue="$967,830"
      outflowValue="$351,420"
      data={cashflowMonths}
      config={cashflowConfig}
    />
  )
}`,
  "spotlight-chart": `import { spotlightSeries, spotlightConfig } from "@/components/ui/chart"
import { SpotlightChart } from "@/components/ui/spotlight-chart"

export function Example() {
  return (
    <SpotlightChart
      title="Gross volume"
      value="$107,843"
      delta="↑ 88% vs last month"
      data={spotlightSeries}
      config={spotlightConfig}
      markerLabel="Peak"
    />
  )
}`,
  "lane-chart": `import { laneRows, laneConfig } from "@/components/ui/chart"
import { LaneChart } from "@/components/ui/lane-chart"

export function Example() {
  return <LaneChart title="Payment outcomes" rows={laneRows} config={laneConfig} />
}`,
  "usage-meter": `import { UsageMeter } from "@/components/ui/usage-meter"

export function Example() {
  return (
    <UsageMeter
      title="Credits remaining"
      value={500}
      max={1000}
      remainingLabel="of $1,000 this cycle"
      resetLabel="Resets Jul 1"
    />
  )
}`,
};

const previewByName: Record<string, ReactNode> = {
  chart: <ChartPreview />,
  sparkline: <SparklinePreview />,
  "area-chart": <AreaChartPreview />,
  "line-chart": <LineChartPreview />,
  "bar-chart": <BarChartPreview />,
  "composed-chart": <ComposedChartPreview />,
  "pie-chart": <PieChartPreview />,
  "radar-chart": <RadarChartPreview />,
  "radial-chart": <RadialChartPreview />,
  "sankey-chart": <SankeyChartPreview />,
  "trend-card": <TrendCardPreview />,
  "metric-chart": <MetricChartPreview />,
  "comparison-chart": <ComparisonChartPreview />,
  "breakdown-chart": <BreakdownChartPreview />,
  "range-chart": <RangeChartPreview />,
  "country-chart": <CountryChartPreview />,
  "ring-metric": <RingMetricPreview />,
  "cashflow-chart": <CashflowChartPreview />,
  "spotlight-chart": <SpotlightChartPreview />,
  "lane-chart": <LaneChartPreview />,
  "usage-meter": <UsageMeterPreview />,
};

const examplesByName: Record<string, ReactNode> = {
  "area-chart": <AreaChartExamples />,
  chart: <ChartExamples />,
  sparkline: <SparklineExamples />,
  "line-chart": <LineChartExamples />,
  "bar-chart": <BarChartExamples />,
  "composed-chart": <ComposedChartExamples />,
  "pie-chart": <PieChartExamples />,
  "radar-chart": <RadarChartExamples />,
  "radial-chart": <RadialChartExamples />,
  "trend-card": <TrendCardExamples />,
};

const sourcePaths: Record<string, string> = {
  chart: "apps/docs/components/ui/chart.tsx",
  sparkline: "apps/docs/components/ui/sparkline.tsx",
  "area-chart": "apps/docs/components/ui/area-chart.tsx",
  "line-chart": "apps/docs/components/ui/line-chart.tsx",
  "bar-chart": "apps/docs/components/ui/bar-chart.tsx",
  "composed-chart": "apps/docs/components/ui/composed-chart.tsx",
  "pie-chart": "apps/docs/components/ui/pie-chart.tsx",
  "radar-chart": "apps/docs/components/ui/radar-chart.tsx",
  "radial-chart": "apps/docs/components/ui/radial-chart.tsx",
  "sankey-chart": "apps/docs/components/ui/sankey-chart.tsx",
  "trend-card": "apps/docs/components/ui/trend-card.tsx",
  "metric-chart": "apps/docs/components/ui/metric-chart.tsx",
  "comparison-chart": "apps/docs/components/ui/comparison-chart.tsx",
  "breakdown-chart": "apps/docs/components/ui/breakdown-chart.tsx",
  "range-chart": "apps/docs/components/ui/range-chart.tsx",
  "country-chart": "apps/docs/components/ui/country-chart.tsx",
  "ring-metric": "apps/docs/components/ui/ring-metric.tsx",
  "cashflow-chart": "apps/docs/components/ui/cashflow-chart.tsx",
  "spotlight-chart": "apps/docs/components/ui/spotlight-chart.tsx",
  "lane-chart": "apps/docs/components/ui/lane-chart.tsx",
  "usage-meter": "apps/docs/components/ui/usage-meter.tsx",
};

function readRegistrySource(name: string) {
  const relative = sourcePaths[name];
  if (!relative) return "// Source unavailable";

  const roots = [
    path.join(process.cwd(), relative),
    path.join(process.cwd(), "../..", relative),
  ];

  for (const file of roots) {
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
  }

  return "// Source unavailable";
}

export function generateStaticParams() {
  return components.map((component) => ({ name: component.name }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  return params.then(({ name }) => {
    const component = getComponent(name);
    return {
      title: component?.title ?? "Component",
      description: component?.description,
    };
  });
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const component = getComponent(name);
  if (!component) notFound();

  const source = readRegistrySource(name);
  const preview = previewByName[name];
  const usage =
    usageByName[name] ??
    `import { ${component.title} } from "@/components/ui/${component.name}"`;
  const examples = examplesByName[name];

  return (
    <ComponentDocLayout
      component={component}
      preview={preview}
      usage={usage}
      source={source}
      examples={examples}
    />
  );
}
