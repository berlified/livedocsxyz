"use client";

import * as React from "react";
import {
  Area,
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
import { cn } from "@/lib/utils";

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
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
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

      <ChartContainer isLoading={isLoading} reaction={reaction} config={config} data={data} className="mt-4 h-44 w-full" variant="plain">
        {isLoading ? null : (
          <ComparisonBody
            data={data}
            xDataKey={xDataKey}
            primaryKey={primaryKey}
            compareKey={compareKey}
          />
        )}
      </ChartContainer>
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
          cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
          content={<ChartTooltipContent />}
        />
        <Area
          type="monotone"
          dataKey={compareKey}
          stroke={colorVar(compareKey)}
          fill={`url(#${id}-${compareKey})`}
          strokeWidth={1.5}
        />
        <Area
          type="monotone"
          dataKey={primaryKey}
          stroke={colorVar(primaryKey)}
          fill={`url(#${id}-${primaryKey})`}
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export const ComparisonChart = Object.assign(ComparisonChartRoot, {});
