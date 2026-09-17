"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ReferenceDot,
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

function SpotlightChartRoot({
  title,
  value,
  delta,
  tone = "up",
  data,
  config,
  markerIndex,
  markerLabel,
  xDataKey = "day",
  className,
  isLoading,
  reaction,
}: {
  title?: string;
  value?: string;
  delta?: string;
  tone?: "up" | "down";
  data: Record<string, unknown>[];
  config: ChartConfig;
  markerIndex?: number;
  markerLabel?: string;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  const peak =
    markerIndex ??
    data.reduce((best, row, index) => {
      const valueAt = Number(row.current ?? 0);
      const bestValue = Number(data[best]?.current ?? 0);
      return valueAt > bestValue ? index : best;
    }, 0);

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartSkeleton isLoading={isLoading}>
      {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
      {value ? (
        <div className="mt-2 flex items-end gap-2">
          <p className="tabular-nums text-3xl font-semibold tracking-tight">{value}</p>
          {delta ? (
            <Badge
              variant="outline"
              className={
                tone === "down"
                  ? "mb-1 border-destructive/30 bg-destructive/15 text-destructive"
                  : "mb-1 border-transparent bg-secondary text-[color:var(--chart-2)]"
              }
            >
              {delta}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <ChartContainer isLoading={isLoading} loadingVariant="area" reaction={reaction} config={config} data={data} className="mt-4 h-52 w-full" variant="plain">
        <SpotlightBody
          data={data}
          xDataKey={xDataKey}
          peak={peak}
          markerLabel={markerLabel}
        />
      </ChartContainer>
      </ChartSkeleton>
    </Card>
  );
}

function SpotlightBody({
  data,
  xDataKey,
  peak,
  markerLabel,
}: {
  data: Record<string, unknown>[];
  xDataKey: string;
  peak: number;
  markerLabel?: string;
}) {
  const { id } = useChart();
  const peakRow = data[peak];
  const peakX = peakRow?.[xDataKey];
  const peakY = Number(peakRow?.current ?? 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <GradientFill id={pixelPatternId(id, "current")} color={colorVar("current")} />
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
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
        <Area
          type="monotone"
          dataKey="previous"
          stroke={colorVar("previous")}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="current"
          stroke={colorVar("current")}
          fill={pixelPatternUrl(id, "current")}
          fillOpacity={1}
          strokeWidth={2.5}
          isAnimationActive={false}
        />
        {peakRow ? (
          <ReferenceDot
            x={peakX as string | number}
            y={peakY}
            r={5}
            fill={colorVar("current")}
            stroke="var(--background)"
            strokeWidth={2}
            label={
              markerLabel
                ? {
                    value: markerLabel,
                    position: "top",
                    fill: "var(--foreground)",
                    fontSize: 10,
                  }
                : undefined
            }
          />
        ) : null}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export const SpotlightChart = Object.assign(SpotlightChartRoot, {});
