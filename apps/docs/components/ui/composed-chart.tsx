"use client";

import * as React from "react";
import {
  Area,
  Bar,
  ComposedChart as RechartsComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  GradientFill,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type SeriesProps = {
  dataKey: string;
  isClickable?: boolean;
};

function AreaSeries(_props: SeriesProps) {
  return null;
}
function BarSeries(_props: SeriesProps) {
  return null;
}
function LineSeries(_props: SeriesProps) {
  return null;
}

function Grid(props: React.ComponentProps<typeof ChartGrid>) {
  return <ChartGrid {...props} />;
}
Grid.displayName = "CartesianGrid";

function AxisX(props: React.ComponentProps<typeof XAxis>) {
  return <XAxis {...props} />;
}
AxisX.displayName = "XAxis";

function AxisY(props: React.ComponentProps<typeof YAxis>) {
  return <YAxis {...props} />;
}
AxisY.displayName = "YAxis";

function Tooltip(props: React.ComponentProps<typeof ChartTooltip>) {
  return <ChartTooltip {...props} />;
}
Tooltip.displayName = "Tooltip";

function Legend(props: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} />;
}
Legend.displayName = "Legend";

function ChartComposed({
  data,
  config,
  className,
  children,
  isLoading,
  xDataKey = "month",
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  xDataKey?: string;
}) {
  const childArray = React.Children.toArray(children);
  const areas = childArray.filter(
    (child) => React.isValidElement(child) && child.type === AreaSeries
  ) as React.ReactElement<SeriesProps>[];
  const bars = childArray.filter(
    (child) => React.isValidElement(child) && child.type === BarSeries
  ) as React.ReactElement<SeriesProps>[];
  const lines = childArray.filter(
    (child) => React.isValidElement(child) && child.type === LineSeries
  ) as React.ReactElement<SeriesProps>[];
  const extras = childArray.filter(
    (child) =>
      !(
        React.isValidElement(child) &&
        (child.type === AreaSeries ||
          child.type === BarSeries ||
          child.type === LineSeries)
      )
  );

  return (
    <ChartContainer config={config} data={data} className={cn("h-72 w-full", className)}>
      {isLoading ? (
        <div className="h-full w-full animate-pulse rounded-xl bg-muted/40" />
      ) : (
        <ComposedBody
          data={data}
          xDataKey={xDataKey}
          areas={areas}
          bars={bars}
          lines={lines}
          extras={extras}
        />
      )}
    </ChartContainer>
  );
}

function ComposedBody({
  data,
  xDataKey,
  areas,
  bars,
  lines,
  extras,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  areas: React.ReactElement<SeriesProps>[];
  bars: React.ReactElement<SeriesProps>[];
  lines: React.ReactElement<SeriesProps>[];
  extras: React.ReactNode[];
}) {
  const { id, selected, setSelected } = useChart();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((item) => (
            <GradientFill
              key={item.props.dataKey}
              id={`${id}-${item.props.dataKey}-fill`}
              color={colorVar(item.props.dataKey)}
            />
          ))}
        </defs>
        {extras}
        {bars.map((item) => (
          <Bar
            key={item.props.dataKey}
            dataKey={item.props.dataKey}
            fill={colorVar(item.props.dataKey)}
            radius={4}
            opacity={selected && selected !== item.props.dataKey ? 0.25 : 1}
            onClick={() => item.props.isClickable && setSelected(item.props.dataKey)}
          />
        ))}
        {areas.map((item) => (
          <Area
            key={item.props.dataKey}
            type="monotone"
            dataKey={item.props.dataKey}
            stroke={colorVar(item.props.dataKey)}
            fill={`url(#${id}-${item.props.dataKey}-fill)`}
            opacity={selected && selected !== item.props.dataKey ? 0.25 : 1}
          />
        ))}
        {lines.map((item) => (
          <Line
            key={item.props.dataKey}
            type="monotone"
            dataKey={item.props.dataKey}
            stroke={colorVar(item.props.dataKey)}
            strokeWidth={2}
            dot={false}
            opacity={selected && selected !== item.props.dataKey ? 0.25 : 1}
          />
        ))}
        {extras.some(
          (child) => React.isValidElement(child) && child.type === AxisX
        ) ? null : (
          <XAxis
            dataKey={xDataKey}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) =>
              typeof value === "string" ? value.slice(0, 3) : value
            }
          />
        )}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}

export const ComposedChart = Object.assign(ChartComposed, {
  Area: AreaSeries,
  Bar: BarSeries,
  Line: LineSeries,
  Grid,
  XAxis: AxisX,
  YAxis: AxisY,
  Tooltip,
  Legend,
});
