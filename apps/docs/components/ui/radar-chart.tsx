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
  GradientFill,
  colorVar,
  pixelPatternId,
  pixelPatternUrl,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
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
  onActivate,
}: {
  geometry: InternalRadarProps;
  label: string;
  selected: boolean;
  muted: boolean;
  glowing?: boolean;
  onActivate?: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();
  const active = hovered || focused || selected;

  return (
    <g
      tabIndex={0}
      role={onActivate ? "button" : "img"}
      aria-label={label}
      aria-pressed={onActivate ? selected : undefined}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
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
  return <ChartTooltip {...props} />;
}
Tooltip.displayName = "Tooltip";
function Legend(props: React.ComponentProps<typeof ChartLegend>) {
  return <ChartLegend {...props} />;
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
      reaction={reaction}
      config={config}
      data={data}
      className={cn("h-72 w-full", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      {isLoading ? null : (
        <RadarBody
          data={data}
          series={series}
          extras={extras}
          gridType={gridType}
        />
      )}
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
  const { id, config, selected, setSelected } = useChart();
  const reducedMotion = useChartReducedMotion();
  const { animationsEnabled = true } = useChartReactions();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <defs>
          {series.map((item) => (
            <GradientFill
              key={item.props.dataKey}
              id={pixelPatternId(id, item.props.dataKey)}
              color={colorVar(item.props.dataKey)}
            />
          ))}
        </defs>
        <PolarGrid
          gridType={gridType}
          stroke="var(--border)"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        {extras}
        {series.map((item) => {
          const {
            dataKey,
            variant = "filled",
            fillOpacity = 0.2,
            isGlowing,
            isClickable,
          } = item.props;
          const muted = selected && selected !== dataKey;
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
                  onActivate={isClickable ? () => setSelected(dataKey) : undefined}
                />
              )}
            />
          );
        })}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}

export const RadarChart = Object.assign(ChartRadar, {
  Radar: RadarSeries,
  Tooltip,
  Legend,
});
