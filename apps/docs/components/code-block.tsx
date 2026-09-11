"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { IconButton } from "frosted-ui";

export function CodeBlock({
  code,
  language = "tsx",
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        border: "1px solid var(--gray-a6)",
        background: "var(--gray-a2)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid var(--gray-a6)" }}
      >
        <div className="flex items-center gap-2">
          {title ? (
            <span className="text-1" style={{ color: "var(--gray-11)" }}>
              {title}
            </span>
          ) : null}
          <span
            className="rounded px-1.5 py-0.5 font-mono text-1 uppercase"
            style={{
              border: "1px solid var(--gray-a6)",
              color: "var(--gray-11)",
            }}
          >
            {language}
          </span>
        </div>
        <IconButton
          variant="ghost"
          color="gray"
          size="2"
          onClick={onCopy}
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </IconButton>
      </div>
      <pre
        className="overflow-x-auto p-4 font-mono text-1 leading-relaxed"
        style={{ color: "var(--gray-11)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
