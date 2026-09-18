"use client";

import * as React from "react";
import {
  Bell,
  CalendarDays,
  ChevronsUpDown,
  CircleCheck,
  CircleHelp,
  ClipboardList,
  Compass,
  CreditCard,
  DollarSign,
  Eye,
  Flag,
  Home,
  Info,
  Link2,
  Mail,
  MessageCircle,
  MessagesSquare,
  Plus,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Ticket,
  Users,
  ChevronDown,
  ChevronLeft,
  CircleDollarSign,
} from "lucide-react";

import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { LineChart } from "@/components/ui/line-chart";
import { type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const todayConfig = {
  current: { label: "Today", color: "var(--chart-1)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" }) },
  previous: { label: "Yesterday", color: "var(--muted-foreground)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" }) },
} satisfies ChartConfig;

const statsConfig = {
  current: { label: "Selected period", color: "var(--chart-1)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) },
  previous: { label: "Previous period", color: "var(--muted-foreground)", valueFormatter: (value: number | string) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) },
} satisfies ChartConfig;

const paymentsConfig = {
  paid: { label: "Paid", color: "var(--chart-2)" },
  pastDue: { label: "Past due", color: "var(--chart-1)" },
  cancelled: { label: "Cancelled", color: "var(--chart-4)" },
  failed: { label: "Failed", color: "var(--destructive)" },
  refunded: { label: "Refunded", color: "var(--chart-3)" },
} satisfies ChartConfig;

function intraday() {
  const seed = [0.32, 0.61, 0.78, 0.55, 0.7, 0.62, 0.5, 0.46, 0.58, 0.66, 0.52, 0.6, 0.57, 0.62, 0.62, 0.55, 0.72, 0.68, 0.6, 0.78, 0.85, 0.8, 0.9, 0.94, 0.96];
  return seed.map((value, index) => {
    const hour = index;
    const label = hour === 0 ? "12:00 am" : hour === 24 ? "11:59 pm" : "";
    return {
      time: label || `${hour}:00`,
      short: label,
      current: Math.round((18 + value * 82 + index * 1.4) * 1000),
      previous: Math.round((16 + index * 3.1 + Math.sin(index * 0.4) * 4) * 1000),
    };
  });
}

function fortnight(base: number, amp: number, drift: number) {
  return Array.from({ length: 14 }, (_, index) => ({
    day: `Jul ${8 + index}`,
    current: Math.round(base + Math.sin(index * 0.9) * amp * 0.4 + index * drift),
    previous: Math.round(base * 0.72 + Math.sin(index * 0.7 + 1.2) * amp * 0.5 + index * drift * 0.4),
  }));
}

const todayData = intraday();
const revenueData = fortnight(1500000, 1100000, 150000);
const mrrData = fortnight(30, 150, 8);

const payments = [
  { key: "paid", label: "Paid", value: 156.19, percent: 19.32 },
  { key: "pastDue", label: "Past due", value: 52.48, percent: 6.49 },
  { key: "cancelled", label: "Cancelled", value: 299.98, percent: 37.1 },
  { key: "failed", label: "Failed", value: 299.98, percent: 37.1 },
  { key: "refunded", label: "Refunded", value: 2.35, percent: 1.5 },
];

const nav = [
  { heading: "GENERAL", items: [{ icon: Home, label: "Home", active: true }, { icon: ShoppingBag, label: "Products" }, { icon: Link2, label: "Checkout links" }] },
  { heading: "USER MANAGEMENT", items: [{ icon: Users, label: "Users" }, { icon: ClipboardList, label: "Waitlists" }] },
  { heading: "PAYMENTS", items: [{ icon: CreditCard, label: "Payments" }, { icon: DollarSign, label: "Payouts" }, { icon: Flag, label: "Disputes" }, { icon: MessagesSquare, label: "Resolution center" }] },
  { heading: "MARKETING", items: [{ icon: Eye, label: "Tracking links" }, { icon: CircleCheck, label: "Leads" }, { icon: Ticket, label: "Promo codes" }, { icon: Share2, label: "Affiliates" }, { icon: Mail, label: "Automated messages" }, { icon: CircleHelp, label: "Cancelation reasons" }] },
];

