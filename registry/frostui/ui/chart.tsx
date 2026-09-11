"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    colors?: {
      light?: string[];
      dark?: string[];
    };
  }
>;

type ChartContextValue = {
  id: string;
  config: ChartConfig;
  data: Record<string, unknown>[];
  selected?: string;
  setSelected: (key?: string) => void;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used inside a chart");
  }
  return context;
}

export function colorVar(key: string, stop = 0) {
  return stop === 0
    ? `var(--color-${key})`
    : `var(--color-${key}-${stop})`;
}

export function ChartContainer({
  id,
  config,
  data,
  className,
  children,
  defaultSelectedDataKey,
  onSelectionChange,
}: {
  id?: string;
  config: ChartConfig;
  data: Record<string, unknown>[];
  className?: string;
  children: React.ReactNode;
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
}) {
  const generatedId = React.useId().replace(/:/g, "");
  const chartId = id ?? generatedId;
  const [selected, setSelectedState] = React.useState<string | undefined>(
    defaultSelectedDataKey
  );

  const setSelected = React.useCallback(
    (key?: string) => {
      setSelectedState((current) => {
        const next = current === key ? undefined : key;
        onSelectionChange?.(next);
        return next;
      });
    },
    [onSelectionChange]
  );

  return (
    <ChartContext.Provider
      value={{ id: chartId, config, data, selected, setSelected }}
    >
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-auto w-full flex-col justify-end text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/40 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          className
        )}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const rules = Object.entries(config)
    .map(([key, item]) => {
      const dark = item.colors?.dark ?? (item.color ? [item.color] : ["var(--chart-1)"]);
      const light =
        item.colors?.light ?? (item.color ? [item.color] : ["var(--chart-1)"]);
      const darkStops = dark
        .map((color, index) =>
          index === 0
            ? `--color-${key}: ${color}; --color-${key}-0: ${color};`
            : `--color-${key}-${index}: ${color};`
        )
        .join(" ");
      const lightStops = light
        .map((color, index) =>
          index === 0
            ? `--color-${key}: ${color}; --color-${key}-0: ${color};`
            : `--color-${key}-${index}: ${color};`
        )
        .join(" ");
      return `[data-chart="${id}"]{${darkStops}}.light [data-chart="${id}"]{${lightStops}}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: rules }} />;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  roundness = "lg",
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string | number;
    name?: string;
    value?: number | string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
  roundness?: "sm" | "md" | "lg" | "full";
}) {
  const { config, selected } = useChart();
  if (!active || !payload?.length) return null;

  const radius =
    roundness === "full"
      ? "rounded-full"
      : roundness === "sm"
        ? "rounded-md"
        : roundness === "md"
          ? "rounded-lg"
          : "rounded-xl";

  return (
    <div
      className={cn(
        "min-w-40 border border-border bg-card px-3 py-2 text-xs shadow-sm",
        radius
      )}
    >
      {label ? (
        <p className="mb-1.5 font-medium text-foreground">{label}</p>
      ) : null}
      <div className="space-y-1">
        {payload.map((item) => {
          const rawKey = String(item.dataKey ?? item.name ?? "");
          const nameKey = String(item.name ?? "");
          const key = config[rawKey]
            ? rawKey
            : config[nameKey]
              ? nameKey
              : rawKey;
          if (selected && selected !== key && selected !== rawKey) return null;
          const series = config[key];
          const Icon = series?.icon;
          return (
            <div key={key} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-muted-foreground">
                {Icon ? (
                  <Icon className="size-2.5" />
                ) : (
                  <span
                    className="size-2 rounded-sm"
                    style={{ background: colorVar(key) }}
                  />
                )}
                {series?.label ?? key}
              </span>
              <span className="font-mono text-foreground">
                {item.value?.toLocaleString?.() ?? item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartTooltip(props: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) {
  return (
    <RechartsPrimitive.Tooltip
      cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
      content={<ChartTooltipContent />}
      {...props}
    />
  );
}
ChartTooltip.displayName = "Tooltip";

export function ChartLegendContent({
  payload,
  isClickable,
}: {
  payload?: Array<{ dataKey?: string | number; value?: string; color?: string }>;
  isClickable?: boolean;
}) {
  const { config, selected, setSelected } = useChart();
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      {payload.map((item) => {
        const rawKey = String(item.dataKey ?? item.value ?? "");
        const key = config[rawKey] ? rawKey : String(item.value ?? rawKey);
        const series = config[key];
        const Icon = series?.icon;
        const active = !selected || selected === key;
        return (
          <button
            key={key}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && setSelected(key)}
            className={cn(
              "flex items-center gap-1.5 text-xs text-muted-foreground",
              isClickable && "cursor-pointer",
              !active && "opacity-40"
            )}
          >
            {Icon ? (
              <Icon className="size-3" />
            ) : (
              <span
                className="size-2 rounded-sm"
                style={{ background: colorVar(key) }}
              />
            )}
            {series?.label ?? key}
          </button>
        );
      })}
    </div>
  );
}

export function ChartLegend({
  isClickable,
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Legend> & {
  isClickable?: boolean;
}) {
  return (
    <RechartsPrimitive.Legend
      content={<ChartLegendContent isClickable={isClickable} />}
      {...props}
    />
  );
}
ChartLegend.displayName = "Legend";

export function ChartGrid(props: React.ComponentProps<typeof RechartsPrimitive.CartesianGrid>) {
  return (
    <RechartsPrimitive.CartesianGrid
      vertical={false}
      stroke="var(--border)"
      strokeDasharray="3 3"
      {...props}
    />
  );
}
ChartGrid.displayName = "CartesianGrid";

export function HatchPattern({
  id,
  color,
}: {
  id: string;
  color: string;
}) {
  return (
    <pattern
      id={id}
      width="6"
      height="6"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2" />
    </pattern>
  );
}

export function GradientFill({
  id,
  color,
}: {
  id: string;
  color: string;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.45} />
      <stop offset="100%" stopColor={color} stopOpacity={0.05} />
    </linearGradient>
  );
}

export const monthlyData = [
  { month: "January", desktop: 342, mobile: 184, tablet: 98 },
  { month: "February", desktop: 876, mobile: 491, tablet: 210 },
  { month: "March", desktop: 512, mobile: 290, tablet: 140 },
  { month: "April", desktop: 629, mobile: 391, tablet: 168 },
  { month: "May", desktop: 458, mobile: 309, tablet: 132 },
  { month: "June", desktop: 781, mobile: 449, tablet: 190 },
  { month: "July", desktop: 394, mobile: 234, tablet: 110 },
  { month: "August", desktop: 925, mobile: 557, tablet: 240 },
  { month: "September", desktop: 647, mobile: 367, tablet: 155 },
  { month: "October", desktop: 532, mobile: 357, tablet: 148 },
  { month: "November", desktop: 803, mobile: 515, tablet: 205 },
  { month: "December", desktop: 271, mobile: 149, tablet: 88 },
];

export const trafficConfig = {
  desktop: {
    label: "Desktop",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  mobile: {
    label: "Mobile",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
  tablet: {
    label: "Tablet",
    colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] },
  },
} satisfies ChartConfig;

export const shareData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];

export const shareConfig = {
  chrome: {
    label: "Chrome",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  safari: {
    label: "Safari",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
  firefox: {
    label: "Firefox",
    colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] },
  },
  edge: {
    label: "Edge",
    colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] },
  },
  other: {
    label: "Other",
    colors: { dark: ["var(--chart-5)"], light: ["var(--chart-5)"] },
  },
  visitors: {
    label: "Visitors",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
} satisfies ChartConfig;

export const radarData = [
  { metric: "Design", current: 120, previous: 110 },
  { metric: "Code", current: 98, previous: 130 },
  { metric: "Speed", current: 86, previous: 90 },
  { metric: "Docs", current: 99, previous: 85 },
  { metric: "Support", current: 85, previous: 90 },
  { metric: "Sales", current: 65, previous: 74 },
];

export const radarConfig = {
  current: {
    label: "This quarter",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  previous: {
    label: "Last quarter",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
} satisfies ChartConfig;

export const radialData = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
];

export const sankeyNodes = [
  { name: "Visit" },
  { name: "Signup" },
  { name: "Activate" },
  { name: "Paid" },
  { name: "Churn" },
];

export const sankeyLinks = [
  { source: 0, target: 1, value: 180 },
  { source: 0, target: 4, value: 40 },
  { source: 1, target: 2, value: 140 },
  { source: 1, target: 4, value: 40 },
  { source: 2, target: 3, value: 110 },
  { source: 2, target: 4, value: 30 },
];

export const sankeyConfig = {
  Visit: {
    label: "Visit",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  Signup: {
    label: "Signup",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
  Activate: {
    label: "Activate",
    colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] },
  },
  Paid: {
    label: "Paid",
    colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] },
  },
  Churn: {
    label: "Churn",
    colors: { dark: ["var(--chart-5)"], light: ["var(--chart-5)"] },
  },
} satisfies ChartConfig;

export { RechartsPrimitive };
