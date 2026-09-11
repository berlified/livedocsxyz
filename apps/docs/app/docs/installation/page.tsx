import { Badge, Heading, Text } from "frosted-ui";

import { CodeBlock } from "@/components/code-block";

export default function InstallationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <Badge color="blue">Guides</Badge>
        <Heading size="8">Installation</Heading>
        <Text size="3" color="gray">
          FrostUI uses the official Whop Frosted UI package.
        </Text>
      </header>

      <section className="space-y-3">
        <Heading size="5">Install</Heading>
        <CodeBlock language="bash" code="pnpm add frosted-ui" />
      </section>

      <section className="space-y-3">
        <Heading size="5">Styles + Theme</Heading>
        <CodeBlock
          language="tsx"
          code={`import "frosted-ui/styles.css"
import { Theme, Button } from "frosted-ui"

export default function App({ children }) {
  return (
    <Theme appearance="light" accentColor="blue" grayColor="gray" hasBackground>
      {children}
    </Theme>
  )
}`}
        />
      </section>

      <section className="space-y-3">
        <Heading size="5">Usage</Heading>
        <CodeBlock
          language="tsx"
          code={`import { Button } from "frosted-ui"

export function Example() {
  return <Button variant="solid">Continue</Button>
}`}
        />
      </section>
    </div>
  );
}
