"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  ResponsiveContainer,
  type RadialBarSectorProps,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { ChartInteractiveSector } from "@/components/ui/pie-chart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RadialSeriesProps = {
  dataKey: string;
  cornerRadius?: number;
  barSize?: number;
  showBackground?: boolean;
  isClickable?: boolean;
};

function RadialSeries(_props: RadialSeriesProps) {
  return null;
}
function Tooltip(props: React.ComponentProps<typeof ChartTooltip>) {
  return <ChartTooltip {...props} cursor={false} />;
}
Tooltip.displayName = "Tooltip";
function Legend(props: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} />;
}
Legend.displayName = "Legend";

function ChartRadial({
  data,
  config,
  nameKey,
  className,
  children,
  isLoading,
  reaction,
  variant = "full",
  innerRadius = 28,
  outerRadius,
  max,
  defaultSelectedDataKey,
  onSelectionChange,
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  nameKey: string;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  variant?: "full" | "semi";
  innerRadius?: number;
  outerRadius?: number;
  max?: number;
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
}) {
  const childArray = React.Children.toArray(children);
  const series = childArray.find(
    (child) => React.isValidElement(child) && child.type === RadialSeries
  ) as React.ReactElement<RadialSeriesProps> | undefined;
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === RadialSeries)
  );

  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="radial"
      reaction={reaction}
      config={config}
      data={data}
      className={cn("h-auto min-h-96 w-full sm:h-[400px]", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <RadialBody
        data={data}
        nameKey={nameKey}
        series={series}
        extras={extras}
        variant={variant}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        max={max}
      />
    </ChartContainer>
  );
}

function RadialBody({
  data,
  nameKey,
  series,
  extras,
  variant,
  innerRadius,
  outerRadius,
  max,
}: {
  data: Record<string, unknown>[];
  nameKey: string;
  series?: React.ReactElement<RadialSeriesProps>;
  extras: React.ReactNode[];
  variant: "full" | "semi";
  innerRadius: number;
  outerRadius?: number;
  max?: number;
}) {
  const { config, selected, setSelected } = useChart();
  const [hoveredKey, setHoveredKey] = React.useState<string>();
  const [focusedKey, setFocusedKey] = React.useState<string>();
  const activeKey = hoveredKey ?? focusedKey ?? selected;
  const tooltipKey = hoveredKey ?? focusedKey;
  const legendId = React.useId();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const dataKey = series?.props.dataKey ?? "value";
  const clickable = series?.props.isClickable !== false;
  const colored = data.map((item) => ({ ...item, fill: colorVar(String(item[nameKey])) }));
  const computedMax = max ?? Math.max(...data.map((item) => Number(item[dataKey]) || 0), 1);
  const formatValue = (key: string, value: unknown) =>
    typeof value === "number" || typeof value === "string"
      ? config[key]?.valueFormatter?.(value) ?? value.toLocaleString("en-US")
      : "";
  const tooltipItem = data.find((item) => String(item[nameKey]) === tooltipKey);
  const legend = extras.find((child) => React.isValidElement(child) && child.type === Legend) as React.ReactElement<React.ComponentProps<typeof ChartLegend>> | undefined;
  const tooltip = extras.find((child) => React.isValidElement(child) && child.type === Tooltip) as React.ReactElement<React.ComponentProps<typeof ChartTooltip>> | undefined;

  return (
    <div className="grid h-full min-h-0 w-full items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(160px,0.65fr)]">
      <div className="relative h-72 min-w-0 sm:h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadialBarChart
            data={colored}
            innerRadius={innerRadius}
            outerRadius={outerRadius ?? "92%"}
            cy={variant === "semi" ? "70%" : "50%"}
            startAngle={variant === "semi" ? 180 : 90}
            endAngle={variant === "semi" ? 0 : -270}
            margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <PolarAngleAxis type="number" domain={[0, computedMax]} tick={false} />
            {extras.filter((child) => !(React.isValidElement(child) && (child.type === Legend || child.type === Tooltip)))}
            {tooltip ? React.cloneElement(tooltip, { active: tooltipKey ? false : tooltip.props.active }) : null}
            <RadialBar
              dataKey={dataKey}
              background={series?.props.showBackground ? { fill: "var(--border)", fillOpacity: 0.45 } : undefined}
              cornerRadius={series?.props.cornerRadius ?? 8}
              barSize={series?.props.barSize}
              stroke="var(--background)"
              strokeWidth={2}
              isAnimationActive={animationsEnabled && !reducedMotion}
              animationBegin={0}
              animationDuration={600}
              shape={(props: RadialBarSectorProps) => {
                const item = data[props.index];
                const key = String(item?.[nameKey] ?? "");
                const label = config[key]?.label;
                return (
                  <ChartInteractiveSector
                    geometry={props}
                    label={`${typeof label === "string" ? label : key}: ${String(item?.[dataKey] ?? "")}`}
                    selected={selected === key}
                    muted={Boolean(activeKey && activeKey !== key)}
                    emphasized={activeKey === key}
                    onActivate={clickable ? () => setSelected(key) : undefined}
                    onHoverChange={(hovered) => setHoveredKey(hovered ? key : undefined)}
                    onFocus={() => setFocusedKey(key)}
                    onBlur={() => setFocusedKey(undefined)}
                  />
                );
              }}
            />
          </RechartsRadialBarChart>
        </ResponsiveContainer>
        {tooltipItem && tooltipKey && tooltip?.props.active !== false ? (
          <div role="tooltip" className="pointer-events-none absolute left-1/2 top-0 z-10 w-max max-w-full -translate-x-1/2 rounded-sm bg-[var(--chart-tooltip-background,var(--popover))] px-3.5 py-3 text-xs text-[var(--chart-tooltip-foreground,var(--popover-foreground))] shadow-lg">
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-[var(--chart-tooltip-muted,var(--muted-foreground))]">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colorVar(tooltipKey) }} />
                {config[tooltipKey]?.label ?? tooltipKey}
              </span>
              <span className="font-mono font-bold tabular-nums">{formatValue(tooltipKey, tooltipItem[dataKey])}</span>
            </div>
          </div>
        ) : null}
      </div>
      <div role="group" aria-labelledby={legendId} className="min-w-0 space-y-3">
        <h3 id={legendId} className="px-3 text-sm font-semibold text-foreground">{config[dataKey]?.label ?? "Values"}</h3>
        <div className="max-h-72 space-y-1 overflow-y-auto p-1">
          {data.map((item) => {
            const key = String(item[nameKey]);
            const canSelect = legend?.props.isClickable ?? clickable;
            return (
              <Button
                key={key}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={canSelect ? selected === key : undefined}
                onClick={canSelect ? () => setSelected(key) : undefined}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(undefined)}
                onFocus={() => setFocusedKey(key)}
                onBlur={() => setFocusedKey(undefined)}
                className={cn("h-9 w-full justify-start gap-3 px-3 text-muted-foreground", activeKey === key && "bg-accent text-foreground", activeKey && activeKey !== key && "opacity-50")}
              >
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: colorVar(key) }} />
                <span className="truncate">{config[key]?.label ?? key}</span>
                <span className="ml-auto shrink-0 font-mono font-bold tabular-nums text-foreground">{formatValue(key, item[dataKey])}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const RadialChart = Object.assign(ChartRadial, {
  RadialBar: RadialSeries,
  Tooltip,
  Legend,
});
