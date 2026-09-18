"use client";

import * as React from "react";
import {
  Area,
  AreaRevealShape,
  type AreaRevealShapeProps,
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
import { type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

function InteractiveAreaShape({ onMouseEnter, onMouseLeave, onFocus, onBlur, onClick, ...props }: AreaRevealShapeProps) {
  return (
    <g
      onMouseEnter={onMouseEnter as unknown as React.MouseEventHandler<SVGGElement>}
      onMouseLeave={onMouseLeave as unknown as React.MouseEventHandler<SVGGElement>}
      onFocus={onFocus as unknown as React.FocusEventHandler<SVGGElement>}
      onBlur={onBlur as unknown as React.FocusEventHandler<SVGGElement>}
      onClick={onClick as unknown as React.MouseEventHandler<SVGGElement>}
    >
      <AreaRevealShape {...props} />
    </g>
  );
}

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
    (child) => React.isValidElement(child) && child.type === AreaSeries
  ) as React.ReactElement<AreaSeriesProps>[];
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === AreaSeries)
  );

  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="area"
      reaction={reaction}
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
      />
    </ChartContainer>
  );
}

function AreaBody({
  data,
  xDataKey,
  series,
  extras,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: React.ReactElement<AreaSeriesProps>[];
  extras: React.ReactNode[];
}) {
  const { id, selected, setSelected } = useChart();
  const [hovered, setHovered] = React.useState<string>();
  const interaction = (key: string) => ({
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
              shape={InteractiveAreaShape}
              key={dataKey}
              type={curveType ?? type ?? "monotone"}
              dataKey={dataKey}
              stroke={colorVar(dataKey)}
              fill={fill}
              fillOpacity={variant === "default" ? 0.5 : 1}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeVariant === "dashed" ? "6 4" : undefined}
              connectNulls={connectNulls}
              {...interaction(dataKey)}
              opacity={hovered ? (hovered === dataKey ? 1 : 0.6) : muted ? 0.2 : 1}
              onClick={() => isClickable && setSelected(dataKey)}
              cursor={isClickable ? "pointer" : undefined}
              activeDot={{ r: 4, strokeWidth: 2, fill: "var(--background)", ...interaction(dataKey), opacity: hovered ? (hovered === dataKey ? 1 : 0.6) : muted ? 0.2 : 1 }}
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
