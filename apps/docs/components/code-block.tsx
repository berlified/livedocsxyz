"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "tsx",
  title,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-none border-2 border-border bg-card shadow-[4px_4px_0_0_var(--border)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b-2 border-border px-3 py-2">
        <span className="text-xs text-muted-foreground">
          {title ?? language}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="Copy code"
          onClick={copy}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
