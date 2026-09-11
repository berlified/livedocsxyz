"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Github, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

import { LivedocsLogo } from "@/components/livedocs-logo";
import { Button } from "@/components/ui/button";
import { DocsSidebar } from "@/components/docs-sidebar";
import { PageToc } from "@/components/page-toc";
import { SearchDialog } from "@/components/search-dialog";
import { foundationExtras, navGroups } from "@/lib/nav";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [themeReady, setThemeReady] = React.useState(false);
  const isLanding = pathname === "/";
  const isComponentDoc =
    pathname.startsWith("/docs/components/") && pathname !== "/docs/components";
  const showToc = isComponentDoc;

  React.useEffect(() => {
    setThemeReady(true);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 md:px-6">
          {isLanding ? null : (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
          )}

          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <LivedocsLogo className="h-7" />
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              livedocs
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-2 hidden h-9 min-w-0 w-full max-w-md items-center gap-2 rounded-md border border-border bg-card px-3 text-left text-sm text-muted-foreground sm:flex"
          >
            <span className="flex-1">Search documentation…</span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          <nav className="ml-4 hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Link
              href="/docs/components"
              className={`no-underline transition-colors hover:text-foreground ${
                pathname.startsWith("/docs/components") ? "text-foreground" : ""
              }`}
            >
              Components
            </Link>
            <Link
              href="/docs"
              className={`no-underline transition-colors hover:text-foreground ${
                pathname.startsWith("/docs") && !pathname.startsWith("/docs/components")
                  ? "text-foreground"
                  : ""
              }`}
            >
              Docs
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <span className="text-[10px] font-medium">⌘K</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {themeReady && resolvedTheme === "light" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="GitHub"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <Github className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {isLanding ? null : (
          <aside className="docs-sidebar hidden w-64 shrink-0 px-3 py-5 lg:block">
            <DocsSidebar
              guides={foundationExtras}
              groups={navGroups}
              pathname={pathname}
            />
          </aside>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-10">
          {children}
        </main>

        {showToc ? (
          <aside className="docs-toc hidden w-56 shrink-0 px-4 py-8 xl:block">
            <PageToc />
          </aside>
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-border bg-background">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="flex items-center gap-2 font-semibold">
                <LivedocsLogo className="h-5" />
                Navigation
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <DocsSidebar
                guides={foundationExtras}
                groups={navGroups}
                pathname={pathname}
              />
            </div>
          </div>
        </div>
      ) : null}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

export function DocsSidebarLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-2.5 py-1.5 text-sm no-underline transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

export function CatalogLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="catalog-item group">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowUpRight className="catalog-arrow mt-0.5 size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
