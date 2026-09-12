"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";

import { searchComponents } from "@frostui/registry";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { foundationExtras } from "@/lib/nav";

const RECENTS_KEY = "livedocs:search-recents";

type SearchHit = {
  id: string;
  href: string;
  title: string;
  description: string;
  group: "Recent" | "Guides" | "Charts";
  meta?: string;
};

const GUIDES: SearchHit[] = foundationExtras.map((item) => ({
  id: item.href,
  href: item.href,
  title: item.title,
  description: guideCopy(item.href),
  group: "Guides",
  meta: "Docs",
}));

function guideCopy(href: string) {
  switch (href) {
    case "/docs":
      return "What livedocs is and how the catalog is organized";
    case "/docs/components":
      return "Browse every chart in the registry";
    case "/docs/installation":
      return "Install components with the shadcn CLI";
    case "/docs/theming":
      return "Light, dark, and semantic color tokens";
    case "/docs/tokens":
      return "Background, border, chart, and type tokens";
    case "/docs/agents":
      return "How agents should pick and compose charts";
    default:
      return "Documentation";
  }
}

function readRecents(): SearchHit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SearchHit[];
    return parsed.filter((item) => item?.href && item?.title).slice(0, 5);
  } catch {
    return [];
  }
}

function writeRecent(hit: SearchHit) {
  const next = [
    hit,
    ...readRecents().filter((item) => item.href !== hit.href),
  ].slice(0, 5);
  window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
}

function scoreGuide(query: string, hit: SearchHit) {
  const q = query.toLowerCase();
  const haystack = `${hit.title} ${hit.description} ${hit.href}`.toLowerCase();
  if (!q.split(/\s+/).every((token) => haystack.includes(token))) return 0;
  if (hit.title.toLowerCase() === q) return 200;
  if (hit.title.toLowerCase().startsWith(q)) return 140;
  if (hit.title.toLowerCase().includes(q)) return 90;
  if (haystack.includes(q)) return 40;
  return 10;
}

function hitDomId(id: string) {
  return `search-item-${id.replace(/\W+/g, "_")}`;
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="underline decoration-current decoration-2 underline-offset-2">
        {text.slice(index, index + q.length)}
      </span>
      {text.slice(index + q.length)}
    </>
  );
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [recents, setRecents] = React.useState<SearchHit[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setRecents(readRecents());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(id);
    };
  }, [open]);

  const results = React.useMemo(() => {
    const q = query.trim();
    const components = (q ? searchComponents(q) : searchComponents("")).map(
      (item) =>
        ({
          id: item.name,
          href: `/docs/components/${item.name}`,
          title: item.title,
          description: item.description,
          group: "Charts",
          meta: item.category,
        }) satisfies SearchHit
    );

    if (!q) {
      const recentHrefs = new Set(recents.map((item) => item.href));
      return [
        ...recents.map((item) => ({ ...item, group: "Recent" as const })),
        ...GUIDES.filter((item) => !recentHrefs.has(item.href)),
        ...components.filter((item) => !recentHrefs.has(item.href)),
      ];
    }

    const guides = GUIDES.map((item) => ({ item, score: scoreGuide(q, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    return [...guides, ...components];
  }, [query, recents]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  React.useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [active, results.length]);

  const go = React.useCallback(
    (hit: SearchHit) => {
      writeRecent({ ...hit, group: hit.group === "Guides" ? "Guides" : "Charts" });
      onOpenChange(false);
      router.push(hit.href);
    },
    [onOpenChange, router]
  );

  const resultsRef = React.useRef(results);
  const activeRef = React.useRef(active);
  const goRef = React.useRef(go);
  resultsRef.current = results;
  activeRef.current = active;
  goRef.current = go;

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((current) =>
          Math.min(resultsRef.current.length - 1, current + 1)
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((current) => Math.max(0, current - 1));
      } else if (event.key === "Home") {
        event.preventDefault();
        setActive(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setActive(Math.max(0, resultsRef.current.length - 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const hit = resultsRef.current[activeRef.current];
        if (hit) goRef.current(hit);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const grouped = results.reduce<Array<{ group: SearchHit["group"]; items: Array<SearchHit & { index: number }> }>>(
    (groups, item, index) => {
      const last = groups[groups.length - 1];
      if (last?.group === item.group) {
        last.items.push({ ...item, index });
        return groups;
      }
      groups.push({ group: item.group, items: [{ ...item, index }] });
      return groups;
    },
    []
  );

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close search"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        className="relative mx-auto mt-[8vh] flex w-[min(40rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-none border-2 border-border bg-card shadow-[6px_6px_0_0_var(--border)]"
        style={{ height: "min(32rem, 75vh)" }}
      >
        <div className="flex shrink-0 items-center gap-2 border-b-2 border-border px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search charts, guides, props…"
            className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results[active] ? hitDomId(results[active].id) : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              Clear
            </button>
          ) : null}
          <kbd className="rounded-none border-2 border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
            esc
          </kbd>
        </div>

        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          className="min-h-0 flex-1 overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="font-mono text-sm text-foreground">No matches</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a chart name, a keyword like donut, or a guide.
              </p>
            </div>
          ) : (
            grouped.map((section) => (
              <div key={section.group} className="mb-2">
                <p className="px-2 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {section.group}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.index === active;
                    return (
                      <button
                        key={item.id}
                        id={hitDomId(item.id)}
                        data-index={item.index}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActive(item.index)}
                        onClick={() => go(item)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-none border-2 px-3 py-2 text-left",
                          isActive
                            ? "border-foreground bg-primary text-primary-foreground"
                            : "border-transparent hover:bg-accent"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {highlight(item.title, query)}
                            </span>
                            {item.meta ? (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "border-current/30 px-1.5 py-px",
                                  isActive && "border-primary-foreground/40 text-primary-foreground"
                                )}
                              >
                                {item.meta}
                              </Badge>
                            ) : null}
                          </div>
                          <p
                            className={cn(
                              "truncate text-xs",
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}
                          >
                            {item.description}
                          </p>
                        </div>
                        {isActive ? (
                          <ArrowRight className="size-3.5 shrink-0 opacity-80" aria-hidden />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t-2 border-border bg-background px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-3">
            <span>↑↓ Move</span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="size-3" aria-hidden />
              Open
            </span>
          </span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
