import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Layers3, Palette } from "lucide-react";

import { components } from "@frostui/registry";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { LandingShowcase } from "@/components/landing-showcase";
import { getShadcnAddCommand } from "@/lib/registry-url";

const featured = [
  { name: "area-chart", detail: "Give trends room to breathe.", label: "Trends" },
  { name: "bar-chart", detail: "Make every comparison count.", label: "Comparisons" },
  { name: "ring-metric", detail: "The whole story, in one number.", label: "Composition" },
  { name: "country-chart", detail: "See where your growth comes from.", label: "Geography" },
  { name: "cashflow-chart", detail: "Understand what moves in and out.", label: "Finance" },
  { name: "metric-chart", detail: "Put your most important metric first.", label: "Overview" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="landing-hero relative grid gap-10 border-x border-b border-border px-5 py-14 sm:px-10 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16 lg:py-24">
        <div className="relative space-y-7">
          <Badge variant="outline" className="gap-2 rounded-full bg-background px-3 py-1 font-normal">
            <span className="size-1.5 rounded-full bg-chart-1" aria-hidden />
            A chart library for your next great product
          </Badge>
          <h1 className="max-w-2xl text-balance text-5xl font-medium leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Your data.<br />
            <span className="text-muted-foreground">Beautifully clear.</span>
          </h1>
          <p className="max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Thoughtfully crafted React charts for the products you care about.
            Composable, themeable, and yours to build on.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/docs/components">Explore the charts <ArrowRight className="size-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs/installation">Get started</Link>
            </Button>
          </div>
        </div>
        <div className="relative space-y-4 lg:pb-1">
          <p className="text-xs font-medium text-muted-foreground">From your terminal to your product.</p>
          <CodeBlock language="bash" title="Install a little clarity" code={getShadcnAddCommand("metric-chart")} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>React + TypeScript</span><span>shadcn compatible</span><span>Open source</span>
          </div>
        </div>
      </section>

      <section id="showcase" aria-labelledby="showcase-title" className="scroll-mt-24 py-14 sm:py-20">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Less noise. More signal.</p>
            <h2 id="showcase-title" className="text-2xl font-medium tracking-tight sm:text-3xl">A dashboard worth opening.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">Real components. Sample data. Go ahead and make yourself at home.</p>
        </div>
        <LandingShowcase />
      </section>

      <section aria-label="Designed for developers" className="grid border-y border-border md:grid-cols-3">
        {[
          { icon: Code2, title: "Your code. Your call.", copy: "Install the source, not another black box. Read it, change it, ship it. No runtime service required." },
          { icon: Palette, title: "Feels like your product.", copy: "Semantic tokens, considered defaults, and light and dark themes. A natural fit for your design system." },
          { icon: Layers3, title: "Small pieces. Bigger ideas.", copy: "Start with a single metric or compose a complete dashboard. Shared primitives keep everything in sync." },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="space-y-4 px-5 py-8 first:pl-5 md:border-l md:first:border-l-0 md:first:pl-0 md:last:pr-0">
            <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </section>

      <section className="space-y-7 py-14 sm:py-20" aria-labelledby="catalog-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Find your next building block</p>
            <h2 id="catalog-title" className="text-2xl font-medium tracking-tight sm:text-3xl">A chart for every perspective.</h2>
          </div>
          <Button variant="ghost" asChild><Link href="/docs/components">All {components.length} components <ArrowUpRight className="size-4" /></Link></Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <Card key={item.name} className="group shadow-none transition-colors hover:bg-accent/50">
              <Link href={`/docs/components/${item.name}`} className="block h-full rounded-xl p-6 no-underline">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.label}</span><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </div>
                <h3 className="mt-6 text-base font-medium tracking-tight">{components.find((component) => component.name === item.name)?.title ?? item.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-start justify-between gap-6 border-t border-border py-10 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <h2 className="text-xl font-medium tracking-tight">Make something worth looking at.</h2>
          <p className="text-sm text-muted-foreground">One command. Full ownership. A better starting point.</p>
        </div>
        <Button asChild><Link href="/docs/installation">Start building <ArrowRight className="size-4" /></Link></Button>
      </section>
    </div>
  );
}
