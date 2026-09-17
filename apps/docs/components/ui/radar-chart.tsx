"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Polygon,
  type InternalRadarProps,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RadarSeriesProps = {
  dataKey: string;
  variant?: "filled" | "lines";
  fillOpacity?: number;
  isGlowing?: boolean;
  isClickable?: boolean;
};

function InteractiveRadarShape({
  geometry,
  label,
  selected,
  muted,
  glowing,
  emphasized,
  onHoverChange,
  onFocusChange,
  onActivate,
}: {
  geometry: InternalRadarProps;
  label: string;
  selected: boolean;
  muted: boolean;
  glowing?: boolean;
  emphasized?: boolean;
  onHoverChange: (hovered: boolean) => void;
  onFocusChange: (focused: boolean) => void;
  onActivate?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const active = hovered || focused || selected || emphasized;

  return (
    <g
      tabIndex={0}
      role={onActivate ? "button" : "img"}
      aria-label={label}
      aria-pressed={onActivate ? selected : undefined}
      className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onMouseEnter={() => { setHovered(true); onHoverChange(true); }}
      onMouseLeave={() => { setHovered(false); onHoverChange(false); }}
      onPointerDown={() => setFocused(false)}
      onFocus={(event) => { setFocused(event.currentTarget.matches(":focus-visible")); onFocusChange(true); }}
      onBlur={() => { setFocused(false); onFocusChange(false); }}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (onActivate && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          event.stopPropagation();
          onActivate();
        }
      }}
      style={{
        opacity: muted && !hovered && !focused ? 0.25 : 1,
        filter: active || glowing ? "drop-shadow(0 2px 3px color-mix(in oklab, var(--foreground) 12%, transparent))" : "drop-shadow(0 0 0 transparent)",
        transition: animationsEnabled && !reducedMotion ? "opacity 220ms ease, filter 220ms ease" : "none",
        cursor: onActivate ? "pointer" : undefined,
      }}
    >
      <Polygon
        points={geometry.points}
        baseLinePoints={geometry.isRange ? geometry.baseLinePoints : undefined}
        connectNulls={geometry.connectNulls}
        stroke={focused ? "var(--ring)" : geometry.stroke}
        strokeWidth={active ? 3 : 2}
        strokeLinejoin="round"
        fill={geometry.fill}
        fillOpacity={geometry.fillOpacity}
        style={{ transition: animationsEnabled && !reducedMotion ? "stroke-width 220ms ease" : "none" }}
      />
    </g>
  );
}

function RadarSeries(_props: RadarSeriesProps) {
  return null;
}
function Tooltip(props: React.ComponentProps<typeof ChartTooltip>) {
  return <ChartTooltip {...props} cursor={false} />;
}
Tooltip.displayName = "Tooltip";
function Legend({ wrapperStyle, ...props }: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} wrapperStyle={{ paddingTop: 12, ...wrapperStyle }} />;
}
Legend.displayName = "Legend";

