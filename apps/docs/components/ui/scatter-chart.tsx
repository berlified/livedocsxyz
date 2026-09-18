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
import { ChartSkeleton } from "@/components/ui/chart-reactions";
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
      <ChartSkeleton isLoading={isLoading}>
      {title ? <p className="text-sm font-medium tracking-tight">{title}</p> : null}
      <ChartContainer
        isLoading={isLoading}
        loadingVariant={bubbleKey ? "bubble" : "scatter"}
        reaction={reaction}
        config={{ ...defaultConfig, ...config }}
        data={clean as unknown as Record<string, unknown>[]}
        className={cn("mt-4 h-64 w-full", isLoading && "bg-muted/40")}
        variant="plain"
      >
        {!clean.length ? (
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
      </ChartSkeleton>
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
  const { config, selected, setSelected } = useChart();
  const [hovered, setHovered] = React.useState<string>();
  const [focused, setFocused] = React.useState<string>();
  const activePoint = hovered ?? focused;
  const inspected = groups.flatMap((group) => group.points.map((point, index) => ({ point, key: `${group.name}:${index}` }))).find((item) => item.key === activePoint)?.point;
  const xs = numeric(groups.flatMap((g) => g.points.map((p) => p.x)));
  const ys = numeric(groups.flatMap((g) => g.points.map((p) => p.y)));
  const meanX = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
  const meanY = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;

  return (
    <div className="relative h-full w-full">
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
          cursor={false}
          active={inspected ? false : undefined}
          content={<ScatterTooltipContent xLabel={xLabel} yLabel={yLabel} bubbleKey={bubbleKey} />}
          isAnimationActive={false}
        />
        {groups.map((group) => (
          <RechartsScatter
            key={group.name}
            name={group.name}
            data={group.points}
            fill={colorVar(group.name)}
            fillOpacity={1}
            cursor={onPointClick ? "pointer" : undefined}
            shape={(dotProps: RechartsScatterShapeProps) => (
              <ScatterDot
                {...dotProps}
                group={group.name}
                seriesLabel={config[group.name]?.label ?? group.name}
                bubbleKey={bubbleKey}
                muted={activePoint !== undefined ? activePoint !== `${group.name}:${dotProps.index}` : Boolean(selected && selected !== group.name)}
                onHoverChange={(active) => setHovered(active ? `${group.name}:${dotProps.index}` : undefined)}
                onFocusChange={(active) => setFocused(active ? `${group.name}:${dotProps.index}` : undefined)}
                onActivate={(point) => { setSelected(group.name); onPointClick?.(point); }}
              />
            )}
          />
        ))}
        {bubbleKey ? <ZAxis type="number" dataKey={bubbleKey} range={[24, 400]} domain={zDomain} /> : <ZAxis range={[24, 24]} />}
      </RechartsScatterChart>
    </ResponsiveContainer>
    {inspected ? (
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 w-max max-w-full -translate-x-1/2">
        <ScatterTooltipContent active payload={[{ payload: inspected as Record<string, unknown> }]} xLabel={xLabel} yLabel={yLabel} bubbleKey={bubbleKey} />
      </div>
    ) : null}
    </div>
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
  bubbleKey,
}: ScatterTooltipProps & { xLabel: string; yLabel: string; bubbleKey?: string }) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;
  const row = (payload[0]?.payload ?? {}) as Record<string, unknown>;
  const key = String(row.series ?? "series");
  const series = config[key];
  return (
    <div role="tooltip" className="relative min-w-40 overflow-hidden rounded-md border border-border/60 bg-popover px-3 py-2 font-mono shadow-sm">
      <p className="mb-1.5 font-medium uppercase tracking-wide text-foreground">
        {String(row.label ?? series?.label ?? key)}
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">{xLabel}</span>
          <span className="text-foreground">{Number(row.x).toLocaleString("en-US", { maximumFractionDigits: 20 })}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">{yLabel}</span>
          <span className="text-foreground">{Number(row.y).toLocaleString("en-US", { maximumFractionDigits: 20 })}</span>
        </div>
        {bubbleKey ? (
          <div className="flex items-center justify-between gap-6">
            <span className="text-muted-foreground">{config[bubbleKey]?.label ?? bubbleKey}</span>
            <span className="text-foreground">{config[bubbleKey]?.valueFormatter?.(Number(row[bubbleKey])) ?? Number(row[bubbleKey]).toLocaleString("en-US", { maximumFractionDigits: 20 })}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type RechartsScatterShapeProps = {
  cx?: number;
  cy?: number;
  size?: number;
  index?: number;
  payload?: Record<string, unknown>;
};

type ScatterDotProps = RechartsScatterShapeProps & {
  group: string;
  seriesLabel?: React.ReactNode;
  bubbleKey?: string;
  muted: boolean;
  onHoverChange: (active: boolean) => void;
  onFocusChange: (active: boolean) => void;
  onActivate: (point: ScatterPoint) => void;
};

function ScatterDot({ cx, cy, size, payload, group, seriesLabel, bubbleKey, muted, onHoverChange, onFocusChange, onActivate }: ScatterDotProps) {
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return <g />;
  const row = payload as ScatterPoint & Record<string, unknown>;
  const nameText = row.label ?? (typeof seriesLabel === "string" ? seriesLabel : group);
  const formatValue = (value: unknown) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 20 });
  const summary = `${nameText}: x ${formatValue(row.x)}, y ${formatValue(row.y)}${bubbleKey ? `, ${bubbleKey} ${formatValue(row[bubbleKey])}` : ""}`;
  const radius = bubbleKey && typeof size === "number" && Number.isFinite(size) ? Math.sqrt(Math.max(0, size) / Math.PI) : 4.5;
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={summary}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      onClick={() => onActivate(row)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onActivate(row);
        }
      }}
      className="cursor-pointer outline-none transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
      opacity={muted ? 0.6 : 1}
    >
      <circle cx={cx} cy={cy} r={radius} fill={colorVar(group)} stroke="var(--background)" strokeWidth={2} />
    </g>
  );
}
