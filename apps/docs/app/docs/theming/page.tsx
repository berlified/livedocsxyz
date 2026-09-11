import { Badge, Button, Card, Heading, Text } from "frosted-ui";

import { CodeBlock } from "@/components/code-block";

export default function ThemingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <Badge color="blue">Guides</Badge>
        <Heading size="8">Theming</Heading>
        <Text size="3" color="gray">
          Frosted UI Theme controls appearance, accent, and gray scales.
        </Text>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card size="2">
          <Heading size="3">Light</Heading>
          <Text size="2" color="gray">
            Default docs appearance — matches Storybook canvas.
          </Text>
        </Card>
        <Card size="2">
          <Heading size="3">Dark</Heading>
          <Text size="2" color="gray">
            Toggle from the header to switch appearance.
          </Text>
        </Card>
      </div>

      <section className="space-y-3">
        <Heading size="5">Apply theme</Heading>
        <CodeBlock
          language="tsx"
          code={`<Theme appearance="light" accentColor="blue" grayColor="gray" hasBackground>
  {children}
</Theme>`}
        />
        <Button variant="surface" color="gray">
          Theme toggle lives in the header
        </Button>
      </section>
    </div>
  );
}
