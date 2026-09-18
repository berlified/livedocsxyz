"use client";

import * as React from "react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  Clock,
  DollarSign,
  LifeBuoy,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

import { AreaChart } from "@/components/ui/area-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { UsageMeter } from "@/components/ui/usage-meter";
import { type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const revenueConfig = {
  current: { label: "Revenue", color: "var(--chart-1)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) },
} satisfies ChartConfig;

const mrrConfig = {
  current: { label: "MRR", color: "var(--chart-2)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) },
} satisfies ChartConfig;

const subsConfig = {
  current: { label: "Active", color: "var(--chart-4)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US") },
} satisfies ChartConfig;

const barsConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) },
} satisfies ChartConfig;

type DayRow = { day: string; current: number };

function buildDays(count: number): DayRow[] {
  const start = new Date(2026, 2, 4);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const wave = Math.sin(index * 0.09) * 0.6 + Math.sin(index * 0.023 + 1.4) * 0.4;
    return {
      day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      current: Math.round(1500 + (index / count) * 2500 + wave * 700),
    };
  });
}

const allDays = buildDays(200);

const ranges = [
  { label: "All Time", days: 200 },
  { label: "6m", days: 180 },
  { label: "3m", days: 90 },
  { label: "30d", days: 30 },
] as const;

const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const events = [
  { scope: "system", title: "Payout sent to bank account", detail: "$4,210.00 · Jul 28", icon: CircleDollarSign },
  { scope: "all", title: "New subscription · Scale plan", detail: "Acme Inc · Jul 27", icon: Zap },
  { scope: "all", title: "Invoice paid", detail: "$1,180.00 · Northwind · Jul 26", icon: Clock },
  { scope: "system", title: "Balance threshold reached", detail: "Trigger set at $10,000 · Jul 25", icon: TrendingUp },
  { scope: "all", title: "Refund issued", detail: "$86.00 · Craftly · Jul 24", icon: ArrowUpRight },
];

const sideNav = [
  { icon: ChartNoAxesCombined, label: "Home", active: true },
  { icon: Package, label: "Products" },
  { icon: Users, label: "Customers" },
  { icon: TrendingUp, label: "Analytics" },
  { icon: ShoppingBag, label: "Sales" },
  { icon: DollarSign, label: "Finance" },
  { icon: Settings, label: "Settings" },
];

