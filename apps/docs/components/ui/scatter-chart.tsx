"use client";

import * as React from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter as RechartsScatter,
  ScatterChart as RechartsScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import {
  ChartContainer,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ScatterPoint = {
  x: number;
  y: number;
  series?: string;
  label?: string;
};

export type ScatterChartProps = {
  data: ScatterPoint[];
  series?: string[];
  config?: ChartConfig;
  title?: string;
  description?: string;
  xLabel?: string;
  yLabel?: string;
  xDomain?: [number | "auto", number | "auto"];
  yDomain?: [number | "auto", number | "auto"];
  bubbleKey?: string;
  meanLine?: boolean;
  quadrantLines?: boolean;
  onPointClick?: (point: ScatterPoint) => void;
  emptyLabel?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
  className?: string;
};

const defaultConfig = {
  series: { label: "Series", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
} satisfies ChartConfig;

const baseMargin = { top: 12, right: 16, bottom: 4, left: 0 };

function numeric(values: Array<number | undefined | null>) {
  return values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
}

function autoDomain(values: number[]): [number | "auto", number | "auto"] {
  if (!values.length) return ["auto", "auto"];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min - 1, max + 1];
  return [min, max];
}

function formatTick(value: number) {
  return Math.abs(value) >= 1000
    ? `${(value / 1000).toFixed(Math.abs(value) >= 10000 ? 0 : 1)}k`
    : `${value}`;
}

function bubbleMax(points: ScatterPoint[], bubbleKey?: string) {
  if (!bubbleKey) return 400;
  return Math.max(
    1,
    ...points.map((p) => Math.abs(Number((p as Record<string, unknown>)[bubbleKey])) || 0)
  );
}

export function ScatterChart(props: ScatterChartProps) {
  const {
    data,
    series,
    config = defaultConfig,
    title = "Correlation",
    description,
    xLabel = "X",
    yLabel = "Y",
    xDomain,
    yDomain,
    bubbleKey,
    meanLine = false,
    quadrantLines = false,
    onPointClick,
    emptyLabel = "No points to plot",
    isLoading = false,
    reaction,
    className,
  } = props;
  const clean = data.filter(
    (p) =>
      Number.isFinite(p.x) &&
      Number.isFinite(p.y) &&
      (!bubbleKey || Number.isFinite(Number((p as Record<string, unknown>)[bubbleKey])))
  );
  const names = series ?? Array.from(new Set(clean.map((p) => p.series ?? "series")));
  const groups = names
    .map((name) => ({ name, points: clean.filter((p) => (p.series ?? "series") === name) }))
    .filter((g) => g.points.length > 0);
  const xs = numeric(clean.map((p) => p.x));
  const ys = numeric(clean.map((p) => p.y));
  const meanX = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  const meanY = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
  const zDomain: [number, number] = [0, bubbleMax(clean, bubbleKey)];

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={title}>
      {title ? <p className="text-sm font-medium tracking-tight">{title}</p> : null}
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <ChartContainer
        isLoading={isLoading}
        loadingVariant={bubbleKey ? "bubble" : "scatter"}
        reaction={reaction}
        config={{ ...defaultConfig, ...config }}
        data={clean as unknown as Record<string, unknown>[]}
        className={cn("mt-4 h-64 w-full", isLoading && "bg-muted/40")}
        variant="plain"
      >
        {isLoading ? null : !clean.length ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground" role="status">
            {emptyLabel}
          </p>
        ) : (
          <ScatterBody
            groups={groups}
            xLabel={xLabel}
            yLabel={yLabel}
            xDomain={xDomain ?? autoDomain(xs)}
            yDomain={yDomain ?? autoDomain(ys)}
            bubbleKey={bubbleKey}
            zDomain={zDomain}
            meanLine={meanLine}
            quadrantLines={quadrantLines}
            onPointClick={onPointClick}
          />
        )}
      </ChartContainer>
    </Card>
  );
}

