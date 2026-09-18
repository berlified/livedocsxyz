"use client";

import * as React from "react";

import { AreaChart } from "@/components/ui/area-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { CashflowChart } from "@/components/ui/cashflow-chart";
import {
  cashflowConfig,
  cashflowMonths,
  cohortMix,
  composedDaily,
  composedDailyConfig,
  dailyOverlay,
  laneConfig,
  laneRows,
  marketConfig,
  marketRank,
  metricConfig,
  metricSeries,
  mixConfig,
  monthlyData,
  overlayConfig,
  paymentMix,
  radarConfig,
  radarData,
  radialData,
  rangeBand,
  rangeConfig,
  ringConfig,
  ringMembers,
  ringPayments,
  salesByCategoryConfig,
  salesByCategory,
  sankeyConfig,
  sankeyLinks,
  sankeyNodes,
  shareConfig,
  shareData,
  spotlightConfig,
  spotlightSeries,
  trafficConfig,
  yearCompare,
  yearCompareConfig,
} from "@/components/ui/chart";
import { CountryChart } from "@/components/ui/country-chart";
import { LaneChart } from "@/components/ui/lane-chart";
import { RingMetric } from "@/components/ui/ring-metric";
import { SpotlightChart } from "@/components/ui/spotlight-chart";
import { UsageMeter } from "@/components/ui/usage-meter";
import { ComparisonChart } from "@/components/ui/comparison-chart";
import { ComposedChart } from "@/components/ui/composed-chart";
import { LineChart } from "@/components/ui/line-chart";
import { MetricChart } from "@/components/ui/metric-chart";
import { PieChart } from "@/components/ui/pie-chart";
import { RadarChart } from "@/components/ui/radar-chart";
import { RadialChart } from "@/components/ui/radial-chart";
import { RangeChart } from "@/components/ui/range-chart";
import { SankeyChart } from "@/components/ui/sankey-chart";
import { Sparkline } from "@/components/ui/sparkline";
import { ActivityChart } from "@/components/ui/activity-chart";
import { Card } from "@/components/ui/card";
import { TrendCard } from "@/components/ui/trend-card";

import { ComponentPreview } from "@/components/component-preview";
import { emotionConfig, money, shapeValues, sumKey, usePreviewEmotion, useShapedRecords } from "@/components/emotion-data";
import { sparklineSample } from "@/components/ui/sparkline";

export {
  WaterfallChartPreview,
  WaterfallChartExamples,
  CandlestickChartPreview,
  CandlestickChartExamples,
  ChartReactionsPreview,
  ChartReactionsExamples,
  FunnelConversionExamples,
} from "@/components/financial-chart-previews";

function PreviewPair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 [&>*]:min-w-0 [&>*]:w-full">
      {children}
    </div>
  );
}

export function ChartPreview() {
  const { data, emotion } = useShapedRecords(monthlyData, ["desktop", "mobile"]);
  const total = Math.round(sumKey(data, "desktop"));
  return (
    <AreaChart title="Traffic" value={total.toLocaleString("en-US")} data={data} config={emotionConfig(trafficConfig, emotion)} className="h-[28rem] w-full">
      <AreaChart.Grid />
      <AreaChart.Tooltip />
      <AreaChart.Legend isClickable />
      <AreaChart.Area dataKey="desktop" variant="gradient" isClickable />
      <AreaChart.Area dataKey="mobile" variant="gradient" isClickable />
    </AreaChart>
  );
}

export function ChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Config</h2>
      <ComponentPreview label="Clickable legend + tooltip" className="p-4">
        <ChartPreview />
      </ComponentPreview>
    </section>
  );
}

export function AreaChartPreview() {
  return <ChartPreview />;
}

