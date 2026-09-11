"use client";

import { AreaChart } from "@/components/ui/area-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { CashflowChart } from "@/components/ui/cashflow-chart";
import {
  cashflowConfig,
  cashflowMonths,
  cohortMix,
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
import { Card } from "@/components/ui/card";
import { TrendCard } from "@/components/ui/trend-card";

import { ComponentPreview } from "@/components/component-preview";

function PreviewPair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 [&>*]:min-w-0 [&>*]:w-full">
      {children}
    </div>
  );
}

export function ChartPreview() {
  return (
    <AreaChart data={monthlyData} config={trafficConfig} className="w-full">
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
  return (
    <LineChart data={monthlyData} config={trafficConfig} className="w-full">
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
    </section>
  );
}

export function BarChartPreview() {
  return (
    <BarChart data={monthlyData} config={trafficConfig} className="w-full">
      <BarChart.Grid />
      <BarChart.Tooltip />
      <BarChart.Legend isClickable />
      <BarChart.Bar dataKey="desktop" isClickable />
      <BarChart.Bar dataKey="mobile" isClickable />
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
    </section>
  );
}

export function ComposedChartPreview() {
  return (
    <ComposedChart data={monthlyData} config={trafficConfig} className="w-full">
      <ComposedChart.Grid />
      <ComposedChart.Tooltip />
      <ComposedChart.Legend isClickable />
      <ComposedChart.Bar dataKey="desktop" isClickable />
      <ComposedChart.Area dataKey="mobile" />
      <ComposedChart.Line dataKey="tablet" />
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
    </section>
  );
}

export function PieChartPreview() {
  return (
    <PieChart
      data={shareData}
      config={shareConfig}
      dataKey="visitors"
      nameKey="browser"
      innerRadius={64}
      className="w-full"
    >
      <PieChart.Tooltip />
      <PieChart.Legend isClickable />
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
    </section>
  );
}

export function RadarChartPreview() {
  return (
    <RadarChart data={radarData} config={radarConfig} className="w-full">
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
    </section>
  );
}

export function RadialChartPreview() {
  return (
    <RadialChart data={radialData} config={shareConfig} nameKey="browser" className="w-full">
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
    </section>
  );
}

export function SankeyChartPreview() {
  return (
    <SankeyChart
      nodes={sankeyNodes}
      links={sankeyLinks}
      config={sankeyConfig}
      className="w-full"
    />
  );
}

export function SparklinePreview() {
  return (
    <Sparkline
      className="w-full"
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
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Available balance</p>
            <p className="font-mono text-lg font-semibold">$12,480</p>
          </div>
          <Sparkline
            className="max-w-40 bg-transparent"
            size="sm"
            tone="up"
            interactive={false}
            showValue={false}
          />
        </div>
      </ComponentPreview>
      <ComponentPreview label="Card" className="p-4">
        <Card className="w-full max-w-sm p-4">
          <p className="text-sm text-muted-foreground">Volume</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">$48,210</p>
          <Sparkline
            className="mt-3 bg-transparent"
            size="md"
            tone="up"
            showValue={false}
          />
        </Card>
      </ComponentPreview>
      <h2 className="text-xl font-semibold">Callout</h2>
      <ComponentPreview label="Labeled marker" className="p-0">
        <Sparkline
          markerLabel="Peak balance"
          markerIndex={31}
          tone="up"
          format={(value) =>
            value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          }
        />
      </ComponentPreview>
    </section>
  );
}

export function TrendCardPreview() {
  return (
    <PreviewPair>
      <TrendCard
        title="Gross volume"
        value="$48,210"
        baseline="$11,640"
        delta="+$940"
        data={dailyOverlay}
        config={overlayConfig}
      />
      <TrendCard
        title="Churn"
        value="3.8%"
        baseline="6.1%"
        delta="-0.4%"
        tone="down"
        data={dailyOverlay}
        config={overlayConfig}
      />
    </PreviewPair>
  );
}

export function TrendCardExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Down tone</h2>
      <ComponentPreview label="Churn" className="p-4">
        <TrendCard
          className="w-full max-w-sm"
          title="Churn"
          value="3.8%"
          baseline="6.1%"
          delta="-0.4%"
          tone="down"
          data={dailyOverlay}
          config={overlayConfig}
        />
      </ComponentPreview>
    </section>
  );
}

export function MetricChartPreview() {
  return (
    <MetricChart
      className="w-full"
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
  );
}

export function ComparisonChartPreview() {
  return (
    <ComparisonChart
      className="w-full"
      title="Revenue"
      value="$83,151"
      delta="+12.8%"
      data={yearCompare}
      config={yearCompareConfig}
    />
  );
}

export function BreakdownChartPreview() {
  return (
    <PreviewPair>
      <BreakdownChart title="Settlements" items={paymentMix} config={mixConfig} />
      <BreakdownChart
        title="Cohorts"
        items={cohortMix}
        config={mixConfig}
        currency={false}
      />
    </PreviewPair>
  );
}

export function RangeChartPreview() {
  return (
    <RangeChart
      className="w-full"
      title="Expected vs actual"
      data={rangeBand}
      config={rangeConfig}
    />
  );
}

export function CountryChartPreview() {
  return (
    <CountryChart
      className="w-full"
      title="Revenue by market"
      rows={marketRank}
      config={marketConfig}
    />
  );
}

export function RingMetricPreview() {
  return (
    <PreviewPair>
      <RingMetric
        title="Members"
        centerLabel="Total"
        data={ringMembers}
        config={ringConfig}
      />
      <RingMetric
        title="Transactions"
        centerLabel="Volume"
        data={ringPayments}
        config={ringConfig}
      />
    </PreviewPair>
  );
}

export function CashflowChartPreview() {
  return (
    <CashflowChart
      className="w-full"
      title="Cash movement"
      inflowValue="$967,830"
      outflowValue="$351,420"
      data={cashflowMonths}
      config={cashflowConfig}
    />
  );
}

export function SpotlightChartPreview() {
  return (
    <SpotlightChart
      className="w-full"
      title="Gross volume"
      value="$107,843"
      delta="↑ 88% vs last month"
      data={spotlightSeries}
      config={spotlightConfig}
      markerLabel="Peak"
    />
  );
}

export function LaneChartPreview() {
  return (
    <LaneChart
      className="w-full"
      title="Payment outcomes"
      rows={laneRows}
      config={laneConfig}
    />
  );
}

export function UsageMeterPreview() {
  return (
    <PreviewPair>
      <UsageMeter
        title="Credits remaining"
        value={500}
        max={1000}
        remainingLabel="of $1,000 this cycle"
        resetLabel="Resets Jul 1"
      />
      <UsageMeter
        title="Payout reserve"
        value={186}
        max={800}
        remainingLabel="of $800 held"
        resetLabel="Clears on payout"
      />
    </PreviewPair>
  );
}
