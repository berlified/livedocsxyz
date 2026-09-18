"use client";

import * as React from "react";
import {
  Area,
  AreaRevealShape,
  type AreaRevealShapeProps,
  Bar,
  Cell,
  ComposedChart as RechartsComposedChart,
  Line,
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

type SeriesProps = {
  dataKey: string;
  isClickable?: boolean;
};

function AreaSeries(_props: SeriesProps) {
  return null;
}
type BarSeriesProps = SeriesProps & {
  maxBarSize?: number;
};

function BarSeries(_props: BarSeriesProps) {
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
  reaction,
  xDataKey = "month",
  height = 288,
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
  xDataKey?: string;
  height?: number;
  title?: string;
  value?: string;
  description?: string;
}) {
  const childArray = React.Children.toArray(children);
  const areas = childArray.filter(
    (child) => React.isValidElement(child) && child.type === AreaSeries
  ) as React.ReactElement<SeriesProps>[];
  const bars = childArray.filter(
    (child) => React.isValidElement(child) && child.type === BarSeries
  ) as React.ReactElement<BarSeriesProps>[];
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
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="bar"
      reaction={reaction}
      config={config}
      data={data}
      className={cn("w-full", className)}
      style={{ height }}
    >
      <ChartHeading title={title} value={value} description={description} />
      <div className="min-h-0 w-full flex-1">
        <ComposedBody
          data={data}
          xDataKey={xDataKey}
          areas={areas}
          bars={bars}
          lines={lines}
          extras={extras}
        />
      </div>
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
  bars: React.ReactElement<BarSeriesProps>[];
  lines: React.ReactElement<SeriesProps>[];
  extras: React.ReactNode[];
}) {
  const { id, selected, setSelected } = useChart();
  const [hovered, setHovered] = React.useState<{ key: string; index?: number }>();
  const opacity = (key: string, index?: number) =>
    hovered ? (hovered.key === key && hovered.index === index ? 1 : 0.6) : selected && selected !== key ? 0.25 : 1;
  const interaction = (key: string, index?: number) => ({
    onMouseEnter: () => setHovered({ key, index }),
    onMouseLeave: () => setHovered(undefined),
    onFocus: () => setHovered({ key, index }),
    onBlur: () => setHovered(undefined),
    tabIndex: 0,
    "aria-label": index === undefined ? key : `${data[index]?.[xDataKey]}: ${key} ${data[index]?.[key]}`,
    className: "transition-opacity duration-150 motion-reduce:transition-none [&_.recharts-curve]:transition-opacity [&_.recharts-curve]:duration-150 motion-reduce:[&_.recharts-curve]:transition-none",
    opacity: opacity(key, index),
  });
  const backdrop = extras.filter(
    (child) =>
      !(
        React.isValidElement(child) &&
        (child.type === Tooltip || child.type === Legend)
      )
  );
  const overlays = extras.filter(
    (child) =>
      React.isValidElement(child) &&
      (child.type === Tooltip || child.type === Legend)
  );
  const hasXAxis = extras.some(
    (child) => React.isValidElement(child) && child.type === AxisX
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {[
            ...new Set(
              [...areas, ...bars].map((item) => item.props.dataKey)
            ),
          ].map((key) => (
            <GradientFill
              key={key}
              id={`${id}-${key}-fill`}
              color={colorVar(key)}
            />
          ))}
        </defs>
        {backdrop}
        {areas.map((item) => (
          <Area
            shape={InteractiveAreaShape}
            key={`${item.props.dataKey}-area`}
            zIndex={100}
            type="monotone"
            dataKey={item.props.dataKey}
            stroke={colorVar(item.props.dataKey)}
            fill={`url(#${id}-${item.props.dataKey}-fill)`}
            fillOpacity={1}
            activeDot={{ r: 4, ...interaction(item.props.dataKey) }}
            isAnimationActive={false}
            {...interaction(item.props.dataKey)}
          />
        ))}
        {bars.map((item) => (
          <Bar
            key={`${item.props.dataKey}-bar`}
            zIndex={200}
            dataKey={item.props.dataKey}
            fill={colorVar(item.props.dataKey)}
            radius={[4, 4, 0, 0]}
            maxBarSize={item.props.maxBarSize ?? 42}
            activeBar={false}
            isAnimationActive={false}
            onClick={() => item.props.isClickable && setSelected(item.props.dataKey)}
            cursor={item.props.isClickable ? "pointer" : undefined}
          >
            {data.map((_, index) => (
              <Cell key={index} {...interaction(item.props.dataKey, index)} />
            ))}
          </Bar>
        ))}
        {lines.map((item) => (
          <Line
            key={`${item.props.dataKey}-line`}
            zIndex={300}
            type="monotone"
            dataKey={item.props.dataKey}
            stroke={colorVar(item.props.dataKey)}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 4,
              fill: colorVar(item.props.dataKey),
              ...interaction(item.props.dataKey),
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
            {...interaction(item.props.dataKey)}
            isAnimationActive={false}
          />
        ))}
        {hasXAxis ? null : (
          <XAxis
            dataKey={xDataKey}
            tickLine={false}
            axisLine={false}
             tickFormatter={(value: string) =>
               xDataKey === "month" && typeof value === "string" ? value.slice(0, 3) : value
             }
          />
        )}
        {overlays}
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
