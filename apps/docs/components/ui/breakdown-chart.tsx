"use client";

import * as React from "react";

import {
  ChartContainer,
  ChartHoverTooltip,
  ChartTooltipSurface,
  PixelSwatch,
  colorVar,
  pixelFillStyle,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BreakdownItem = {
  key: string;
  label: string;
  value: number;
  percent: number;
};

function BreakdownChartRoot({
  title,
  items,
  config,
  currency = true,
  className,
  isLoading,
  reaction,
}: {
  title: string;
  items: BreakdownItem[];
  config: ChartConfig;
  currency?: boolean;
  className?: string;
  isLoading?: boolean;
  reaction?: import("@/components/ui/chart-reactions").ChartReactionOptions;
}) {
  const [selected, setSelected] = React.useState<string>();
  const [active, setActive] = React.useState<string>();
  const emphasized = active ?? selected;
  const formatAmount = (value: number) => value.toLocaleString("en-US", currency ? { style: "currency", currency: "USD" } : { maximumFractionDigits: 20 });
  const tooltip = (item: BreakdownItem) => (
    <ChartTooltipSurface title={config[item.key]?.label ?? item.label}>
      <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Amount</span><span className="font-mono font-bold tabular-nums">{formatAmount(item.value)}</span></div>
      <div className="flex items-center justify-between gap-6"><span className="text-muted-foreground">Share</span><span className="font-mono font-bold tabular-nums">{item.percent.toLocaleString("en-US", { maximumFractionDigits: 20 })}%</span></div>
    </ChartTooltipSurface>
  );
  const activate = (key: string, next: boolean) => setActive((current) => next ? key : current === key ? undefined : current);

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <ChartContainer
        isLoading={isLoading}
        loadingVariant="meter"
        reaction={reaction}
        config={config}
        data={items as unknown as Record<string, unknown>[]}
        className="w-full justify-start"
        variant="plain"
      >
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-4 flex h-3 rounded-full bg-muted" onKeyDown={(event) => { if (event.key === "Escape") setSelected(undefined); }}>
        {items.map((item, index) => (
          <div key={item.key} className="h-full min-w-1" style={{ width: `${item.percent}%` }}>
            <ChartHoverTooltip className="h-full" content={tooltip(item)} onActiveChange={(next: boolean) => activate(item.key, next)}>
              <button
                type="button"
                aria-label={`${item.label}: ${formatAmount(item.value)}, ${item.percent}%`}
                aria-pressed={selected === item.key}
                onClick={() => setSelected((current) => current === item.key ? undefined : item.key)}
                className={cn(
                  "block h-full w-full transition-opacity motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  index === 0 && "rounded-l-full",
                  index === items.length - 1 && "rounded-r-full",
                  emphasized !== undefined && emphasized !== item.key && "opacity-60"
                )}
                style={pixelFillStyle(colorVar(item.key))}
              />
            </ChartHoverTooltip>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2" onKeyDown={(event) => { if (event.key === "Escape") setSelected(undefined); }}>
        {items.map((item) => {
          const muted = emphasized !== undefined && emphasized !== item.key;
          return (
            <li key={item.key}>
              <ChartHoverTooltip content={tooltip(item)} onActiveChange={(next: boolean) => activate(item.key, next)}>
                <button
                  type="button"
                  aria-pressed={selected === item.key}
                  onClick={() => setSelected((current) => current === item.key ? undefined : item.key)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left text-sm transition-colors hover:bg-accent motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className={cn("transition-opacity motion-reduce:transition-none", muted && "opacity-60")}><PixelSwatch color={colorVar(item.key)} /></span>
                    {config[item.key]?.label ?? item.label}
                  </span>
                  <span className="flex items-center gap-3 tabular-nums text-xs">
                    <span className="text-foreground">
                      {currency ? item.value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : item.value.toLocaleString("en-US")}
                    </span>
                    <span className="w-12 text-right text-muted-foreground">{item.percent.toFixed(1)}%</span>
                  </span>
                </button>
              </ChartHoverTooltip>
            </li>
          );
        })}
      </ul>
      </ChartContainer>
    </Card>
  );
}

export const BreakdownChart = Object.assign(BreakdownChartRoot, {});
