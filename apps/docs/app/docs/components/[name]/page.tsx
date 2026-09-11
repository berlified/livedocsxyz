import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { components, getComponent } from "@frostui/registry";

import { ComponentDocLayout } from "@/components/component-doc-layout";
import {
  AvatarPreview,
  BadgeExamples,
  BadgePreview,
  ButtonExamples,
  ButtonPreview,
  CardExamples,
  CardPreview,
  InputExamples,
  InputPreview,
  SeparatorPreview,
} from "@/components/previews";
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
} from "@/components/chart-previews";

const usageByName: Record<string, string> = {
  button: `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Continue</Button>
}`,
  badge: `import { Badge } from "@/components/ui/badge"

export function Example() {
  return <Badge variant="secondary">Active</Badge>
}`,
  card: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>$12,480</CardContent>
    </Card>
  )
}`,
  input: `import { Input } from "@/components/ui/input"

export function Example() {
  return <Input placeholder="Search…" />
}`,
  avatar: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.jpg" alt="User" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  )
}`,
  separator: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return <Separator />
}`,
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
  return <Sparkline markerLabel="Your balance will appear here." />
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
};

const previewByName: Record<string, ReactNode> = {
  button: <ButtonPreview />,
  badge: <BadgePreview />,
  card: <CardPreview />,
  input: <InputPreview />,
  avatar: <AvatarPreview />,
  separator: <SeparatorPreview />,
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
};

const examplesByName: Record<string, ReactNode> = {
  button: <ButtonExamples />,
  badge: <BadgeExamples />,
  card: <CardExamples />,
  input: <InputExamples />,
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
  button: "apps/docs/components/ui/button.tsx",
  badge: "apps/docs/components/ui/badge.tsx",
  card: "apps/docs/components/ui/card.tsx",
  input: "apps/docs/components/ui/input.tsx",
  avatar: "apps/docs/components/ui/avatar.tsx",
  separator: "apps/docs/components/ui/separator.tsx",
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
