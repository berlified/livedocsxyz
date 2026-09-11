import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { components, categories } from "@frostui/registry";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogLink } from "@/components/docs-shell";
import { getShadcnAddAllCommand } from "@/lib/registry-url";

const catalogGroups = categories
  .map((category) => ({
    ...category,
    items: components.filter((component) => component.category === category.id),
  }))
  .filter((group) => group.items.length > 0);

export default function ComponentsCatalogPage() {
  const installAll = getShadcnAddAllCommand();

  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <section className="grid gap-8 pt-2 lg:grid-cols-[1fr_18rem] lg:items-start">
        <div className="space-y-6">
          <Badge variant="outline">Component catalog</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              Browse the FrostUI component library
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Pick a category, open a component, preview the demo, then copy the
              shadcn install command or manual source from the docs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/docs/components/button">
                Start with buttons
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/installation">CLI install</Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-xl">
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
              snippets, and agent guidance.
            </p>
            <pre className="overflow-x-auto rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
              {installAll}
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="catalog-grid md:grid-cols-2">
        {catalogGroups.map((group) => (
          <div key={group.id} className="catalog-column">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{group.title}</p>
                <p className="text-xs text-muted-foreground">
                  {group.items.length} components
                </p>
              </div>
            </div>
            {group.items.map((item) => (
              <CatalogLink
                key={item.name}
                href={`/docs/components/${item.name}`}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
