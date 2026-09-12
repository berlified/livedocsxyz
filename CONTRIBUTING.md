# Contributing

Thanks for helping with livedocs. The public catalog is **chart components** plus a shadcn registry. Preview lives at [livedocs.xyz](https://livedocs.xyz).

Please read the [Code of Conduct](./CODE_OF_CONDUCT.md) first.

## Ways to contribute

- Bug reports and accessibility issues
- Chart or docs fixes
- Registry metadata (keywords, props, AI guidance) that make install and search better
- Tests and CI improvements

Open an issue before large visual or API changes so we can agree on scope.

## Development

Requirements: **Node.js 20+** and **pnpm 9.15**.

```bash
pnpm install
pnpm dev
```

Docs: [http://localhost:3000](http://localhost:3000)

| Command | What it does |
| --- | --- |
| `pnpm typecheck` | Typecheck every workspace package |
| `pnpm registry:build` | Write `apps/docs/public/r/*.json` from `packages/registry` |
| `pnpm build:docs` | Production build of the docs site |

Component source of truth is `apps/docs/components/ui/*.tsx`. After UI changes, run `pnpm registry:build`.

Workspace packages still use internal names (`@frostui/*`). That is a folder/package id, not the public product name. User-facing copy should say **livedocs**.

## Design rules

Follow `AGENTS.md`:

- Semantic tokens only (`bg-background`, `text-foreground`, `border-border`). No raw hex in component styles.
- Compose existing primitives. Do not reimplement Button / Input / Card.
- Keep charts keyboard-accessible. Icon-only controls need `aria-label`.
- Series fills use the shared pixel tile pattern from the chart primitive.

## Pull requests

1. Branch from `main`.
2. Keep the diff focused. Do not mix refactors with behavior changes.
3. Run `pnpm typecheck` and `pnpm registry:build`.
4. If you change UI, say what you verified (page, light/dark).
5. Do not commit `.env`, keys, credentials, or personal notes.

By submitting a PR you agree to license your work under the [MIT License](./LICENSE).

## Security

Report vulnerabilities privately. See [SECURITY.md](./SECURITY.md).

## Release notes

User-facing changes belong in [CHANGELOG.md](./CHANGELOG.md) under **Unreleased**.

## Maintainer checklist (going public)

Do this once, before flipping the GitHub repo from private to public:

1. Search git history for secrets (`gh secret` is not enough). Look for `.env`, API keys, tokens, and private URLs.
2. Enable **secret scanning**, **push protection**, and **private vulnerability reporting** in the GitHub repo settings.
3. Protect `main`: require a PR, require the CI check, and disallow force-push.
4. Confirm the GitHub description and topics do not leak private brand names.
5. Ship a GitHub release (`v0.1.0`) after the first public commit so consumers have a tag.
6. Never `git push --force` to `main` after the repo is public.
