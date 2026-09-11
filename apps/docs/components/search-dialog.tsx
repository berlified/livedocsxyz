"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { searchComponents, type RegistryComponent } from "@frostui/registry";
import { cn } from "@frostui/ui";

import { foundationExtras } from "@/lib/nav";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setQuery("");
      const id = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const componentResults = React.useMemo(
    () => (query.trim() ? searchComponents(query) : searchComponents("")),
    [query]
  );

  const guideResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foundationExtras;
    return foundationExtras.filter((g) => g.title.toLowerCase().includes(q));
  }, [query]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-overlay"
        aria-label="Close search"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface-elevated shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-2 border-b border-border-subtle px-3">
          <Search className="size-4 text-foreground-subtle" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, props, patterns…"
            className="h-12 w-full bg-transparent text-[length:var(--text-3)] text-foreground outline-none placeholder:text-foreground-subtle"
            aria-label="Search"
          />
          <kbd className="rounded-[var(--radius-sm)] border border-border px-1.5 py-0.5 font-mono text-[length:var(--text-0)] text-foreground-muted">
            esc
          </kbd>
        </div>

        <div className="max-h-[min(24rem,50vh)] overflow-y-auto p-2">
          {guideResults.length > 0 ? (
            <ResultGroup title="Guides">
              {guideResults.map((item) => (
                <ResultItem
                  key={item.href}
                  title={item.title}
                  description="Documentation"
                  onSelect={() => go(item.href)}
                />
              ))}
            </ResultGroup>
          ) : null}

          <ResultGroup title="Components">
            {componentResults.length ? (
              componentResults.map((item) => (
                <ResultItem
                  key={item.name}
                  title={item.title}
                  description={item.description}
                  meta={item.category}
                  onSelect={() => go(`/docs/components/${item.name}`)}
                />
              ))
            ) : (
              <p className="px-3 py-6 text-center text-[length:var(--text-2)] text-foreground-muted">
                No components found
              </p>
            )}
          </ResultGroup>
        </div>
      </div>
    </div>
  );
}

function ResultGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="px-3 py-1.5 text-[length:var(--text-0)] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ResultItem({
  title,
  description,
  meta,
  onSelect,
}: {
  title: string;
  description: string;
  meta?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left",
        "hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--text-2)] font-medium text-foreground">
            {title}
          </span>
          {meta ? (
            <span className="text-[length:var(--text-0)] uppercase tracking-wide text-foreground-subtle">
              {meta}
            </span>
          ) : null}
        </div>
        <p className="truncate text-[length:var(--text-1)] text-foreground-muted">
          {description}
        </p>
      </div>
    </button>
  );
}

export type { RegistryComponent };
