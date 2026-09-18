"use client";

import * as React from "react";
import {
  Bell,
  CalendarDays,
  ChevronsUpDown,
  ChevronDown,
  CircleCheck,
  CircleDollarSign,
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
  Menu,
  MessageCircle,
  MessagesSquare,
  Plus,
  Search,
  Settings,
  Share2,
  ShoppingBag,
  Ticket,
  Users,
  X,
} from "lucide-react";

import { BreakdownChart } from "@/components/ui/breakdown-chart";
import { CountryChart } from "@/components/ui/country-chart";
import { LineChart } from "@/components/ui/line-chart";
import { TrendCard } from "@/components/ui/trend-card";
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

const widgetConfig = {
  current: { label: "Orders", color: "var(--chart-1)" },
  previous: { label: "Previous", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const regionConfig = {
  current: { label: "This period", color: "var(--chart-1)" },
  previous: { label: "Last period", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

function intraday() {
  const seed = [0.32, 0.61, 0.78, 0.55, 0.7, 0.62, 0.5, 0.46, 0.58, 0.66, 0.52, 0.6, 0.57, 0.62, 0.62, 0.55, 0.72, 0.68, 0.6, 0.78, 0.85, 0.8, 0.9, 0.94, 0.96];
  return seed.map((value, index) => {
    const label = index === 0 ? "12:00 am" : index === seed.length - 1 ? "11:59 pm" : "";
    return {
      time: label || `${index}:00`,
      current: Math.round((18 + value * 82 + index * 1.4) * 1000),
      previous: Math.round((16 + index * 3.1 + Math.sin(index * 0.4) * 4) * 1000),
    };
  });
}

function series(days: number, base: number, amp: number, drift: number) {
  const start = new Date(2025, 6, 8);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      current: Math.round(base + Math.sin(index * 0.9) * amp * 0.4 + index * drift),
      previous: Math.round(base * 0.72 + Math.sin(index * 0.7 + 1.2) * amp * 0.5 + index * drift * 0.4),
    };
  });
}

const todayData = intraday();
const payments = [
  { key: "paid", label: "Paid", value: 156.19, percent: 19.32 },
  { key: "pastDue", label: "Past due", value: 52.48, percent: 6.49 },
  { key: "cancelled", label: "Cancelled", value: 299.98, percent: 37.1 },
  { key: "failed", label: "Failed", value: 299.98, percent: 37.1 },
  { key: "refunded", label: "Refunded", value: 2.35, percent: 1.5 },
];

const regions = [
  { region: "United States", current: 48210, previous: 41200 },
  { region: "United Kingdom", current: 18340, previous: 17020 },
  { region: "Germany", current: 12680, previous: 13110 },
  { region: "Canada", current: 8420, previous: 7980 },
];

const navSections = [
  { heading: "GENERAL", items: [{ icon: Home, label: "Home" }, { icon: ShoppingBag, label: "Products" }, { icon: Link2, label: "Checkout links" }] },
  { heading: "USER MANAGEMENT", items: [{ icon: Users, label: "Users" }, { icon: ClipboardList, label: "Waitlists" }] },
  { heading: "PAYMENTS", items: [{ icon: CreditCard, label: "Payments" }, { icon: DollarSign, label: "Payouts" }, { icon: Flag, label: "Disputes" }, { icon: MessagesSquare, label: "Resolution center" }] },
  { heading: "MARKETING", items: [{ icon: Eye, label: "Tracking links" }, { icon: CircleCheck, label: "Leads" }, { icon: Ticket, label: "Promo codes" }, { icon: Share2, label: "Affiliates" }, { icon: Mail, label: "Automated messages" }, { icon: CircleHelp, label: "Cancelation reasons" }] },
];

const railIcons = [Home, Compass, MessageCircle, Bell, Ticket];
const ranges = [7, 14, 30] as const;
const compares = ["Previous period", "Previous year"] as const;
const years = ["2025", "2024"] as const;

function FilterPill({ icon: Icon, active, onClick, children }: { icon?: React.ComponentType<{ className?: string }>; active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active === false ? "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground" : "border-border bg-background text-foreground hover:bg-accent"
      )}
    >
      {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      <span className="whitespace-nowrap">{children}</span>
      <ChevronDown className="size-3.5 text-muted-foreground" />
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
  const [activeNav, setActiveNav] = React.useState("Home");
  const [range, setRange] = React.useState<(typeof ranges)[number]>(14);
  const [compare, setCompare] = React.useState<(typeof compares)[number]>("Previous period");
  const [year, setYear] = React.useState<(typeof years)[number]>("2025");
  const [drawer, setDrawer] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [hidden, setHidden] = React.useState<string[]>([]);
  const [widgetMenu, setWidgetMenu] = React.useState(false);
  const [widgets, setWidgets] = React.useState<string[]>([]);
  const [withdrawn, setWithdrawn] = React.useState(false);

  const revenueData = React.useMemo(() => series(range, 1500000, 1100000, 150000), [range]);
  const mrrData = React.useMemo(() => series(range, 30, 150, 8), [range]);
  const orderData = React.useMemo(() => series(range, 320, 120, 9).map((row) => ({ day: row.day, current: row.current, previous: row.previous })), [range]);
  const firstDay = revenueData[0]?.day ?? "";
  const lastDay = revenueData[revenueData.length - 1]?.day ?? "";

  const nav = (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Workspace">
      {navSections.map((section) => (
        <div key={section.heading}>
          <p className="px-2 text-[11px] font-medium tracking-wide text-muted-foreground">{section.heading}</p>
          <ul className="mt-1 space-y-0.5">
            {section.items.map(({ icon: Icon, label }) => {
              const active = activeNav === label;
              return (
                <li key={label}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => { setActiveNav(label); setDrawer(false); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-[7px] text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-accent font-medium text-foreground" : "text-foreground/90 hover:bg-accent/60"
                    )}
                  >
                    <Icon className="size-[18px] text-muted-foreground" strokeWidth={active ? 2 : 1.75} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const statCards: Record<string, React.ReactNode> = {
    revenue: (
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="flex items-center gap-1.5 text-sm font-medium">Gross Revenue <Info className="size-4 text-muted-foreground" /></p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-semibold tabular-nums tracking-tight">$86.70 <DeltaPill>+$383.00</DeltaPill></p>
        <LineChart data={revenueData} config={statsConfig} xDataKey="day" variant="plain" className="mt-2 h-56 w-full">
          <LineChart.Grid />
          <LineChart.Tooltip />
          <LineChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval={0} ticks={[firstDay, lastDay]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
          <LineChart.YAxis orientation="right" width={52} tickLine={false} axisLine={false} domain={[-2000000, 4000000]} ticks={[4000000, 2000000, 0, -2000000]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(value: number) => (value === 0 ? "$0" : value > 0 ? `$${(value / 1000000).toFixed(1)}M` : `-$${(Math.abs(value) / 1000000).toFixed(0)}M`)} />
          <LineChart.Line dataKey="previous" curveType="linear" strokeWidth={1.5} strokeVariant="dashed" />
          <LineChart.Line dataKey="current" curveType="linear" strokeWidth={2} />
        </LineChart>
      </div>
    ),
    mrr: (
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="flex items-center gap-1.5 text-sm font-medium">MRR <Info className="size-4 text-muted-foreground" /></p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-semibold tabular-nums tracking-tight">$320.00 <DeltaPill>+$50.00</DeltaPill></p>
        <LineChart data={mrrData} config={statsConfig} xDataKey="day" variant="plain" className="mt-2 h-56 w-full">
          <LineChart.Grid />
          <LineChart.Tooltip />
          <LineChart.XAxis dataKey="day" tickLine={false} axisLine={false} interval={0} ticks={[firstDay, lastDay]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
          <LineChart.YAxis orientation="right" width={52} tickLine={false} axisLine={false} domain={[-200, 200]} ticks={[200, 100, 0, -100, -200]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(value: number) => `$${value}`} />
          <LineChart.Line dataKey="previous" curveType="linear" strokeWidth={1.5} strokeVariant="dashed" />
          <LineChart.Line dataKey="current" curveType="linear" strokeWidth={2} />
        </LineChart>
      </div>
    ),
    payments: <BreakdownChart title="Payments breakdown" items={payments} config={paymentsConfig} className="p-5" />,
  };

  const extra: Record<string, React.ReactNode> = {
    orders: <TrendCard title="Orders" value={orderData.reduce((sum, row) => sum + row.current, 0).toLocaleString("en-US")} baseline="Previous period" delta="+12.4%" tone="up" data={orderData} config={widgetConfig} />,
    regions: <CountryChart title="Orders by region" rows={regions} config={regionConfig} currency={false} />,
  };

  const visible = ["revenue", "mrr", "payments"].filter((key) => !hidden.includes(key));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm">
      <div className="flex min-h-[880px] text-left">
        <div className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-border py-3 md:flex" aria-hidden>
          <span className="mb-3 flex size-8 items-center justify-center rounded-lg bg-destructive text-lg font-black text-white">W</span>
          {railIcons.map((Icon, index) => (
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
          {nav}
        </div>

        {drawer ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-background">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold">Monetise</span>
                <button type="button" aria-label="Close" onClick={() => setDrawer(false)} className="rounded-md p-1 hover:bg-accent"><X className="size-4" /></button>
              </div>
              {nav}
            </div>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
            <button type="button" aria-label="Open menu" onClick={() => setDrawer(true)} className="rounded-md p-1.5 hover:bg-accent lg:hidden"><Menu className="size-5" /></button>
            <span className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg bg-muted/60 px-3 text-sm text-muted-foreground">
              <Search className="size-4" /> Search…
            </span>
            <span className="ml-auto flex items-center gap-3">
              <button type="button" aria-label="Notifications, 1 unread" className="relative rounded-md p-1 text-muted-foreground hover:bg-accent">
                <Bell className="size-5" /><span className="absolute right-1 top-1 size-2 rounded-full bg-chart-1" />
              </button>
              <span className="relative">
                <button
                  type="button"
                  aria-expanded={createOpen}
                  onClick={() => setCreateOpen((value) => !value)}
                  className="flex h-9 items-center gap-1 rounded-lg bg-chart-1 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Create <ChevronDown className="size-4" />
                </button>
                {createOpen ? (
                  <span className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg">
                    {["Product", "Checkout link", "Coupon"].map((item) => (
                      <button key={item} type="button" onClick={() => setCreateOpen(false)} className="block w-full px-3 py-2 text-left text-sm hover:bg-accent">
                        {item}
                      </button>
                    ))}
                  </span>
                ) : null}
              </span>
            </span>
          </div>

          <div className="space-y-8 px-4 py-6 sm:px-8">
            <section aria-labelledby="today-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="today-title" className="text-2xl font-semibold tracking-tight">Today</h2>
                <button
                  type="button"
                  onClick={() => { setWithdrawn(true); window.setTimeout(() => setWithdrawn(false), 2400); }}
                  className="flex h-9 items-center gap-2 rounded-lg border border-chart-2/30 bg-chart-2/10 px-3 text-sm font-medium transition-colors hover:bg-chart-2/20"
                >
                  <CircleDollarSign className="size-5 text-chart-2" /> {withdrawn ? "Withdrawal queued" : "Withdraw $38,482.42"}
                </button>
              </div>
              <div className="mt-4 grid gap-6 border-t border-border pt-4 [&>*]:min-w-0 xl:grid-cols-[1fr_240px]">
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
                    <p className="flex items-center justify-between text-sm text-muted-foreground">Balance <button type="button" className="text-chart-1 hover:underline">View</button></p>
                    <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">$12,283.829.01</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">Available to payout</p>
                  </div>
                  <div className="border-t border-border pt-5">
                    <p className="flex items-center justify-between text-sm text-muted-foreground">Payouts <button type="button" className="text-chart-1 hover:underline">View</button></p>
                    <p className="mt-1 text-[26px] font-semibold tabular-nums tracking-tight">$1,000.000.00</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">Deposited Apr 30</p>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="stats-title" className="space-y-4">
              <h2 id="stats-title" className="text-2xl font-semibold tracking-tight">Stats</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span role="group" aria-label="Range" className="flex gap-2">
                  {ranges.map((days) => (
                    <FilterPill key={days} active={range !== days} onClick={() => setRange(days)}>
                      Last {days} days
                    </FilterPill>
                  ))}
                </span>
                <FilterPill icon={CalendarDays}>{firstDay} – {lastDay}</FilterPill>
                <span className="px-1 text-sm text-muted-foreground">compared to</span>
                <FilterPill onClick={() => setCompare(compare === compares[0] ? compares[1] : compares[0])}>{compare}</FilterPill>
                <FilterPill onClick={() => setYear(year === years[0] ? years[1] : years[0])}>{year}</FilterPill>
                <span className="ml-auto flex gap-2">
                  <span className="relative">
                    <button
                      type="button"
                      aria-expanded={widgetMenu}
                      onClick={() => setWidgetMenu((value) => !value)}
                      className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Plus className="size-4 text-muted-foreground" /> Add new widget
                    </button>
                    {widgetMenu ? (
                      <span className="absolute right-0 top-10 z-20 w-48 overflow-hidden rounded-lg border border-border bg-background py-1 shadow-lg">
                        {[{ key: "orders", label: "Orders trend" }, { key: "regions", label: "Top regions" }].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            disabled={widgets.includes(item.key)}
                            onClick={() => { setWidgets((current) => [...current, item.key]); setWidgetMenu(false); }}
                            className="block w-full px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-40"
                          >
                            {item.label}
                          </button>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    aria-pressed={editing}
                    onClick={() => setEditing((value) => !value)}
                    className={cn(
                      "flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      editing ? "border-chart-1/40 bg-chart-1/10" : "border-border bg-background hover:bg-accent"
                    )}
                  >
                    <Settings className="size-4 text-muted-foreground" /> Edit
                  </button>
                </span>
              </div>
              <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-3">
                {visible.map((key) => (
                  <div key={key} className="relative">
                    {editing ? (
                      <button
                        type="button"
                        aria-label="Remove widget"
                        onClick={() => setHidden((current) => [...current, key])}
                        className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent"
                      >
                        <X className="size-4" />
                      </button>
                    ) : null}
                    {statCards[key]}
                  </div>
                ))}
                {widgets.filter((key) => !hidden.includes(key)).map((key) => (
                  <div key={key} className="relative">
                    {editing ? (
                      <button
                        type="button"
                        aria-label="Remove widget"
                        onClick={() => setHidden((current) => [...current, key])}
                        className="absolute -right-2 -top-2 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent"
                      >
                        <X className="size-4" />
                      </button>
                    ) : null}
                    {extra[key]}
                  </div>
                ))}
              </div>
              {hidden.length ? (
                <button type="button" onClick={() => setHidden([])} className="text-sm text-chart-1 hover:underline">
                  Restore {hidden.length} hidden widget{hidden.length > 1 ? "s" : ""}
                </button>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
