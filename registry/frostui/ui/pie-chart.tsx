"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Sector, type SectorProps, type PieSectorShapeProps } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  PixelSwatch,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PieInspectionContext = React.createContext<{
  key?: string;
  index?: number;
  dataKey: string;
  nameKey: string;
  setHoveredKey: (key?: string) => void;
  setFocusedKey: (key?: string) => void;
} | null>(null);

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
  const active = !muted && (hovered || focused || selected || emphasized);
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
      opacity={muted ? 0.6 : 1}
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
  const inspection = React.useContext(PieInspectionContext);
  const { config, data } = useChart();
  const index = inspection?.index;
  const key = inspection?.key;
  const dataKey = inspection?.dataKey;
  const item = index === undefined ? undefined : data[index];
  const series = key ? config[key] : undefined;
  const value = item === undefined || dataKey === undefined ? undefined : item[dataKey];
  const formatted = typeof value === "number" || typeof value === "string"
    ? series?.valueFormatter?.(value) ?? value.toLocaleString("en-US")
    : "";
  return (
    <ChartTooltip
      {...props}
      cursor={false}
      active={props.active === false ? false : item ? true : props.active}
      defaultIndex={index ?? props.defaultIndex}
      {...(item && key ? { content: () => (
        <div role="tooltip" className="rounded-sm bg-[var(--chart-tooltip-background,var(--popover))] px-3.5 py-3 text-xs text-[var(--chart-tooltip-foreground,var(--popover-foreground))] shadow-lg">
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-[var(--chart-tooltip-muted,var(--muted-foreground))]">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colorVar(key) }} />
              {series?.label ?? key}
            </span>
            <span className="font-mono font-bold tabular-nums">{formatted}</span>
          </div>
        </div>
      ) } : {})}
    />
  );
}
Tooltip.displayName = "Tooltip";
function Legend({ isClickable, ...props }: React.ComponentProps<typeof ChartLegend>) {
  const inspection = React.useContext(PieInspectionContext);
  const { config, data, selected, setSelected } = useChart();
  if (!inspection) return <ChartLegend {...props} isClickable={isClickable} />;
  return (
    <ChartLegend
      {...props}
      content={props.content ?? (
        <div role="group" aria-label="Chart series" className="flex flex-wrap justify-center gap-1 pt-3">
          {data.map((item) => {
            const key = String(item[inspection.nameKey]);
            return (
              <Button
                key={key}
                type="button"
                variant="ghost"
                size="sm"
                aria-pressed={isClickable ? selected === key : undefined}
                onClick={isClickable ? () => setSelected(key) : undefined}
                onMouseEnter={() => inspection.setHoveredKey(key)}
                onMouseLeave={() => inspection.setHoveredKey(undefined)}
                onFocus={() => inspection.setFocusedKey(key)}
                onBlur={() => inspection.setFocusedKey(undefined)}
                className={cn("h-8 gap-2 rounded-full px-3 text-xs text-muted-foreground", selected === key && "bg-background text-foreground shadow-sm")}
              >
                <PixelSwatch color={colorVar(key)} />
                {config[key]?.label ?? key}
              </Button>
            );
          })}
        </div>
      )}
    />
  );
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

  const tooltipKey = hoveredKey ?? focusedKey;
  const tooltipIndex = data.findIndex((item) => String(item[nameKey]) === tooltipKey);
  const chart = (
    <PieInspectionContext.Provider value={{ key: tooltipKey, index: tooltipIndex < 0 ? undefined : tooltipIndex, dataKey, nameKey, setHoveredKey, setFocusedKey }}>
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
    </PieInspectionContext.Provider>
  );

  if (!legendTitle) return chart;

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center gap-6 sm:flex-row">
      <div className="h-64 w-full min-w-0 sm:h-full sm:flex-1">{chart}</div>
      <div role="group" aria-labelledby={legendId} className="w-full min-w-0 space-y-5 sm:w-2/5">
        <h3 id={legendId} className="text-sm font-semibold text-foreground">{legendTitle}</h3>
        <div className="flex flex-col gap-4">
          {data.map((item) => {
            const key = String(item[nameKey]);
            const value = item[dataKey];
            const series = config[key];
            return (
              <Button
                key={key}
                type="button"
                variant="ghost"
                aria-pressed={selected === key}
                onClick={() => setSelected(key)}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(undefined)}
                onFocus={() => setFocusedKey(key)}
                onBlur={() => setFocusedKey(undefined)}
                className={cn("h-auto w-full justify-start gap-3 px-0 text-xs text-muted-foreground", activeKey && activeKey !== key && "opacity-60")}
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