export function AreaChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Gradient" className="p-4">
        <AreaChart data={monthlyData} config={trafficConfig} className="w-full">
          <AreaChart.Grid />
          <AreaChart.Tooltip />
          <AreaChart.Legend isClickable />
          <AreaChart.Area dataKey="desktop" variant="gradient" isClickable />
          <AreaChart.Area dataKey="mobile" variant="gradient" isClickable />
        </AreaChart>
      </ComponentPreview>
      <ComponentPreview label="Hatched + glow" className="p-4">
        <AreaChart data={monthlyData} config={trafficConfig} className="w-full">
          <AreaChart.Grid />
          <AreaChart.Tooltip />
          <AreaChart.Area dataKey="desktop" variant="hatched" isGlowing isClickable />
        </AreaChart>
      </ComponentPreview>
      <ComponentPreview label="Dashed stroke + brush" className="p-4">
        <AreaChart data={monthlyData} config={trafficConfig} className="w-full">
          <AreaChart.Grid />
          <AreaChart.Tooltip />
          <AreaChart.Area dataKey="desktop" strokeVariant="dashed" />
          <AreaChart.Brush dataKey="month" height={18} />
        </AreaChart>
      </ComponentPreview>
      <ComponentPreview label="Loading" className="p-4">
        <AreaChart data={monthlyData} config={trafficConfig} isLoading className="w-full">
          <AreaChart.Area dataKey="desktop" />
        </AreaChart>
      </ComponentPreview>
    </section>
  );
}

export function LineChartPreview() {
  const { data, emotion } = useShapedRecords(monthlyData, ["desktop", "mobile"]);
  const total = Math.round(sumKey(data, "desktop"));
  return (
    <LineChart title="Traffic" value={total.toLocaleString("en-US")} data={data} config={emotionConfig(trafficConfig, emotion)} className="h-[28rem] w-full">
      <LineChart.Grid />
      <LineChart.Tooltip />
      <LineChart.Legend isClickable />
      <LineChart.Line dataKey="desktop" isClickable />
      <LineChart.Line dataKey="mobile" strokeVariant="dashed" isClickable />
    </LineChart>
  );
}

export function LineChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Glow + dots" className="p-4">
        <LineChart data={monthlyData} config={trafficConfig} className="w-full">
          <LineChart.Grid />
          <LineChart.Tooltip />
          <LineChart.Line dataKey="desktop" isGlowing dot />
        </LineChart>
      </ComponentPreview>
      <ComponentPreview label="Step curve" className="p-4">
        <LineChart data={monthlyData} config={trafficConfig} className="w-full">
          <LineChart.Grid />
          <LineChart.Tooltip />
          <LineChart.Line dataKey="desktop" curveType="step" />
          <LineChart.Line dataKey="mobile" curveType="linear" />
        </LineChart>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <LineChart data={monthlyData} config={trafficConfig} isLoading className="w-full">
          <LineChart.Line dataKey="desktop" />
        </LineChart>
      </ComponentPreview>
    </section>
  );
}

const barPreviewData = monthlyData.slice(-6);

export function BarChartPreview() {
  const { data, emotion } = useShapedRecords(barPreviewData, ["desktop", "mobile"]);
  const total = data.reduce((sum, row) => sum + Number(row.desktop ?? 0), 0);
  return (
    <BarChart
      title="Revenue"
      value={`$${(total / 1000).toFixed(1)}k`}
     
      data={data}
      config={emotionConfig(trafficConfig, emotion)}
      className="h-[28rem] w-full"
    >
      <BarChart.Grid />
      <BarChart.Tooltip />
      <BarChart.Bar dataKey="desktop" isClickable />
    </BarChart>
  );
}

