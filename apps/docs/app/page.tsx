import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { components } from "@frostui/registry";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { CompositionPreview } from "@/components/previews";
import { AreaChart } from "@/components/ui/area-chart";
import { getShadcnAddCommand } from "@/lib/registry-url";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-24 pb-16">
      <section className="space-y-8 pt-8 md:pt-16">
        <Badge variant="outline">shadcn registry</Badge>
        <div className="space-y-5">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Copy the command. Own the source.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            A component registry for real products. Preview it here, install it
            with shadcn, then edit the files in your repo like they were always
            yours.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Badge>New</Badge>
          <Badge variant="secondary">Shipped</Badge>
          <Input className="h-9 w-44" placeholder="Search…" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs/components">
              Browse components
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/installation">Install with shadcn</Link>
          </Button>
        </div>
      </section>

      <section className="-mx-4 md:-mx-8 lg:-mx-10">
        <AreaChart />
      </section>

      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          One command
        </p>
        <CodeBlock language="bash" code={getShadcnAddCommand("button")} />
        <p className="text-sm text-muted-foreground">
          That URL is a real registry item. Run it in any shadcn project and
          `button.tsx` lands in `@/components/ui`.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Source in your repo",
            description:
              "No package lock-in. Files copy in, you change them, you ship them.",
          },
          {
            title: "Works with shadcn",
            description:
              "Same CLI you already use. Point it at livedocs.xyz and keep building.",
          },
          {
            title: "Reuse everywhere",
            description:
              "Install the same primitives into every future project from one catalog.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Catalog
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {components.length} primitives, ready to install
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/components">View all</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((item) => (
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

      <Separator />

      <section className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            In a product
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Compose the pieces. Don’t restyle a div.
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Button, Badge, Card, Input, Avatar, Separator — the same set you
            will reach for in dashboards, settings, and auth screens.
          </p>
          <Button variant="outline" asChild>
            <Link href="/docs/components">Open the catalog</Link>
          </Button>
        </div>
        <CompositionPreview />
      </section>
    </div>
  );
}
