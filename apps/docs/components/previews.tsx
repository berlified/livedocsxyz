"use client";

import {
  ArrowRight,
  Ban,
  Download,
  Mail,
  Plus,
  Settings,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Heading,
  IconButton,
  Inset,
  Link,
  Separator,
  Text,
  TextField,
} from "frosted-ui";

import {
  ComponentPreview,
  PreviewSection,
} from "@/components/component-preview";

export function ButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="solid">Button</Button>
      <Button variant="soft">Button</Button>
      <Button variant="ghost">Button</Button>
      <Button variant="surface">Button</Button>
      <Link href="#" onClick={(e) => e.preventDefault()}>
        Button
      </Link>
    </div>
  );
}

export function ButtonExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-5 font-semibold">Variants</h2>

      <ComponentPreview label="Variant" className="space-y-6">
        <PreviewSection title="Variant">
          <Button variant="solid">Button</Button>
          <Button variant="soft">Button</Button>
          <Button variant="ghost">Button</Button>
          <Button variant="surface">Button</Button>
          <Link href="#" onClick={(e) => e.preventDefault()}>
            Button
          </Link>
        </PreviewSection>

        <PreviewSection title="Color">
          <Button variant="soft" color="blue">
            Blue
          </Button>
          <Button variant="soft" color="green">
            Green
          </Button>
          <Button variant="soft" color="orange">
            Orange
          </Button>
          <Button variant="soft" color="red">
            Red
          </Button>
        </PreviewSection>

        <PreviewSection title="Semantic color">
          <Button variant="soft" color="info">
            Info
          </Button>
          <Button variant="soft" color="success">
            Success
          </Button>
          <Button variant="soft" color="warning">
            Warning
          </Button>
          <Button variant="soft" color="danger">
            Danger
          </Button>
        </PreviewSection>

        <PreviewSection title="High contrast">
          <Button highContrast>Button</Button>
          <Button highContrast color="green">
            Button
          </Button>
          <Button highContrast color="orange">
            Button
          </Button>
          <Button highContrast color="red">
            Button
          </Button>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="soft" highContrast>
              Button
            </Button>
            <Button variant="soft" highContrast color="green">
              Button
            </Button>
            <Button variant="soft" highContrast color="orange">
              Button
            </Button>
            <Button variant="soft" highContrast color="red">
              Button
            </Button>
          </div>
        </PreviewSection>
      </ComponentPreview>

      <ComponentPreview label="Size & states" className="space-y-6">
        <PreviewSection title="Size">
          <Button size="1">Size 1</Button>
          <Button size="2">Size 2</Button>
          <Button size="3">Size 3</Button>
          <Button size="4">Size 4</Button>
        </PreviewSection>
        <PreviewSection title="States">
          <Button loading>Saving</Button>
          <Button disabled>
            <Ban size={16} />
            Disabled
          </Button>
          <Button>
            <Mail size={16} />
            Email
          </Button>
          <IconButton aria-label="Settings">
            <Settings size={16} />
          </IconButton>
          <Button variant="surface">
            Next
            <ArrowRight size={16} />
          </Button>
        </PreviewSection>
      </ComponentPreview>
    </section>
  );
}

export function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge color="blue">Blue</Badge>
      <Badge color="green">Green</Badge>
      <Badge color="orange">Orange</Badge>
      <Badge color="red">Red</Badge>
      <Badge color="gray">Gray</Badge>
    </div>
  );
}

export function BadgeExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-5 font-semibold">Variants</h2>
      <ComponentPreview className="space-y-6">
        <PreviewSection title="Variant">
          <Badge variant="solid">Solid</Badge>
          <Badge variant="soft">Soft</Badge>
          <Badge variant="surface">Surface</Badge>
          <Badge variant="outline">Outline</Badge>
        </PreviewSection>
        <PreviewSection title="Semantic">
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="danger">Danger</Badge>
          <Badge color="info">Info</Badge>
        </PreviewSection>
      </ComponentPreview>
    </section>
  );
}

