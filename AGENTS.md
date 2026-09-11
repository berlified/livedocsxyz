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
| `Sparkline` | Quiet trend graphs, inline balances, and empty-state charts |
| `Chart` | Shared config, tooltip, legend, and theme tokens |
| `AreaChart` | Compound area series with gradient, hatch, glow, brush |
| `LineChart` | Compound lines with dashes, dots, and curve types |
| `BarChart` | Stacked, horizontal, hatched, duotone, stripped bars |
| `ComposedChart` | Mix bar, area, and line on one surface |
| `PieChart` | Pie and donut with selectable glowing sectors |
| `RadarChart` | Polar filled or stroke-only profiles |
| `RadialChart` | Full or semi radial bars |
| `SankeyChart` | Flow diagrams between stages |
| `TrendCard` | KPI tile with overlay period vs last |
| `MetricChart` | Hero metric with delta badge, series pills, and a gradient well |
| `ComparisonChart` | Overlapping this-year vs last-year areas |
| `BreakdownChart` | Clickable share stack with amounts |
| `RangeChart` | Forecast band with an actual line |
| `CountryChart` | Ranked markets with a last-period marker |
| `RingMetric` | Donut with a total in the hole |
| `CashflowChart` | Inflow up / outflow down from zero |
| `SpotlightChart` | Volume series with a peak callout |
| `LaneChart` | Horizontal outcome lanes |
| `UsageMeter` | Quota remaining vs used |