function ChartRadar({
  data,
  config,
  className,
  children,
  isLoading,
  reaction,
  gridType = "polygon",
  defaultSelectedDataKey,
  onSelectionChange,
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  gridType?: "polygon" | "circle";
  defaultSelectedDataKey?: string;
  onSelectionChange?: (key?: string) => void;
}) {
  const childArray = React.Children.toArray(children);
  const series = childArray.filter(
    (child) => React.isValidElement(child) && child.type === RadarSeries
  ) as React.ReactElement<RadarSeriesProps>[];
  const extras = childArray.filter(
    (child) => !(React.isValidElement(child) && child.type === RadarSeries)
  );

  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="radar"
      reaction={reaction}
      config={config}
      data={data}
      className={cn("h-auto min-h-[420px] w-full sm:h-[420px]", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      <RadarBody
        data={data}
        series={series}
        extras={extras}
        gridType={gridType}
      />
    </ChartContainer>
  );
}

function RadarBody({
  data,
  series,
  extras,
  gridType,
}: {
  data: Record<string, unknown>[];
  series: React.ReactElement<RadarSeriesProps>[];
  extras: React.ReactNode[];
  gridType: "polygon" | "circle";
}) {
  const { config, selected, setSelected } = useChart();
  const [hoveredKey, setHoveredKey] = React.useState<string>();
  const [focusedKey, setFocusedKey] = React.useState<string>();
  const [size, setSize] = React.useState({ width: 360, height: 340 });
  const activeKey = hoveredKey ?? focusedKey ?? selected;
  const tooltipKey = hoveredKey ?? focusedKey;
  const legendId = React.useId();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const legend = extras.find((child) => React.isValidElement(child) && child.type === Legend) as React.ReactElement<React.ComponentProps<typeof ChartLegend>> | undefined;
  const tooltip = extras.find((child) => React.isValidElement(child) && child.type === Tooltip) as React.ReactElement<React.ComponentProps<typeof ChartTooltip>> | undefined;
  const average = (key: string) => {
    const values = data.map((item) => item[key]).filter((value): value is number => typeof value === "number" && Number.isFinite(value));
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length * 10) / 10 : 0;
  };
  const formatValue = (key: string, value: unknown) => typeof value === "number" || typeof value === "string"
    ? config[key]?.valueFormatter?.(value) ?? value.toLocaleString("en-US") : "—";
  const radius = Math.max(24, Math.min(size.width / 2 - 56, size.height / 2 - 32));

  return (
    <div className="grid h-full min-h-0 w-full items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(160px,0.6fr)]">
      <div className="relative h-80 min-w-0 sm:h-full">
        <ResponsiveContainer width="100%" height="100%" onResize={(width, height) => setSize({ width, height })}>
          <RechartsRadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={radius}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <PolarGrid
              gridType={gridType}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <PolarRadiusAxis domain={[0, "dataMax"]} tick={false} axisLine={false} />
            {extras.filter((child) => !(React.isValidElement(child) && (child.type === Legend || child.type === Tooltip)))}
            {tooltip ? React.cloneElement(tooltip, { active: tooltipKey ? false : tooltip.props.active }) : null}
            {series.map((item) => {
              const {
                dataKey,
                variant = "filled",
                fillOpacity = 0.3,
                isGlowing,
                isClickable,
              } = item.props;
              const muted = activeKey && activeKey !== dataKey;
              return (
                <Radar
                  key={dataKey}
                  dataKey={dataKey}
                  stroke={colorVar(dataKey)}
                  fill={variant === "lines" ? "none" : colorVar(dataKey)}
                  fillOpacity={variant === "lines" ? 0 : fillOpacity}
                  strokeLinejoin="round"
                  strokeWidth={2}
                  isAnimationActive={animationsEnabled && !reducedMotion}
                  animationBegin={0}
                  animationDuration={600}
                  shape={(props: InternalRadarProps) => (
                    <InteractiveRadarShape
                      geometry={props}
                      label={typeof config[dataKey]?.label === "string" ? String(config[dataKey]?.label) : dataKey}
                      selected={selected === dataKey}
                      muted={Boolean(muted)}
                      glowing={isGlowing}
                      emphasized={activeKey === dataKey}
                      onHoverChange={(hovered) => setHoveredKey(hovered ? dataKey : undefined)}
                      onFocusChange={(focused) => setFocusedKey(focused ? dataKey : undefined)}
                      onActivate={isClickable !== false ? () => setSelected(dataKey) : undefined}
                    />
                  )}
                />
              );
            })}
          </RechartsRadarChart>
        </ResponsiveContainer>
        {tooltipKey && tooltip?.props.active !== false ? (
          <div role="tooltip" className="pointer-events-none absolute left-1/2 top-0 z-10 w-max max-w-full -translate-x-1/2 rounded-sm bg-[var(--chart-tooltip-background,var(--popover))] px-3.5 py-3 text-xs text-[var(--chart-tooltip-foreground,var(--popover-foreground))] shadow-lg">
            <p className="mb-2 flex items-center gap-2 font-bold">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colorVar(tooltipKey) }} />
              {config[tooltipKey]?.label ?? tooltipKey}
            </p>
            <div className="max-h-56 space-y-2 overflow-hidden">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-6">
                  <span className="text-[var(--chart-tooltip-muted,var(--muted-foreground))]">{String(item.metric ?? index + 1)}</span>
                  <span className="font-mono font-bold tabular-nums">{formatValue(tooltipKey, item[tooltipKey])}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div role="group" aria-labelledby={legendId} className="min-w-0 space-y-3">
        <h3 id={legendId} className="px-3 text-sm font-semibold text-foreground">Average score</h3>
        <div className="max-h-72 space-y-1 overflow-y-auto p-1">
          {series.map(({ props: { dataKey, isClickable } }) => {
            const canSelect = legend?.props.isClickable ?? isClickable !== false;
            return (
              <Button
                key={dataKey}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={canSelect ? selected === dataKey : undefined}
                onClick={canSelect ? () => setSelected(dataKey) : undefined}
                onMouseEnter={() => setHoveredKey(dataKey)}
                onMouseLeave={() => setHoveredKey(undefined)}
                onFocus={() => setFocusedKey(dataKey)}
                onBlur={() => setFocusedKey(undefined)}
                className={cn("h-9 w-full justify-start gap-3 px-3 text-muted-foreground", activeKey === dataKey && "bg-accent text-foreground", activeKey && activeKey !== dataKey && "opacity-50")}
              >
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: colorVar(dataKey) }} />
                <span className="truncate">{config[dataKey]?.label ?? dataKey}</span>
                <span className="ml-auto shrink-0 font-mono font-bold tabular-nums text-foreground">{formatValue(dataKey, average(dataKey))}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const RadarChart = Object.assign(ChartRadar, {
  Radar: RadarSeries,
  Tooltip,
  Legend,
});
