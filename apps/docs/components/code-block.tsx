"use client";

import * as React from "react";
import { Check, ChevronDown, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TokenKind = "comment" | "string" | "keyword" | "number" | "property" | "function" | "operator";
type TokenRule = [TokenKind, string];

const strings = String.raw`"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'`;
const numbers = String.raw`\b(?:0[xX][\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?n?)\b`;
const scriptRules: TokenRule[] = [
  ["comment", String.raw`\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)`],
  ["string", `${strings}|` + String.raw`\x60(?:\\[\s\S]|[^\x60\\])*\x60`],
  ["keyword", String.raw`\b(?:as|async|await|break|case|catch|class|const|continue|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|if|implements|import|in|instanceof|interface|keyof|let|new|null|of|private|protected|public|readonly|return|satisfies|static|super|switch|this|throw|true|try|type|typeof|undefined|var|void|while|yield|boolean|number|string|never|unknown|any)\b`],
  ["number", numbers],
  ["function", String.raw`<\/?[A-Za-z][\w.:-]*|\b[A-Za-z_$][\w$]*(?=\s*\()`],
  ["property", String.raw`\b[A-Za-z_$][\w$-]*(?=\s*[:=](?!=|>))`],
  ["operator", String.raw`=>|\?\.|\?\?|===?|!==?|&&|\|\||[+*/%=<>!&|?:~-]`],
];
const languageRules: Record<string, TokenRule[]> = {
  tsx: scriptRules,
  jsx: scriptRules,
  typescript: scriptRules,
  ts: scriptRules,
  javascript: scriptRules,
  js: scriptRules,
  json: [
    ["property", String.raw`"(?:\\[\s\S]|[^"\\])*"(?=\s*:)`],
    ["string", String.raw`"(?:\\[\s\S]|[^"\\])*"`],
    ["keyword", String.raw`\b(?:true|false|null)\b`],
    ["number", `-?${numbers}`],
  ],
  bash: [
    ["comment", String.raw`(?<!\S)#[^\r\n]*`],
    ["string", strings],
    ["keyword", String.raw`\b(?:if|then|else|elif|fi|for|in|do|done|while|case|esac|export|source|sudo)\b`],
    ["function", String.raw`\b(?:npx|npm|pnpm|yarn|bun|node|git|cd|echo|mkdir|curl)\b`],
    ["property", String.raw`\$(?:\{[^}\r\n]*\}|[\w@#?$!*-]+)|(?<!\S)--?[\w-]+`],
    ["number", numbers],
    ["operator", String.raw`&&|\|\||[|><;=]|\\(?=\r?\n)`],
  ],
  css: [
    ["comment", String.raw`\/\*[\s\S]*?(?:\*\/|$)`],
    ["string", strings],
    ["keyword", String.raw`@[\w-]+|!important\b`],
    ["property", String.raw`--[\w-]+|[a-zA-Z-]+(?=\s*:)`],
    ["number", String.raw`#[\da-fA-F]{3,8}\b|-?\b\d*\.?\d+(?:%|[a-zA-Z]+)?`],
    ["function", String.raw`[a-zA-Z-]+(?=\()|[.#][\w-]+`],
    ["operator", String.raw`[>+~:=]`],
  ],
};

const syntaxStyles = {
  "--syntax-comment": "var(--muted-foreground)",
  "--syntax-string": "color-mix(in oklab, var(--chart-2) 65%, var(--foreground))",
  "--syntax-keyword": "color-mix(in oklab, var(--chart-1) 65%, var(--foreground))",
  "--syntax-number": "color-mix(in oklab, var(--chart-4) 65%, var(--foreground))",
  "--syntax-property": "color-mix(in oklab, var(--chart-3) 65%, var(--foreground))",
  "--syntax-function": "color-mix(in oklab, var(--chart-5) 65%, var(--foreground))",
  "--syntax-operator": "var(--foreground)",
} as React.CSSProperties;

function highlightCode(code: string, language: string): React.ReactNode {
  const rules = languageRules[language.toLowerCase()];
  if (!Array.isArray(rules)) return code;

  const pattern = new RegExp(
    rules.map(([kind, source]) => `(?<${kind}>${source})`).join("|"),
    "g"
  );
  const tokens: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of code.matchAll(pattern)) {
    const index = match.index;
    if (index > cursor) tokens.push(code.slice(cursor, index));
    const kind = rules.find(([name]) => match.groups?.[name] !== undefined)?.[0];
    tokens.push(
      <span key={index} style={{ color: `var(--syntax-${kind})` }}>
        {match[0]}
      </span>
    );
    cursor = index + match[0].length;
  }

  if (cursor < code.length) tokens.push(code.slice(cursor));
  return tokens;
}