export function CardPreview() {
  return (
    <Card size="2" className="w-full max-w-sm">
      <Inset side="all" p="current">
        <div className="mb-1 flex items-center justify-between gap-3">
          <Heading size="3">Workspace</Heading>
          <Badge color="success">Active</Badge>
        </div>
        <Text size="2" color="gray">
          Layered surfaces with subtle borders for dense product UI.
        </Text>
        <Text size="2" color="gray" className="mt-2">
          Use Card as the default content container across dashboards and
          settings.
        </Text>
        <div className="mt-4 flex gap-2">
          <Button size="2">Open</Button>
          <Button size="2" variant="ghost">
            Dismiss
          </Button>
        </div>
      </Inset>
    </Card>
  );
}

export function CardExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-5 font-semibold">Variants</h2>
      <ComponentPreview label="Surface treatments">
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <Card variant="surface" size="2">
            <Inset side="all" p="current">
              <Heading size="3">Surface</Heading>
              <Text size="2" color="gray">
                Default panel
              </Text>
            </Inset>
          </Card>
          <Card variant="outline" size="2">
            <Inset side="all" p="current">
              <Heading size="3">Outline</Heading>
              <Text size="2" color="gray">
                Border only
              </Text>
            </Inset>
          </Card>
          <Card variant="soft" size="2">
            <Inset side="all" p="current">
              <Heading size="3">Soft</Heading>
              <Text size="2" color="gray">
                Muted fill
              </Text>
            </Inset>
          </Card>
          <Card variant="ghost" size="2">
            <Inset side="all" p="current">
              <Heading size="3">Ghost</Heading>
              <Text size="2" color="gray">
                Borderless
              </Text>
            </Inset>
          </Card>
        </div>
      </ComponentPreview>
    </section>
  );
}

export function InputPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <TextField.Root>
        <TextField.Input placeholder="Email address" type="email" />
      </TextField.Root>
      <TextField.Root variant="soft">
        <TextField.Input placeholder="Soft variant" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="Disabled" disabled />
      </TextField.Root>
    </div>
  );
}

export function InputExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-5 font-semibold">Sizes</h2>
      <ComponentPreview>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <TextField.Root size="1">
            <TextField.Input placeholder="Size 1" />
          </TextField.Root>
          <TextField.Root size="2">
            <TextField.Input placeholder="Size 2" />
          </TextField.Root>
          <TextField.Root size="3">
            <TextField.Input placeholder="Size 3" />
          </TextField.Root>
        </div>
      </ComponentPreview>
    </section>
  );
}

export function AvatarPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size="2" fallback="SM" />
      <Avatar
        size="3"
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop"
        fallback="JD"
      />
      <Avatar size="4" fallback="LG" />
      <Avatar size="5" fallback="XL" />
    </div>
  );
}

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <Text size="2" weight="medium">
          Account
        </Text>
        <Text size="1" color="gray">
          Profile and security
        </Text>
      </div>
      <Separator size="4" />
      <div>
        <Text size="2" weight="medium">
          Billing
        </Text>
        <Text size="1" color="gray">
          Invoices and plans
        </Text>
      </div>
      <div className="flex h-8 items-center gap-3">
        <Text size="2" color="gray">
          Item
        </Text>
        <Separator orientation="vertical" size="4" />
        <Text size="2" color="gray">
          Detail
        </Text>
      </div>
    </div>
  );
}

export function CompositionPreview() {
  return (
    <Card size="2" className="w-full max-w-md">
      <Inset side="all" p="current">
        <div className="mb-4 flex items-center gap-3">
          <Avatar size="3" fallback="FU" />
          <div>
            <Heading size="3">FrostUI Design System</Heading>
            <Text size="2" color="gray">
              Phase 1 foundations
            </Text>
          </div>
          <Badge color="info" className="ml-auto">
            New
          </Badge>
        </div>
        <Separator size="4" className="my-4" />
        <TextField.Root>
          <TextField.Input placeholder="Invite teammate by email" />
        </TextField.Root>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="2">
            <Plus size={16} />
            Invite
          </Button>
          <Button size="2" variant="surface" color="gray" loading>
            Syncing
          </Button>
          <Button size="2" variant="ghost" color="gray">
            <Download size={16} />
            Export
          </Button>
        </div>
      </Inset>
    </Card>
  );
}
