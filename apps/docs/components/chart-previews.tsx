"use client";

import { AreaChart } from "@/components/ui/area-chart";
import { BarChart } from "@/components/ui/bar-chart";
import {
  monthlyData,
  radarConfig,
  radarData,
  radialData,
  sankeyConfig,
  sankeyLinks,
  sankeyNodes,
  shareConfig,
  shareData,
  trafficConfig,
} from "@/components/ui/chart";
import { ComposedChart } from "@/components/ui/composed-chart";
import { LineChart } from "@/components/ui/line-chart";
import { PieChart } from "@/components/ui/pie-chart";
import { RadarChart } from "@/components/ui/radar-chart";
import { RadialChart } from "@/components/ui/radial-chart";
import { SankeyChart } from "@/components/ui/sankey-chart";
import { Sparkline } from "@/components/ui/sparkline";

import { ComponentPreview } from "@/components/component-preview";

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
  return <Sparkline className="w-full" />;
}

export function SparklineExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Marker</h2>
      <ComponentPreview label="Custom label" className="p-0">
        <Sparkline markerLabel="$12,480" markerIndex={18} />
      </ComponentPreview>
    </section>
  );
}
