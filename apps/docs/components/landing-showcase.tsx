"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined, ChevronRight } from "lucide-react";

import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { CountryChart } from "@/components/ui/country-chart";
import { MetricChart } from "@/components/ui/metric-chart";
import { TrendCard } from "@/components/ui/trend-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChartConfig } from "@/components/ui/chart";
import { ChartReactionProvider } from "@/components/chart-reaction-provider";
import { type ChartEmotion, type ChartReactionOptions } from "@/components/ui/chart-reactions";
import { cn } from "@/lib/utils";

const ranges = [7, 30, 90] as const;
const metrics = ["Revenue", "Orders"] as const;
type Metric = (typeof metrics)[number];

const sampleData = Array.from({ length: 180 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 3, 4 + index));
  const orders = Math.round(42 + index * 0.23 + Math.sin(index * 0.61) * 14 + Math.cos(index * 0.19) * 9);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    orders,
    revenue: orders * (38 + (index % 7) * 2),
    customers: Math.round(orders * (0.57 + (index % 5) * 0.03)),
  };
});

const config = {
  current: { label: "Selected period", color: "var(--chart-1)" },
  previous: { label: "Previous period", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const planConfig = {
  pro: { label: "Pro", color: "var(--chart-1)" },
  team: { label: "Team", color: "var(--chart-2)" },
  business: { label: "Business", color: "var(--chart-3)" },
} satisfies ChartConfig;

const formatNumber = (value: number) => value.toLocaleString("en-US");
const formatMoney = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const delta = (current: number, previous: number) => `${current >= previous ? "+" : ""}${((current / previous - 1) * 100).toFixed(1)}%`;

export function LandingShowcase() {
  const [range, setRange] = React.useState<(typeof ranges)[number]>(30);
  const [metric, setMetric] = React.useState<Metric>("Revenue");
  const [showData, setShowData] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
  const [emotion, setEmotion] = React.useState<ChartEmotion | "off" | "metric">("off");
  const reactionFor = (current: number, previous: number): ChartReactionOptions => emotion === "off" ? { enabled: false } : emotion === "metric" ? { metric: { current, previous, goal: previous * 1.25 } } : { emotion };
  const current = sampleData.slice(-range);
  const previous = sampleData.slice(-range * 2, -range);
  const sum = (rows: typeof sampleData, key: "revenue" | "orders" | "customers") => rows.reduce((total, row) => total + row[key], 0);
  const revenue = sum(current, "revenue");
  const previousRevenue = sum(previous, "revenue");
  const orders = sum(current, "orders");
  const previousOrders = sum(previous, "orders");
  const customers = sum(current, "customers");
  const previousCustomers = sum(previous, "customers");
  const key = metric === "Revenue" ? "revenue" : "orders";
  const format = metric === "Revenue" ? formatMoney : formatNumber;
  const total = metric === "Revenue" ? revenue : orders;
  const previousTotal = metric === "Revenue" ? previousRevenue : previousOrders;
  const series = current.map((row, index) => ({ day: row.date, current: row[key], previous: previous[index]![key] }));
  const trend = (field: "revenue" | "orders" | "customers") => current.map((row, index) => ({ day: row.date, current: row[field], previous: previous[index]![field] }));
  const markets = [
    { region: "United States", share: 0.42, previousShare: 0.4 },
    { region: "United Kingdom", share: 0.23, previousShare: 0.21 },
    { region: "Germany", share: 0.16, previousShare: 0.18 },
    { region: "Canada", share: 0.11, previousShare: 0.12 },
    { region: "Australia", share: 0.08, previousShare: 0.09 },
  ].map((market) => ({ region: market.region, current: Math.round(total * market.share), previous: Math.round(previousTotal * market.previousShare) }));
  const pro = Math.round(total * 0.48);
  const team = Math.round(total * 0.34);
  const plans = [
    { key: "pro", label: "Pro", value: pro, percent: pro / total * 100 },
    { key: "team", label: "Team", value: team, percent: team / total * 100 },
    { key: "business", label: "Business", value: total - pro - team, percent: (total - pro - team) / total * 100 },
  ];

  return (
    <ChartReactionProvider animationsEnabled={animationsEnabled}>
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="flex size-7 items-center justify-center rounded-lg border border-border bg-background"><ChartNoAxesCombined className="size-4" aria-hidden /></span>
          <span className="font-medium">Acme Studio</span><ChevronRight className="size-3 text-muted-foreground" aria-hidden /><span className="text-muted-foreground">Overview</span>
        </div>
        <Badge variant="outline" className="rounded-full font-normal text-muted-foreground">Interactive demo</Badge>
      </div>
      <div className="space-y-4 bg-muted/20 p-3 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
          <div>
            <h3 className="text-base font-medium tracking-tight">Business overview</h3>
            <p className="mt-1 text-xs text-muted-foreground">{current[0]!.date} – {current[current.length - 1]!.date}, 2026</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Chart metric" className="flex rounded-lg border border-border bg-background p-1">
              {metrics.map((item) => (
                <Button key={item} variant="ghost" size="sm" aria-pressed={metric === item} onClick={() => setMetric(item)} className={cn("h-8 px-3 text-xs text-muted-foreground", metric === item && "bg-accent text-foreground")}>
                  {item}
                </Button>
              ))}
            </div>
            <div role="group" aria-label="Date range" className="flex rounded-lg border border-border bg-background p-1">
              {ranges.map((days) => (
                <Button key={days} variant="ghost" size="sm" aria-label={`Last ${days} days`} aria-pressed={range === days} onClick={() => setRange(days)} className={cn("h-8 px-3 text-xs text-muted-foreground", range === days && "bg-accent text-foreground")}>
                  {days}d
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background p-2" role="group" aria-label="Chart reactions">
          <Button variant="outline" size="sm" aria-pressed={isLoading} onClick={() => setIsLoading((value) => !value)}>Loading {isLoading ? "on" : "off"}</Button>
          <Button variant="outline" size="sm" aria-pressed={animationsEnabled} onClick={() => setAnimationsEnabled((value) => !value)}>Animations {animationsEnabled ? "on" : "off"}</Button>
          {(["off", "metric", "neutral", "sad", "disappointed", "happy", "surprised", "proud"] as const).map((item) => <Button key={item} variant="ghost" size="sm" aria-pressed={emotion === item} className={cn("text-xs capitalize", emotion === item && "bg-accent")} onClick={() => setEmotion(item)}>{item === "metric" ? "From metric" : item}</Button>)}
          <p className="w-full text-xs text-muted-foreground">Text placeholders until GIFs and static posters are configured. Reduced motion always disables GIFs.</p>
        </div>
        <p className="sr-only" role="status">Showing {range} days. {metric}: {format(total)}, {delta(total, previousTotal)} compared with the previous {range} days.</p>
        <div className="grid gap-3 md:grid-cols-3">
          <TrendCard isLoading={isLoading} reaction={reactionFor(revenue, previousRevenue)} title="Total revenue" value={formatMoney(revenue)} baseline={`${formatMoney(previousRevenue)} previous period`} delta={delta(revenue, previousRevenue)} tone={revenue >= previousRevenue ? "up" : "down"} data={trend("revenue")} config={config} />
          <TrendCard isLoading={isLoading} reaction={reactionFor(orders, previousOrders)} title="Orders" value={formatNumber(orders)} baseline={`${formatNumber(previousOrders)} previous period`} delta={delta(orders, previousOrders)} tone={orders >= previousOrders ? "up" : "down"} data={trend("orders")} config={config} />
          <TrendCard isLoading={isLoading} reaction={reactionFor(customers, previousCustomers)} title="New customers" value={formatNumber(customers)} baseline={`${formatNumber(previousCustomers)} previous period`} delta={delta(customers, previousCustomers)} tone={customers >= previousCustomers ? "up" : "down"} data={trend("customers")} config={config} />
        </div>
        <MetricChart isLoading={isLoading} reaction={reactionFor(total, previousTotal)} title={`${metric} over time`} value={format(total)} delta={delta(total, previousTotal)} tone={total >= previousTotal ? "up" : "down"} data={series} config={config} xDataKey="day" series={[{ key: "current", label: "Selected period" }, { key: "previous", label: "Previous period" }]} />
        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <CountryChart isLoading={isLoading} reaction={reactionFor(total, previousTotal)} title={`${metric} by country`} rows={markets} config={config} currency={metric === "Revenue"} />
          <BreakdownChart isLoading={isLoading} reaction={reactionFor(total, previousTotal)} title={`${metric} by plan`} items={plans} config={planConfig} currency={metric === "Revenue"} className="p-5" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs leading-5 text-muted-foreground">Explore a range. Compare a series. Select a segment.</p>
          <Button variant="ghost" size="sm" aria-expanded={showData} aria-controls="showcase-data" onClick={() => setShowData((value) => !value)} className="text-xs">{showData ? "Hide" : "View"} data</Button>
        </div>
        {showData ? (
          <div id="showcase-data" role="region" aria-label="Chart data" tabIndex={0} className="max-h-72 overflow-auto rounded-xl border border-border bg-background">
            <table className="w-full text-left text-xs tabular-nums">
              <caption className="px-4 py-3 text-left text-muted-foreground">{metric} · selected {range} days and corresponding previous period</caption>
              <thead className="sticky top-0 bg-card"><tr><th scope="col" className="px-4 py-3 font-medium">Date</th><th scope="col" className="px-4 py-3 text-right font-medium">Selected</th><th scope="col" className="px-4 py-3 text-right font-medium">Previous</th></tr></thead>
              <tbody>{series.map((row) => <tr key={row.day} className="border-t border-border"><th scope="row" className="px-4 py-2 font-normal">{row.day}</th><td className="px-4 py-2 text-right">{format(row.current)}</td><td className="px-4 py-2 text-right text-muted-foreground">{format(row.previous)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6">
        <p className="text-xs text-muted-foreground">Built with livedocs. Ready for your data.</p>
        <Button variant="ghost" size="sm" asChild><Link href="/docs/components/metric-chart">Build this view <ArrowUpRight className="size-3.5" /></Link></Button>
      </div>
    </div>
    </ChartReactionProvider>
  );
}
