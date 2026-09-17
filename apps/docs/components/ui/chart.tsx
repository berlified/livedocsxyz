"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChartReaction, ChartReactionScope, ChartSkeleton, useChartReaction, useChartReactions, useChartReducedMotion, type ChartReactionOptions } from "@/components/ui/chart-reactions";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    valueFormatter?: (value: number | string) => React.ReactNode;
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
  variant = "panel",
  isLoading = false,
  loadingVariant,
  reaction,
  style,
}: {
  id?: string;
  config: ChartConfig;
  data: Record<string, unknown>[];
  className?: string;
  children: React.ReactNode;
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
  variant?: "panel" | "plain";
  isLoading?: boolean;
  loadingVariant?: ChartReactionOptions["loadingVariant"];
  reaction?: ChartReactionOptions;
  style?: React.CSSProperties;
}) {
  const settings = useChartReactions();
  const reducedMotion = useChartReducedMotion();
  isLoading = isLoading || Boolean(settings.isLoading);
  const { emotion, animationsEnabled } = useChartReaction({ isLoading, reaction });
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!isLoading && animationsEnabled && !reducedMotion) {
      const animation = contentRef.current?.animate?.(
        [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 450, easing: "cubic-bezier(0.22,1,0.36,1)" }
      );
      return () => animation?.cancel();
    }
  }, [isLoading, animationsEnabled, reducedMotion, settings.replayKey]);
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
        aria-busy={isLoading}
        style={style}
        className={cn(
          "relative flex aspect-auto w-full flex-col justify-end text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis-tick_text]:font-mono",
          "[&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border",
          "[&_.recharts-dot]:stroke-background [&_.recharts-curve]:[stroke-linejoin:round] [&_.recharts-curve]:[stroke-linecap:round]", 
          "[&_.recharts-tooltip-wrapper]:z-10",
          variant === "panel" &&
            "rounded-lg border border-border bg-card p-4 sm:p-5",
          variant === "plain" && "rounded-none border-0 bg-transparent shadow-none",
          className
        )}
      >
        <ChartStyle id={chartId} config={config} />
        <div ref={contentRef} key={settings.replayKey} className="relative z-[1] flex h-full min-h-0 w-full flex-1 flex-col justify-end">
          <ChartSkeleton isLoading={isLoading}>
            <ChartReactionScope active={Boolean(emotion)}>{children}</ChartReactionScope>
          </ChartSkeleton>
          {emotion ? <ChartReaction isLoading={isLoading} reaction={reaction} className={isLoading ? "absolute bottom-2 right-2" : "mt-2 shrink-0 self-end"} /> : null}
        </div>
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

function seriesKey(
  item: { dataKey?: string | number; name?: string; value?: string | number },
  config: ChartConfig
) {
  const fromDataKey = String(item.dataKey ?? "");
  const fromName = String(item.name ?? "");
  const fromValue = String(item.value ?? "");
  if (config[fromName]) return fromName;
  if (config[fromValue]) return fromValue;
  if (config[fromDataKey]) return fromDataKey;
  return fromDataKey || fromName || fromValue;
}

function uniquePayload<T extends { dataKey?: string | number; name?: string; value?: string | number }>(
  payload: T[] | undefined,
  config: ChartConfig
) {
  if (!payload?.length) return [];
  const seen = new Set<string>();
  const rows: Array<{ item: T; key: string; index: number }> = [];
  payload.forEach((item, index) => {
    const key = seriesKey(item, config);
    if (!key || seen.has(key)) return;
    seen.add(key);
    rows.push({ item, key, index });
  });
  return rows;
}

function formatChartNumber(value: number | string | undefined) {
  if (typeof value === "number") return value.toLocaleString("en-US");
  return value ?? "";
}

