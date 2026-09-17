"use client";

import * as React from "react";
import { ArrowUpRight, Info } from "lucide-react";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

function TrendCardRoot({
  title,
  value,
  baseline,
  delta,
  tone = "up",
  href,
  data,
  config,
  currentKey = "current",
  compareKey = "previous",
  xDataKey = "day",
  className,
  isLoading,
  reaction,
}: {
  title: string;
  value: string;
  baseline?: string;
  delta?: string;
  tone?: "up" | "down" | "neutral";
  href?: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  currentKey?: string;
  compareKey?: string;
  xDataKey?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
}) {
  const deltaClass =
    tone === "down"
      ? "border-destructive/30 bg-destructive/15 text-destructive"
      : tone === "up"
        ? "border-transparent bg-secondary text-[color:var(--chart-2)]"
        : "border-border text-muted-foreground";

  return (
    <Card className={cn("relative overflow-hidden p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-muted-foreground">{title}</p>
          <span className="text-muted-foreground" title={title}>
            <Info className="size-3.5" aria-hidden />
          </span>
        </div>
        {href ? (
          <Button variant="ghost" size="icon" className="size-7" asChild>
            <a href={href} aria-label={`Open ${title}`}>
              <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <p className="tabular-nums text-3xl font-semibold tracking-tight">{value}</p>
        {delta ? (
          <Badge variant="outline" className={cn("mb-1", deltaClass)}>
            {delta}
          </Badge>
        ) : null}
      </div>
      {baseline ? (
        <p className="mt-1 tabular-nums text-xs text-muted-foreground">{baseline}</p>
      ) : null}

      <ChartContainer
        isLoading={isLoading}
        loadingVariant="bar"
        reaction={reaction}
        config={config}
        data={data}
        className="mt-4 h-24 w-full"
        variant="plain"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              type="monotone"
              dataKey={compareKey}
              stroke={colorVar(compareKey)}
              strokeWidth={2}
              dot={false}
              opacity={0.65}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={currentKey}
              stroke={colorVar(currentKey)}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 0 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{String(data[0]?.[xDataKey] ?? "")}</span>
        <span>Now</span>
      </p>
    </Card>
  );
}

export const TrendCard = Object.assign(TrendCardRoot, {});
