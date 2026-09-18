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
  ChartHeading,
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
  variant,
  title,
  value,
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
  variant?: "panel" | "plain";
  title?: string;
  value?: string;
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
      variant={variant}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <ChartHeading title={title} value={value} />
      <div className="min-h-0 w-full flex-1">
        <LineBody
          data={data}
          xDataKey={xDataKey}
          series={series}
          extras={extras}
        />
      </div>
    </ChartContainer>
  );
}

function LineBody({
  data,
  xDataKey,
  series,
  extras,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: React.ReactElement<LineSeriesProps>[];
  extras: React.ReactNode[];
}) {
  const { selected, setSelected } = useChart();
  const [hovered, setHovered] = React.useState<string>();  const interaction = (key: string) => ({
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(undefined),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(undefined),
    tabIndex: 0,
    "aria-label": key,
    className: "transition-opacity duration-150 motion-reduce:transition-none [&_.recharts-curve]:transition-opacity [&_.recharts-curve]:duration-150 motion-reduce:[&_.recharts-curve]:transition-none",
  });

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
              {...interaction(dataKey)}
              dot={dot ? { r: 3, fill: colorVar(dataKey), ...interaction(dataKey) } : false}
              activeDot={{ r: 4, fill: colorVar(dataKey), ...interaction(dataKey), opacity: hovered ? (hovered === dataKey ? 1 : 0.6) : muted ? 0.2 : 1 }}
              opacity={hovered ? (hovered === dataKey ? 1 : 0.6) : muted ? 0.2 : 1}
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
