"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Minus,
} from "lucide-react";

import { components } from "@frostui/registry";

import { AreaChart } from "@/components/ui/area-chart";
import { BarChart } from "@/components/ui/bar-chart";
import { LineChart } from "@/components/ui/line-chart";
import { Sparkline } from "@/components/ui/sparkline";
import { ChartThumbnail } from "@/components/chart-thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChartConfig } from "@/components/ui/chart";
import { OverviewDashboard } from "@/components/overview-dashboard";
import { getShadcnAddCommand } from "@/lib/registry-url";
import { cn } from "@/lib/utils";

const heroData = Array.from({ length: 30 }, (_, index) => ({
  day: `D${index + 1}`,
  current: Math.round(40 + index * 2.4 + Math.sin(index * 0.7) * 12),
  previous: Math.round(36 + index * 1.1 + Math.cos(index * 0.5) * 8),
}));

const heroConfig = {
  current: { label: "Revenue", color: "var(--chart-1)" },
  previous: { label: "Previous", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const heroSessions = heroData.map((row, index) => ({ day: row.day, sessions: Math.round(900 + row.current * 9 + (index % 5) * 120) }));

const heroSessionsConfig = {
  sessions: { label: "Sessions", color: "var(--chart-2)" },
} satisfies ChartConfig;

const heroConversion = [1.8, 2.1, 2.0, 2.4, 2.6, 2.3, 2.9, 3.1, 2.8, 3.2, 3.5, 3.8];

const themeDemoConfig = {
  current: { label: "Signups", color: "var(--chart-1)" },
} satisfies ChartConfig;

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background py-2 pl-4 pr-2 font-mono text-[13px]">
      <span className="min-w-0 flex-1 truncate text-left">{command}</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={copied ? "Copied" : "Copy install command"}
        onClick={() => {
          void navigator.clipboard?.writeText(command).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        }}
        className="size-8 shrink-0"
      >
        {copied ? <Check className="size-4 text-chart-2" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-3 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2>
      {copy ? <p className="text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{copy}</p> : null}
    </div>
  );
}

function ComponentBrowser() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const categories = React.useMemo(
    () => ["All", ...Array.from(new Set(components.map((item) => item.category).filter(Boolean)))],
    []
  );
  const results = components.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.name}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (category === "All" || item.category === category);
  });
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components…"
          aria-label="Search components"
          className="h-10 w-full rounded-lg border border-border bg-background px-3.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:max-w-xs"
        />
        <div role="group" aria-label="Category" className="flex flex-wrap gap-1.5">
          {categories.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="sm"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cn("h-8 rounded-full px-3 text-xs capitalize", category === item ? "bg-accent text-foreground" : "text-muted-foreground")}
            >
              {item}
            </Button>
          ))}
        </div>
        <p role="status" className="text-xs tabular-nums text-muted-foreground sm:ml-auto">{results.length} of {components.length}</p>
      </div>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <Link
            key={item.name}
            href={`/docs/components/${item.name}`}
            className="group overflow-hidden rounded-xl border border-border bg-card no-underline transition-colors hover:border-muted-foreground/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-28 items-center justify-center border-b border-border bg-muted/25 px-6">
              <ChartThumbnail name={item.name} />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium tracking-tight">{item.title}</p>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden />
              </div>
              <p className="mt-1.5 line-clamp-2 min-h-10 text-[13px] leading-5 text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
        {!results.length ? <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No components match “{query}”.</p> : null}
      </div>
    </div>
  );
}

const compareRows: Array<{ label: string; livedocs: true | string; diy: false | string }> = [
  { label: "Install with shadcn CLI", livedocs: true, diy: "Copy-paste marathon" },
  { label: "Reference tooltips + hover states", livedocs: true, diy: false },
  { label: "Loading skeletons per chart", livedocs: true, diy: false },
  { label: "Light and dark themes", livedocs: true, diy: "Weeks of tokens" },
  { label: "Keyboard + screen-reader support", livedocs: true, diy: false },
  { label: "Own the source, MIT licensed", livedocs: true, diy: "You maintain it" },
];

