"use client";

import { DocsSidebarLink } from "@/components/docs-shell";
import { upcomingCategories } from "@/lib/nav";

type NavItem = { title: string; href: string };
type NavGroup = {
  id: string;
  title: string;
  items: NavItem[];
};

export function DocsSidebar({
  guides,
  groups,
  pathname,
}: {
  guides: NavItem[];
  groups: NavGroup[];
  pathname: string;
}) {
  return (
    <nav className="space-y-6" aria-label="Documentation">
      <div>
        <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Guides
        </p>
        <div className="space-y-0.5">
          {guides.map((item) => (
            <DocsSidebarLink
              key={item.href}
              href={item.href}
              active={pathname === item.href}
            >
              {item.title}
            </DocsSidebarLink>
          ))}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <DocsSidebarLink
                key={item.href}
                href={item.href}
                active={pathname === item.href}
              >
                {item.title}
              </DocsSidebarLink>
            ))}
          </div>
        </div>
      ))}

      {upcomingCategories.length > 0 ? (
        <div>
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Roadmap
          </p>
          <ul className="space-y-1 px-2.5 text-sm text-muted-foreground">
            {upcomingCategories.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
