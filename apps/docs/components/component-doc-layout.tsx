import type { ReactNode } from "react";

import type { RegistryComponent } from "@frostui/registry";

import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { ComponentPreview } from "@/components/component-preview";
import { getShadcnAddCommand } from "@/lib/registry-url";

export function ComponentDocLayout({
  component,
  preview,
  usage,
  source,
  examples,
}: {
  component: RegistryComponent;
  preview: ReactNode;
  usage: string;
  source: string;
  examples?: ReactNode;
}) {
  const installCommand = getShadcnAddCommand(component.name);

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <header id="overview" className="scroll-mt-24 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{component.category}</Badge>
          <Badge variant="secondary">Registry</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">
          {component.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {component.description}
        </p>
      </header>

      <section id="preview" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Preview</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <ComponentPreview
            className={component.category === "charts" ? "p-0" : undefined}
          >
            {preview}
          </ComponentPreview>
        </div>
      </section>

      {examples}

      <section id="installation" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
        <p className="text-sm text-muted-foreground">
          Install with the shadcn CLI. This copies source into your project.
        </p>
        <CodeBlock language="bash" code={installCommand} />
        <CodeBlock
          language="bash"
          title="Namespace (after one-time setup)"
          code={`npx shadcn@latest add @livedocs/${component.name}`}
        />
      </section>

      <section id="usage" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Usage</h2>
        <CodeBlock language="tsx" code={usage} />
      </section>

      <section id="props" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Props</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-card text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Prop</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Default</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr key={prop.name} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {prop.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {prop.type}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {prop.default ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="source" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Source</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <CodeBlock language="tsx" title={`${component.name}.tsx`} code={source} collapsible className="rounded-none border-x-0 border-b-0" />
        </div>
      </section>
    </div>
  );
}
