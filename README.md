# livedocs

A shadcn component registry. Preview on [livedocs.xyz](https://livedocs.xyz), copy the command, own the source.

## Install a component

```bash
npx shadcn@latest add https://livedocs.xyz/r/button.json
```

That copies `button.tsx` into `@/components/ui` in any shadcn project.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Monorepo

```text
apps/docs          Documentation website + registry JSON
packages/ui        React components
packages/tokens    Design tokens
packages/registry  Component metadata
packages/cli       Helper CLI
packages/config    Shared tooling config
```

## License

MIT
