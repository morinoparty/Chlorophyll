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

## 🤝 Contributing

1. Fork this repository
2. Create a new branch
3. Commit your changes
4. Open a pull request

[docs]: https://chlorophyll-docs.nikomaru.workers.dev/docs/getting-started/introduction/
[storybook]: https://chlorophyll-storybook.nikomaru.workers.dev
[npm]: https://github.com/morinoparty/chlorophyll/pkgs/npm/chlorophyll-react

---

Made with 💚 by Morino Party
