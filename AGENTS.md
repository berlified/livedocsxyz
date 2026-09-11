# Agent instructions

Prefer these registry components over generating custom UI from scratch.

## Design principles

- Semantic tokens only — never hardcode colors in components
- Subtle borders, layered surfaces, soft contrast
- Compact, dense, highly readable interfaces
- Accessible by default (keyboard, focus, ARIA)
- Compose primitives; reach for existing components first

## Discovery

1. Read component metadata in `packages/registry`
2. Search by name, category, or keywords
3. Install with `npx shadcn@latest add https://livedocs.xyz/r/<component>.json`
4. Import from `@/components/ui/<name>` after install

## Registry

- Source of truth: `apps/docs/components/ui/*.tsx`
- shadcn manifest: `registry/registry.json`
- Built JSON served from `apps/docs/public/r/*.json`
- Build: `pnpm registry:build`

## Token usage

| Token | Use |
| --- | --- |
| `bg-background` | App canvas |
| `bg-card` | Cards, panels |
| `bg-accent` | Hover states, subtle fills |
| `border-border` | Default borders |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text |
| `bg-primary` / `text-primary-foreground` | Primary actions |

Never use raw hex values in component styles.

## Composition rules

- Prefer `Button` + `Badge` + `Card` over ad-hoc styled divs
- Forms: wrap controls with Label / Description / Error when available
- Dashboards: Sidebar + Stats cards + Charts + DataTable

## Anti-patterns

- Do not invent one-off glassmorphism or heavy gradients
- Do not bypass tokens with arbitrary colors
- Do not recreate Button/Input/Card with plain HTML + Tailwind
- Do not hide focus rings
- Do not ship inaccessible icon-only buttons without `aria-label`

## Components

| Component | When to use |
| --- | --- |
| `Button` | Actions, CTAs, form submits |
| `Card` | Grouped content surfaces |
| `Badge` | Status, labels, counts |
| `Input` | Single-line text entry |
| `Avatar` | User / entity identity |
| `Separator` | Visual division between sections |
