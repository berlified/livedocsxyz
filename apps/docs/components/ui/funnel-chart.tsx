"use client";

import * as React from "react";

import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltipSurface, type ChartConfig } from "@/components/ui/chart";
import { ChartSkeleton, useChartReducedMotion, useChartReactions, type ChartReactionOptions } from "@/components/ui/chart-reactions";
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

const formatNumber = (value: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value).replace("K", "k");
const valid = (value: number) => Number.isFinite(value) && value >= 0;
const conversion = (value: number, baseline: number, digits = 1) => {
  const ratio = value / baseline * 100;
  return valid(value) && valid(baseline) && baseline > 0 && Number.isFinite(ratio) ? `${Number(ratio.toFixed(digits))}%` : "—";
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
  const id = React.useId().replace(/:/g, "");
  const drawing = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const tooltipHost = React.useRef<HTMLDivElement>(null);
  const [tooltipPoint, setTooltipPoint] = React.useState({ left: 0, top: 0 });
  const placeTooltip = (element: HTMLElement) => {
    const host = tooltipHost.current?.getBoundingClientRect();
    const bounds = element.getBoundingClientRect();
    if (host) setTooltipPoint({ left: Math.max(0, Math.min(bounds.left - host.left, host.width - 208)), top: bounds.top - host.top + 44 });
    setDismissed(false);
  };
  React.useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") setDismissed(true); };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, []);
  const reducedMotion = useChartReducedMotion();
  const settings = useChartReactions();
  const animate = !reducedMotion && settings.animationsEnabled !== false;
  const loading = Boolean(isLoading || settings.isLoading);
  const max = stages.reduce((value, stage) => valid(stage.value) ? Math.max(value, stage.value) : value, 0);
  const available = stages.some((stage) => valid(stage.value));
  const first = stages[0]?.value ?? 0;
  const last = stages[stages.length - 1]?.value ?? 0;
  const transient = dismissed ? null : hovered ?? focused;
  const active = transient ?? selected;
  const tooltipStage = stages.find((stage) => stage.key === transient);
  const activeStage = stages.find((stage) => stage.key === active);
  const step = 1000 / Math.max(1, stages.length);
  const proportions = [...stages.map((stage) => stage.value), last].map((value) => valid(value) && max > 0 ? value / max : 0);
  const flow = (halo: number) => {
    const top = (index: number) => 112 - proportions[index]! * (86 + halo);
    const bottom = (index: number) => 112 + proportions[index]! * (86 + halo);
    let path = `M 0 ${top(0)}`;
    for (let index = 0; index < stages.length; index++) {
      path += ` C ${(index + 1 / 3) * step} ${top(index)} ${(index + 2 / 3) * step} ${top(index + 1)} ${(index + 1) * step} ${top(index + 1)}`;
    }
    path += ` L 1000 ${bottom(stages.length)}`;
    for (let index = stages.length - 1; index >= 0; index--) {
      path += ` C ${(index + 2 / 3) * step} ${bottom(index + 1)} ${(index + 1 / 3) * step} ${bottom(index)} ${index * step} ${bottom(index)}`;
    }
    return `${path} Z`;
  };
  const paths = [flow(18), flow(9), flow(0)];
  const stageSignature = JSON.stringify(stages.map(({ key, value }) => [key, value]));

  React.useEffect(() => {
    if (!animate || loading || !available) return;
    const animations = Array.from(drawing.current?.querySelectorAll<HTMLElement | SVGElement>("[data-funnel-stage]") ?? []).map((element) => element.animate?.(
      [{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)" }],
      { duration: 650, delay: Number(element.dataset.funnelStage) * 90, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
    ));
    return () => animations.forEach((animation) => animation?.cancel());
  }, [animate, loading, available, stageSignature, settings.replayKey]);

  function navigate(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = Math.min(stages.length - 1, index + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else if (event.key === "Escape") { setSelected(null); setDismissed(true); return; }
    else return;
    event.preventDefault();
    drawing.current?.querySelector<HTMLButtonElement>(`[data-stage-index="${next}"]`)?.focus();
  }

  return (
    <Card className={cn("min-w-0 w-full p-5", className)} role="region" aria-labelledby={`${id}-title`} aria-busy={loading}>
      <ChartSkeleton isLoading={isLoading}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${id}-title`} className="text-sm font-medium tracking-tight">{title}</h3>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {available && showConversion ? <div className="text-right"><p className="font-mono text-xl font-semibold tracking-tight">{conversion(last, first)}</p><p className="text-[10px] text-muted-foreground">Overall conversion</p></div> : null}
      </div>
      <ChartContainer config={config} data={stages} isLoading={isLoading} loadingVariant="funnel" reaction={reaction} variant="plain" className="mt-5">
        {!available ? <p role="status" className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">{emptyLabel}</p> : (
          <>
            <p id={`${id}-help`} className="sr-only">Use Left and Right arrow keys to explore stages. Press Enter or Space to select, or Escape to clear selection. Stage percentages compare each stage with the first stage, rounded to the nearest whole percent.</p>
            <div ref={tooltipHost} className="relative">
            <div className="overflow-x-auto p-1" onScroll={() => setDismissed(true)}>
              <div ref={drawing} className="relative" style={{ minWidth: Math.max(360, stages.length * 104) }}>
                <svg viewBox="0 0 1000 224" preserveAspectRatio="none" className="pointer-events-none absolute top-11 h-56 w-full overflow-visible" aria-hidden="true">
                  <defs>
                    {stages.map((stage, index) => (
                      <clipPath key={`${stage.key}-${index}`} id={`${id}-stage-${index}`}><rect x={index * step} y="0" width={step} height="224" /></clipPath>
                    ))}
                  </defs>
                  {stages.map((stage, index) => {
                    const fill = `var(--color-${stage.key}, var(--chart-2, var(--primary)))`;
                    const emphasized = active === stage.key || selected === stage.key;
                    return (
                      <g key={`${stage.key}-${index}`} clipPath={`url(#${id}-stage-${index})`} opacity={transient !== null && transient !== stage.key ? 0.6 : 1} className={cn(animate && "transition-opacity duration-150")}>
                        <g data-funnel-stage={index}>
                          {paths.map((path, layer) => <path key={layer} d={path} fill={fill} fillOpacity={layer === 2 ? emphasized ? 0.92 : 0.72 : layer === 1 ? 0.13 : 0.06} className={cn(animate && "transition-[fill-opacity] duration-300")} />)}
                        </g>
                      </g>
                    );
                  })}
                  {stages.slice(1).map((stage, index) => <line key={`${stage.key}-${index}`} x1={(index + 1) * step} x2={(index + 1) * step} y1="8" y2="216" stroke="var(--background)" strokeOpacity="0.85" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
                </svg>
                <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
                  {stages.map((stage, index) => (
                    <li key={`${stage.key}-${index}`} className="min-w-0" data-funnel-stage={index}>
                      <Button type="button" variant="ghost" data-stage-index={index} aria-pressed={selected === stage.key}
                        aria-label={`${stage.label}: ${valid(stage.value) ? formatValue(stage.value) : "Unavailable"}${showConversion ? `, ${conversion(stage.value, first, 0)} of first stage` : ""}`}
                        aria-describedby={transient === stage.key ? `${id}-help ${id}-tooltip` : `${id}-help`}
                        className={cn("grid h-[312px] w-full grid-rows-[44px_224px_44px] gap-0 rounded-lg p-0 text-center hover:bg-accent/10 hover:text-foreground", !animate && "transition-none", (active === stage.key || selected === stage.key) && "bg-accent/10")}
                        onFocus={(event) => { setFocused(stage.key); placeTooltip(event.currentTarget); }} onBlur={() => setFocused(null)}
                        onMouseEnter={(event) => { setHovered(stage.key); placeTooltip(event.currentTarget); }} onMouseLeave={() => setHovered(null)}
                        onKeyDown={(event) => navigate(event, index)}
                        onClick={() => { setSelected((current) => current === stage.key ? null : stage.key); if (valid(stage.value)) onStageClick?.(stage); }}>
                        <span className="truncate px-2 font-mono text-xl font-semibold tracking-tight">{valid(stage.value) ? formatValue(stage.value) : "—"}</span>
                        <span className="flex items-center justify-center">{showConversion ? <span className={cn(badgeVariants({ variant: "outline" }), "border-primary/30 bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold text-primary-foreground shadow-sm")}>{conversion(stage.value, first, 0)}</span> : null}</span>
                        <span className={cn("truncate px-2 text-xs text-muted-foreground", active === stage.key && "text-foreground")}>{stage.label}</span>
                      </Button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {tooltipStage ? <div className="pointer-events-none absolute z-50 w-52 max-w-full" style={tooltipPoint}>
              <ChartTooltipSurface id={`${id}-tooltip`} title={tooltipStage.label}>
                <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Value</span><span className="font-mono font-bold tabular-nums">{valid(tooltipStage.value) ? tooltipStage.value.toLocaleString("en-US", { maximumFractionDigits: 20 }) : "Unavailable"}</span></div>
                <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Of first stage</span><span className="font-mono font-bold tabular-nums">{conversion(tooltipStage.value, first)}</span></div>
                {stages.indexOf(tooltipStage) > 0 ? <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">From previous</span><span className="font-mono font-bold tabular-nums">{conversion(tooltipStage.value, stages[stages.indexOf(tooltipStage) - 1]!.value)}</span></div> : null}
              </ChartTooltipSurface>
            </div> : null}
            </div>
            <p role="status" aria-live="polite" className="sr-only">{activeStage ? `${activeStage.label}: ${valid(activeStage.value) ? formatValue(activeStage.value) : "Unavailable"}${activeStage.meta ? `. ${activeStage.meta}` : ""}` : "Select a stage to inspect conversion."}</p>
            {activeStage?.meta ? <p className="mt-3 text-xs text-muted-foreground">{activeStage.meta}</p> : null}
          </>
        )}
      </ChartContainer>
      </ChartSkeleton>
    </Card>
  );
}
