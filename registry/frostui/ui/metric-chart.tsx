"use client";

import * as React from "react";
import {
  Area,
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
import { cn } from "@/lib/utils";

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
}) {
  const [active, setActive] = React.useState(series[0]?.key);

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-center gap-2.5">
            <p className="font-mono text-4xl font-semibold leading-none tracking-tight">{value}</p>
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
          className="inline-flex flex-wrap rounded-none border-2 border-border bg-background p-0.5"
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
                  "flex items-center gap-1.5 rounded-none px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground",
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
          config={config}
          data={data}
          className="h-full w-full"
          variant="plain"
          defaultSelectedDataKey={active}
        >
          {isLoading ? (
            <div className="h-full animate-pulse bg-muted/40" />
          ) : (
            <MetricBody
              data={data}
              xDataKey={xDataKey}
              series={series}
              active={active}
            />
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
  const id = React.useId().replace(/:/g, "");
  const last = data[data.length - 1];

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
          cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
          content={<ChartTooltipContent />}
        />
        {series.map((item) => {
          const muted = Boolean(active && active !== item.key);
          return (
            <Area
              key={`${item.key}-fill`}
              type="monotone"
              dataKey={item.key}
              stroke="none"
              fill={`url(#${id}-${item.key})`}
              fillOpacity={muted ? 0 : 1}
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
              opacity={muted ? 0.55 : 1}
              dot={false}
              activeDot={
                muted
                  ? false
                  : {
                      r: 5,
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
