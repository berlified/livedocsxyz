"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartContainer, colorVar, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type GaugeChartProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  thresholds?: number[];
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
};

const defaultConfig = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig;

const CX = 80;
const CY = 84;
const R = 62;
const START = Math.PI * 0.75;
const SWEEP = Math.PI * 1.5;

function pointAt(value: number, min: number, max: number, radius: number) {
  const angle = START + ((value - min) / (max - min)) * SWEEP;
  return { x: Number((CX + radius * Math.cos(angle)).toFixed(4)), y: Number((CY + radius * Math.sin(angle)).toFixed(4)) };
}

function arcPath(from: number, to: number, min: number, max: number, radius: number) {
  const start = pointAt(from, min, max, radius);
  const end = pointAt(to, min, max, radius);
  const large = (to - from) / (max - min) > 2 / 3 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

function thresholdStops(min: number, max: number, thresholds?: number[]) {
  return (thresholds ?? [])
    .filter((t) => Number.isFinite(t) && t > min && t < max)
    .sort((a, b) => a - b);
}

export function GaugeChart({
  label,
  value,
  min = 0,
  max = 100,
  unit = "",
  thresholds = [60, 85],
  formatValue,
  ariaLabel,
  className,
  isLoading,
  reaction,
}: GaugeChartProps) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  const clean = Number.isFinite(value) ? value : safeMin;
  const clamped = Math.min(safeMax, Math.max(safeMin, clean));
  const format = (v: number) =>
    formatValue ? formatValue(v) : `${v.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}`;
  const describe = ariaLabel ?? `${label}: ${format(clamped)}, range ${format(safeMin)} to ${format(safeMax)}`;
  const stops = thresholdStops(safeMin, safeMax, thresholds);
  const edges = [safeMin, ...stops, safeMax];
  const segments = edges.slice(0, -1).map((from, i, arr) => ({
    from,
    to: edges[i + 1]!,
    color:
      arr.length === 1
        ? colorVar("value")
        : `color-mix(in oklab, ${colorVar("value")} ${28 + (i / (arr.length - 1)) * 44}%, var(--muted))`,
  }));

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={`${label} gauge`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium tracking-tight">{label}</p>
        {unit ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{unit}</span>
        ) : null}
      </div>
      <ChartContainer
        isLoading={isLoading}
        reaction={reaction}
        config={defaultConfig}
        data={[{ value: clamped }]}
        variant="plain"
        className="mt-2 h-44 w-full justify-center"
      >
        <div className="grid h-full place-items-center">
          <div className="relative">
            <svg viewBox="0 0 160 148" className="w-56 max-w-full" role="img" aria-label={describe}>
              <path d={arcPath(safeMin, safeMax, safeMin, safeMax, R)} stroke="var(--muted)" strokeWidth={12} fill="none" />
              {segments.map((seg, i) => (
                <path
                  key={i}
                  d={arcPath(seg.from, seg.to, safeMin, safeMax, R)}
                  stroke={seg.color}
                  strokeWidth={12}
                  fill="none"
                />
              ))}
              {stops.map((t) => {
                const p1 = pointAt(t, safeMin, safeMax, R - 9);
                const p2 = pointAt(t, safeMin, safeMax, R + 9);
                return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--background)" strokeWidth={2} />;
              })}
              <line
                x1={CX}
                y1={CY}
                x2={pointAt(clamped, safeMin, safeMax, R - 16).x}
                y2={pointAt(clamped, safeMin, safeMax, R - 16).y}
                stroke="var(--foreground)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <circle cx={CX} cy={CY} r={4} fill="var(--foreground)" stroke="var(--background)" strokeWidth={1.5} />
              {edges.map((v) => {
                const p1 = pointAt(v, safeMin, safeMax, R - 8);
                const p2 = pointAt(v, safeMin, safeMax, R + 8);
                const label1 = pointAt(v, safeMin, safeMax, R + 16);
                return (
                  <g key={v}>
                    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--foreground)" strokeWidth={1.5} />
                    <text x={label1.x} y={label1.y + 3} textAnchor="middle" fontSize={8} className="fill-muted-foreground font-mono">
                      {format(v)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="pointer-events-none absolute inset-x-0 top-[76%] text-center font-mono text-2xl font-semibold tracking-tight">
              {format(clamped)}
            </p>
          </div>
        </div>
      </ChartContainer>
    </Card>
  );
}
