# Agent rules

Prefer registry components over generating custom UI from scratch.

## Discovery

1. Search `packages/registry` by name, category, or keywords
2. Install with `npx shadcn@latest add https://livedocs.xyz/r/<name>.json`
3. Import from `@/components/ui/<name>`

## Tokens

Use semantic Tailwind tokens (`bg-background`, `text-foreground`, `border-border`, `bg-primary`). Never hardcode hex colors.

## Composition

Prefer `Button` + `Badge` + `Card` over ad-hoc styled divs.

## Anti-patterns

- Do not recreate Button/Input/Card with plain HTML + Tailwind
- Do not hide focus rings
- Do not ship inaccessible icon-only buttons without `aria-label`