type ChartTooltipPayload = {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  roundness = "sm",
  variant = "reference",
  className,
}: {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
  labelFormatter?: (label: React.ReactNode, payload: ChartTooltipPayload[]) => React.ReactNode;
  roundness?: "sm" | "md" | "lg" | "full";
  variant?: "reference" | "default";
  className?: string;
}) {
  const { config, selected } = useChart();
  if (!active || !payload?.length) return null;

  const rows = uniquePayload(payload, config).filter(
    ({ key, item }) =>
      !selected ||
      selected === key ||
      selected === String(item.dataKey ?? "") ||
      selected === String(item.name ?? "")
  );

  if (!rows.length) return null;

  const header = labelFormatter ? labelFormatter(label, payload) : label;

  return (
    <div role="tooltip" data-variant={variant} className={cn(
      "pointer-events-none relative min-w-48 overflow-hidden border-0 px-3.5 py-3 text-xs shadow-lg",
      variant === "reference"
        ? "bg-[var(--chart-tooltip-background)] text-[var(--chart-tooltip-foreground)]"
        : "bg-popover text-popover-foreground",
      { sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", full: "rounded-2xl" }[roundness],
      className
    )}>
      {header !== undefined && header !== null && header !== "" ? (
        <p className="mb-2 text-[11px] font-bold">{header}</p>
      ) : null}
      <div className="space-y-2">
        {rows.map(({ item, key, index }) => {
          const series = config[key];
          const Icon = series?.icon;
          return (
            <div
              key={`${key}-${index}`}
              className="flex items-center justify-between gap-6"
            >
              <span className={cn("flex items-center gap-2", variant === "reference" ? "text-[var(--chart-tooltip-muted)]" : "text-muted-foreground")}>
                {Icon ? (
                  <Icon className="size-3" />
                ) : (
                  <PixelSwatch color={series ? colorVar(key) : item.color ?? "var(--chart-1)"} />
                )}
                {series?.label ?? key}
              </span>
              <span className="ml-auto text-right font-mono font-bold tabular-nums">
                {series?.valueFormatter && item.value !== undefined
                  ? series.valueFormatter(item.value)
                  : formatChartNumber(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartTooltipCursor({
  axisLabelFormatter,
}: {
  axisLabelFormatter?: (label: string | number) => string;
}) {
  const label = RechartsPrimitive.useActiveTooltipLabel();
  const coordinate = RechartsPrimitive.useActiveTooltipCoordinate();
  const plot = RechartsPrimitive.usePlotArea();
  const layout = RechartsPrimitive.useChartLayout();
  const active = RechartsPrimitive.useIsTooltipActive();
  if (!active || !plot || !coordinate || layout !== "horizontal") return null;

  const text = label === undefined ? "" : axisLabelFormatter?.(label) ?? String(label);
  const width = Math.min(plot.width, Math.max(40, text.length * 7 + 20));
  const x = Math.max(plot.x + width / 2, Math.min(coordinate.x, plot.x + plot.width - width / 2));
  const bottom = plot.y + plot.height;

  return (
    <RechartsPrimitive.ZIndexLayer zIndex={3000}>
      <g aria-hidden="true" className="pointer-events-none" data-chart-cursor="">
        <line x1={coordinate.x} x2={coordinate.x} y1={plot.y} y2={bottom} stroke="var(--chart-cursor)" strokeWidth={1} strokeDasharray="none" />
        {text ? (
          <g>
            <rect x={x - width / 2} y={bottom + 4} width={width} height={24} rx={12} fill="var(--chart-cursor)" />
            <text x={x} y={bottom + 16} textAnchor="middle" dominantBaseline="central" fill="var(--chart-cursor-foreground)" className="font-mono text-xs font-semibold">{text}</text>
          </g>
        ) : null}
      </g>
    </RechartsPrimitive.ZIndexLayer>
  );
}

type ChartTooltipProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
  contentProps?: Pick<React.ComponentProps<typeof ChartTooltipContent>, "variant" | "roundness" | "className" | "labelFormatter">;
  axisLabelFormatter?: (label: string | number) => string;
};

export function ChartTooltip({ contentProps, axisLabelFormatter, labelFormatter, cursor, ...props }: ChartTooltipProps) {
  return (
    <RechartsPrimitive.Tooltip
      content={<ChartTooltipContent labelFormatter={labelFormatter as React.ComponentProps<typeof ChartTooltipContent>["labelFormatter"]} {...contentProps} />}
      cursor={cursor ?? <ChartTooltipCursor axisLabelFormatter={axisLabelFormatter} />}
      {...props}
    />
  );
}
ChartTooltip.displayName = "Tooltip";

export function ChartTooltipLabelFormatter(props: Omit<ChartTooltipProps, "content">) {
  return <ChartTooltip {...props} />;
}
ChartTooltipLabelFormatter.displayName = "Tooltip";

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
    <div className="flex justify-center pt-3">
      <div
        role="group"
        aria-label="Chart series"
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-muted/40 p-1"
      >
        {uniquePayload(payload, config).map(({ key, index }) => {
          const series = config[key];
          const Icon = series?.icon;
          const active = selected === key;
          return (
            <Button
              key={`${key}-${index}`}
              type="button"
              variant="ghost"
              size="sm"
              disabled={!isClickable}
              aria-pressed={isClickable ? active : undefined}
              onClick={() => isClickable && setSelected(key)}
              className={cn(
                "h-8 min-w-0 shrink gap-2 rounded-full border border-transparent px-3 font-sans text-xs font-medium normal-case tracking-normal text-muted-foreground disabled:opacity-100",
                active && "border-border bg-background text-foreground shadow-sm",
                isClickable && "cursor-pointer hover:bg-accent hover:text-foreground"
              )}
            >
              {Icon ? (
                <Icon className="size-3 shrink-0" aria-hidden="true" />
              ) : (
                <PixelSwatch color={colorVar(key)} />
              )}
              <span className="truncate">{series?.label ?? key}</span>
            </Button>
          );
        })}
      </div>
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
      strokeDasharray="4 4"
      {...props}
    />
  );
}
ChartGrid.displayName = "CartesianGrid";

export function pixelPatternId(scope: string, key: string) {
  return `${scope}-${String(key).replace(/[^a-zA-Z0-9_-]/g, "_")}-px`;
}

export function pixelPatternUrl(scope: string, key: string) {
  return `url(#${pixelPatternId(scope, key)})`;
}

export function pixelFillStyle(color: string): React.CSSProperties {
  return { backgroundColor: color };
}

export function PixelSwatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-2 shrink-0 rounded-full"
      style={pixelFillStyle(color)}
    />
  );
}

export function HatchPattern({
  id,
  color,
}: {
  id: string;
  color: string;
}) {
  return (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={color} fillOpacity={0.08} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeOpacity={0.45} strokeWidth={1.5} />
    </pattern>
  );
}

export function GradientFill({
  id,
  color,
  startOpacity = 0.5,
  endOpacity = 0.1,
}: {
  id: string;
  color: string;
  startOpacity?: number;
  endOpacity?: number;
}) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={startOpacity} />
      <stop offset="100%" stopColor={color} stopOpacity={endOpacity} />
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

export const salesByCategory = [
  { category: "electronics", sales: 4250 },
  { category: "clothing", sales: 3120 },
  { category: "food", sales: 2100 },
  { category: "home", sales: 1580 },
  { category: "other", sales: 1050 },
];

export const salesByCategoryConfig = {
  electronics: {
    label: "Electronics",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  clothing: {
    label: "Clothing",
    colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] },
  },
  food: {
    label: "Food",
    colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] },
  },
  home: {
    label: "Home",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
  other: {
    label: "Other",
    colors: { dark: ["var(--chart-5)"], light: ["var(--chart-5)"] },
  },
} satisfies ChartConfig;

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

export function formatChartCurrency(value: number | string) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export const composedDaily = Array.from({ length: 30 }, (_, index) => {
  const daily = Math.round(
    10200 + index * 90 + Math.sin(index / 2.6) * 1200 + Math.exp(-((index - 14) ** 2) / 40) * 3600
  );
  const average = Math.round(daily * 0.95 + 2600);
  const trend = Math.round(daily * 0.9 + 6400);
  return { day: `Jan ${index + 1}`, daily, average, trend };
});

export const composedDailyConfig = {
  daily: {
    label: "Sales",
    valueFormatter: formatChartCurrency,
    colors: { dark: ["var(--chart-teal)"], light: ["var(--chart-teal)"] },
  },
  average: {
    label: "Average",
    valueFormatter: formatChartCurrency,
    colors: { dark: ["var(--chart-turquoise)"], light: ["var(--chart-turquoise)"] },
  },
  trend: {
    label: "Trend",
    valueFormatter: formatChartCurrency,
    colors: { dark: ["var(--chart-teal-strong)"], light: ["var(--chart-teal-strong)"] },
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
  { browser: "chrome", visitors: 90 },
  { browser: "safari", visitors: 72 },
  { browser: "firefox", visitors: 64 },
  { browser: "edge", visitors: 48 },
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

export const dailyOverlay = [
  { day: "Mon", current: 42, previous: 38 },
  { day: "Tue", current: 68, previous: 51 },
  { day: "Wed", current: 51, previous: 47 },
  { day: "Thu", current: 44, previous: 62 },
  { day: "Fri", current: 71, previous: 58 },
  { day: "Sat", current: 63, previous: 49 },
  { day: "Sun", current: 28, previous: 41 },
];

export const overlayConfig = {
  current: {
    label: "This period",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  previous: {
    label: "Last period",
    colors: { dark: ["var(--muted-foreground)"], light: ["var(--muted-foreground)"] },
  },
} satisfies ChartConfig;

export const metricSeries = [
  { month: "Jan", period: 82, today: 40 },
  { month: "Feb", period: 118, today: 52 },
  { month: "Mar", period: 168, today: 71 },
  { month: "Apr", period: 214, today: 88 },
  { month: "May", period: 236, today: 104 },
  { month: "Jun", period: 248, today: 121 },
  { month: "Jul", period: 258, today: 136 },
  { month: "Aug", period: 264, today: 148 },
  { month: "Sep", period: 272, today: 168 },
];

export const metricConfig = {
  period: {
    label: "Current period",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  today: {
    label: "Today",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
} satisfies ChartConfig;

export const yearCompare = [
  { month: "Nov 3", thisYear: 48, lastYear: 36 },
  { month: "Nov 6", thisYear: 62, lastYear: 44 },
  { month: "Nov 9", thisYear: 91, lastYear: 58 },
  { month: "Nov 12", thisYear: 54, lastYear: 61 },
  { month: "Nov 15", thisYear: 73, lastYear: 49 },
  { month: "Nov 18", thisYear: 41, lastYear: 38 },
];

export const yearCompareConfig = {
  thisYear: {
    label: "This year",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  lastYear: {
    label: "Last year",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
} satisfies ChartConfig;

export const rangeBand = [
  { month: "Jan", low: 18, high: 46, value: 32 },
  { month: "Feb", low: 22, high: 58, value: 41 },
  { month: "Mar", low: 19, high: 51, value: 28 },
  { month: "Apr", low: 26, high: 64, value: 49 },
  { month: "May", low: 24, high: 61, value: 44 },
  { month: "Jun", low: 31, high: 72, value: 58 },
];

export const rangeConfig = {
  high: {
    label: "Upper",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  low: {
    label: "Lower",
    colors: { dark: ["var(--muted)"], light: ["var(--muted)"] },
  },
  value: {
    label: "Actual",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
} satisfies ChartConfig;

export const paymentMix = [
  { key: "paid", label: "Settled", value: 48210, percent: 64.2 },
  { key: "open", label: "Open", value: 12840, percent: 17.1 },
  { key: "retry", label: "Retrying", value: 7620, percent: 10.2 },
  { key: "void", label: "Voided", value: 4310, percent: 5.7 },
  { key: "back", label: "Chargeback", value: 2110, percent: 2.8 },
];

export const cohortMix = [
  { key: "renew", label: "Renewing", value: 4120, percent: 46.1 },
  { key: "join", label: "Joined", value: 2680, percent: 30.0 },
  { key: "pause", label: "Paused", value: 980, percent: 11.0 },
  { key: "once", label: "One-time", value: 710, percent: 7.9 },
  { key: "trial", label: "Trial", value: 450, percent: 5.0 },
];

export const mixConfig = {
  paid: { label: "Settled", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
  open: { label: "Open", colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] } },
  retry: { label: "Retrying", colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] } },
  void: { label: "Voided", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
  back: { label: "Chargeback", colors: { dark: ["var(--chart-5)"], light: ["var(--chart-5)"] } },
  renew: { label: "Renewing", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
  join: { label: "Joined", colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] } },
  pause: { label: "Paused", colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] } },
  once: { label: "One-time", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
  trial: { label: "Trial", colors: { dark: ["var(--chart-5)"], light: ["var(--chart-5)"] } },
} satisfies ChartConfig;

export const marketRank = [
  { region: "United States", code: "US", current: 58200, previous: 49400 },
  { region: "India", code: "IN", current: 14500, previous: 16200 },
  { region: "United Kingdom", code: "GB", current: 9800, previous: 9100 },
  { region: "Germany", code: "DE", current: 7200, previous: 7800 },
  { region: "Canada", code: "CA", current: 5100, previous: 4300 },
  { region: "Australia", code: "AU", current: 3600, previous: 3900 },
];

export const marketConfig = {
  current: {
    label: "This period",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  previous: {
    label: "Last period",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
} satisfies ChartConfig;

export const ringMembers = [
  { key: "new", label: "New", value: 6123 },
  { key: "existing", label: "Existing", value: 6000 },
];

export const ringPayments = [
  { key: "captured", label: "Captured", value: 1000 },
  { key: "refunded", label: "Refunded", value: 900 },
  { key: "charged", label: "Chargebacks", value: 42 },
];

export const ringConfig = {
  new: { label: "New", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
  existing: { label: "Existing", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
  captured: { label: "Captured", colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] } },
  refunded: { label: "Refunded", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
  charged: { label: "Chargebacks", colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] } },
} satisfies ChartConfig;

export const cashflowMonths = [
  { month: "Feb", inflow: 78, outflow: -32 },
  { month: "Mar", inflow: 61, outflow: -41 },
  { month: "Apr", inflow: 112, outflow: -18 },
  { month: "May", inflow: 58, outflow: -44 },
  { month: "Jun", inflow: 134, outflow: -52 },
  { month: "Jul", inflow: 141, outflow: -38 },
  { month: "Aug", inflow: 99, outflow: -29 },
  { month: "Sep", inflow: 118, outflow: -47 },
  { month: "Oct", inflow: 64, outflow: -36 },
  { month: "Nov", inflow: 31, outflow: -22 },
  { month: "Dec", inflow: 88, outflow: -40 },
  { month: "Jan", inflow: 42, outflow: -19 },
];

export const cashflowConfig = {
  inflow: {
    label: "Inflow",
    colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] },
  },
  outflow: {
    label: "Outflow",
    colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] },
  },
} satisfies ChartConfig;

export const spotlightSeries = Array.from({ length: 24 }, (_, index) => {
  const wave = Math.sin(index / 2.4) * 18 + 42;
  const spike = index === 16 ? 28 : index === 7 ? 14 : 0;
  return {
    day: `Jun ${index + 1}`,
    current: Math.round(wave + spike + index * 1.4),
    previous: Math.round(wave * 0.72 + 8),
  };
});

export const spotlightConfig = {
  current: {
    label: "This month",
    colors: { dark: ["var(--chart-1)"], light: ["var(--chart-1)"] },
  },
  previous: {
    label: "Last month",
    colors: { dark: ["var(--muted-foreground)"], light: ["var(--muted-foreground)"] },
  },
} satisfies ChartConfig;

export const laneRows = [
  { key: "total", label: "Total", value: 640 },
  { key: "ok", label: "Succeeded", value: 418 },
  { key: "issuer", label: "Issuer decline", value: 36 },
  { key: "buyer", label: "Buyer decline", value: 22 },
  { key: "idle", label: "Not started", value: 164 },
];

export const laneConfig = {
  total: { label: "Total", colors: { dark: ["var(--chart-4)"], light: ["var(--chart-4)"] } },
  ok: { label: "Succeeded", colors: { dark: ["var(--chart-2)"], light: ["var(--chart-2)"] } },
  issuer: { label: "Issuer decline", colors: { dark: ["var(--destructive)"], light: ["var(--destructive)"] } },
  buyer: { label: "Buyer decline", colors: { dark: ["var(--chart-3)"], light: ["var(--chart-3)"] } },
  idle: { label: "Not started", colors: { dark: ["var(--muted-foreground)"], light: ["var(--muted-foreground)"] } },
} satisfies ChartConfig;

export { RechartsPrimitive };
