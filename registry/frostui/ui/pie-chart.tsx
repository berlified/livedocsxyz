"use client";

import * as React from "react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  colorVar,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

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
  innerRadius = 0,
  outerRadius = 110,
  paddingAngle = 2,
  cornerRadius = 6,
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
      config={config}
      data={data}
      className={cn("h-72 w-full", className)}
      defaultSelectedDataKey={defaultSelectedSector}
      onSelectionChange={onSelectionChange}
    >
      {isLoading ? (
        <div className="mx-auto size-48 animate-pulse rounded-full bg-muted/40" />
      ) : (
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
  const { selected, setSelected } = useChart();

  return (
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
        >
          {data.map((item) => {
            const key = String(item[nameKey]);
            const muted = selected && selected !== key;
            const glow = glowingSectors?.includes(key);
            return (
              <Cell
                key={key}
                fill={colorVar(key)}
                opacity={muted ? 0.25 : 1}
                style={
                  glow
                    ? { filter: `drop-shadow(0 0 10px ${colorVar(key)})` }
                    : undefined
                }
                onClick={() => setSelected(key)}
                cursor="pointer"
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