function CardShell({ title, action, children, onRemove }: { title: string; action?: React.ReactNode; children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="relative min-w-0 rounded-2xl border border-border bg-card p-5">
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${title}`}
          onClick={onRemove}
          className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-accent"
        >
          <X className="size-4" />
        </button>
      ) : null}
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-[15px] font-medium tracking-tight">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function OverviewDashboard() {
  const [range, setRange] = React.useState<(typeof ranges)[number]>(ranges[0]);
  const [nav, setNav] = React.useState("Home");
  const [drawer, setDrawer] = React.useState(false);
  const [customizing, setCustomizing] = React.useState(false);
  const [hidden, setHidden] = React.useState<string[]>([]);
  const [feed, setFeed] = React.useState<"System" | "All">("System");

  const days = React.useMemo(() => allDays.slice(-range.days), [range]);
  const revenue = React.useMemo(() => days.reduce((sum, row) => sum + row.current, 0), [days]);
  const mrr = Math.round(revenue * 0.082);
  const subs = Math.round(320 + range.days * 1.4);
  const firstDay = days[0]?.day ?? "";
  const lastDay = days[days.length - 1]?.day ?? "";

  const months = React.useMemo(() => {
    const buckets = new Map<string, number>();
    allDays.slice(-180).forEach((row) => {
      const month = row.day.split(" ")[0]!;
      buckets.set(month, (buckets.get(month) ?? 0) + row.current);
    });
    return [...buckets.entries()].slice(-6).map(([month, total]) => ({ month, revenue: total }));
  }, []);

  const visible = (key: string) => !hidden.includes(key);
  const remove = (key: string) => () => setHidden((current) => [...current, key]);

  const sidebar = (
    <nav className="flex flex-1 flex-col px-3 py-4" aria-label="Workspace">
      <ul className="space-y-0.5">
        {sideNav.map(({ icon: Icon, label, active }) => {
          const selected = nav === label || (nav === "Home" && active && label === "Home");
          return (
            <li key={label}>
              <button
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => { setNav(label); setDrawer(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" strokeWidth={selected ? 2 : 1.75} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-xl border border-border bg-muted/30 p-3.5">
          <p className="text-[13px] font-medium leading-5">Introducing livedocs themes</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">One token set for light and dark chart surfaces.</p>
          <button type="button" className="mt-2 text-[13px] font-medium text-chart-1 hover:underline">Upgrade</button>
        </div>
        <button type="button" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground">
          <LifeBuoy className="size-4" /> Support
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 text-sm">
          <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">AC</span>
          <span className="flex-1 truncate font-medium">Acme Inc</span>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm">
      <div className="flex min-h-[860px] text-left">
        <div className="hidden w-60 shrink-0 flex-col border-r border-border lg:flex">
          <div className="flex items-center gap-2 px-5 pb-1 pt-5">
            <span className="flex size-7 items-center justify-center rounded-full border border-border">
              <ChartNoAxesCombined className="size-4" />
            </span>
          </div>
          {sidebar}
        </div>

        {drawer ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-background">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold">Acme Inc</span>
                <button type="button" aria-label="Close" onClick={() => setDrawer(false)} className="rounded-md p-1 hover:bg-accent"><X className="size-4" /></button>
              </div>
              {sidebar}
            </div>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
            <button type="button" aria-label="Open menu" onClick={() => setDrawer(true)} className="rounded-md p-1.5 hover:bg-accent lg:hidden"><Menu className="size-5" /></button>
            <h2 className="text-xl font-medium tracking-tight">Overview</h2>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div role="group" aria-label="Time range" className="flex rounded-full border border-border bg-card p-1">
                {ranges.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={range.label === item.label}
                    onClick={() => setRange(item)}
                    className={cn(
                      "h-7 rounded-full px-3 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      range.label === item.label ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-pressed={customizing}
                onClick={() => setCustomizing((value) => !value)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  customizing ? "border-chart-1/40 bg-chart-1/10" : "border-border bg-card hover:bg-accent"
                )}
              >
                <SlidersHorizontal className="size-3.5" /> Customize
              </button>
            </div>
          </div>

          <div className="space-y-3 px-4 pb-6 sm:px-6">
            {visible("revenue") ? (
              <CardShell
                title="Revenue"
                onRemove={customizing ? remove("revenue") : undefined}
                action={
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <button type="button" aria-label="Open revenue details" className="rounded-md p-1.5 hover:bg-accent"><ArrowUpRight className="size-4" /></button>
                  </span>
                }
              >
                <p className="mt-1 text-5xl font-medium tabular-nums tracking-tight">{money(revenue)}</p>
                <p className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="size-2 rounded-full border-2 border-chart-1" aria-hidden /> {firstDay} – {lastDay}, 2026
                </p>
                <AreaChart data={days} config={revenueConfig} xDataKey="day" variant="plain" className="mt-2 h-64 w-full">
                  <AreaChart.Grid />
                  <AreaChart.Tooltip />
                  <AreaChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={90} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <AreaChart.Area dataKey="current" variant="gradient" strokeWidth={2.5} />
                </AreaChart>
              </CardShell>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2 [&>*]:min-w-0">
              {visible("mrr") ? (
                <CardShell title="Monthly Recurring Revenue" onRemove={customizing ? remove("mrr") : undefined}>
                  <p className="mt-1 text-4xl font-medium tabular-nums tracking-tight">{money(mrr)}</p>
                  <p className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
                    <span className="size-2 rounded-full border-2 border-chart-2" aria-hidden /> {firstDay} – {lastDay}, 2026
                  </p>
                  <AreaChart data={days} config={mrrConfig} xDataKey="day" variant="plain" className="mt-2 h-40 w-full">
                    <AreaChart.Grid />
                    <AreaChart.Tooltip />
                    <AreaChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={70} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <AreaChart.Area dataKey="current" variant="gradient" strokeWidth={2} />
                  </AreaChart>
                </CardShell>
              ) : null}
              {visible("subs") ? (
                <CardShell title="Active Subscriptions" onRemove={customizing ? remove("subs") : undefined}>
                  <p className="mt-1 text-4xl font-medium tabular-nums tracking-tight">{subs.toLocaleString("en-US")}</p>
                  <p className="mt-2 flex items-center gap-2 text-[13px] text-muted-foreground">
                    <span className="size-2 rounded-full border-2 border-chart-4" aria-hidden /> {firstDay} – {lastDay}, 2026
                  </p>
                  <AreaChart data={days.map((row, index) => ({ day: row.day, current: Math.round(subs * (0.55 + (index / days.length) * 0.45)) }))} config={subsConfig} xDataKey="day" variant="plain" className="mt-2 h-40 w-full">
                    <AreaChart.Grid />
                    <AreaChart.Tooltip />
                    <AreaChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={70} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                    <AreaChart.Area dataKey="current" variant="gradient" strokeWidth={2} />
                  </AreaChart>
                </CardShell>
              ) : null}
            </div>

            <div className="grid gap-3 xl:grid-cols-3 [&>*]:min-w-0">
              {visible("monthly") ? (
                <CardShell title="Revenue" onRemove={customizing ? remove("monthly") : undefined} action={<span className="text-[13px] text-muted-foreground">Last 6 months</span>}>
                  <BarChart data={months} config={barsConfig} xDataKey="month" variant="plain" className="mt-2 h-64 w-full">
                    <BarChart.Grid />
                    <BarChart.Tooltip />
                    <BarChart.XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <BarChart.Bar dataKey="revenue" />
                  </BarChart>
                </CardShell>
              ) : null}
              {visible("timeline") ? (
                <CardShell
                  title="Timeline"
                  onRemove={customizing ? remove("timeline") : undefined}
                  action={
                    <span role="group" aria-label="Event filter" className="flex rounded-full border border-border p-0.5 text-xs">
                      {(["System", "All"] as const).map((scope) => (
                        <button
                          key={scope}
                          type="button"
                          aria-pressed={feed === scope}
                          onClick={() => setFeed(scope)}
                          className={cn("rounded-full px-2.5 py-1 transition-colors", feed === scope ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                        >
                          {scope}
                        </button>
                      ))}
                    </span>
                  }
                >
                  <ul className="mt-3 space-y-1">
                    {events.filter((event) => feed === "All" || event.scope === "System").map((event) => (
                      <li key={event.title} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent/50">
                        <event.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium">{event.title}</span>
                          <span className="block text-xs text-muted-foreground">{event.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardShell>
              ) : null}
              {visible("balance") ? (
                <CardShell title="Available balance" onRemove={customizing ? remove("balance") : undefined} action={<span className="text-lg font-medium tabular-nums tracking-tight">{money(12480)}</span>}>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Withdrawals open above $10. Next automatic payout Jul 1.</p>
                  <UsageMeter title="Payout progress" value={7480} max={10000} className="mt-3 border-0 p-0 shadow-none" />
                </CardShell>
              ) : null}
            </div>

            {hidden.length ? (
              <button type="button" onClick={() => setHidden([])} className="text-[13px] text-chart-1 hover:underline">
                Restore {hidden.length} hidden card{hidden.length > 1 ? "s" : ""}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
