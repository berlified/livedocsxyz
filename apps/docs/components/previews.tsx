"use client";

import {
  ArrowRight,
  Download,
  Mail,
  Plus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AreaChart } from "@/components/ui/area-chart";

import {
  ComponentPreview,
  PreviewSection,
} from "@/components/component-preview";

export function ButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Button</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}

export function ButtonExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>

      <ComponentPreview label="Variant" className="space-y-6">
        <PreviewSection title="Variant">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </PreviewSection>

        <PreviewSection title="Size">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Email">
            <Mail className="size-4" />
          </Button>
        </PreviewSection>

        <PreviewSection title="With icon">
          <Button>
            <Mail className="size-4" />
            Email
          </Button>
          <Button variant="outline">
            Next
            <ArrowRight className="size-4" />
          </Button>
          <Button disabled>Disabled</Button>
        </PreviewSection>
      </ComponentPreview>
    </section>
  );
}

export function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}

export function BadgeExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Variants</h2>
      <ComponentPreview className="space-y-6">
        <PreviewSection title="Variant">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </PreviewSection>
      </ComponentPreview>
    </section>
  );
}

export function CardPreview() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Workspace</CardTitle>
          <Badge variant="secondary">Active</Badge>
        </div>
        <CardDescription>
          Layered surfaces with subtle borders for dense product UI.
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CardExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Composition</h2>
      <ComponentPreview label="Surface treatments">
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Surface</CardTitle>
              <CardDescription>Default panel</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Outline</CardTitle>
              <CardDescription>Border emphasis</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </ComponentPreview>
    </section>
  );
}

export function InputPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input placeholder="Email address" type="email" />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}

export function InputExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">States</h2>
      <ComponentPreview>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input placeholder="Default" />
          <Input placeholder="Disabled" disabled />
        </div>
      </ComponentPreview>
    </section>
  );
}

export function AvatarPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar className="size-8">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop"
          alt="User"
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <p className="text-sm font-medium">Account</p>
        <p className="text-xs text-muted-foreground">Profile and security</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium">Billing</p>
        <p className="text-xs text-muted-foreground">Invoices and plans</p>
      </div>
      <div className="flex h-8 items-center gap-3">
        <span className="text-sm text-muted-foreground">Item</span>
        <Separator orientation="vertical" />
        <span className="text-sm text-muted-foreground">Detail</span>
      </div>
    </div>
  );
}

export function AreaChartPreview() {
  return <AreaChart className="w-full" />;
}

export function AreaChartExamples() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Marker</h2>
      <ComponentPreview label="Custom label" className="p-0">
        <AreaChart markerLabel="$12,480" markerIndex={18} />
      </ComponentPreview>
    </section>
  );
}

export function CompositionPreview() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>FU</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Invite teammates</CardDescription>
          </div>
          <Badge variant="outline">New</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <Input placeholder="Invite teammate by email" />
        <div className="flex flex-wrap gap-2">
          <Button size="sm">
            <Plus className="size-4" />
            Invite
          </Button>
          <Button size="sm" variant="secondary">
            Syncing
          </Button>
          <Button size="sm" variant="ghost">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
