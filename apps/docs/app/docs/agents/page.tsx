import { Badge, Heading, Text } from "frosted-ui";

import { CodeBlock } from "@/components/code-block";

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <Badge color="blue">Guides</Badge>
        <Heading size="8">For AI agents</Heading>
        <Text size="3" color="gray">
          Import from <code>frosted-ui</code> directly. Registry metadata lives in{" "}
          <code>packages/registry</code>.
        </Text>
      </header>

      <section className="space-y-3">
        <Heading size="5">Discovery flow</Heading>
        <CodeBlock
          language="text"
          code={`Understand request
  → search registry
  → read component ai guidance
  → pnpm add frosted-ui
  → compose with Theme + primitives`}
        />
      </section>
    </div>
  );
}
