"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { searchComponents } from "@frostui/registry";
import { cn } from "@/lib/utils";

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
        className="absolute inset-0 bg-black/70"
        aria-label="Close search"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, props, patterns…"
            className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search"
          />
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
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
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
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
      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
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
        "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left",
        "hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{title}</span>
          {meta ? (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {meta}
            </span>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
