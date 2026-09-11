import { components, categories } from "@frostui/registry";

import { foundationExtras } from "@/lib/guides";

export { foundationExtras };

const populated = categories
  .map((category) => ({
    ...category,
    items: components
      .filter((c) => c.category === category.id)
      .map((c) => ({
        title: c.title,
        href: `/docs/components/${c.name}`,
        name: c.name,
      })),
  }))
  .filter((group) => group.items.length > 0);

const upcoming = categories
  .filter((category) => !populated.some((g) => g.id === category.id))
  .map((category) => category.title);

export const navGroups = populated;

export const upcomingCategories = upcoming;
