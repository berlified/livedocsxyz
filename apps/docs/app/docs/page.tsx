import Link from "next/link";
import { components } from "@frostui/registry";
import { Badge, Card, Heading, Inset, Text } from "frosted-ui";

import { DocsLinkButton } from "@/components/docs-link-button";
import { CodeBlock } from "@/components/code-block";

export default function DocsIntroPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge color="blue">Guides</Badge>
        <Heading size="8">Introduction</Heading>
        <Text size="3" color="gray">
          FrostUI wraps Whop&apos;s open-source Frosted UI. Phase 1 ships real
          components — not reimplementations.
        </Text>
      </header>

      <section className="space-y-3">
        <Heading size="5">What&apos;s ready</Heading>
        <div className="grid gap-3 sm:grid-cols-2">
          {components.map((component) => (
            <Link key={component.name} href={`/docs/components/${component.name}`} className="no-underline">
              <Card size="2" className="h-full">
                <Inset side="all" p="current">
                  <Heading size="3">{component.title}</Heading>
                  <Text size="2" color="gray">
                    {component.description}
                  </Text>
                </Inset>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Heading size="5">Start here</Heading>
        <CodeBlock
          language="bash"
          code={`pnpm add frosted-ui\nimport "frosted-ui/styles.css"`}
        />
        <DocsLinkButton href="/docs/installation">Installation guide</DocsLinkButton>
      </section>
    </div>
  );
}
