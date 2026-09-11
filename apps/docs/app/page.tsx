import Link from "next/link";
import { Badge, Card, Heading, Inset, Text } from "frosted-ui";

import { DocsLinkButton } from "@/components/docs-link-button";

import { CompositionPreview } from "@/components/previews";
import { ComponentPreview } from "@/components/component-preview";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-14">
      <section className="space-y-6 pt-4">
        <Badge color="blue">Phase 1 · Foundations</Badge>
        <div className="space-y-4">
          <Text size="1" color="gray" weight="medium" className="uppercase tracking-wide">
            FrostUI
          </Text>
          <Heading size="8" className="max-w-3xl tracking-tight">
            Frosted components for products that feel premium.
          </Heading>
          <Text size="4" color="gray" className="max-w-2xl">
            Built on Whop Frosted UI — real components, real tokens, copyable
            source, and first-class guidance for AI coding agents.
          </Text>
        </div>
        <div className="flex flex-wrap gap-3">
          <DocsLinkButton href="/docs">Browse docs</DocsLinkButton>
          <DocsLinkButton href="/docs/components/button" variant="surface" color="gray">
            View Button
          </DocsLinkButton>
        </div>
      </section>

      <ComponentPreview label="Foundation composition" className="min-h-56">
        <CompositionPreview />
      </ComponentPreview>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Whop Frosted UI",
            description: "Official open-source components from whopio/frosted-ui.",
            href: "/docs/installation",
          },
          {
            title: "Radix color scales",
            description: "12-step palettes with semantic info, success, warning, danger.",
            href: "/docs/tokens",
          },
          {
            title: "Agent-native",
            description: "Registry metadata tells agents what to use and how to compose.",
            href: "/docs/agents",
          },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="no-underline">
            <Card size="2" className="h-full">
              <Inset side="all" p="current">
                <Heading size="3">{item.title}</Heading>
                <Text size="2" color="gray">
                  {item.description}
                </Text>
              </Inset>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
