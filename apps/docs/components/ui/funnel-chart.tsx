"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartContainer, colorVar, pixelFillStyle, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type FunnelStage = {
  key: string;
  label: string;
  value: number;
  meta?: string;
};

export type FunnelChartProps = {
  stages: FunnelStage[];
  config?: ChartConfig;
  title?: string;
  description?: string;
  showConversion?: boolean;
  onStageClick?: (stage: FunnelStage) => void;
  emptyLabel?: string;
  className?: string;
};

const defaultConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  signups: { label: "Signups", color: "var(--chart-2)" },
  activated: { label: "Activated", color: "var(--chart-3)" },
  paid: { label: "Paid", color: "var(--chart-4)" },
} satisfies ChartConfig;

const formatNumber = (value: number) => value.toLocaleString("en-US");

export function FunnelChart({
  stages,
  config = defaultConfig,
  title = "Conversion funnel",
  description,
  showConversion = true,
  onStageClick,
  emptyLabel = "No funnel data available",
  className,
}: FunnelChartProps) {
  const [selected, setSelected] = React.useState<string>();
  const clean = stages.filter((stage) => Number.isFinite(stage.value) && stage.value > 0);
  const top = clean[0]?.value ?? 0;
  const selectedStage = clean.find((stage) => stage.key === selected);

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={title}>
      <p className="text-sm font-medium tracking-tight">{title}</p>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <ChartContainer
        config={{ ...defaultConfig, ...config }}
        data={clean as unknown as Record<string, unknown>[]}
        className="mt-5 w-full justify-start"
        variant="plain"
      >
        {!clean.length ? (
          <p className="flex min-h-40 items-center justify-center text-sm text-muted-foreground" role="status">
            {emptyLabel}
          </p>
        ) : (
          <ul role="list" aria-label={title} className="flex flex-col gap-1">
            {clean.map((stage, index) => {
              const width = top ? Math.max(12, (stage.value / top) * 100) : 12;
              const share = top ? (stage.value / top) * 100 : 0;
              const step = index ? (stage.value / clean[index - 1]!.value) * 100 : 100;
              const drop = 100 - step;
              const color = colorVar(stage.key);
              const muted = selected && selected !== stage.key;
              const summary = `${stage.label}: ${formatNumber(stage.value)}, ${share.toFixed(1)}% of ${clean[0]!.label}`;
              const interactive = Boolean(onStageClick);
              const body = (
                <>
                  <span className="sr-only">{summary}</span>
                  <span
                    aria-hidden
                    className="block h-10 w-full border border-border/60"
                    style={{
                      width: `${width}%`,
                      marginInline: "auto",
                      ...pixelFillStyle(color),
                    }}
                  />
                </>
              );
              return (
                <li key={stage.key} className={cn("min-w-0", muted && "opacity-40 transition-opacity")}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs text-muted-foreground">{stage.label}</span>
                    <span className="shrink-0 font-mono text-xs text-foreground">{formatNumber(stage.value)}</span>
                  </div>
                  {interactive ? (
                    <button
                      type="button"
                      aria-label={summary}
                      aria-pressed={selected === stage.key}
                      onClick={() => {
                        setSelected((current) => (current === stage.key ? undefined : stage.key));
                        onStageClick?.(stage);
                      }}
                      className="mt-1 block w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      {body}
                    </button>
                  ) : (
                    <div className="mt-1">{body}</div>
                  )}
                  {showConversion && index > 0 ? (
                    <p className="mt-1 text-center text-[10px] text-muted-foreground">
                      {Number.isFinite(step) ? `${step.toFixed(1)}% from previous` : "n/a"}
                      {Number.isFinite(drop) && drop > 0.05 ? ` · −${drop.toFixed(1)}%` : ""}
                    </p>
                  ) : null}
                  {selectedStage?.key === stage.key && stage.meta ? (
                    <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">{stage.meta}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </ChartContainer>
    </Card>
  );
}