function CompareCell({ value, good }: { value: true | false | string; good?: boolean }) {
  if (value === true) return <Check className="size-4 text-chart-2" aria-label="Included" />;
  if (value === false) return <Minus className="size-4 text-muted-foreground" aria-label="Not included" />;
  return <span className={cn("text-[13px]", good ? "text-foreground" : "text-muted-foreground")}>{value}</span>;
}

const faqs = [
  { q: "What is livedocs?", a: "A shadcn-compatible chart registry: 35 copyable React components (line, bar, pie, funnel, heatmap,payments-style dashboards and more) built on Recharts with reference tooltips, loading skeletons, and light/dark tokens." },
  { q: "How do I install a chart?", a: "Run the shadcn add command for any component. The source lands in your project — read it, theme it, extend it. No runtime service, no lock-in." },
  { q: "Do charts work with my theme?", a: "Yes. Every chart reads semantic CSS tokens (background, foreground, chart-1…5), so your existing light and dark themes apply automatically." },
  { q: "Are loading states included?", a: "Every chart ships an isLoading state with shimmer skeletons, text placeholders, and a reduced-motion-safe static fallback." },
  { q: "Are the charts accessible?", a: "Keyboard operable series and sectors, focus-visible rings, aria labels, live-region summaries, and Escape-to-dismiss tooltips come standard." },
  { q: "Can I use livedocs commercially?", a: "Yes. Everything is MIT licensed. Build client work, SaaS dashboards, and internal tools without attribution or fees." },
];

