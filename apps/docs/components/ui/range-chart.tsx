"use client";

import * as React from "react";
import {
  Area,
  AreaRevealShape,
  type AreaRevealShapeProps,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  GradientFill,
  colorVar,
  pixelPatternId,
  pixelPatternUrl,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/chart-reactions";
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

function RangeChartRoot({
  title,
  data,
  config,
  xDataKey = "month",
  className,
  isLoading,
  reaction,
}: {
  title?: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartSkeleton isLoading={isLoading}>
      {title ? <p className="text-[15px] font-medium tracking-tight">{title}</p> : null}
      <ChartContainer
        isLoading={isLoading}
        loadingVariant="range"
        reaction={reaction}
        config={config}
        data={data}
        className={cn("w-full", title ? "mt-3 h-64" : "h-64")}
        variant="plain"
      >
        <RangeBody data={data} xDataKey={xDataKey} />
      </ChartContainer>
      </ChartSkeleton>
    </Card>
  );
}

function RangeBody({
  data,
  xDataKey,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
}) {
  const { id } = useChart();
  const [hovered, setHovered] = React.useState<string>();
  const interaction = (key: string) => ({
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(undefined),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(undefined),
    tabIndex: 0,
    "aria-label": key === "high" ? "Forecast range" : "Actual",
    className: "transition-opacity duration-150 motion-reduce:transition-none [&_.recharts-curve]:transition-opacity [&_.recharts-curve]:duration-150 motion-reduce:[&_.recharts-curve]:transition-none",
    opacity: hovered && hovered !== key ? 0.6 : 1,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <GradientFill id={pixelPatternId(id, "high")} color={colorVar("high")} />
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey={xDataKey}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Area
          shape={InteractiveAreaShape}
          type="monotone"
          dataKey="high"
          {...interaction("high")}
          activeDot={{ r: 4, ...interaction("high") }}
          stroke="none"
          fill={pixelPatternUrl(id, "high")}
          fillOpacity={1}
        />
        <Area
          shape={InteractiveAreaShape}
          type="monotone"
          dataKey="low"
          activeDot={false}
          stroke="none"
          fill="var(--card)"
          fillOpacity={1}
        />
        <Line
          type="monotone"
          dataKey="value"
          {...interaction("value")}
          activeDot={{ r: 4, ...interaction("value") }}
          stroke={colorVar("value")}
          strokeWidth={2.25}
          dot={{ r: 3, fill: colorVar("value"), stroke: "var(--background)", strokeWidth: 2, ...interaction("value") }}
        />
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}

export const RangeChart = Object.assign(RangeChartRoot, {});
