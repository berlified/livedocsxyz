"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
  GradientFill,
  PixelSwatch,
  colorVar,
  pixelPatternId,
  pixelPatternUrl,
  useChart,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function CashflowChartRoot({
  title,
  inflowLabel,
  outflowLabel,
  inflowValue,
  outflowValue,
  data,
  config,
  className,
  isLoading,
  reaction,
}: {
  title?: string;
  inflowLabel?: string;
  outflowLabel?: string;
  inflowValue?: string;
  outflowValue?: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartContainer isLoading={isLoading} loadingVariant="cashflow" reaction={reaction} config={config} data={data} className="w-full justify-start" variant="plain">
        {title ? <p className="text-sm text-muted-foreground">{title}</p> : null}
        <div className="mt-3 flex flex-wrap gap-6">
        <div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <PixelSwatch color={colorVar("inflow")} />
            {inflowLabel ?? config.inflow?.label ?? "Inflow"}
          </p>
          {inflowValue ? (
            <p className="mt-1 tabular-nums text-2xl font-semibold tracking-tight">{inflowValue}</p>
          ) : null}
        </div>
        <div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <PixelSwatch color={colorVar("outflow")} />
            {outflowLabel ?? config.outflow?.label ?? "Outflow"}
          </p>
          {outflowValue ? (
            <p className="mt-1 tabular-nums text-2xl font-semibold tracking-tight">{outflowValue}</p>
          ) : null}
        </div>
        </div>
      <div className="mt-4 h-64 w-full">
        <CashflowBars data={data} />
      </div>
      </ChartContainer>
    </Card>
  );
}

function CashflowBars({ data }: { data: Record<string, unknown>[] }) {
  const { id } = useChart();
  const [hovered, setHovered] = React.useState<{ key: string; index: number }>();
  const interaction = (key: string, index: number) => ({
    onMouseEnter: () => setHovered({ key, index }),
    onMouseLeave: () => setHovered(undefined),
    onFocus: () => setHovered({ key, index }),
    onBlur: () => setHovered(undefined),
    tabIndex: 0,
    "aria-label": `${data[index]?.month}: ${key} ${data[index]?.[key]}`,
    className: "transition-opacity duration-150 motion-reduce:transition-none",
    opacity: hovered && (hovered.key !== key || hovered.index !== index) ? 0.6 : 1,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} stackOffset="sign" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <GradientFill id={pixelPatternId(id, "inflow")} color={colorVar("inflow")} startOpacity={0.85} endOpacity={0.4} />
          <GradientFill id={pixelPatternId(id, "outflow")} color={colorVar("outflow")} startOpacity={0.4} endOpacity={0.85} />
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
        />
        <YAxis hide />
        <ReferenceLine y={0} stroke="var(--border)" />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="inflow" stackId="flow" radius={0} activeBar={false} isAnimationActive={false}>
          {data.map((_, index) => (
            <Cell key={`in-${index}`} fill={pixelPatternUrl(id, "inflow")} {...interaction("inflow", index)} />
          ))}
        </Bar>
        <Bar dataKey="outflow" stackId="flow" radius={0} activeBar={false} isAnimationActive={false}>
          {data.map((_, index) => (
            <Cell key={`out-${index}`} fill={pixelPatternUrl(id, "outflow")} {...interaction("outflow", index)} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export const CashflowChart = Object.assign(CashflowChartRoot, {});
