"use client";

import * as React from "react";
import {
  Area,
  AreaRevealShape,
  type AreaRevealShapeProps,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
import { ChartSkeleton, type ChartReactionOptions } from "@/components/ui/chart-reactions";
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

function MetricChartRoot({
  title,
  value,
  delta,
  tone = "up",
  data,
  config,
  series,
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
  series: Array<{ key: string; label: string }>;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const [active, setActive] = React.useState(series[0]?.key);

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartSkeleton isLoading={isLoading}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[15px] font-medium tracking-tight">{title}</p>
          <div className="mt-1 flex items-center gap-2.5">
            <p className="tabular-nums text-4xl font-medium leading-none tracking-tight">{value}</p>
            {delta ? (
              <Badge
                variant="outline"
                className={
                  tone === "down"
                    ? "border-destructive/30 bg-destructive/15 text-destructive"
                    : "border-transparent bg-secondary text-chart-2"
                }
              >
                {delta}
              </Badge>
            ) : null}
          </div>
        </div>
        <div
          className="inline-flex flex-wrap gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5"
          role="radiogroup"
          aria-label="Series"
        >
          {series.map((item) => {
            const selected = active === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setActive(item.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "bg-accent text-foreground"
                )}
              >
                <PixelSwatch color={colorVar(item.key)} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-72">
        <ChartContainer
          isLoading={isLoading}
          loadingVariant="line"
          reaction={reaction}
          config={config}
          data={data}
          className="h-full w-full"
          variant="plain"
        >
          <MetricBody
            data={data}
            xDataKey={xDataKey}
            series={series}
            active={active}
          />
        </ChartContainer>
      </div>
      </ChartSkeleton>
    </Card>
  );
}

function MetricBody({
  data,
  xDataKey,
  series,
  active,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  series: Array<{ key: string; label: string }>;
  active?: string;
}) {
  const id = React.useId().replace(/:/g, "");
  const last = data[data.length - 1];
  const [hovered, setHovered] = React.useState<string>();
  const interaction = (key: string) => ({
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(undefined),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(undefined),
    tabIndex: 0,
    "aria-label": key,
    className: "transition-opacity duration-150 motion-reduce:transition-none [&_.recharts-curve]:transition-opacity [&_.recharts-curve]:duration-150 motion-reduce:[&_.recharts-curve]:transition-none",
    opacity: hovered ? (hovered === key ? 1 : 0.6) : active && active !== key ? 0.55 : 1,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <defs>
          {series.map((item) => (
            <GradientFill
              key={item.key}
              id={`${id}-${item.key}`}
              color={colorVar(item.key)}
            />
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          tickFormatter={(value: number) =>
            value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value)
          }
        />
        <XAxis
          dataKey={xDataKey}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        {series.map((item) => {
          const muted = Boolean(active && active !== item.key);
          return (
            <Area
              shape={InteractiveAreaShape}
              key={`${item.key}-fill`}
              type="monotone"
              dataKey={item.key}
              stroke="none"
              fill={`url(#${id}-${item.key})`}
              fillOpacity={muted ? 0 : 1}
              pointerEvents={muted ? "none" : undefined}
              {...interaction(item.key)}
              tabIndex={muted ? -1 : 0}
              activeDot={false}
              isAnimationActive={false}
            />
          );
        })}
        {series.map((item) => {
          const muted = Boolean(active && active !== item.key);
          return (
            <Line
              key={`${item.key}-stroke`}
              type="monotone"
              dataKey={item.key}
              stroke={colorVar(item.key)}
              strokeWidth={muted ? 1.5 : 2.5}
              strokeDasharray={muted ? "5 5" : undefined}
              {...interaction(item.key)}
              dot={false}
              activeDot={
                muted
                  ? false
                  : {
                      r: 5,
                      ...interaction(item.key),
                      fill: colorVar(item.key),
                      stroke: "var(--background)",
                      strokeWidth: 2,
                    }
              }
              isAnimationActive={false}
            />
          );
        })}
        {active && last && last[active] != null ? (
          <ReferenceDot
            x={last[xDataKey] as string | number}
            y={Number(last[active])}
            {...interaction(active)}
            r={4.5}
            fill={colorVar(active)}
            stroke="var(--background)"
            strokeWidth={2}
          />
        ) : null}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}

export const MetricChart = Object.assign(MetricChartRoot, {});
