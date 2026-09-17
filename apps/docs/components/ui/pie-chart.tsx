"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Sector, type SectorProps, type PieSectorShapeProps } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  GradientFill,
  colorVar,
  pixelPatternId,
  pixelPatternUrl,
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
}: {
  geometry: SectorProps;
  label: string;
  selected: boolean;
  muted: boolean;
  emphasized?: boolean;
  onActivate?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const active = hovered || focused || selected || emphasized;
  const angle = (((geometry.startAngle ?? 0) + (geometry.endAngle ?? 0)) / 2) * Math.PI / 180;
  const offset = active ? 6 : 0;

  return (
    <Sector
      {...geometry}
      tabIndex={0}
      role={onActivate ? "button" : "img"}
      aria-label={label}
      aria-pressed={onActivate ? selected : undefined}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
        geometry.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        geometry.onMouseLeave?.(event);
      }}
      onFocus={() => {
        setFocused(true);
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
  return <ChartTooltip {...props} />;
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
      className={cn("h-72 w-full", className)}
      defaultSelectedDataKey={defaultSelectedSector}
      onSelectionChange={onSelectionChange}
    >
      {isLoading ? null : (
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
        >
          {children}
        </PieBody>
      )}
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
  children?: React.ReactNode;
}) {
  const { id, config, selected, setSelected } = useChart();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <defs>
          {data.map((item) => {
            const key = String(item[nameKey]);
            return (
              <GradientFill
                key={key}
                id={pixelPatternId(id, key)}
                color={colorVar(key)}
              />
            );
          })}
        </defs>
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
                muted={Boolean(selected && selected !== key)}
                emphasized={glowingSectors?.includes(key)}
                onActivate={() => setSelected(key)}
              />
            );
          }}
        >
          {data.map((item) => {
            const key = String(item[nameKey]);
            return (
              <Cell
                key={key}
                fill={pixelPatternUrl(id, key)}
              />
            );
          })}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export const PieChart = Object.assign(ChartPie, {
  Tooltip,
  Legend,
});
