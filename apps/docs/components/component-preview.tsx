"use client";

import * as React from "react";
import { Theme } from "frosted-ui";

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
    <div
      className="overflow-hidden rounded-lg"
      style={{ border: "1px solid var(--gray-a6)" }}
    >
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          borderBottom: "1px solid var(--gray-a6)",
          background: "var(--gray-a2)",
        }}
      >
        <span className="text-1" style={{ color: "var(--gray-11)" }}>
          {label}
        </span>
      </div>
      <Theme appearance="light" hasBackground={false}>
        <div className={`preview-canvas p-6 ${className ?? ""}`}>{children}</div>
      </Theme>
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
