import Link from "next/link";

import { LivedocsLogo } from "@/components/livedocs-logo";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { getShadcnAddCommand } from "@/lib/registry-url";

export default function DocsHomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <LivedocsLogo className="h-7" />
          <Badge variant="outline">Documentation</Badge>
        </div>
        <h1 className="text-4xl font-medium tracking-[-0.03em]">Docs</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Preview components, copy a shadcn command, and drop the source into
          any project.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Installation",
            description: "Add components with the shadcn CLI.",
            href: "/docs/installation",
          },
          {
            title: "Component catalog",
            description: "Previews, props, and install commands.",
            href: "/docs/components",
          },
          {
            title: "Theming",
            description: "Semantic CSS variables for both themes.",
            href: "/docs/theming",
          },
          {
            title: "Agent guidance",
            description: "Registry metadata for coding agents.",
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
        <CodeBlock language="bash" code={getShadcnAddCommand("chart")} />
      </section>
    </div>
  );
}
