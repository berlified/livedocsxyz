"use client";

import * as React from "react";

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
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-card px-3 py-2">
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className={`preview-canvas p-6 ${className ?? ""}`}>{children}</div>
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
