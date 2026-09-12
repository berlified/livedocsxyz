"use client";

import * as React from "react";

import {
  ChartContainer,
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
}: {
  title: string;
  items: BreakdownItem[];
  config: ChartConfig;
  currency?: boolean;
  className?: string;
}) {
  const [selected, setSelected] = React.useState<string>();

  return (
    <Card className={cn("p-4", className)}>
      <ChartContainer
        config={config}
        data={items as unknown as Record<string, unknown>[]}
        className="w-full justify-start"
        variant="plain"
      >
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-none border-2 border-border bg-muted">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-label={`${item.label} ${item.percent}%`}
            onClick={() =>
              setSelected((current) => (current === item.key ? undefined : item.key))
            }
            className={cn(
              "h-full min-w-1 transition-opacity",
              selected && selected !== item.key && "opacity-30"
            )}
            style={{
              width: `${item.percent}%`,
              ...pixelFillStyle(colorVar(item.key)),
            }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => {
          const muted = selected && selected !== item.key;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() =>
                  setSelected((current) => (current === item.key ? undefined : item.key))
                }
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-none px-1 py-0.5 text-left text-sm transition-opacity",
                  muted && "opacity-40"
                )}
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <PixelSwatch color={colorVar(item.key)} />
                  {config[item.key]?.label ?? item.label}
                </span>
                <span className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-foreground">
                    {currency
                      ? item.value.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })
                      : item.value.toLocaleString("en-US")}
                  </span>
                  <span className="w-12 text-right text-muted-foreground">
                    {item.percent.toFixed(1)}%
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      </ChartContainer>
    </Card>
  );
}

export const BreakdownChart = Object.assign(BreakdownChartRoot, {});
