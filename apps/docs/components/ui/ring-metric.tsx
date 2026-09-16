"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, type PieSectorShapeProps } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  GradientFill,
  PixelSwatch,
  colorVar,
  pixelPatternId,
  pixelPatternUrl,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { ChartInteractiveSector } from "@/components/ui/pie-chart";
import { useChartReducedMotion, useChartReactions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type RingSlice = { key: string; label: string; value: number };

function RingMetricRoot({
  title,
  centerLabel,
  data,
  config,
  className,
  isLoading,
  reaction,
}: {
  title?: string;
  centerLabel?: string;
  data: RingSlice[];
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={cn("p-5", className)}>
      {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
      <ChartContainer
        isLoading={isLoading}
        reaction={reaction}
        config={config}
        data={data as unknown as Record<string, unknown>[]}
        className="mt-2 h-64 w-full justify-center"
        variant="plain"
      >
        <RingBody data={data} total={total} centerLabel={centerLabel} />
      </ChartContainer>
    </Card>
  );
}

function RingBody({
  data,
  total,
  centerLabel,
}: {
  data: RingSlice[];
  total: number;
  centerLabel?: string;
}) {
  const { id, selected, setSelected } = useChart();
  const [focused, setFocused] = React.useState<string>();
  const [hovered, setHovered] = React.useState<string>();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();

  return (
    <div className="grid h-full items-center gap-4 sm:grid-cols-[1fr_8rem]">
      <div className="relative h-full min-h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <defs>
              {data.map((item) => (
                <GradientFill
                  key={item.key}
                  id={pixelPatternId(id, item.key)}
                  color={colorVar(item.key)}
                />
              ))}
            </defs>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              cornerRadius={0}
              stroke="var(--background)"
              rootTabIndex={-1}
              isAnimationActive={animationsEnabled && !reducedMotion}
              animationBegin={0}
              animationDuration={600}
              shape={(props: PieSectorShapeProps) => {
                const item = data[props.index];
                if (!item) return <g />;
                return (
                  <ChartInteractiveSector
                    geometry={props}
                    label={`${item.label}: ${item.value.toLocaleString("en-US")}`}
                    selected={selected === item.key}
                    muted={Boolean(selected && selected !== item.key)}
                    emphasized={focused === item.key || hovered === item.key}
                    onActivate={() => setSelected(item.key)}
                  />
                );
              }}
            >
              {data.map((item) => (
                <Cell
                  key={item.key}
                  fill={pixelPatternUrl(id, item.key)}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="tabular-nums text-2xl font-semibold tracking-tight">
            {total.toLocaleString("en-US")}
          </p>
          {centerLabel ? (
            <p className="text-xs text-muted-foreground">
              {centerLabel}
            </p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((item) => {
          const share = total ? (item.value / total) * 100 : 0;
          const muted = selected && selected !== item.key;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => setSelected(item.key)}
                aria-pressed={selected === item.key}
                onMouseEnter={() => setHovered(item.key)}
                onMouseLeave={() => setHovered(undefined)}
                onFocus={() => setFocused(item.key)}
                onBlur={() => setFocused(undefined)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  muted && focused !== item.key && hovered !== item.key && "opacity-40"
                )}
                style={{ transition: animationsEnabled && !reducedMotion ? "opacity 220ms ease" : "none" }}
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <PixelSwatch color={colorVar(item.key)} />
                  {item.label}
                </span>
                <span className="tabular-nums text-xs text-foreground">
                  {item.value.toLocaleString("en-US")}
                </span>
              </button>
              <p className="pl-4 tabular-nums text-[10px] text-muted-foreground">
                {share.toFixed(1)}%
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const RingMetric = Object.assign(RingMetricRoot, {});
