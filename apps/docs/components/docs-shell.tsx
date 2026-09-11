"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, Github, X } from "lucide-react";
import { IconButton } from "frosted-ui";

import { useAppearance } from "@/components/frost-theme-provider";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SearchDialog } from "@/components/search-dialog";
import { foundationExtras, navGroups } from "@/lib/nav";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { appearance, setAppearance } = useAppearance();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

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
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 md:px-6">
          <IconButton
            variant="ghost"
            color="gray"
            size="2"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={16} />
          </IconButton>

          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span
              className="flex size-7 items-center justify-center rounded-md font-bold"
              style={{
                background: "var(--accent-9)",
                color: "var(--accent-contrast)",
              }}
            >
              F
            </span>
            <span className="text-4 font-semibold" style={{ color: "var(--gray-12)" }}>
              FrostUI
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-2 hidden h-8 w-full max-w-sm items-center gap-2 rounded-md border px-3 text-left text-2 sm:flex"
            style={{
              borderColor: "var(--gray-a6)",
              background: "var(--gray-a2)",
              color: "var(--gray-11)",
            }}
          >
            <span className="flex-1">Search components…</span>
            <kbd
              className="rounded px-1.5 py-0.5 font-mono text-1"
              style={{
                border: "1px solid var(--gray-a6)",
                background: "var(--gray-a2)",
                color: "var(--gray-11)",
              }}
            >
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <IconButton
              variant="ghost"
              color="gray"
              size="2"
              className="sm:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <span className="text-1 font-medium">⌘K</span>
            </IconButton>
            <IconButton
              variant="ghost"
              color="gray"
              size="2"
              aria-label="Toggle theme"
              onClick={() =>
                setAppearance(appearance === "dark" ? "light" : "dark")
              }
            >
              {appearance === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </IconButton>
            <IconButton
              variant="ghost"
              color="gray"
              size="2"
              aria-label="GitHub"
              onClick={() =>
                window.open("https://github.com/whopio/frosted-ui", "_blank")
              }
            >
              <Github size={16} />
            </IconButton>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="docs-sidebar hidden w-64 shrink-0 px-3 py-5 md:block">
          <DocsSidebar
            guides={foundationExtras}
            groups={navGroups}
            pathname={pathname}
          />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-10">
          {children}
        </main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0"
            style={{ background: "var(--black-a8)" }}
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col"
            style={{
              background: "var(--color-background)",
              borderRight: "1px solid var(--gray-a6)",
            }}
          >
            <div
              className="flex h-14 items-center justify-between border-b px-4"
              style={{ borderColor: "var(--gray-a6)" }}
            >
              <span className="font-semibold">Navigation</span>
              <IconButton
                variant="ghost"
                color="gray"
                size="2"
                aria-label="Close"
                onClick={() => setMobileOpen(false)}
              >
                <X size={16} />
              </IconButton>
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
      className="block rounded-md px-2.5 py-1.5 text-2 no-underline transition-colors"
      style={
        active
          ? {
              background: "var(--accent-9)",
              color: "var(--accent-contrast)",
            }
          : {
              color: "var(--gray-11)",
            }
      }
    >
      {children}
    </Link>
  );
}