function ScatterBody({
  groups,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  bubbleKey,
  zDomain,
  meanLine,
  quadrantLines,
  onPointClick,
}: {
  groups: Array<{ name: string; points: ScatterPoint[] }>;
  xLabel: string;
  yLabel: string;
  xDomain: [number | "auto", number | "auto"];
  yDomain: [number | "auto", number | "auto"];
  bubbleKey?: string;
  zDomain: [number, number];
  meanLine: boolean;
  quadrantLines: boolean;
  onPointClick?: (point: ScatterPoint) => void;
}) {
  const { id, config, selected, setSelected } = useChart();
  const xs = numeric(groups.flatMap((g) => g.points.map((p) => p.x)));
  const ys = numeric(groups.flatMap((g) => g.points.map((p) => p.y)));
  const meanX = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  const meanY = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart
        margin={{ ...baseMargin, bottom: 20 }}
        style={{ outline: "none" }}
      >
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          domain={xDomain}
          tickFormatter={formatTick}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          label={{ value: xLabel, position: "insideBottom", offset: -2, fill: "var(--muted-foreground)", fontSize: 10 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={yDomain}
          tickFormatter={formatTick}
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          label={{ value: yLabel, angle: -90, position: "insideLeft", fill: "var(--muted-foreground)", fontSize: 10 }}
        />
        {quadrantLines ? (
          <>
            <ReferenceLine x={meanX} stroke="var(--border)" strokeDasharray="6 4" />
            <ReferenceLine y={meanY} stroke="var(--border)" strokeDasharray="6 4" />
          </>
        ) : null}
        {meanLine && !quadrantLines ? (
          <ReferenceLine y={meanY} stroke="var(--border)" strokeDasharray="6 4" />
        ) : null}
        <RechartsTooltip
          cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }}
          content={<ScatterTooltipContent xLabel={xLabel} yLabel={yLabel} />}
          isAnimationActive={false}
        />
        {groups.map((group) => (
          <RechartsScatter
            key={group.name}
            name={group.name}
            data={group.points}
            fill={colorVar(group.name)}
            fillOpacity={1}
            onClick={() => setSelected(group.name)}
            cursor={onPointClick ? "pointer" : undefined}
            shape={(dotProps: RechartsScatterShapeProps) => (
              <ScatterDot
                {...dotProps}
                group={group.name}
                seriesLabel={config[group.name]?.label ?? group.name}
                onPointClick={onPointClick}
              />
            )}
          />
        ))}
        {bubbleKey ? <ZAxis type="number" dataKey={bubbleKey} range={[24, 400]} domain={zDomain} /> : <ZAxis range={[24, 24]} />}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}

type ScatterTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload?: Record<string, unknown> }>;
  label?: string | number;
};

function ScatterTooltipContent({
  active,
  payload,
  xLabel,
  yLabel,
}: ScatterTooltipProps & { xLabel: string; yLabel: string }) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;
  const row = (payload[0]?.payload ?? {}) as Record<string, unknown>;
  const key = String(row.series ?? "series");
  const series = config[key];
  return (
    <div className="relative min-w-40 overflow-hidden rounded-md border border-border bg-card px-3 py-2 font-mono shadow-sm">
      <p className="mb-1.5 font-medium uppercase tracking-wide text-foreground">
        {String(row.label ?? series?.label ?? key)}
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">{xLabel}</span>
          <span className="text-foreground">{formatTick(Number(row.x))}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">{yLabel}</span>
          <span className="text-foreground">{formatTick(Number(row.y))}</span>
        </div>
      </div>
    </div>
  );
}

type RechartsScatterShapeProps = {
  cx?: number;
  cy?: number;
  payload?: Record<string, unknown>;
};

type ScatterDotProps = RechartsScatterShapeProps & {
  group: string;
  seriesLabel?: React.ReactNode;
  onPointClick?: (point: ScatterPoint) => void;
};

function ScatterDot(props: ScatterDotProps) {
  const { cx, cy, payload, group, seriesLabel, onPointClick } = props;
  const { selected } = useChart();
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return <g />;
  const row = payload as ScatterPoint & Record<string, unknown>;
  const nameText =
    typeof row.label === "string" || typeof row.label === "number"
      ? row.label
      : seriesLabel ?? group;
  const muted = selected && selected !== group;
  const summary = `${nameText}: x ${formatTick(Number(row.x))}, y ${formatTick(Number(row.y))}`;
  return (
    <g
      role="img"
      aria-label={summary}
      onClick={() => onPointClick?.(row)}
      className="cursor-pointer outline-none"
      opacity={muted ? 0.2 : 1}
    >
      <circle cx={cx} cy={cy} r={4.5} fill={colorVar(group)} stroke="var(--background)" strokeWidth={2} />
    </g>
  );
}
