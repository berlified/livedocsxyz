"use client";

import * as React from "react";

import { badgeVariants } from "@/components/ui/badge";
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
  const drawing = React.useRef<HTMLDivElement>(null);
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

  React.useEffect(() => {
    if (!animate || isLoading || !available || !drawing.current?.animate) return;
    const animation = drawing.current.animate(
      [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
      { duration: 850, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    return () => animation.cancel();
  }, [animate, isLoading, available]);

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-label={title} aria-busy={isLoading}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium tracking-tight">{title}</h3>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {available && showConversion ? <div className="text-right"><p className="font-mono text-xl font-semibold tracking-tight">{conversion(last, first)}</p><p className="text-[10px] text-muted-foreground">Overall conversion</p></div> : null}
      </div>
      <ChartContainer config={config} data={stages} isLoading={isLoading} loadingVariant="funnel" reaction={reaction} variant="plain" className="mt-5 min-h-48">
        {!available ? <p role="status" className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</p> : (
          <>
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] gap-3 sm:gap-6">
              <div ref={drawing} className="rounded-xl bg-accent/20">
                <svg viewBox={`0 0 240 ${stages.length * 72}`} preserveAspectRatio="none" className="w-full" style={{ height: stages.length * 72 }} aria-hidden="true">
                  {stages.map((stage, index) => {
                    const top = width(stage.value);
                    const bottom = width(stages[index + 1]?.value ?? stage.value * 0.7);
                    const y = index * 72;
                    const fill = config[stage.key] ? `var(--color-${stage.key}, var(--chart-1))` : "var(--chart-1)";
                    const emphasized = active === index || selected === index;
                    return (
                      <path key={`${stage.key}-${index}`} d={`M ${120 - top / 2} ${y} H ${120 + top / 2} C ${120 + top / 2} ${y + 30} ${120 + bottom / 2} ${y + 42} ${120 + bottom / 2} ${y + 72} H ${120 - bottom / 2} C ${120 - bottom / 2} ${y + 42} ${120 - top / 2} ${y + 30} ${120 - top / 2} ${y} Z`}
                        fill={fill} fillOpacity={emphasized ? 1 : 0.85 - index / stages.length * 0.2}
                        stroke="var(--card)" strokeWidth={1.5} strokeLinejoin="round"
                        className={cn("cursor-pointer", animate && "transition-[fill-opacity] duration-300")}
                        onClick={() => { setSelected(selected === index ? null : index); if (valid(stage.value)) onStageClick?.(stage); }}
                        onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} />
                    );
                  })}
                </svg>
              </div>
              <ol className="min-w-0">
                {stages.map((stage, index) => (
                  <li key={`${stage.key}-${index}`} className="h-[72px] min-w-0">
                    <Button type="button" variant="ghost" aria-pressed={selected === index}
                      aria-label={`${stage.label}: ${valid(stage.value) ? formatValue(stage.value) : "Unavailable"}${index && showConversion ? `, ${conversion(stage.value, stages[index - 1]!.value)} from previous` : ""}`}
                      className={cn("h-full w-full justify-start whitespace-normal rounded-lg px-2 text-left", !animate && "transition-none", (active === index || selected === index) && "bg-accent")}
                      onFocus={() => setActive(index)} onBlur={() => setActive(null)}
                      onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)}
                      onKeyDown={(event) => { if (event.key === "Escape") { setActive(null); setSelected(null); } }}
                      onClick={() => { setSelected(selected === index ? null : index); if (valid(stage.value)) onStageClick?.(stage); }}>
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs text-muted-foreground">{stage.label}</span><span className="mt-1 block font-mono text-base font-medium">{valid(stage.value) ? formatValue(stage.value) : "—"}</span></span>
                      {showConversion ? <span className="shrink-0 text-right"><span className={cn(badgeVariants({ variant: "outline" }), "bg-card font-mono text-[11px]")}>{conversion(stage.value, index > 0 ? stages[index - 1]!.value : first)}</span><span className="mt-1 block text-[9px] text-muted-foreground">{index > 0 ? "of previous" : "baseline"}</span></span> : null}
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
