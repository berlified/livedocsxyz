# livedocs

[![CI](https://github.com/berlified/livedocsxyz/actions/workflows/ci.yml/badge.svg)](https://github.com/berlified/livedocsxyz/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

<img src="apps/docs/public/logo.svg" alt="livedocs" width="37" height="48" />

Pixel-art chart components for [shadcn](https://ui.shadcn.com). Preview on [livedocs.xyz](https://livedocs.xyz), copy the command, own the source.

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

Requires Node.js 20+ and [pnpm](https://pnpm.io) 9.15. Open [http://localhost:3000](http://localhost:3000).

## Monorepo

```text
apps/docs              Docs site + published registry JSON (`public/r`)
packages/registry      Component metadata used to build that JSON
packages/ui            Shared React primitives
packages/tokens        Design tokens
packages/cli           Helper CLI for install commands
packages/config        Shared tooling
```

Chart implementations live in `apps/docs/components/ui`. Rebuild the registry with `pnpm registry:build`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md).

## Security

Please report vulnerabilities privately. Details are in [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE)
