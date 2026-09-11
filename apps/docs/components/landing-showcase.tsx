"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { ComparisonChart } from "@/components/ui/comparison-chart";
import { MetricChart } from "@/components/ui/metric-chart";
import { RangeChart } from "@/components/ui/range-chart";
import { TrendCard } from "@/components/ui/trend-card";
import { Button } from "@/components/ui/button";
import {
  cohortMix,
  dailyOverlay,
  metricConfig,
  metricSeries,
  mixConfig,
  overlayConfig,
  paymentMix,
  rangeBand,
  rangeConfig,
  yearCompare,
  yearCompareConfig,
} from "@/components/ui/chart";

const usersOverlay = dailyOverlay.map((row) => ({
  ...row,
  current: Math.round(row.current * 3.4),
  previous: Math.round(row.previous * 2.8),
}));

const visitOverlay = dailyOverlay.map((row) => ({
  ...row,
  current: Math.round(row.current * 12 + 20),
  previous: Math.round(row.previous * 9 + 18),
}));

const churnOverlay = dailyOverlay.map((row) => ({
  ...row,
  current: Math.max(4, 22 - row.current / 5),
  previous: Math.max(6, 18 - row.previous / 6),
}));

export function LandingShowcase() {
  return (
    <div className="space-y-4">
      <MetricChart
        title="Active members"
        value="272"
        data={metricSeries}
        config={metricConfig}
        series={[
          { key: "period", label: "Current period" },
          { key: "today", label: "Today" },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TrendCard
          title="Gross volume"
          value="$48,210"
          baseline="$11,640"
          delta="+$940"
          tone="up"
          href="/docs/components/trend-card"
          data={dailyOverlay}
          config={overlayConfig}
        />
        <TrendCard
          title="New members"
          value="186"
          baseline="42"
          delta="+31"
          tone="up"
          href="/docs/components/trend-card"
          data={usersOverlay}
          config={overlayConfig}
        />
        <TrendCard
          title="Sessions"
          value="6,294"
          baseline="2,118"
          delta="+4.1%"
          tone="up"
          href="/docs/components/trend-card"
          data={visitOverlay}
          config={overlayConfig}
        />
        <TrendCard
          title="Churn"
          value="3.8%"
          baseline="6.1%"
          delta="-0.4%"
          tone="down"
          href="/docs/components/trend-card"
          data={churnOverlay}
          config={overlayConfig}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ComparisonChart
          title="Revenue"
          value="$83,151"
          delta="+12.8%"
          data={yearCompare}
          config={yearCompareConfig}
        />
        <ComparisonChart
          title="Charges"
          value="6,294"
          delta="+4.1%"
          data={yearCompare.map((row) => ({
            ...row,
            thisYear: row.thisYear * 8,
            lastYear: row.lastYear * 7,
          }))}
          config={yearCompareConfig}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <RangeChart
          title="Expected vs actual"
          data={rangeBand}
          config={rangeConfig}
        />
        <div className="grid gap-3">
          <BreakdownChart title="Settlements" items={paymentMix} config={mixConfig} />
          <BreakdownChart
            title="Cohorts"
            items={cohortMix}
            config={mixConfig}
            currency={false}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-sm text-muted-foreground">
          Overlay, range, share, and metric wells — install any tile as source.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/docs/components">
            Open chart docs
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