export function CodeBlock({
  code,
  language = "tsx",
  title,
  className,
  collapsible = false,
  collapsedHeight = 108,
}: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  collapsible?: boolean;
  collapsedHeight?: number;
}) {
  const [copyStatus, setCopyStatus] = React.useState<"idle" | "copied" | "error">("idle");
  const [expanded, setExpanded] = React.useState(false);
  const resetTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlighted = React.useMemo(() => highlightCode(code, language), [code, language]);
  const needsCollapse = collapsible;
  const codeId = React.useId();

  React.useEffect(() => {
    setCopyStatus("idle");
    return () => {
      if (resetTimeout.current !== null) clearTimeout(resetTimeout.current);
    };
  }, [code]);

  const copy = async () => {
    if (resetTimeout.current !== null) clearTimeout(resetTimeout.current);
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    resetTimeout.current = setTimeout(() => setCopyStatus("idle"), 1500);
  };

  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      style={syntaxStyles}
    >
      <div className={cn("flex items-center justify-between border-b border-border px-3 py-2", needsCollapse && !expanded && "hidden")}>
        <span className="text-xs text-muted-foreground">
          {title ?? language}
        </span>
        <div className="flex items-center gap-1">
          {needsCollapse ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 rounded-full px-2.5 text-xs"
              aria-expanded={expanded}
              aria-controls={codeId}
              onClick={() => setExpanded((current) => !current)}
            >
              <ChevronDown
                className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
                aria-hidden
              />
              {expanded ? "Collapse" : "Expand"}
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={copyStatus === "copied" ? "Copied code" : "Copy code"}
            onClick={copy}
          >
            {copyStatus === "copied" ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      </div>
      <span role="status" className="sr-only">
        {copyStatus === "copied" ? "Code copied to clipboard." : copyStatus === "error" ? "Could not copy code. Select the code to copy it manually." : ""}
      </span>
      <div className="relative">
      <pre
        id={codeId}
        tabIndex={needsCollapse && !expanded ? -1 : 0}
        aria-label={title ? `${title} code` : `${language} code`}
        className={cn(
          "overflow-auto whitespace-pre p-4 font-mono text-[13px] leading-6 text-foreground outline-offset-[-2px] [tab-size:2] focus-visible:outline-2 focus-visible:outline-ring sm:p-5",
          needsCollapse && !expanded && "[&_code]:pointer-events-none [&_code]:select-none"
        )}
        style={needsCollapse && !expanded ? { maxHeight: collapsedHeight, overflowY: "hidden" } : { maxHeight: expanded ? 720 : undefined }}
      >
        <span className="flex min-w-max">
          {collapsible ? <span aria-hidden="true" className="mr-5 select-none text-right text-muted-foreground/50">{code.split("\n").map((_, index) => <span key={index} className="block">{index + 1}</span>)}</span> : null}
          <code className={`language-${language} font-mono`}>{highlighted}</code>
        </span>
      </pre>
      {needsCollapse && !expanded ? (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--card) 25%, transparent), var(--card))" }}>
          <Button variant="outline" size="sm" className="rounded-xl bg-background px-4 font-mono text-xs shadow-sm" aria-expanded={expanded} aria-controls={codeId} onClick={() => setExpanded(true)}>View Code</Button>
        </div>
      ) : null}
      </div>
    </div>
  );
}
