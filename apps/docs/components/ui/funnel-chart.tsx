"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

export type FunnelStage = { key: string; label: string; value: number; meta?: string };
export type FunnelChartProps = {
  stages: FunnelStage[];
  config?: ChartConfig;
  title?: string;
  description?: string;
  showConversion?: boolean;
  formatValue?: (value: number) => string;
  onStageClick?: (stage: FunnelStage) => void;
  emptyLabel?: string;
  className?: string;
  isLoading?: boolean;
  reaction?: ChartReactionOptions;
};

const formatNumber = (value: number) => value.toLocaleString("en-US");
const valid = (value: number) => Number.isFinite(value) && value >= 0;
const conversion = (value: number, baseline: number) => {
  const ratio = value / baseline * 100;
  return valid(value) && valid(baseline) && baseline > 0 && Number.isFinite(ratio) ? `${ratio.toFixed(1)}%` : "—";
};

export function FunnelChart({
  stages,
  config = {},
  title = "Conversion funnel",
  description,
  showConversion = true,
  formatValue = formatNumber,
  onStageClick,
  emptyLabel = "No funnel data available",
  className,
  isLoading,
  reaction,
}: FunnelChartProps) {
  const [active, setActive] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const reducedMotion = useChartReducedMotion();
  const settings = useChartReactions();
  const animate = !reducedMotion && settings.animationsEnabled !== false;
  const max = stages.reduce((value, stage) => valid(stage.value) ? Math.max(value, stage.value) : value, 0);
  const available = stages.some((stage) => valid(stage.value));
  const first = stages[0]?.value ?? 0;
  const last = stages[stages.length - 1]?.value ?? 0;
  const width = (value: number) => valid(value) && max > 0 ? value / max * 216 : 0;
  const activeStage = active === null ? undefined : stages[active];

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={title} aria-busy={isLoading}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium tracking-tight">{title}</h3>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {available && showConversion ? <div className="text-right"><p className="font-mono text-xl font-semibold tracking-tight">{conversion(last, first)}</p><p className="text-[10px] text-muted-foreground">Overall conversion</p></div> : null}
      </div>
      <ChartContainer config={config} data={stages} isLoading={isLoading} reaction={reaction} variant="plain" className="mt-5 min-h-48">
        {!available ? <p role="status" className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</p> : (
          <>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4">
              <svg viewBox={`0 0 240 ${stages.length * 64}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden="true">
                {stages.map((stage, index) => {
                  const top = width(stage.value);
                  const bottom = width(stages[index + 1]?.value ?? stage.value);
                  const y = index * 64;
                  const color = config[stage.key]?.color ?? config[stage.key]?.colors?.dark?.[0] ?? "var(--chart-1)";
                  const fill = config[stage.key] ? `var(--color-${stage.key})` : color;
                  return (
                    <path key={`${stage.key}-${index}`} d={`M ${120 - top / 2} ${y} H ${120 + top / 2} L ${120 + bottom / 2} ${y + 64} H ${120 - bottom / 2} Z`}
                      fill={fill} fillOpacity={active === index || selected === index ? 0.85 : 0.16 + (1 - index / stages.length) * 0.3}
                      stroke="var(--card)" strokeWidth={1.5} strokeLinejoin="round"
                      className={cn(animate && "transition-[fill-opacity] duration-200")}
                      onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} />
                  );
                })}
              </svg>
              <ol className="min-w-0">
                {stages.map((stage, index) => (
                  <li key={`${stage.key}-${index}`} className="h-16 min-w-0">
                    <Button type="button" variant="ghost" aria-pressed={selected === index}
                      aria-label={`${stage.label}: ${valid(stage.value) ? formatValue(stage.value) : "Unavailable"}${index && showConversion ? `, ${conversion(stage.value, stages[index - 1]!.value)} from previous` : ""}`}
                      className={cn("h-full w-full justify-start whitespace-normal rounded-lg px-2 text-left", !animate && "transition-none", (active === index || selected === index) && "bg-accent")}
                      onFocus={() => setActive(index)} onBlur={() => setActive(null)}
                      onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)}
                      onKeyDown={(event) => { if (event.key === "Escape") { setActive(null); setSelected(null); } }}
                      onClick={() => { setSelected(selected === index ? null : index); if (valid(stage.value)) onStageClick?.(stage); }}>
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs text-muted-foreground">{stage.label}</span><span className="mt-1 block font-mono text-base font-medium">{valid(stage.value) ? formatValue(stage.value) : "—"}</span></span>
                      {showConversion && index > 0 ? <span className="shrink-0 text-right"><span className="block font-mono text-xs">{conversion(stage.value, stages[index - 1]!.value)}</span><span className="text-[9px] text-muted-foreground">of previous</span></span> : null}
                    </Button>
                  </li>
                ))}
              </ol>
            </div>
            <p role="status" className="mt-4 min-h-4 border-t border-border pt-3 text-xs text-muted-foreground">{activeStage?.meta ?? (selected !== null ? stages[selected]?.meta : undefined) ?? "Select a stage to inspect conversion. Unavailable and negative counts are shown as —."}</p>
          </>
        )}
      </ChartContainer>
    </Card>
  );
}
