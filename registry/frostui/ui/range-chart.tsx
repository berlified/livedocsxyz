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
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function RangeChartRoot({
  title,
  data,
  config,
  xDataKey = "month",
  className,
  isLoading,
}: {
  title?: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <Card className={cn("p-5", className)}>
      {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
      <ChartContainer
        config={config}
        data={data}
        className={cn("w-full", title ? "mt-3 h-64" : "h-64")}
      >
        {isLoading ? (
          <div className="h-full animate-pulse rounded-lg bg-muted/40" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                dataKey="high"
                stroke="none"
                fill={colorVar("high")}
                fillOpacity={0.18}
              />
              <Area
                type="monotone"
                dataKey="low"
                stroke="none"
                fill="var(--card)"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={colorVar("value")}
                strokeWidth={2.25}
                dot={{ r: 3, fill: colorVar("value"), stroke: "var(--background)", strokeWidth: 2 }}
              />
            </RechartsComposedChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </Card>
  );
}

export const RangeChart = Object.assign(RangeChartRoot, {});
