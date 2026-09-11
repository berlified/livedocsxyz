import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge variant="outline">Guides</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Agent guidance</h1>
        <p className="text-base leading-7 text-muted-foreground">
          FrostUI ships registry metadata so agents can discover components,
          install commands, and composition rules without guessing.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Discovery</h2>
        <CodeBlock
          language="bash"
          code={`npx frostui list
npx frostui search card
npx frostui info button`}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Install</h2>
        <CodeBlock language="bash" code="npx frostui add button" />
        <p className="text-sm text-muted-foreground">
          Prints the shadcn CLI command that copies source into{" "}
          <code className="text-foreground">@/components/ui</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Metadata location</h2>
        <CodeBlock
          language="text"
          code={`packages/registry/src/components/*.json
registry/registry.json
AGENTS.md`}
        />
      </section>
    </div>
  );
}
