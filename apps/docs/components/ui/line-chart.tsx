"use client";

import * as React from "react";
import {
  Brush,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

type StrokeVariant = "solid" | "dashed";
type CurveType = "monotone" | "linear" | "step" | "bump" | "monotoneY";

type LineSeriesProps = {
  dataKey: string;
  strokeVariant?: StrokeVariant;
  strokeWidth?: number;
  curveType?: CurveType;
  isClickable?: boolean;
  isGlowing?: boolean;
  connectNulls?: boolean;
  dot?: boolean;
};

function LineSeries(_props: LineSeriesProps) {
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

function ChartBrush(props: React.ComponentProps<typeof Brush>) {
  return <Brush {...props} />;
}
ChartBrush.displayName = "Brush";

function ChartLine({
  data,
  config,
  className,
  children,
  isLoading,
  reaction,
  defaultSelectedDataKey,
  onSelectionChange,
  xDataKey = "month",
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
  xDataKey?: string;
}) {
  const childArray = React.Children.toArray(children);
  const series = childArray.filter(
    (child) => React.isValidElement(child) && child.type === LineSeries
  ) as React.ReactElement<LineSeriesProps>[];
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === LineSeries)
  );

  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="line"
      reaction={reaction}
      config={config}
      data={data}
      className={cn("h-72 w-full", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <LineBody
        data={data}
        xDataKey={xDataKey}
        series={series}
        extras={extras}
        isLoading={isLoading}
      />
    </ChartContainer>
  );
}

function LineBody({
  data,
  xDataKey,
  series,
  extras,
  isLoading,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: React.ReactElement<LineSeriesProps>[];
  extras: React.ReactNode[];
  isLoading?: boolean;
}) {
  const { selected, setSelected } = useChart();

  if (isLoading) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        {extras}
        {series.map((item) => {
          const {
            dataKey,
            strokeVariant = "solid",
            strokeWidth = 2,
            curveType = "monotone",
            isClickable,
            connectNulls,
            dot = false,
          } = item.props;
          const muted = selected && selected !== dataKey;
          return (
            <Line
              key={dataKey}
              type={curveType}
              dataKey={dataKey}
              stroke={colorVar(dataKey)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeVariant === "dashed" ? "6 4" : undefined}
              connectNulls={connectNulls}
              dot={dot ? { r: 3, fill: colorVar(dataKey) } : false}
              activeDot={{ r: 4, fill: colorVar(dataKey) }}
              opacity={muted ? 0.2 : 1}
              onClick={() => isClickable && setSelected(dataKey)}
              cursor={isClickable ? "pointer" : undefined}
            />
          );
        })}
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
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export const LineChart = Object.assign(ChartLine, {
  Line: LineSeries,
  Grid,
  XAxis: AxisX,
  YAxis: AxisY,
  Tooltip,
  Legend,
  Brush: ChartBrush,
});