function Faq() {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
      {faqs.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`faq-${index}`}
              onClick={() => setOpen(expanded ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {item.q}
              <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} aria-hidden />
            </button>
            <div id={`faq-${index}`} className={cn("grid transition-all", expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ThemeDemo() {
  const [dark, setDark] = React.useState(true);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border", dark ? "" : "light")}>
      <div className="flex items-center justify-between gap-3 bg-card px-5 py-4">
        <p className="text-sm font-medium">Tokens do the theming. You ship the product.</p>
        <div role="group" aria-label="Preview theme" className="flex rounded-full border border-border bg-background p-1">
          {(["Light", "Dark"] as const).map((mode) => {
            const isDark = mode === "Dark";
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={dark === isDark}
                onClick={() => setDark(isDark)}
                className={cn("h-7 rounded-full px-3 text-xs", dark === isDark ? "bg-accent font-medium text-foreground" : "text-muted-foreground")}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-3 bg-muted/20 p-4 sm:p-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Signups</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">8,412</p>
          <LineChart data={heroData} config={themeDemoConfig} xDataKey="day" variant="plain" className="mt-2 h-44 w-full">
            <LineChart.Grid />
            <LineChart.Tooltip />
            <LineChart.Line dataKey="current" strokeWidth={2.5} />
          </LineChart>
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-xl border border-border bg-card p-5 text-sm leading-6">
          <p className="font-mono text-xs text-muted-foreground">globals.css</p>
          <p><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">--chart-1</code> <span className="text-muted-foreground">picks the series color in both themes — no prop drilling.</span></p>
          <p><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">.light</code> <span className="text-muted-foreground">flips every tooltip, cursor, and axis automatically.</span></p>
          <p><code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">isLoading</code> <span className="text-muted-foreground">renders skeletons that respect contrast in each mode.</span></p>
        </div>
      </div>
    </div>
  );
}

const quotes = [
  { quote: "Replaced three chart libraries in an afternoon. The tooltips alone were worth the switch.", name: "Maya R.", role: "Frontend lead, fintech" },
  { quote: "Loading states that actually look designed. Our skeletons finally match the product.", name: "Daniel K.", role: "Indie hacker" },
  { quote: "Dropped the dashboard into our admin panel and clients assumed it was custom work.", name: "Sofia L.", role: "Design engineer" },
  { quote: "Keyboard support out of the box saved us a full accessibility audit cycle.", name: "James T.", role: "Product engineer, SaaS" },
  { quote: "Light and dark just work. I stopped thinking about chart theming entirely.", name: "Aisha B.", role: "Full-stack developer" },
  { quote: "Source I can read and fork beats a black box I have to fight. MIT sealed it.", name: "Tom H.", role: "CTO, early-stage" },
];

export function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-x border-b border-border px-5 py-16 sm:px-10 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mx-auto grid max-w-5xl items-center gap-12 text-center [&>*]:min-w-0">
          <div className="space-y-6">
            <Badge variant="outline" className="gap-2 rounded-full bg-background px-3 py-1 font-normal">
              <span className="size-1.5 rounded-full bg-chart-2" aria-hidden />
              {components.length} chart primitives · MIT licensed
            </Badge>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-6xl sm:leading-[1.05] sm:tracking-[-0.04em]">
              Dashboards that look designed, not default.
            </h1>
            <p className="mx-auto max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              livedocs is a shadcn-ready chart registry with reference tooltips, loading skeletons,
              and themes that match your product. Install the source. Own every pixel.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/docs/components">Explore the charts <ArrowRight className="size-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/installation">Get started</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-4xl space-y-3 text-left">
            <CopyCommand command={getShadcnAddCommand("area-chart")} />
            <div className="grid gap-3 lg:grid-cols-3 [&>*]:min-w-0">
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 lg:col-span-2">
                <div className="flex items-baseline justify-between px-1">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-semibold tabular-nums tracking-tight">$128,430</p>
                </div>
                <AreaChart data={heroData} config={heroConfig} xDataKey="day" variant="plain" className="mt-1 h-48 w-full">
                  <AreaChart.Grid />
                  <AreaChart.Tooltip />
                  <AreaChart.Area dataKey="current" variant="gradient" />
                  <AreaChart.Area dataKey="previous" strokeVariant="dashed" />
                </AreaChart>
              </div>
              <div className="grid gap-3">
                <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-baseline justify-between px-1">
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <p className="text-xl font-semibold tabular-nums tracking-tight">48.2k</p>
                  </div>
                  <BarChart data={heroSessions} config={heroSessionsConfig} xDataKey="day" variant="plain" className="mt-1 h-24 w-full">
                    <BarChart.Tooltip />
                    <BarChart.Bar dataKey="sessions" />
                  </BarChart>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-baseline justify-between px-1">
                    <p className="text-sm text-muted-foreground">Conversion</p>
                    <p className="text-xl font-semibold tabular-nums tracking-tight">3.8%</p>
                  </div>
                  <Sparkline data={heroConversion} size="md" tone="up" className="mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="system-title" className="space-y-8 border-t border-border py-16 sm:py-24">
        <SectionHeading
          eyebrow="A complete dashboard system"
          title="One registry. An entire overview page."
          copy="Revenue, MRR, subscriptions, monthly bars, and timelines — every widget below is a live livedocs component. Switch ranges, filter the feed, customize the layout."
        />
        <OverviewDashboard />
      </section>

      <section aria-labelledby="browser-title" className="space-y-8 border-t border-border py-16 sm:py-24">
        <SectionHeading
          eyebrow={`Browse all ${components.length} components`}
          title="Every chart you'll ever need."
          copy="Search the registry, pick a primitive, and install it with one command. Each ships with variants, props docs, and live examples."
        />
        <ComponentBrowser />
      </section>

      <section aria-labelledby="compare-title" className="space-y-8 border-t border-border py-16 sm:py-24">
        <SectionHeading eyebrow="livedocs vs DIY" title="Stop rebuilding charts." copy="Hand-rolled charts cost weeks and still miss the details. livedocs ships them finished." />
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-medium"><span className="sr-only">Capability</span></th>
                <th scope="col" className="px-5 py-3.5 font-medium">livedocs</th>
                <th scope="col" className="px-5 py-3.5 font-medium">DIY charts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {compareRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-5 py-3.5 font-normal text-foreground">{row.label}</th>
                  <td className="px-5 py-3.5"><CompareCell value={row.livedocs} good /></td>
                  <td className="px-5 py-3.5"><CompareCell value={row.diy} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="theme-title" className="space-y-8 border-t border-border py-16 sm:py-24">
        <SectionHeading eyebrow="Theming" title="Make the charts look like you." copy="Semantic tokens, considered defaults, and light and dark themes. Flip the switch — the same chart, two products." />
        <ThemeDemo />
      </section>

      <section aria-label="By the numbers" className="grid grid-cols-2 border-y border-border md:grid-cols-4">
        {[
          [`${components.length}`, "Chart primitives"],
          ["26", "Documented examples"],
          ["100%", "Open source, MIT"],
          ["0", "Runtime services"],
        ].map(([value, label]) => (
          <div key={label} className="space-y-1 border-l border-border px-6 py-8 first:border-l-0">
            <p className="text-3xl font-medium tabular-nums tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="quotes-title" className="space-y-8 py-16 sm:py-24">
        <SectionHeading eyebrow="Loved by builders" title="Trusted by teams shipping dashboards." />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((item) => (
            <figure key={item.name} className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5">
              <blockquote className="text-sm leading-6 text-foreground/90">“{item.quote}”</blockquote>
              <figcaption>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="install-title" className="space-y-6 border-t border-border py-16 text-center sm:py-24">
        <SectionHeading eyebrow="Free forever" title="Make a commitment-free start." copy="One command installs any chart with full source. No account, no paywall, no telemetry." />
        <div className="mx-auto max-w-xl">
          <CopyCommand command={getShadcnAddCommand("dashboard")} />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/docs/installation">Read the installation guide <ArrowRight className="size-4" /></Link></Button>
          <Button variant="outline" asChild><Link href="/docs/components">Browse components</Link></Button>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="space-y-8 border-t border-border py-16 sm:py-24">
        <SectionHeading eyebrow="FAQs" title="Frequently asked questions." copy="Quick answers before you install. See the docs for everything else." />
        <Faq />
      </section>

      <section aria-labelledby="support-title" className="space-y-8 border-t border-border py-16 sm:py-24">
        <SectionHeading eyebrow="Support" title="Real help from the people who build it." copy="Answers within a day from the maintainers — no bots, no ticket black holes." />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: "GitHub", copy: "Report bugs, request charts, and read every line of source.", cta: "Open GitHub", href: "/docs" },
            { title: "Email", copy: "Prefer a direct line? Write in and get an answer from a maintainer.", cta: "Contact", href: "/docs" },
            { title: "Feedback", copy: "Something to say about the registry? Shape what gets built next.", cta: "Send feedback", href: "/docs/components" },
          ].map((item) => (
            <div key={item.title} className="space-y-3 rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{item.copy}</p>
              <Button variant="outline" size="sm" asChild><Link href={item.href}>{item.cta} <ArrowUpRight className="size-3.5" /></Link></Button>
            </div>
          ))}
        </div>
      </section>

      <footer className="overflow-hidden border-t border-border pt-14">
        <div className="grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { heading: "Product", links: ["Components", "Dashboard demo", "Theming", "Changelog", "Pricing"] },
            { heading: "Resources", links: ["Docs", "Installation", "Props reference", "System status"] },
            { heading: "Charts", links: ["Line chart", "Bar chart", "Pie chart", "Funnel chart", "Heatmap chart"] },
            { heading: "Company", links: ["About", "GitHub", "Contact", "License"] },
          ].map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{group.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((label) => (
                  <li key={label}>
                    <Link href="/docs/components" className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p aria-hidden className="select-none text-center text-[18vw] font-medium leading-[0.8] tracking-[-0.05em] text-foreground/[0.07]">livedocs</p>
      </footer>
    </div>
  );
}
