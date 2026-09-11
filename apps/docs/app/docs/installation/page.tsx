import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import {
  getNamespaceSetupCommand,
  getNamespacedAddCommand,
  getShadcnAddAllCommand,
  getShadcnAddCommand,
} from "@/lib/registry-url";

export default function InstallationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge variant="outline">Guides</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
        <p className="text-base leading-7 text-muted-foreground">
          These components ship through a shadcn registry. The CLI copies source
          into your project — then you own the files.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add one component</h2>
        <p className="text-sm text-muted-foreground">
          Works in any project that already uses shadcn. No extra setup.
        </p>
        <CodeBlock language="bash" code={getShadcnAddCommand("button")} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add the full set</h2>
        <CodeBlock language="bash" code={getShadcnAddAllCommand()} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Optional: namespace</h2>
        <p className="text-sm text-muted-foreground">
          Register the catalog once, then install with short names.
        </p>
        <CodeBlock language="bash" code={getNamespaceSetupCommand()} />
        <CodeBlock language="bash" code={getNamespacedAddCommand("button")} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Usage</h2>
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
