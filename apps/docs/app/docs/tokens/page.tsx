import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

const tokens = [
  ["--background", "App canvas"],
  ["--foreground", "Primary text"],
  ["--card", "Card surfaces"],
  ["--muted-foreground", "Secondary text"],
  ["--border", "Default borders"],
  ["--primary", "Primary actions"],
  ["--ring", "Focus rings"],
];

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge variant="outline">Guides</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Design tokens</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Semantic CSS variables mapped to Tailwind tokens. Never hardcode hex
          values in components.
        </p>
      </header>

      <section className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Use</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map(([token, use]) => (
              <tr key={token} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{token}</td>
                <td className="px-4 py-3 text-muted-foreground">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Install theme</h2>
        <CodeBlock
          language="bash"
          code="npx shadcn@latest add https://livedocs.xyz/r/theme.json"
        />
      </section>
    </div>
  );
}