const rail = [Home, Compass, MessageCircle, Bell, Ticket];

function FilterPill({ icon: Icon, children, chevron = true }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode; chevron?: boolean }) {
  return (
    <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-accent">
      {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      <span className="whitespace-nowrap">{children}</span>
      {chevron ? <ChevronDown className="size-3.5 text-muted-foreground" /> : null}
    </button>
  );
}

function DeltaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-chart-2/15 px-2 py-0.5 text-xs font-medium text-chart-2">
      {children}
      <span aria-hidden>↑</span>
    </span>
  );
}

export function WhopDashboard() {
  return (
    <div className="light overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm">
      <div className="flex min-h-[880px] text-left">
        <div className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-border py-3 md:flex" aria-hidden>
          <span className="mb-3 flex size-8 items-center justify-center rounded-lg bg-destructive text-lg font-black text-white">W</span>
          {rail.map((Icon, index) => (
            <span key={index} className={cn("flex size-9 items-center justify-center rounded-lg text-muted-foreground", index === 0 && "bg-accent text-foreground")}>
              <Icon className="size-[18px]" />
            </span>
          ))}
          <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-[11px] font-bold text-background">M</span>
          <span className="mt-1 flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px] font-semibold">B</span>
          <span className="flex size-9 items-center justify-center rounded-lg text-muted-foreground"><Search className="size-[18px]" /></span>
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-chart-4 to-chart-1 text-[11px] font-bold text-white">M</span>
        </div>

        <div className="hidden w-60 shrink-0 flex-col border-r border-border lg:flex">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-chart-4 to-chart-1 text-xs font-bold text-white">M</span>
            <span className="flex-1 truncate text-sm font-semibold">Monetise</span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </div>
          <div className="border-b border-border px-4 py-2.5 text-[13px] text-muted-foreground">← Open whop</div>
          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Workspace">
            {nav.map((section) => (
              <div key={section.heading}>
                <p className="px-2 text-[11px] font-medium tracking-wide text-muted-foreground">{section.heading}</p>
                <ul className="mt-1 space-y-0.5">
                  {section.items.map(({ icon: Icon, label, active }) => (
                    <li key={label}>
                      <span className={cn("flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-[14px]", active ? "bg-accent font-medium text-foreground" : "text-foreground/90")}>
                        <Icon className="size-[18px] text-muted-foreground" strokeWidth={active ? 2 : 1.75} />
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
            <span className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg bg-muted/60 px-3 text-sm text-muted-foreground">
              <Search className="size-4" /> Search…
            </span>
            <span className="ml-auto flex items-center gap-3">
              <span className="relative text-muted-foreground"><Bell className="size-5" /><span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-chart-1" /></span>
              <span className="flex h-9 items-center gap-1 rounded-lg bg-chart-1 px-4 text-sm font-medium text-white">Create <ChevronDown className="size-4" /></span>
            </span>
          </div>

          <div className="space-y-8 px-4 py-6 sm:px-8">
            <section aria-labelledby="today-title">
              <div className="flex items-center justify-between gap-3">
                <h2 id="today-title" className="text-2xl font-semibold tracking-tight">Today</h2>
                <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-chart-2/30 bg-chart-2/10 px-3 text-sm font-medium">
                  <CircleDollarSign className="size-5 text-chart-2" /> Withdraw $38,482.42
                </button>
              </div>
              <div className="mt-4 grid gap-6 border-t border-border pt-4 xl:grid-cols-[1fr_240px]">
                <div>
                  <div className="flex flex-wrap gap-x-12 gap-y-4">
                    <div>
                      <p className="flex items-center gap-2 text-sm text-foreground">Gross Revenue <DeltaPill>+19.7%</DeltaPill></p>
                      <p className="mt-1 text-[32px] font-semibold tabular-nums tracking-tight">$590,424.42</p>
                      <p className="mt-1 text-[13px] text-muted-foreground">9:00 AM</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Yesterday</p>
                      <p className="mt-1 text-[32px] font-semibold tabular-nums tracking-tight text-muted-foreground">$492,252.33</p>
                      <p className="mt-1 text-[13px] text-muted-foreground">9:00 AM</p>
                    </div>
                  </div>
                  <LineChart data={todayData} config={todayConfig} xDataKey="time" variant="plain" className="mt-2 h-64 w-full">
                    <LineChart.Grid />
                    <LineChart.Tooltip />
                    <LineChart.XAxis dataKey="time" tickLine={false} axisLine={false} interval={0} ticks={["12:00 am", "11:59 pm"]} padding={{ left: 28, right: 28 }} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <LineChart.Line dataKey="previous" curveType="linear" strokeWidth={1.5} />
                    <LineChart.Line dataKey="current" curveType="linear" strokeWidth={2} />
                  </LineChart>
                </div>
                <div className="space-y-5 xl:pt-1">
                  <div>
                    <p className="flex items-center justify-between text-sm text-muted-foreground">Balance <span className="text-chart-1">View</span></p>
                    <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">$12,283.829.01</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">Available to payout</p>
                  </div>
                  <div className="border-t border-border pt-5">
                    <p className="flex items-center justify-between text-sm text-muted-foreground">Payouts <span className="text-chart-1">View</span></p>
                    <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">$1,000.000.00</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">Deposited Apr 30</p>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="stats-title" className="space-y-4">
              <h2 id="stats-title" className="text-2xl font-semibold tracking-tight">Stats</h2>
              <div className="flex flex-wrap items-center gap-2">
                <FilterPill>Last 14 days</FilterPill>
                <FilterPill icon={CalendarDays} chevron={false}>Jul 8th – Jul 23rd</FilterPill>
                <span className="px-1 text-sm text-muted-foreground">compared to</span>
                <FilterPill>Previous period</FilterPill>
                <FilterPill>2025</FilterPill>
                <span className="ml-auto flex gap-2">
                  <FilterPill icon={Plus} chevron={false}>Add new widget</FilterPill>
                  <FilterPill icon={Settings} chevron={false}>Edit</FilterPill>
                </span>
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="flex items-center gap-1.5 text-sm font-medium">Gross Revenue <Info className="size-4 text-muted-foreground" /></p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold tabular-nums tracking-tight">$86.70 <DeltaPill>+$383.00</DeltaPill></p>
                  <LineChart data={revenueData} config={statsConfig} xDataKey="day" variant="plain" className="mt-2 h-56 w-full">
                    <LineChart.Grid />
                    <LineChart.Tooltip />
                    <LineChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval={0} ticks={["Jul 8", "Jul 21"]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <LineChart.YAxis orientation="right" width={52} tickLine={false} axisLine={false} domain={[-2000000, 4000000]} ticks={[4000000, 2000000, 0, -2000000]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(value: number) => (value === 0 ? "$0" : value > 0 ? `$${(value / 1000000).toFixed(1)}M` : `-$${(Math.abs(value) / 1000000).toFixed(0)}M`)} />
                    <LineChart.Line dataKey="previous" curveType="linear" strokeWidth={1.5} strokeVariant="dashed" />
                    <LineChart.Line dataKey="current" curveType="linear" strokeWidth={2} />
                  </LineChart>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="flex items-center gap-1.5 text-sm font-medium">MRR <Info className="size-4 text-muted-foreground" /></p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold tabular-nums tracking-tight">$320.00 <DeltaPill>+$50.00</DeltaPill></p>
                  <LineChart data={mrrData} config={statsConfig} xDataKey="day" variant="plain" className="mt-2 h-56 w-full">
                    <LineChart.Grid />
                    <LineChart.Tooltip />
                    <LineChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval={0} ticks={["Jul 8", "Jul 21"]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <LineChart.YAxis orientation="right" width={52} tickLine={false} axisLine={false} domain={[-200, 200]} ticks={[200, 100, 0, -100, -200]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(value: number) => `$${value}`} />
                    <LineChart.Line dataKey="previous" curveType="linear" strokeWidth={1.5} strokeVariant="dashed" />
                    <LineChart.Line dataKey="current" curveType="linear" strokeWidth={2} />
                  </LineChart>
                </div>
                <BreakdownChart title="Payments breakdown" items={payments} config={paymentsConfig} className="p-5" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
