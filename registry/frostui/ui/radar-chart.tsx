"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
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
import { cn } from "@/lib/utils";

type RadarSeriesProps = {
  dataKey: string;
  variant?: "filled" | "lines";
  fillOpacity?: number;
  isGlowing?: boolean;
  isClickable?: boolean;
};

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
  gridType = "polygon",
  defaultSelectedDataKey,
  onSelectionChange,
}: {
  data: Record<string, unknown>[];
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
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
      config={config}
      data={data}
      className={cn("h-72 w-full", className)}
      defaultSelectedDataKey={defaultSelectedDataKey}
      onSelectionChange={onSelectionChange}
    >
      {isLoading ? (
        <div className="h-full w-full animate-pulse bg-muted/40" />
      ) : (
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
  const { id, selected, setSelected } = useChart();

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
              fill={pixelPatternUrl(id, dataKey)}
              fillOpacity={variant === "lines" ? 0 : Math.max(fillOpacity, 0.85)}
              strokeWidth={2}
              opacity={muted ? 0.25 : 1}
              onClick={() => isClickable && setSelected(dataKey)}
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
