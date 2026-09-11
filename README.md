# FrostUI

A production-quality React component library inspired by frosted design systems — open, composable, and built for both developers and AI coding agents.

## What's included

- **Design tokens** — semantic color, typography, radius, and spacing systems
- **UI primitives** — Button, Card, Badge, Input, Avatar, Separator, and more
- **Documentation site** — interactive previews, variants, props, and copyable source
- **Component registry** — machine-readable metadata for CLI, search, and agents
- **Agent rules** — `AGENTS.md` so Cursor, Claude Code, and similar tools compose correctly

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Monorepo

```text
apps/docs          Documentation website
packages/ui        React components
packages/tokens    Design tokens (CSS variables)
packages/registry  Component registry + agent metadata
packages/cli       frostui CLI (install components into your project)
packages/config    Shared tooling config
```

## Phase 1 status

Foundation complete:

- Token + theme system (dark / light)
- Docs shell (sidebar, search, preview, code blocks)
- Core primitives: Button, Card, Badge, Input, Avatar, Separator

Evaluate the visual system before scaling to forms, navigation, charts, and patterns.

## License

MIT
# livedocsxyz
