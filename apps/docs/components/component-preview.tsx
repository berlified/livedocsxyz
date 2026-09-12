"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ComponentPreview({
  children,
  className,
  label = "Preview",
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className="overflow-hidden rounded-none border-2 border-border shadow-[4px_4px_0_0_var(--border)]">
      <div className="flex items-center justify-between border-b-2 border-border bg-card px-3 py-2">
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className={cn("preview-canvas p-6", className)}>{children}</div>
    </div>
  );
}

export function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="preview-section">
      <p className="preview-section-title">{title}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
