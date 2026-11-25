# 🌿 Chlorophyll

[![Documentation](https://shieldcn.dev/badge/Documentation-read-396E56.svg?logo=readthedocs&logoColor=white)][docs]
[![Storybook](https://shieldcn.dev/badge/Storybook-live-FF4785.svg?logo=storybook&logoColor=white)][storybook]
[![npm](https://shieldcn.dev/badge/npm-chlorophyll--react-CB3837.svg?logo=npm&logoColor=white)][npm]

> [!WARNING]
> This project is currently under development.

A modern UI component library for React, built with TypeScript, Panda CSS, and Ark UI.

## 🛠 Tech Stack

**TypeScript** · **React** · **Panda CSS** · **Ark UI**

## 📦 Installation

The package is published to npm. No `.npmrc` setup or token is needed.
Versions up to 0.5.0 are also on GitHub Packages; if your `.npmrc` still has
`@morinoparty:registry=https://npm.pkg.github.com`, remove it so the scope resolves from npm.

```bash
pnpm add @morinoparty/chlorophyll-react
```

The preset requires Panda CSS v2. Install the peer dependencies `@pandacss/dev`, `@pandacss/preset-base` and `@pandacss/types` (all 2.x).

`SkinViewer` and `MinecraftItem` use three.js. The package depends on `three@^0.156.0`, the same range as
`skinview3d` (the 3D skin renderer), so a single copy of three is installed. Do not override `three` (or
`skinview3d>three`) to a newer version: skinview3d is built for three 0.156 and breaks with newer releases
(for example, `fxaaPass.fsQuad is undefined` on unmount), and items held by `SkinViewer` must be built with
the same three instance that skinview3d renders with. Check with `pnpm why three` that only one version is installed.

Add the Panda preset to `panda.config.ts`:

```ts
import { defineConfig } from "@pandacss/dev";
import { createPreset, stone } from "@morinoparty/chlorophyll-react/preset";

export default defineConfig({
  preflight: true,
  presets: ["@pandacss/preset-base", createPreset({ brandColor: "mori", grayColor: stone, radius: "md" })],
  include: ["./src/**/*.{ts,tsx}"],
  jsxFramework: "react",
  outdir: "styled-system",
});
```

## 📖 Usage

```tsx
import { Button } from "@morinoparty/chlorophyll-react";

export function App() {
  return <Button>Click me!</Button>;
}
```

See the [documentation][docs] and [Storybook][storybook] for the full component list and design tokens.

## 🚀 Development

```bash
pnpm install
pnpm dev            # all packages
pnpm dev:docs       # docs only
pnpm dev:storybook  # storybook only
```

The toolchain is [Vite+](https://viteplus.dev) (`vite-plus`, `vp` CLI; version pinned in the `catalog` of `pnpm-workspace.yaml`): Vite 8 + Rolldown for builds, Oxfmt / Oxlint for formatting and linting, and Vite Task for cached task runs.

```bash
pnpm check            # format (Oxfmt) and lint (Oxlint) with autofix (`vp check --fix`)
pnpm check:ci         # same checks without autofix, as run in CI
pnpm build:storybook  # cached Vite Task; restores storybook-static when inputs are unchanged
```

### Testing

```bash
pnpm dlx playwright install --with-deps
pnpm test           # component tests
pnpm test:vrt       # visual regression tests
```

### Deploy

`docs/` is deployed as a single Cloudflare Worker (`chlorophyll`) with [`cf`](https://developers.cloudflare.com/cf/) from GitHub Actions (`.github/workflows/deploy.yml`, PR previews via `cf previews deploy`). The Storybook build (`storybook/storybook-static`) is copied into the docs static assets under `/storybook/` during the docs build (`docs/vite.config.ts`).

- Production: https://chlorophyll.morinoparty.workers.dev (Storybook: https://chlorophyll.morinoparty.workers.dev/storybook/)
- CI reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from GitHub secrets.
- For local `cf` commands, copy `docs/.env.example` to `docs/.env` and fill in the values (`.env` is git-ignored).

```bash
pnpm build:storybook                       # cf does not run package scripts, so build Storybook first
pnpm --filter @chlorophyll/docs generate
(cd docs && pnpm exec cf build && pnpm exec cf deploy --prebuilt --mode production --dry-run)
```

## 🤝 Contributing

1. Fork this repository
2. Create a new branch
3. Commit your changes
4. Open a pull request

[docs]: https://chlorophyll.morinoparty.workers.dev/docs/getting-started/introduction/
[storybook]: https://chlorophyll.morinoparty.workers.dev/storybook/
[npm]: https://www.npmjs.com/package/@morinoparty/chlorophyll-react

---

Made with 💚 by Morino Party
