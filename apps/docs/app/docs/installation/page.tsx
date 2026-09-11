import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import {
  getRegistryBaseUrl,
  getShadcnAddAllCommand,
  getShadcnAddCommand,
} from "@/lib/registry-url";

export default function InstallationPage() {
  const registryUrl = getRegistryBaseUrl();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge variant="outline">Guides</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
        <p className="text-base leading-7 text-muted-foreground">
          FrostUI ships as a shadcn-compatible registry. Components copy into your
          project with the shadcn CLI — no package lock-in.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Registry URL</h2>
        <CodeBlock language="bash" code={registryUrl} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add a component</h2>
        <CodeBlock language="bash" code={getShadcnAddCommand("button")} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add all Phase 1 components</h2>
        <CodeBlock language="bash" code={getShadcnAddAllCommand()} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">FrostUI CLI</h2>
        <p className="text-sm text-muted-foreground">
          The CLI prints the same shadcn command for convenience.
        </p>
        <CodeBlock language="bash" code="npx frostui add button" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Theme tokens</h2>
        <CodeBlock
          language="bash"
          code={`npx shadcn@latest add theme --registry ${registryUrl}`}
        />
        <CodeBlock
          language="tsx"
          code={`import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Continue</Button>
}`}
        />
      </section>
    </div>
  );
}
