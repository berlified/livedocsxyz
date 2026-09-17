import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

import { components, categories } from "@frostui/registry";

import { LivedocsLogo } from "@/components/livedocs-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogLink } from "@/components/docs-shell";
import { CodeBlock } from "@/components/code-block";
import { getShadcnAddCommand } from "@/lib/registry-url";

const catalogGroups = categories
  .map((category) => ({
    ...category,
    items: components.filter((component) => component.category === category.id),
  }))
  .filter((group) => group.items.length > 0);

export const metadata: Metadata = {
  title: "Components",
  description: "Browse the component catalog and copy a shadcn install command.",
};

export default function ComponentsCatalogPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-12 sm:space-y-16">
      <section className="grid min-w-0 gap-8 pt-2 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0 space-y-6">
          <div className="flex items-center gap-3">
            <LivedocsLogo className="h-6" />
            <Badge variant="outline">Chart catalog</Badge>
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-balance text-3xl font-medium tracking-[-0.03em] sm:text-4xl md:text-5xl">
              Charts that work the way your product does.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Open a chart, preview the demo, then copy the shadcn install
              command or the source from the docs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/docs/components/chart">
                Start with Chart
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/installation">CLI install</Link>
            </Button>
          </div>
        </div>

        <Card className="min-w-0">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight">
                {components.length}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Components
              </p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Every item ships with live previews, install commands, usage
              snippets, and source code.
            </p>
            <CodeBlock
              language="bash"
              className="[&_pre]:whitespace-pre-wrap [&_code]:break-all"
              code={getShadcnAddCommand("chart")}
            />
          </CardContent>
        </Card>
      </section>

      <div className="space-y-8">
        {catalogGroups.map((group) => (
          <section
            key={group.id}
            aria-labelledby={`category-${group.id}`}
            className="min-w-0 space-y-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <h2 id={`category-${group.id}`} className="truncate text-sm font-medium tracking-tight">
                {group.title}
              </h2>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {group.items.length} components
              </span>
            </div>
            <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => (
                <CatalogLink
                  key={item.name}
                  href={`/docs/components/${item.name}`}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
