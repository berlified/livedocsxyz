"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Brush,
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
  HatchPattern,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type AreaVariant = "default" | "gradient" | "hatched";
type StrokeVariant = "solid" | "dashed";
type CurveType = "monotone" | "linear" | "step" | "bump" | "monotoneY";

type AreaSeriesProps = {
  dataKey: string;
  variant?: AreaVariant;
  strokeVariant?: StrokeVariant;
  strokeWidth?: number;
  curveType?: CurveType;
  isClickable?: boolean;
  isGlowing?: boolean;
  connectNulls?: boolean;
  type?: CurveType;
};

function AreaSeries(_props: AreaSeriesProps) {
  return null;
}

function Grid(props: React.ComponentProps<typeof ChartGrid>) {
  return <ChartGrid {...props} />;
}
Grid.displayName = "CartesianGrid";

function AxisX(
  props: React.ComponentProps<typeof XAxis> & { dataKey?: string }
) {
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

function ChartArea({
  data,
  config,
  className,
  children,
  isLoading,
  defaultSelectedDataKey,
  onSelectionChange,
  xDataKey = "month",
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
  xDataKey?: string;
}) {
  const childArray = React.Children.toArray(children);
  const series = childArray.filter(
    (child) => React.isValidElement(child) && child.type === AreaSeries
  ) as React.ReactElement<AreaSeriesProps>[];
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === AreaSeries)
  );

  return (
    <ChartContainer
      config={config}
      data={data}
      className={cn("h-72 w-full", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <AreaBody
        data={data}
        xDataKey={xDataKey}
        series={series}
        extras={extras}
        isLoading={isLoading}
      />
    </ChartContainer>
  );
}

function AreaBody({
  data,
  xDataKey,
  series,
  extras,
  isLoading,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: React.ReactElement<AreaSeriesProps>[];
  extras: React.ReactNode[];
  isLoading?: boolean;
}) {
  const { id, selected, setSelected } = useChart();

  if (isLoading) {
    return (
      <div className="h-full w-full animate-pulse bg-muted/40" />
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map((item) => {
            const key = item.props.dataKey;
            const color = colorVar(key);
            return (
              <React.Fragment key={key}>
                <GradientFill id={`${id}-${key}-fill`} color={color} />
                <HatchPattern id={`${id}-${key}-hatch`} color={color} />
              </React.Fragment>
            );
          })}
        </defs>
        {extras}
        {series.map((item) => {
          const {
            dataKey,
            variant = "gradient",
            strokeVariant = "solid",
            strokeWidth = 2,
            curveType,
            type,
            isClickable,
            connectNulls,
          } = item.props;
          const muted = selected && selected !== dataKey;
          const fill =
            variant === "hatched"
              ? `url(#${id}-${dataKey}-hatch)`
              : variant === "default"
                ? colorVar(dataKey)
                : `url(#${id}-${dataKey}-fill)`;
          return (
            <Area
              key={dataKey}
              type={curveType ?? type ?? "monotone"}
              dataKey={dataKey}
              stroke={colorVar(dataKey)}
              fill={fill}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeVariant === "dashed" ? "6 4" : undefined}
              connectNulls={connectNulls}
              opacity={muted ? 0.2 : 1}
              onClick={() => isClickable && setSelected(dataKey)}
              cursor={isClickable ? "pointer" : undefined}
              activeDot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
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
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export const AreaChart = Object.assign(ChartArea, {
  Area: AreaSeries,
  Grid,
  XAxis: AxisX,
  YAxis: AxisY,
  Tooltip,
  Legend,
  Brush: ChartBrush,
});