export function BarChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Stacked" className="p-4">
        <BarChart data={monthlyData} config={trafficConfig} stackType="stacked" className="w-full">
          <BarChart.Grid />
          <BarChart.Tooltip />
          <BarChart.Legend isClickable />
          <BarChart.Bar dataKey="desktop" isClickable />
          <BarChart.Bar dataKey="mobile" isClickable />
          <BarChart.Bar dataKey="tablet" isClickable />
        </BarChart>
      </ComponentPreview>
      <ComponentPreview label="Hatched / duotone / stripped" className="p-4">
        <BarChart data={monthlyData} config={trafficConfig} className="w-full">
          <BarChart.Grid />
          <BarChart.Tooltip />
          <BarChart.Bar dataKey="desktop" variant="hatched" />
          <BarChart.Bar dataKey="mobile" variant="duotone" />
          <BarChart.Bar dataKey="tablet" variant="stripped" />
        </BarChart>
      </ComponentPreview>
      <ComponentPreview label="Horizontal" className="p-4">
        <BarChart
          data={monthlyData.slice(0, 6)}
          config={trafficConfig}
          layout="vertical"
          className="w-full"
        >
          <BarChart.Grid />
          <BarChart.Tooltip />
          <BarChart.Bar dataKey="desktop" variant="gradient" />
        </BarChart>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <BarChart data={monthlyData} config={trafficConfig} isLoading className="w-full">
          <BarChart.Bar dataKey="desktop" />
        </BarChart>
      </ComponentPreview>
    </section>
  );
}

export function ComposedChartPreview() {
  const { data, emotion } = useShapedRecords(composedDaily, ["daily", "average", "trend"], true);
  const total = sumKey(data, "daily");
  return (
    <ComposedChart title="Daily activity" value={total.toLocaleString("en-US")} data={data} config={emotionConfig(composedDailyConfig, emotion)} xDataKey="day" className="w-full" height={340}>
      <ComposedChart.Grid />
      <ComposedChart.XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} ticks={["Jan 1", "Jan 5", "Jan 10", "Jan 15", "Jan 20", "Jan 25", "Jan 30"]} interval="preserveStartEnd" minTickGap={28} />
      <ComposedChart.Tooltip
        labelFormatter={(label) => new Date(Date.UTC(2026, 0, Number(String(label).split(" ")[1]))).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}
      />
      <ComposedChart.Legend isClickable />
      <ComposedChart.Area dataKey="average" />
      <ComposedChart.Bar dataKey="daily" maxBarSize={10} />
      <ComposedChart.Line dataKey="trend" />
    </ComposedChart>
  );
}

export function ComposedChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Mix series</h2>
      <ComponentPreview label="Bar + area + line" className="p-4">
        <ComposedChartPreview />
      </ComponentPreview>
      <ComponentPreview label="Area behind bars" className="p-4">
        <ComposedChart data={monthlyData} config={trafficConfig} className="w-full">
          <ComposedChart.Grid />
          <ComposedChart.Tooltip />
          <ComposedChart.Legend isClickable />
          <ComposedChart.Area dataKey="desktop" />
          <ComposedChart.Bar dataKey="mobile" isClickable />
        </ComposedChart>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <ComposedChart data={monthlyData} config={trafficConfig} isLoading className="w-full">
          <ComposedChart.Bar dataKey="desktop" />
          <ComposedChart.Line dataKey="mobile" />
        </ComposedChart>
      </ComponentPreview>
    </section>
  );
}

export function PieChartPreview() {
  const { data, emotion } = useShapedRecords(salesByCategory, ["sales"], true);
  return (
    <PieChart
      data={data}
      config={emotionConfig(salesByCategoryConfig, emotion)}
      dataKey="sales"
      nameKey="category"
      legendTitle="Sales by Category"
      innerRadius={0}
      paddingAngle={0}
      cornerRadius={0}
      className="w-full"
    >
      <PieChart.Tooltip />
    </PieChart>
  );
}

export function PieChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Donut + glow" className="p-4">
        <PieChart
          data={shareData}
          config={shareConfig}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={70}
          paddingAngle={4}
          glowingSectors={["chrome"]}
          className="w-full"
        >
          <PieChart.Tooltip />
        </PieChart>
      </ComponentPreview>
      <ComponentPreview label="Labels" className="p-4">
        <PieChart
          data={shareData}
          config={shareConfig}
          dataKey="visitors"
          nameKey="browser"
          showLabels
          innerRadius={0}
          className="w-full"
        >
          <PieChart.Tooltip />
        </PieChart>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <PieChart
          data={shareData}
          config={shareConfig}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={64}
          isLoading
          className="w-full"
        >
          <PieChart.Tooltip />
        </PieChart>
      </ComponentPreview>
    </section>
  );
}

