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
  button: `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Continue</Button>
}`,
  badge: `import { Badge } from "@/components/ui/badge"

export function Example() {
  return <Badge variant="secondary">Active</Badge>
}`,
  card: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>$12,480</CardContent>
    </Card>
  )
}`,
  input: `import { Input } from "@/components/ui/input"

export function Example() {
  return <Input placeholder="Search…" />
}`,
  avatar: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.jpg" alt="User" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  )
}`,
  separator: `import { Separator } from "@/components/ui/separator"

export function Example() {
  return <Separator />
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
  button: "apps/docs/components/ui/button.tsx",
  badge: "apps/docs/components/ui/badge.tsx",
  card: "apps/docs/components/ui/card.tsx",
  input: "apps/docs/components/ui/input.tsx",
  avatar: "apps/docs/components/ui/avatar.tsx",
  separator: "apps/docs/components/ui/separator.tsx",
};

function readRegistrySource(name: string) {
  const relative = sourcePaths[name];
  if (!relative) return "// Source unavailable";

  const roots = [
    path.join(process.cwd(), relative),
    path.join(process.cwd(), "../..", relative),
  ];

  for (const file of roots) {
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
  }

  return "// Source unavailable";
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

  const source = readRegistrySource(name);
  const preview = previewByName[name];
  const usage =
    usageByName[name] ??
    `import { ${component.title} } from "@/components/ui/${component.name}"`;
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
