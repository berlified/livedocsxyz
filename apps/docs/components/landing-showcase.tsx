"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { CashflowChart } from "@/components/ui/cashflow-chart";
import { ComparisonChart } from "@/components/ui/comparison-chart";
import { CountryChart } from "@/components/ui/country-chart";
import { LaneChart } from "@/components/ui/lane-chart";
import { MetricChart } from "@/components/ui/metric-chart";
import { RangeChart } from "@/components/ui/range-chart";
import { RingMetric } from "@/components/ui/ring-metric";
import { SpotlightChart } from "@/components/ui/spotlight-chart";
import { TrendCard } from "@/components/ui/trend-card";
import { UsageMeter } from "@/components/ui/usage-meter";
import { Button } from "@/components/ui/button";
import {
  cashflowConfig,
  cashflowMonths,
  cohortMix,
  dailyOverlay,
  laneConfig,
  laneRows,
  marketConfig,
  marketRank,
  metricConfig,
  metricSeries,
  mixConfig,
  overlayConfig,
  paymentMix,
  rangeBand,
  rangeConfig,
  ringConfig,
  ringMembers,
  ringPayments,
  spotlightConfig,
  spotlightSeries,
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

      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <CountryChart title="Revenue by market" rows={marketRank} config={marketConfig} />
        <div className="grid gap-3">
          <RingMetric
            title="Members"
            centerLabel="Total"
            data={ringMembers}
            config={ringConfig}
          />
          <UsageMeter
            title="Credits remaining"
            value={500}
            max={1000}
            remainingLabel="of $1,000 this cycle"
            resetLabel="Resets Jul 1"
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <CashflowChart
          title="Cash movement"
          inflowValue="$967,830"
          outflowValue="$351,420"
          data={cashflowMonths}
          config={cashflowConfig}
        />
        <SpotlightChart
          title="Gross volume"
          value="$107,843"
          delta="↑ 88% vs last month"
          data={spotlightSeries}
          config={spotlightConfig}
          markerLabel="Peak"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <LaneChart title="Payment outcomes" rows={laneRows} config={laneConfig} />
        <RingMetric
          title="Transactions"
          centerLabel="Volume"
          data={ringPayments}
          config={ringConfig}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-sm text-muted-foreground">
          Markets, rings, cashflow, and callouts — install any tile as source.
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