export function RadarChartPreview() {
  const { data, emotion } = useShapedRecords(radarData, ["current", "previous"]);
  return (
    <RadarChart data={data} config={emotionConfig(radarConfig, emotion)} className="w-full">
      <RadarChart.Tooltip />
      <RadarChart.Legend isClickable />
      <RadarChart.Radar dataKey="current" isClickable />
      <RadarChart.Radar dataKey="previous" variant="lines" isClickable />
    </RadarChart>
  );
}

export function RadarChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Circular grid + glow" className="p-4">
        <RadarChart data={radarData} config={radarConfig} gridType="circle" className="w-full">
          <RadarChart.Tooltip />
          <RadarChart.Radar dataKey="current" isGlowing />
        </RadarChart>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <RadarChart data={radarData} config={radarConfig} isLoading className="w-full">
          <RadarChart.Radar dataKey="current" />
        </RadarChart>
      </ComponentPreview>
    </section>
  );
}

export function RadialChartPreview() {
  const { data, emotion } = useShapedRecords(radialData, ["visitors"], true);
  return (
    <RadialChart data={data} config={emotionConfig(shareConfig, emotion)} nameKey="browser" className="w-full">
      <RadialChart.Tooltip />
      <RadialChart.Legend />
      <RadialChart.RadialBar dataKey="visitors" showBackground isClickable />
    </RadialChart>
  );
}

export function RadialChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Semi" className="p-4">
        <RadialChart
          data={radialData}
          config={shareConfig}
          nameKey="browser"
          variant="semi"
          className="w-full"
        >
          <RadialChart.Tooltip />
          <RadialChart.RadialBar dataKey="visitors" showBackground cornerRadius={8} />
        </RadialChart>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <RadialChart data={radialData} config={shareConfig} nameKey="browser" isLoading className="w-full">
          <RadialChart.RadialBar dataKey="visitors" showBackground />
        </RadialChart>
      </ComponentPreview>
    </section>
  );
}

export function SankeyChartPreview() {
  const { data: links, emotion } = useShapedRecords(sankeyLinks, ["value"], true);
  return (
    <SankeyChart
      nodes={sankeyNodes}
      links={links}
      config={emotionConfig(sankeyConfig, emotion)}
      className="w-full"
    />
  );
}

const sparkEmotionBase = Array.from({ length: 40 }, (_, index) => Math.round((50 + Math.sin(index / 5) * 12 + index * 0.4) * 1000) / 1000);

export function SparklinePreview() {
  const emotion = usePreviewEmotion();
  const data = React.useMemo(() => shapeValues(sparkEmotionBase, emotion), [emotion]);
  return (
    <Sparkline
      className="w-full"
      data={data}
      tone={emotion === "sad" || emotion === "disappointed" ? "down" : "up"}
      format={(value) =>
        value.toLocaleString("en-US", { style: "currency", currency: "USD" })
      }
    />
  );
}

function useShapedNumbers(values: number[]) {
  const emotion = usePreviewEmotion();
  return React.useMemo(() => shapeValues(values, emotion), [values, emotion]);
}

const sparkInlineBase = sparklineSample.slice(0, 20);

function SparklineInlineExample() {
  const data = useShapedNumbers(sparkInlineBase);
  const last = data[data.length - 1] ?? 0;
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Available balance</p>
        <p className="font-mono text-lg font-semibold">{money(last)}</p>
      </div>
      <Sparkline
        className="max-w-40 bg-transparent"
        size="sm"
        data={data}
        tone="up"
        interactive={false}
        showValue={false}
      />
    </div>
  );
}

