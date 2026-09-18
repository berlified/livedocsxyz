"use client";

import * as React from "react";
import {
  Area,
  AreaRevealShape,
  type AreaRevealShapeProps,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  GradientFill,
  PixelSwatch,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
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

function ComparisonChartRoot({
  title,
  value,
  delta,
  tone = "up",
  data,
  config,
  primaryKey = "thisYear",
  compareKey = "lastYear",
  xDataKey = "month",
  className,
  isLoading,
  reaction,
}: {
  title: string;
  value: string;
  delta?: string;
  tone?: "up" | "down";
  data: Record<string, unknown>[];
  config: ChartConfig;
  primaryKey?: string;
  compareKey?: string;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartSkeleton isLoading={isLoading}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="tabular-nums text-3xl font-semibold tracking-tight">{value}</p>
            {delta ? (
              <Badge
                variant="outline"
                className={
                  tone === "down"
                    ? "border-destructive/30 bg-destructive/15 text-destructive"
                    : "border-transparent bg-secondary text-[color:var(--chart-2)]"
                }
              >
                {delta}
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <PixelSwatch color={colorVar(primaryKey)} />
            {config[primaryKey]?.label ?? primaryKey}
          </span>
          <span className="flex items-center gap-1.5">
            <PixelSwatch color={colorVar(compareKey)} />
            {config[compareKey]?.label ?? compareKey}
          </span>
        </div>
      </div>

      <ChartContainer isLoading={isLoading} loadingVariant="line" reaction={reaction} config={config} data={data} className="mt-4 h-44 w-full" variant="plain">
        <ComparisonBody
          data={data}
          xDataKey={xDataKey}
          primaryKey={primaryKey}
          compareKey={compareKey}
        />
      </ChartContainer>
      </ChartSkeleton>
    </Card>
  );
}

function ComparisonBody({
  data,
  xDataKey,
  primaryKey,
  compareKey,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  primaryKey: string;
  compareKey: string;
}) {
  const id = React.useId().replace(/:/g, "");
  const [hovered, setHovered] = React.useState<string>();
  const interaction = (key: string) => ({
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(undefined),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(undefined),
    tabIndex: 0,
    "aria-label": key,
    className: "transition-opacity duration-150 motion-reduce:transition-none [&_.recharts-curve]:transition-opacity [&_.recharts-curve]:duration-150 motion-reduce:[&_.recharts-curve]:transition-none",
    opacity: hovered && hovered !== key ? 0.6 : 1,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <GradientFill id={`${id}-${primaryKey}`} color={colorVar(primaryKey)} />
          <GradientFill id={`${id}-${compareKey}`} color={colorVar(compareKey)} />
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
          dataKey={compareKey}
          {...interaction(compareKey)}
          activeDot={{ ...interaction(compareKey), r: 4 }}
          stroke={colorVar(compareKey)}
          fill={`url(#${id}-${compareKey})`}
          fillOpacity={1}
          strokeWidth={1.5}
        />
        <Area
          shape={InteractiveAreaShape}
          type="monotone"
          dataKey={primaryKey}
          {...interaction(primaryKey)}
          activeDot={{ ...interaction(primaryKey), r: 4 }}
          stroke={colorVar(primaryKey)}
          fill={`url(#${id}-${primaryKey})`}
          fillOpacity={1}
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export const ComparisonChart = Object.assign(ComparisonChartRoot, {});
