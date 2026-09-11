import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { getShadcnAddCommand } from "@/lib/registry-url";

export default function DocsHomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge variant="outline">Documentation</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">FrostUI docs</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Dark-first React components distributed through a shadcn-compatible
          registry. Copy source into your app, customize freely, ship faster.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Installation",
            description: "Add components with the shadcn CLI and registry URL.",
            href: "/docs/installation",
          },
          {
            title: "Component catalog",
            description: "Browse previews, props, and install commands.",
            href: "/docs/components",
          },
          {
            title: "Theming",
            description: "Semantic CSS variables for dark and light modes.",
            href: "/docs/theming",
          },
          {
            title: "Agent guidance",
            description: "Registry metadata for AI coding agents.",
            href: "/docs/agents",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-border bg-card p-5 no-underline transition-colors hover:bg-accent"
          >
            <h2 className="text-base font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quick start</h2>
        <CodeBlock language="bash" code={getShadcnAddCommand("button")} />
      </section>
    </div>
  );
}
