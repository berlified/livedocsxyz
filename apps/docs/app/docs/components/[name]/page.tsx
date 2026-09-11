import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { components, getComponent } from "@frostui/registry";

import { ComponentDocLayout } from "@/components/component-doc-layout";
import {
  AvatarPreview,
  BadgeExamples,
  BadgePreview,
  ButtonExamples,
  ButtonPreview,
  CardExamples,
  CardPreview,
  InputExamples,
  InputPreview,
  SeparatorPreview,
} from "@/components/previews";

const usageByName: Record<string, string> = {
  button: `import { Button } from "frosted-ui"

export function Example() {
  return <Button variant="solid">Continue</Button>
}`,
  badge: `import { Badge } from "frosted-ui"

export function Example() {
  return <Badge color="success">Active</Badge>
}`,
  card: `import { Card, Heading, Inset, Text } from "frosted-ui"

export function Example() {
  return (
    <Card size="2">
      <Inset side="all" p="current">
        <Heading size="4">Revenue</Heading>
        <Text size="2" color="gray">Last 30 days</Text>
      </Inset>
    </Card>
  )
}`,
  input: `import { TextField } from "frosted-ui"

export function Example() {
  return (
    <TextField.Root>
      <TextField.Input placeholder="Search…" />
    </TextField.Root>
  )
}`,
  avatar: `import { Avatar } from "frosted-ui"

export function Example() {
  return <Avatar src="/avatar.jpg" fallback="AL" />
}`,
  separator: `import { Separator } from "frosted-ui"

export function Example() {
  return <Separator size="4" />
}`,
};

const previewByName: Record<string, ReactNode> = {
  button: <ButtonPreview />,
  badge: <BadgePreview />,
  card: <CardPreview />,
  input: <InputPreview />,
  avatar: <AvatarPreview />,
  separator: <SeparatorPreview />,
};

const examplesByName: Record<string, ReactNode> = {
  button: <ButtonExamples />,
  badge: <BadgeExamples />,
  card: <CardExamples />,
  input: <InputExamples />,
};

const sourcePaths: Record<string, string> = {
  button: "components/button/button.tsx",
  badge: "components/badge/badge.tsx",
  card: "components/card/card.tsx",
  input: "components/text-field/text-field.tsx",
  avatar: "components/avatar/avatar.tsx",
  separator: "components/separator/separator.tsx",
};

function readFrostedSource(name: string) {
  const relative = sourcePaths[name];
  if (!relative) return "// Source unavailable";

  const roots = [
    path.join(process.cwd(), "node_modules/frosted-ui/dist/esm", relative),
    path.join(process.cwd(), "../../node_modules/frosted-ui/dist/esm", relative),
  ];

  for (const file of roots) {
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
  }

  return `// See https://github.com/whopio/frosted-ui/tree/main/packages/frosted-ui/src/${relative.replace(".tsx", "")}`;
}

export function generateStaticParams() {
  return components.map((component) => ({ name: component.name }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  return params.then(({ name }) => {
    const component = getComponent(name);
    return {
      title: component?.title ?? "Component",
      description: component?.description,
    };
  });
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const component = getComponent(name);
  if (!component) notFound();

  const source = readFrostedSource(name);
  const preview = previewByName[name];
  const usage =
    usageByName[name] ??
    `import { ${component.title} } from "frosted-ui"`;
  const examples = examplesByName[name];

  return (
    <ComponentDocLayout
      component={component}
      preview={preview}
      usage={usage}
      source={source}
      examples={examples}
    />
  );
}
