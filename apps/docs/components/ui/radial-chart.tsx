"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  ResponsiveContainer,
  type RadialBarSectorProps,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  GradientFill,
  colorVar,
  pixelPatternId,
  pixelPatternUrl,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { ChartInteractiveSector } from "@/components/ui/pie-chart";
import { cn } from "@/lib/utils";

type RadialSeriesProps = {
  dataKey: string;
  cornerRadius?: number;
  barSize?: number;
  showBackground?: boolean;
  isClickable?: boolean;
};

function RadialSeries(_props: RadialSeriesProps) {
  return null;
}
function Tooltip(props: React.ComponentProps<typeof ChartTooltip>) {
  return <ChartTooltip {...props} />;
}
Tooltip.displayName = "Tooltip";
function Legend(props: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} />;
}
Legend.displayName = "Legend";

function ChartRadial({
  data,
  config,
  nameKey,
  className,
  children,
  isLoading,
  reaction,
  variant = "full",
  innerRadius = 24,
  outerRadius = 120,
  max,
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  nameKey: string;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  variant?: "full" | "semi";
  innerRadius?: number;
  outerRadius?: number;
  max?: number;
}) {
  const childArray = React.Children.toArray(children);
  const series = childArray.find(
    (child) => React.isValidElement(child) && child.type === RadialSeries
  ) as React.ReactElement<RadialSeriesProps> | undefined;
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === RadialSeries)
  );

  return (
    <ChartContainer isLoading={isLoading} loadingVariant="radial" reaction={reaction} config={config} data={data} className={cn("h-72 w-full", className)}>
      <RadialBody
        data={data}
        nameKey={nameKey}
        series={series}
        extras={extras}
        variant={variant}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        max={max}
      />
    </ChartContainer>
  );
}

function RadialBody({
  data,
  nameKey,
  series,
  extras,
  variant,
  innerRadius,
  outerRadius,
  max,
}: {
  data: Record<string, unknown>[];
  nameKey: string;
  series?: React.ReactElement<RadialSeriesProps>;
  extras: React.ReactNode[];
  variant: "full" | "semi";
  innerRadius: number;
  outerRadius: number;
  max?: number;
}) {
  const { id, config, selected, setSelected } = useChart();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const dataKey = series?.props.dataKey ?? "value";
  const colored = data.map((item) => {
    const key = String(item[nameKey]);
    return {
      ...item,
      fill: pixelPatternUrl(id, key),
    };
  });
  const computedMax =
    max ??
    Math.max(
      ...data.map((item) => Number(item[dataKey]) || 0),
      1
    );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadialBarChart
        data={colored}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={variant === "semi" ? 180 : 90}
        endAngle={variant === "semi" ? 0 : -270}
      >
        <defs>
          {data.map((item) => {
            const key = String(item[nameKey]);
            return (
              <GradientFill
                key={key}
                id={pixelPatternId(id, key)}
                color={colorVar(key)}
              />
            );
          })}
        </defs>
        <PolarAngleAxis type="number" domain={[0, computedMax]} tick={false} />
        {extras}
        <RadialBar
          dataKey={dataKey}
          background={
            series?.props.showBackground
              ? { fill: "var(--border)", fillOpacity: 0.45 }
              : undefined
          }
          cornerRadius={series?.props.cornerRadius ?? 8}
          barSize={series?.props.barSize}
          stroke="var(--background)"
          strokeWidth={2}
          isAnimationActive={animationsEnabled && !reducedMotion}
          animationBegin={0}
          animationDuration={600}
          shape={(props: RadialBarSectorProps) => {
            const item = data[props.index];
            const key = String(item?.[nameKey] ?? "");
            const label = config[key]?.label;
            return (
              <ChartInteractiveSector
                geometry={props}
                label={`${typeof label === "string" ? label : key}: ${String(item?.[dataKey] ?? "")}`}
                selected={selected === key}
                muted={Boolean(selected && selected !== key)}
                onActivate={series?.props.isClickable ? () => setSelected(key) : undefined}
              />
            );
          }}
        />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  );
}

export const RadialChart = Object.assign(ChartRadial, {
  RadialBar: RadialSeries,
  Tooltip,
  Legend,
});
