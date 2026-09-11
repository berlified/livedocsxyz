"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
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
    <ChartContainer config={config} data={data} className={cn("h-72 w-full", className)}>
      {isLoading ? (
        <div className="mx-auto size-48 animate-pulse rounded-full bg-muted/40" />
      ) : (
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
      )}
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
  const { selected, setSelected } = useChart();
  const dataKey = series?.props.dataKey ?? "value";
  const colored = data.map((item) => ({
    ...item,
    fill: colorVar(String(item[nameKey])),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadialBarChart
        data={colored}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={variant === "semi" ? 180 : 90}
        endAngle={variant === "semi" ? 0 : -270}
      >
        <PolarAngleAxis type="number" domain={[0, max ?? 100]} tick={false} />
        {extras}
        <RadialBar
          dataKey={dataKey}
          background={series?.props.showBackground ? { fill: "var(--muted)" } : undefined}
          cornerRadius={series?.props.cornerRadius ?? 6}
          onClick={(entry: Record<string, unknown>) => {
            const key = String(entry?.[nameKey] ?? "");
            if (series?.props.isClickable && key) setSelected(key);
          }}
          style={selected ? { opacity: 0.9 } : undefined}
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
