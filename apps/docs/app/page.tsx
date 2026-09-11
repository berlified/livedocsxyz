import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { components } from "@frostui/registry";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { LandingShowcase } from "@/components/landing-showcase";
import { getShadcnAddCommand } from "@/lib/registry-url";

const featured = components.filter((item) =>
  [
    "trend-card",
    "metric-chart",
    "comparison-chart",
    "breakdown-chart",
    "range-chart",
    "area-chart",
    "button",
    "card",
  ].includes(item.name)
);

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-20 pb-16">
      <section className="space-y-8 pt-8 lg:pt-12">
        <div className="space-y-6">
          <Badge variant="outline">Charts for product UI</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              Metrics that sit in a dashboard, not a demo.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Overlay this period on last. Range bands. Share stacks you can
              click. Install with shadcn, then the files are yours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/docs/components/trend-card">
                Start with trend cards
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/installation">Install with shadcn</Link>
            </Button>
          </div>
        </div>
        <CodeBlock language="bash" code={getShadcnAddCommand("metric-chart")} />
      </section>

      <section>
        <LandingShowcase />
      </section>

      <Separator />

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Featured
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {components.length} items in the catalog
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/components">View all</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <Link
              key={item.name}
              href={`/docs/components/${item.name}`}
              className="group rounded-xl border border-border bg-card p-5 no-underline transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{item.title}</p>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
