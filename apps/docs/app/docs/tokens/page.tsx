import { Badge, Heading, Text } from "frosted-ui";

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <Badge color="blue">Guides</Badge>
        <Heading size="8">Design tokens</Heading>
        <Text size="3" color="gray">
          FrostUI uses Frosted UI&apos;s Radix color scales via{" "}
          <code>frosted-ui/styles.css</code>. See the{" "}
          <a href="https://storybook.whop.dev/?path=/docs/guides-3-color--docs">
            color guide
          </a>
          .
        </Text>
      </header>

      <Text size="2" color="gray">
        Accent colors use 12-step scales: <code>--blue-1</code> through{" "}
        <code>--blue-12</code>, plus semantic aliases for info, success,
        warning, and danger.
      </Text>
    </div>
  );
}