function SparklineCardExample() {
  const data = useShapedNumbers(sparklineSample);
  const last = data[data.length - 1] ?? 0;
  return (
    <Card className="w-full max-w-sm p-5 sm:p-6">
      <p className="text-sm text-muted-foreground">Volume</p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">{money(last)}</p>
      <Sparkline
        className="mt-3 bg-transparent"
        size="md"
        data={data}
        tone="up"
        showValue
      />
    </Card>
  );
}

function SparklineCalloutExample() {
  const data = useShapedNumbers(sparklineSample);
  return (
    <Sparkline
      data={data}
      markerLabel="Peak balance"
      markerIndex={31}
      tone="up"
      format={(value) =>
        value.toLocaleString("en-US", { style: "currency", currency: "USD" })
      }
    />
  );
}

export function SparklineExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Sizes</h2>
      <ComponentPreview label="Inline" className="p-4">
        <SparklineInlineExample />
      </ComponentPreview>
      <ComponentPreview label="Card" className="p-4">
        <SparklineCardExample />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Callout</h2>
      <ComponentPreview label="Labeled marker" className="p-0">
        <SparklineCalloutExample />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <Sparkline isLoading />
      </ComponentPreview>
    </section>
  );
}

export function TrendCardPreview() {
  const { data, emotion } = useShapedRecords(dailyOverlay, ["current", "previous"], true);
  const total = sumKey(data, "current");
  const previous = sumKey(data, "previous");
  const diff = total - previous;
  const last = data[data.length - 1];
  const lastPrevious = data[data.length - 1];
  return (
    <PreviewPair>
      <TrendCard
        title="Gross volume"
        value={money(total)}
        baseline={money(previous)}
        delta={`${diff >= 0 ? "+" : "−"}${money(Math.abs(diff))}`}
        tone={diff >= 0 ? "up" : "down"}
        data={data}
        config={emotionConfig(overlayConfig, emotion)}
      />
      <TrendCard
        title="Churn"
        value={`${Number(last?.current ?? 0).toFixed(1)}%`}
        baseline={`${Number(lastPrevious?.previous ?? 0).toFixed(1)}%`}
        delta={`${(Number(last?.current ?? 0) - Number(lastPrevious?.previous ?? 0)) >= 0 ? "+" : "−"}${Math.abs(Number(last?.current ?? 0) - Number(lastPrevious?.previous ?? 0)).toFixed(1)}pp`}
        tone={diff >= 0 ? "up" : "down"}
        data={data}
        config={emotionConfig(overlayConfig, emotion)}
      />
    </PreviewPair>
  );
}

function TrendChurnExample() {
  const { data, emotion } = useShapedRecords(dailyOverlay, ["current", "previous"], true);
  const last = data[data.length - 1];
  const current = Number(last?.current ?? 0);
  const previous = Number(last?.previous ?? 0);
  const diff = current - previous;
  return (
    <TrendCard
      className="w-full max-w-sm"
      title="Churn"
      value={`${current.toFixed(1)}%`}
      baseline={`${previous.toFixed(1)}%`}
      delta={`${diff >= 0 ? "+" : "−"}${Math.abs(diff).toFixed(1)}pp`}
      tone={diff >= 0 ? "up" : "down"}
      data={data}
      config={overlayConfig}
    />
  );
}

export function TrendCardExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <TrendCard
          className="w-full max-w-sm"
          title="Gross volume"
          value="$48,210"
          data={dailyOverlay}
          config={overlayConfig}
          isLoading
        />
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Down tone</h2>
      <ComponentPreview label="Churn" className="p-4">
        <TrendChurnExample />
      </ComponentPreview>
    </section>
  );
}

export function MetricChartPreview() {
  const { data, emotion } = useShapedRecords(metricSeries, ["period", "today"], true);
  const total = sumKey(data, "period");
  const diff = total - sumKey(data, "today");
  return (
    <MetricChart
      className="w-full"
      title="Active members"
      value={String(total)}
      delta={`${diff >= 0 ? "+" : "−"}${Math.abs(diff)}`}
      tone={diff >= 0 ? "up" : "down"}
      data={data}
      config={emotionConfig(metricConfig, emotion)}
      series={[
        { key: "period", label: "Current period" },
        { key: "today", label: "Today" },
      ]}
    />
  );
}

