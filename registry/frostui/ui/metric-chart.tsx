"use client";

import * as React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  GradientFill,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function MetricChartRoot({
  title,
  value,
  data,
  config,
  series,
  xDataKey = "month",
  className,
  isLoading,
}: {
  title: string;
  value: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  series: Array<{ key: string; label: string }>;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
}) {
  const [active, setActive] = React.useState(series[0]?.key);

  return (
    <Card className={cn("p-5", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 font-mono text-4xl font-semibold tracking-tight">{value}</p>
      <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Series">
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
                "flex items-center gap-2 text-xs text-muted-foreground",
                selected && "text-foreground"
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full border border-border",
                  selected && "border-transparent"
                )}
                style={{ background: selected ? colorVar(item.key) : "transparent" }}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 h-72 overflow-hidden rounded-xl bg-background">
        <ChartContainer
          key={active}
          config={config}
          data={data}
          className="h-full w-full p-2"
          defaultSelectedDataKey={active}
        >
        {isLoading ? (
          <div className="h-full animate-pulse rounded-lg bg-muted/40" />
        ) : (
          <MetricBody data={data} xDataKey={xDataKey} series={series} active={active} />
        )}
        </ChartContainer>
      </div>
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
  const { useId } = React;
  const id = useId().replace(/:/g, "");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
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
        />
        <XAxis
          dataKey={xDataKey}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
          content={<ChartTooltipContent />}
        />
        {series.map((item) => {
          const muted = active && active !== item.key;
          return (
            <Area
              key={`${item.key}-fill`}
              type="monotone"
              dataKey={item.key}
              stroke="none"
              fill={`url(#${id}-${item.key})`}
              fillOpacity={muted ? 0.08 : 0.9}
            />
          );
        })}
        {series.map((item) => {
          const muted = active && active !== item.key;
          return (
            <Line
              key={`${item.key}-stroke`}
              type="monotone"
              dataKey={item.key}
              stroke={colorVar(item.key)}
              strokeWidth={muted ? 1.5 : 2.5}
              opacity={muted ? 0.35 : 1}
              dot={
                muted
                  ? false
                  : { r: 3.5, fill: colorVar(item.key), stroke: "var(--background)", strokeWidth: 2 }
              }
            />
          );
        })}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}

export const MetricChart = Object.assign(MetricChartRoot, {});
