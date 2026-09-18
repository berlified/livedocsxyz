"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  ChartContainer,
  ChartHeading,
  ChartTooltip,
  colorVar,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type ActivityDatum = { label: string; value: number };

const defaultConfig = { value: { label: "Value", color: "var(--chart-2)" } } satisfies ChartConfig;

function ActivityChartRoot({
  title,
  value,
  data,
  config = defaultConfig,
  className,
  isLoading,
  reaction,
  onBarClick,
}: {
  title: string;
  value: string;
  data: ActivityDatum[];
  config?: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  onBarClick?: (datum: ActivityDatum, index: number) => void;
}) {
  const [hovered, setHovered] = React.useState<number>();
  const [focused, setFocused] = React.useState<number>();
  const active = hovered ?? focused;

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartContainer
        isLoading={isLoading}
        loadingVariant="bar"
        reaction={reaction}
        config={{ ...defaultConfig, ...config }}
        data={data}
        variant="plain"
        className="w-full justify-start"
      >
        <ChartHeading title={title} value={value} />
        <div className="mt-3 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} barCategoryGap="28%" margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <ChartTooltip />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={44}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]} maxBarSize={10} isAnimationActive={false}>
                {data.map((datum, index) => (
                  <Cell
                    key={datum.label}
                    fill={colorVar("value")}
                    opacity={active !== undefined && active !== index ? 0.6 : 1}
                    tabIndex={0}
                    role={onBarClick ? "button" : "img"}
                    aria-label={`${datum.label}: ${datum.value.toLocaleString("en-US")}`}
                    className="cursor-pointer transition-opacity duration-150 motion-reduce:transition-none focus-visible:outline-none"
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(undefined)}
                    onFocus={() => setFocused(index)}
                    onBlur={() => setFocused(undefined)}
                    onClick={() => onBarClick?.(datum, index)}
                    onKeyDown={(event) => {
                      if (onBarClick && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        onBarClick(datum, index);
                      }
                    }}
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </Card>
  );
}

export const ActivityChart = Object.assign(ActivityChartRoot, {});