export function ComparisonChartPreview() {
  const { data, emotion } = useShapedRecords(yearCompare, ["thisYear", "lastYear"], true);
  const total = sumKey(data, "thisYear");
  const previous = sumKey(data, "lastYear");
  const pct = previous === 0 ? 0 : ((total - previous) / Math.abs(previous)) * 100;
  return (
    <ComparisonChart
      className="w-full"
      title="Revenue"
      value={money(total)}
      delta={`${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(1)}%`}
      tone={pct >= 0 ? "up" : "down"}
      data={data}
      config={emotionConfig(yearCompareConfig, emotion)}
    />
  );
}

export function MetricChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <MetricChart
          className="w-full"
          title="Active members"
          value="272"
          data={metricSeries}
          config={metricConfig}
          series={[{ key: "period", label: "Current period" }]}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function ComparisonChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <ComparisonChart
          className="w-full"
          title="Revenue"
          value="$83,151"
          data={yearCompare}
          config={yearCompareConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

function useShapedMix(items: { key: string; label: string; value: number; percent: number }[]) {
  const { data, emotion } = useShapedRecords(items, ["value"], true);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return {
    emotion,
    items: data.map((item) => ({
      ...item,
      percent: total > 0 ? Math.round((item.value / total) * 1000) / 10 : 0,
    })),
  };
}

export function BreakdownChartPreview() {
  const { items: settlements, emotion: mixEmotion } = useShapedMix(paymentMix);
  const { items: cohorts } = useShapedMix(cohortMix);
  return (
    <PreviewPair>
      <BreakdownChart title="Settlements" items={settlements} config={emotionConfig(mixConfig, mixEmotion)} />
      <BreakdownChart
        title="Cohorts"
        items={cohorts}
        config={emotionConfig(mixConfig, mixEmotion)}
        currency={false}
      />
    </PreviewPair>
  );
}

export function RangeChartPreview() {
  const { data, emotion } = useShapedRecords(rangeBand, ["low", "high", "value"]);
  return (
    <RangeChart
      className="w-full"
      title="Expected vs actual"
      data={data}
      config={emotionConfig(rangeConfig, emotion)}
    />
  );
}

export function BreakdownChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <BreakdownChart title="Settlements" items={paymentMix} config={mixConfig} isLoading />
      </ComponentPreview>
    </section>
  );
}

