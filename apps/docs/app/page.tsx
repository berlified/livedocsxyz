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
import { CodeBlock } from "@/components/code-block";
import { CompositionPreview } from "@/components/previews";
import { getShadcnAddCommand } from "@/lib/registry-url";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-20 pb-10">
      <section className="space-y-6 pt-6 md:pt-12">
        <Badge variant="outline">FrostUI registry</Badge>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Dark-first components you can install with one command.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            FrostUI is a shadcn-compatible registry. Preview a primitive, copy
            the CLI command, and drop source into{" "}
            <code className="text-foreground">@/components/ui</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs/components">
              Browse components
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/installation">Installation</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Install
        </p>
        <CodeBlock language="bash" code={getShadcnAddCommand("button")} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Own the source",
            description:
              "Components copy into your repo. No lock-in — edit tokens and markup like any other file.",
          },
          {
            title: "shadcn CLI",
            description:
              "Every primitive has a copiable install command pointed at the livedocs.xyz registry.",
          },
          {
            title: "Agent-ready",
            description:
              "Registry metadata tells coding agents when to use Button, Card, Badge, and how to compose them.",
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

      <section className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Composition
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Built to stack, not to reinvent.
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {components.length} Phase 1 primitives — Button, Badge, Card, Input,
            Avatar, and Separator — using semantic tokens only.
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
