"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Brush,
  Cell,
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
  GradientFill,
  HatchPattern,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

type BarVariant =
  | "default"
  | "hatched"
  | "gradient"
  | "duotone"
  | "stripped";

type BarSeriesProps = {
  dataKey: string;
  variant?: BarVariant;
  isClickable?: boolean;
  isGlowing?: boolean;
  stackId?: string;
  radius?: number;
};

function BarSeries(_props: BarSeriesProps) {
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

function ChartBar({
  data,
  config,
  className,
  children,
  isLoading,
  reaction,
  defaultSelectedDataKey,
  onSelectionChange,
  xDataKey = "month",
  layout = "horizontal",
  stackType,
  variant,
  title,
  value,
  description,
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
  layout?: "horizontal" | "vertical";
  stackType?: "none" | "stacked" | "percent";
  variant?: "panel" | "plain";
  title?: string;
  value?: string;
  description?: string;
}) {
  const childArray = React.Children.toArray(children);
  const series = childArray.filter(
    (child) => React.isValidElement(child) && child.type === BarSeries
  ) as React.ReactElement<BarSeriesProps>[];
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === BarSeries)
  );

  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="bar"
      reaction={reaction}
      config={config}
      data={data}
      className={cn("h-72 w-full", className)}
      variant={variant}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <ChartHeading title={title} value={value} description={description} />
      <div className="min-h-0 w-full flex-1">
        <BarBody
          data={data}
          xDataKey={xDataKey}
          series={series}
          extras={extras}
          layout={layout}
          stackType={stackType}
        />
      </div>
    </ChartContainer>
  );
}

function BarBody({
  data,
  xDataKey,
  series,
  extras,
  layout,
  stackType,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: React.ReactElement<BarSeriesProps>[];
  extras: React.ReactNode[];
  layout: "horizontal" | "vertical";
  stackType?: "none" | "stacked" | "percent";
}) {
  const { id, selected, setSelected } = useChart();
  const [hovered, setHovered] = React.useState<{ key: string; index: number }>();

  const stacked = stackType === "stacked" || stackType === "percent";
  const vertical = layout === "vertical";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout={vertical ? "vertical" : "horizontal"}
        stackOffset={stackType === "percent" ? "expand" : undefined}
        barCategoryGap="30%"
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          {series.map((item) => {
            const key = item.props.dataKey;
            const color = colorVar(key);
            return (
              <React.Fragment key={key}>
                <GradientFill id={`${id}-${key}-fill`} color={color} startOpacity={0.85} endOpacity={0.4} />
                <HatchPattern id={`${id}-${key}-hatch`} color={color} />
                <linearGradient id={`${id}-${key}-duo`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.35} />
                </linearGradient>
                <pattern
                  id={`${id}-${key}-strip`}
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="8" height="8" fill={color} opacity="0.25" />
                  <rect width="4" height="8" fill={color} />
                </pattern>
              </React.Fragment>
            );
          })}
        </defs>
        {extras}
        {series.map((item) => {
          const {
            dataKey,
            variant = "default",
            isClickable,
            stackId,
            radius = 4,
          } = item.props;
          const muted = selected && selected !== dataKey;
          const fill =
            variant === "hatched"
              ? `url(#${id}-${dataKey}-hatch)`
              : variant === "stripped"
                ? `url(#${id}-${dataKey}-strip)`
                : variant === "duotone"
                  ? `url(#${id}-${dataKey}-duo)`
                  : variant === "gradient"
                    ? `url(#${id}-${dataKey}-fill)`
                    : colorVar(dataKey);
          return (
            <Bar
              key={dataKey}
              dataKey={dataKey}
              fill={fill}
              radius={radius}
              maxBarSize={28}
              stackId={stacked ? stackId ?? "stack" : stackId}
              activeBar={false}
              onClick={() => isClickable && setSelected(dataKey)}
              cursor={isClickable ? "pointer" : undefined}
            >
              {data.map((row, index) => (
                <Cell
                  key={index}
                  opacity={hovered ? (hovered.key === dataKey && hovered.index === index ? 1 : 0.6) : muted ? 0.25 : 1}
                  onMouseEnter={() => setHovered({ key: dataKey, index })}
                  onMouseLeave={() => setHovered(undefined)}
                  onFocus={() => setHovered({ key: dataKey, index })}
                  onBlur={() => setHovered(undefined)}
                  tabIndex={0}
                  aria-label={`${row[xDataKey]}: ${dataKey} ${row[dataKey]}`}
                  className="transition-opacity duration-150 motion-reduce:transition-none"
                />
              ))}
            </Bar>
          );
        })}
        {extras.some(
          (child) => React.isValidElement(child) && child.type === AxisX
        ) ? null : vertical ? (
          <YAxis
            dataKey={xDataKey}
            type="category"
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value: string) =>
              typeof value === "string" ? value.slice(0, 3) : value
            }
          />
        ) : (
          <XAxis
            dataKey={xDataKey}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: string) =>
              typeof value === "string" ? value.slice(0, 3) : value
            }
          />
        )}
        {vertical ? <XAxis type="number" hide /> : null}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export const BarChart = Object.assign(ChartBar, {
  Bar: BarSeries,
  Grid,
  XAxis: AxisX,
  YAxis: AxisY,
  Tooltip,
  Legend,
  Brush: ChartBrush,
});
