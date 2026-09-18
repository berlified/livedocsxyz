"use client";

import * as React from "react";
import { ChartReactionsProvider, type ChartReactionsSettings } from "@/components/ui/chart-reactions";

export const chartReactionConfig: ChartReactionsSettings = {
  enabled: true,
  animationsEnabled: true,
  assets: {
    loading: { src: "/sad.gif", alt: "Loading chart…" },
    neutral: { alt: "No change" },
    sad: { alt: "Significant decline" },
    disappointed: { alt: "Below expectations" },
    happy: { alt: "Making progress" },
    surprised: { alt: "Unexpected growth" },
    proud: { alt: "Goal achieved" },
  }
};

export function ChartReactionProvider({ children, ...settings }: ChartReactionsSettings & { children: React.ReactNode }) {
  return <ChartReactionsProvider {...chartReactionConfig} {...settings} assets={{ ...chartReactionConfig.assets, ...settings.assets }}>{children}</ChartReactionsProvider>;
}