export function RangeChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <RangeChart
          className="w-full"
          title="Expected vs actual"
          data={rangeBand}
          config={rangeConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function CountryChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <CountryChart
          className="w-full"
          title="Revenue by market"
          rows={marketRank}
          config={marketConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function RingMetricExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <RingMetric
          title="Members"
          centerLabel="Total"
          data={ringMembers}
          config={ringConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function CashflowChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <CashflowChart
          className="w-full"
          title="Cash movement"
          data={cashflowMonths}
          config={cashflowConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function SpotlightChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <SpotlightChart
          className="w-full"
          title="Gross volume"
          value="$107,843"
          data={spotlightSeries}
          config={spotlightConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function LaneChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <LaneChart
          className="w-full"
          title="Payment outcomes"
          rows={laneRows}
          config={laneConfig}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function UsageMeterExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <UsageMeter
          title="Credits remaining"
          value={500}
          max={1000}
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function SankeyChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Loading</h2>
      <ComponentPreview label="Loading" className="p-4">
        <SankeyChart
          nodes={sankeyNodes}
          links={sankeyLinks}
          config={sankeyConfig}
          className="w-full"
          isLoading
        />
      </ComponentPreview>
    </section>
  );
}

export function CountryChartPreview() {
  const { data, emotion } = useShapedRecords(marketRank, ["current", "previous"], true);
  return (
    <CountryChart
      className="w-full"
      title="Revenue by market"
      rows={data}
      config={emotionConfig(marketConfig, emotion)}
    />
  );
}

export function RingMetricPreview() {
  const { data: members, emotion } = useShapedRecords(ringMembers, ["value"], true);
  const { data: payments } = useShapedRecords(ringPayments, ["value"], true);
  return (
    <PreviewPair>
      <RingMetric
        title="Members"
        centerLabel="Total"
        data={members}
        config={emotionConfig(ringConfig, emotion)}
      />
      <RingMetric
        title="Transactions"
        centerLabel="Volume"
        data={payments}
        config={emotionConfig(ringConfig, emotion)}
      />
    </PreviewPair>
  );
}

export function CashflowChartPreview() {
  const { data, emotion } = useShapedRecords(cashflowMonths, ["inflow", "outflow"], false, true);
  const inflow = sumKey(data, "inflow");
  const outflow = Math.abs(sumKey(data, "outflow"));
  return (
    <CashflowChart
      className="w-full"
      title="Cash movement"
      inflowValue={money(inflow)}
      outflowValue={money(outflow)}
      data={data}
      config={emotionConfig(cashflowConfig, emotion)}
    />
  );
}

export function SpotlightChartPreview() {
  const { data, emotion } = useShapedRecords(spotlightSeries, ["current", "previous"], true);
  const total = sumKey(data, "current");
  const previous = sumKey(data, "previous");
  const pct = previous === 0 ? 0 : ((total - previous) / Math.abs(previous)) * 100;
  return (
    <SpotlightChart
      className="w-full"
      title="Gross volume"
      value={money(total)}
      delta={`${pct >= 0 ? "↑" : "↓"} ${Math.abs(pct).toFixed(0)}% vs last month`}
      tone={pct >= 0 ? "up" : "down"}
      data={data}
      config={emotionConfig(spotlightConfig, emotion)}
      markerLabel="Peak"
    />
  );
}

export function LaneChartPreview() {
  const { data, emotion } = useShapedRecords(laneRows, ["value"], true);
  return (
    <LaneChart
      className="w-full"
      title="Payment outcomes"
      rows={data}
      config={emotionConfig(laneConfig, emotion)}
    />
  );
}

export function UsageMeterPreview() {
  const emotion = usePreviewEmotion();
  const credits = React.useMemo(() => shapeValues([500], emotion, true)[0] ?? 500, [emotion]);
  const reserve = React.useMemo(() => shapeValues([186], emotion, true)[0] ?? 186, [emotion]);
  return (
    <PreviewPair>
      <UsageMeter
        title="Credits remaining"
        value={credits}
        max={1000}
        remainingLabel="of $1,000 this cycle"
        resetLabel="Resets Jul 1"
      />
      <UsageMeter
        title="Payout reserve"
        value={reserve}
        max={800}
        remainingLabel="of $800 held"
        resetLabel="Clears on payout"
      />
    </PreviewPair>
  );
}

export const activitySessions = Array.from({ length: 30 }, (_, index) => ({
  label: `D${index + 1}`,
  value: Math.round(1100 + index * 62 + Math.sin(index * 0.7) * 320 + (index % 4) * 90),
}));

export const activityConfig = {
  value: { label: "Sessions", color: "var(--chart-2)" },
};

export function ActivityChartPreview() {
  const { data, emotion } = useShapedRecords(activitySessions, ["value"], true);
  const total = sumKey(data, "value");
  return (
    <ActivityChart
      title="Sessions"
      value={`${(total / 1000).toFixed(1)}k`}
     
      data={data}
      config={emotionConfig(activityConfig, emotion)}
      className="w-full"
    />
  );
}

export function ActivityChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview label="Loading" className="p-4">
        <ActivityChart title="Sessions" value="48.2k" data={activitySessions} config={activityConfig} isLoading className="w-full" />
      </ComponentPreview>
    </section>
  );
}
