"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts";

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
import { cn } from "@/lib/utils";

export type RingSlice = { key: string; label: string; value: number };

function RingMetricRoot({
  title,
  centerLabel,
  data,
  config,
  className,
}: {
  title?: string;
  centerLabel?: string;
  data: RingSlice[];
  config: ChartConfig;
  className?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={cn("p-5", className)}>
      {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
      <ChartContainer
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
            >
              {data.map((item) => (
                <Cell
                  key={item.key}
                  fill={pixelPatternUrl(id, item.key)}
                  opacity={selected && selected !== item.key ? 0.25 : 1}
                  cursor="pointer"
                  onClick={() => setSelected(item.key)}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-2xl font-semibold tracking-tight">
            {total.toLocaleString("en-US")}
          </p>
          {centerLabel ? (
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
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
                className={cn(
                  "flex w-full items-center justify-between gap-2 text-left transition-opacity",
                  muted && "opacity-40"
                )}
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <PixelSwatch color={colorVar(item.key)} />
                  {item.label}
                </span>
                <span className="font-mono text-xs text-foreground">
                  {item.value.toLocaleString("en-US")}
                </span>
              </button>
              <p className="pl-4 font-mono text-[10px] text-muted-foreground">
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
