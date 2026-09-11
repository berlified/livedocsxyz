# FrostUI Agent Rules

## System identity

FrostUI is a frosted-inspired design system for SaaS dashboards, admin panels, marketplaces, and modern web apps.
It is **not** a creator platform — it is a UI component library.

## How to discover components

1. Prefer registry search over inventing UI
2. Check `packages/registry/src/components/*.json`
3. Read `ai` guidance on each registry entry before composing
4. Install with `npx frostui add <name>` so source lands in the consumer project

## Styling rules

- Consume semantic tokens (`background`, `surface`, `border`, `foreground`, `primary`, …)
- Keep radius consistent (`--radius-sm` / `--radius-md` / `--radius-lg`)
- Prefer subtle borders over heavy shadows
- Use restrained motion (`--duration-fast` / `--duration-normal`)
- Respect `prefers-reduced-motion`

## Accessibility requirements

- Every interactive control must be keyboard reachable
- Visible focus using `--border-focus` / ring tokens
- Icon-only buttons require `aria-label`
- Form controls need associated labels
- Do not remove Radix accessibility wiring

## Preferred compositions (Phase 1)

- Page header: Heading + muted Text + Button group
- Settings row: Label + Description + Input / Switch
- Entity row: Avatar + Text stack + Badge + Button
- Empty panel: Card + muted Text + Button

## When NOT to invent new UI

If the need matches an existing registry component, install and compose it.
Only create custom markup when no FrostUI component fits.
