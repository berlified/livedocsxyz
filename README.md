# livedocs

<img src="apps/docs/public/logo.svg" alt="livedocs" width="37" height="48" />

A shadcn component registry. Preview on [livedocs.xyz](https://livedocs.xyz), copy the command, own the source.

Source: [github.com/berlified/livedocsxyz](https://github.com/berlified/livedocsxyz)  
Built by [@oX8erlin](https://x.com/oX8erlin)

## Install a component

```bash
npx shadcn@latest add https://livedocs.xyz/r/chart.json
```

That copies chart source into `@/components/ui` in any shadcn project.

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
