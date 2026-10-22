# 🌿 Chlorophyll

[![Documentation](https://shieldcn.dev/badge/Documentation-read-396E56.svg?logo=readthedocs&logoColor=white)][docs]
[![Storybook](https://shieldcn.dev/badge/Storybook-live-FF4785.svg?logo=storybook&logoColor=white)][storybook]
[![GitHub Packages](https://shieldcn.dev/badge/GitHub_Packages-chlorophyll--react-181717.svg?logo=github&logoColor=white)][npm]

> [!WARNING]
> This project is currently under development.

A modern UI component library for React, built with TypeScript, Panda CSS, and Ark UI.

## 🛠 Tech Stack

**TypeScript** · **React** · **Panda CSS** · **Ark UI**

## 📦 Installation

The package is hosted on GitHub Packages. Point the `@morinoparty` scope at the registry in your `.npmrc`:

```ini
@morinoparty:registry=https://npm.pkg.github.com
```

```bash
pnpm add @morinoparty/chlorophyll-react
```

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
[npm]: https://github.com/morinoparty/chlorophyll/pkgs/npm/chlorophyll-react

---

Made with 💚 by Morino Party
