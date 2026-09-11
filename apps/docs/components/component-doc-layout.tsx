import type { ReactNode } from "react";

import { Badge } from "frosted-ui";
import type { RegistryComponent } from "@frostui/registry";

import { CodeBlock } from "@/components/code-block";
import { ComponentPreview } from "@/components/component-preview";

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
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="blue">{component.category}</Badge>
          <Badge variant="outline" color="gray">
            Phase 1
          </Badge>
        </div>
        <h1 className="text-8 font-semibold tracking-tight">{component.title}</h1>
        <p className="max-w-2xl text-3" style={{ color: "var(--gray-11)" }}>
          {component.description}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-5 font-semibold tracking-tight">Preview</h2>
        <ComponentPreview>{preview}</ComponentPreview>
      </section>

      {examples}

      <section className="space-y-3">
        <h2 className="text-5 font-semibold tracking-tight">Installation</h2>
        <CodeBlock language="bash" code={`npx frostui add ${component.name}`} />
      </section>

      <section className="space-y-3">
        <h2 className="text-5 font-semibold tracking-tight">Usage</h2>
        <CodeBlock language="tsx" code={usage} />
      </section>

      <section className="space-y-3">
        <h2 className="text-5 font-semibold tracking-tight">Props</h2>
        <div
          className="overflow-x-auto rounded-lg"
          style={{ border: "1px solid var(--gray-a6)" }}
        >
          <table className="w-full min-w-[36rem] text-left text-2">
            <thead style={{ background: "var(--gray-a2)", color: "var(--gray-11)" }}>
              <tr>
                <th className="px-4 py-3 font-medium">Prop</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Default</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr
                  key={prop.name}
                  style={{ borderTop: "1px solid var(--gray-a6)" }}
                >
                  <td
                    className="px-4 py-3 font-mono text-1"
                    style={{ color: "var(--accent-11)" }}
                  >
                    {prop.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-1" style={{ color: "var(--gray-11)" }}>
                    {prop.type}
                  </td>
                  <td className="px-4 py-3 font-mono text-1" style={{ color: "var(--gray-10)" }}>
                    {prop.default ?? "—"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--gray-11)" }}>
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-5 font-semibold tracking-tight">Agent guidance</h2>
        <div
          className="space-y-4 rounded-lg p-5 text-2"
          style={{
            border: "1px solid var(--gray-a6)",
            background: "var(--gray-a2)",
          }}
        >
          <div>
            <p className="mb-1 font-medium">Purpose</p>
            <p style={{ color: "var(--gray-11)" }}>{component.ai.purpose}</p>
          </div>
          <div>
            <p className="mb-1 font-medium">Use when</p>
            <ul className="list-disc space-y-1 pl-5" style={{ color: "var(--gray-11)" }}>
              {component.ai.useWhen.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium">Compositions</p>
            <ul className="list-disc space-y-1 pl-5" style={{ color: "var(--gray-11)" }}>
              {component.ai.compositions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium">Avoid</p>
            <ul className="list-disc space-y-1 pl-5" style={{ color: "var(--gray-11)" }}>
              {component.ai.avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-5 font-semibold tracking-tight">Source</h2>
        <CodeBlock language="tsx" title={`${component.name}.tsx`} code={source} />
      </section>
    </div>
  );
}
