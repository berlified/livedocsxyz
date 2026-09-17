"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Sector, type SectorProps, type PieSectorShapeProps } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export function ChartInteractiveSector({
  geometry,
  label,
  selected,
  muted,
  emphasized = false,
  onActivate,
  onFocus,
  onBlur,
  onHoverChange,
}: {
  geometry: SectorProps;
  label: string;
  selected: boolean;
  muted: boolean;
  emphasized?: boolean;
  onActivate?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const active = hovered || focused || selected || emphasized;
  const angle = (((geometry.startAngle ?? 0) + (geometry.endAngle ?? 0)) / 2) * Math.PI / 180;
  const offset = active ? 6 : 0;
  const { key: sectorKey, ...sectorProps } = geometry as SectorProps & { key?: React.Key };

  return (
    <Sector
      key={sectorKey}
      {...sectorProps}
      tabIndex={0}
      role={onActivate ? "button" : "img"}
      aria-label={label}
      aria-pressed={onActivate ? selected : undefined}
      className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      opacity={muted && !active ? 0.3 : 1}
      stroke={focused ? "var(--ring)" : geometry.stroke}
      strokeWidth={focused ? 3 : geometry.strokeWidth}
      style={{
        transform: `translate(${Math.cos(angle) * offset}px, ${-Math.sin(angle) * offset}px)`,
        transition: animationsEnabled && !reducedMotion ? "transform 220ms ease, opacity 220ms ease, stroke-width 220ms ease" : "none",
        cursor: onActivate ? "pointer" : undefined,
      }}
      onMouseEnter={(event) => {
        setHovered(true);
        onHoverChange?.(true);
        geometry.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onHoverChange?.(false);
        geometry.onMouseLeave?.(event);
      }}
      onPointerDown={() => setFocused(false)}
      onFocus={(event) => {
        setFocused(event.currentTarget.matches(":focus-visible"));
        onFocus?.();
      }}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      onClick={(event) => {
        geometry.onClick?.(event);
        onActivate?.();
      }}
      onKeyDown={(event) => {
        if (onActivate && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          event.stopPropagation();
          onActivate();
        }
      }}
    />
  );
}

function Tooltip(props: React.ComponentProps<typeof ChartTooltip>) {
  return <ChartTooltip {...props} cursor={false} />;
}
Tooltip.displayName = "Tooltip";
function Legend(props: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} />;
}
Legend.displayName = "Legend";

function ChartPie({
  data,
  config,
  dataKey,
  nameKey,
  className,
  children,
  isLoading,
  reaction,
  innerRadius = 0,
  outerRadius = 110,
  paddingAngle = 2,
  cornerRadius = 4,
  startAngle = 90,
  endAngle = -270,
  glowingSectors,
  showLabels,
  legendTitle,
  defaultSelectedSector,
  onSelectionChange,
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  glowingSectors?: string[];
  showLabels?: boolean;
  legendTitle?: React.ReactNode;
  defaultSelectedSector?: string;
  onSelectionChange?: (key?: string) => void;
}) {
  return (
    <ChartContainer
      isLoading={isLoading}
      loadingVariant="donut"
      reaction={reaction}
      config={config}
      data={data}
      className={cn("h-80 w-full", legendTitle && "h-auto sm:h-[340px]", className)}
      defaultSelectedDataKey={defaultSelectedSector}
      onSelectionChange={onSelectionChange}
    >
      <PieBody
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        paddingAngle={paddingAngle}
        cornerRadius={cornerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        glowingSectors={glowingSectors}
        showLabels={showLabels}
        legendTitle={legendTitle}
      >
        {children}
      </PieBody>
    </ChartContainer>
  );
}

function PieBody({
  data,
  dataKey,
  nameKey,
  innerRadius,
  outerRadius,
  paddingAngle,
  cornerRadius,
  startAngle,
  endAngle,
  glowingSectors,
  showLabels,
  legendTitle,
  children,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: string;
  innerRadius: number;
  outerRadius: number;
  paddingAngle: number;
  cornerRadius: number;
  startAngle: number;
  endAngle: number;
  glowingSectors?: string[];
  showLabels?: boolean;
  legendTitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { config, selected, setSelected } = useChart();
  const [hoveredKey, setHoveredKey] = React.useState<string>();
  const [focusedKey, setFocusedKey] = React.useState<string>();
  const activeKey = hoveredKey ?? focusedKey ?? selected;
  const legendId = React.useId();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();

  const chart = (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        {children}
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          cornerRadius={cornerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          stroke="var(--background)"
          label={showLabels ? ({ name }) => name : false}
          rootTabIndex={-1}
          isAnimationActive={animationsEnabled && !reducedMotion}
          animationBegin={0}
          animationDuration={600}
          shape={(props: PieSectorShapeProps) => {
            const item = data[props.index];
            const key = String(item?.[nameKey] ?? props.name ?? "");
            const label = config[key]?.label;
            return (
              <ChartInteractiveSector
                geometry={props}
                label={`${typeof label === "string" ? label : key}: ${String(item?.[dataKey] ?? props.value)}`}
                selected={selected === key}
                muted={Boolean(activeKey && activeKey !== key)}
                emphasized={activeKey === key || glowingSectors?.includes(key)}
                onActivate={() => setSelected(key)}
                onHoverChange={(hovered) => setHoveredKey(hovered ? key : undefined)}
                onFocus={() => setFocusedKey(key)}
                onBlur={() => setFocusedKey(undefined)}
              />
            );
          }}
        >
          {data.map((item) => {
            const key = String(item[nameKey]);
            return (
              <Cell
                key={key}
                fill={colorVar(key)}
              />
            );
          })}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  if (!legendTitle) return chart;

  return (
    <div className="grid h-full min-h-0 w-full items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.8fr)]">
      <div className="h-64 min-w-0 sm:h-full">{chart}</div>
      <div role="group" aria-labelledby={legendId} className="min-w-0 space-y-3">
        <h3 id={legendId} className="px-3 text-sm font-semibold text-foreground">{legendTitle}</h3>
        <div className="space-y-1">
          {data.map((item) => {
            const key = String(item[nameKey]);
            const value = item[dataKey];
            const series = config[key];
            return (
              <Button
                key={key}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={selected === key}
                onClick={() => setSelected(key)}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(undefined)}
                onFocus={() => setFocusedKey(key)}
                onBlur={() => setFocusedKey(undefined)}
                className={cn(
                  "h-9 w-full justify-start gap-3 px-3 text-muted-foreground",
                  activeKey === key && "bg-accent text-foreground",
                  activeKey && activeKey !== key && "opacity-50"
                )}
              >
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: colorVar(key) }} />
                <span className="truncate">{series?.label ?? key}</span>
                <span className="ml-auto font-mono font-bold tabular-nums text-foreground">
                  {typeof value === "number" || typeof value === "string"
                    ? series?.valueFormatter?.(value) ?? value.toLocaleString("en-US")
                    : ""}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const PieChart = Object.assign(ChartPie, {
  Tooltip,
  Legend,
});
