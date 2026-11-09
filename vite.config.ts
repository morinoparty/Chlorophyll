import { defineConfig } from "vite-plus";

// 整形・lint の対象外 (依存・生成物・外部由来のコード)。.gitignore に載っているものは別途自動で除外される
const ignorePatterns = [
    "**/.claude/worktrees/**",
    "**/.next/**",
    "**/node_modules/**",
    "**/public/**",
    "**/styled-system/**",
    "**/src/components/ui/**",
    "**/env.d.ts",
    "**/storybook-static/**",
    "**/routeTree.gen.ts",
    "**/.source/**",
    "**/.cloudflare/**",
];

export default defineConfig({
    fmt: {
        tabWidth: 4,
        printWidth: 120,
        // package.json のキー順は手で管理する
        sortPackageJson: false,
        // Biome の organizeImports と同じ並び (プロトコル付き → パッケージ → エイリアス → 絶対パス → 遠い相対パス順) を保つ
        sortImports: {
            newlinesBetween: false,
            // 既存の空行による区切りを保ち、それをまたいで並べ替えない
            partitionByNewline: true,
            // コメントを境に並べ替えを区切る。順序に意味のある副作用 import (CSS など) の直前にはコメントを置く
            partitionByComment: true,
            customGroups: [
                // node:fs や fumadocs-mdx:collections/browser のようなプロトコル付きの指定子
                { groupName: "protocol", elementNamePattern: ["*:*", "*:*/**"] },
                { groupName: "absolute", elementNamePattern: ["/**"] },
                { groupName: "parent-4", elementNamePattern: ["../../../../**"] },
                { groupName: "parent-3", elementNamePattern: ["../../../**"] },
                { groupName: "parent-2", elementNamePattern: ["../../**"] },
            ],
            groups: [
                ["builtin", "protocol"],
                "external",
                ["internal", "subpath"],
                "absolute",
                "parent-4",
                "parent-3",
                "parent-2",
                "parent",
                ["sibling", "index"],
                // style グループは置かない。CSS の ?url import も Biome と同じくパスの位置で並べる
                "unknown",
            ],
        },
        // 対象は JS / TS / JSON / CSS に絞る (Biome でも Markdown / YAML は整形していなかった)
        ignorePatterns: [...ignorePatterns, "**/*.md", "**/*.mdx", "**/*.yml", "**/*.yaml", "**/*.html", "**/*.toml"],
    },
    lint: {
        plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "jsx-a11y"],
        // correctness を基本に、移行前の Biome の recommended に相当するルールを他カテゴリからも有効化する
        categories: { correctness: "error" },
        // 不要になった抑制コメントを知らせる
        options: { reportUnusedDisableDirectives: "warn" },
        ignorePatterns,
        rules: {
            eqeqeq: ["error", "always", { null: "ignore" }],
            "no-case-declarations": "error",
            "no-constructor-return": "error",
            "no-fallthrough": "error",
            "no-label-var": "error",
            "no-self-compare": "error",
            "no-use-before-define": ["error", { functions: false, classes: false, variables: false }],
            "typescript/no-empty-interface": ["error", { allowSingleExtends: true }],
            "react/button-has-type": "error",
            "react/jsx-no-comment-textnodes": "error",
            "react/jsx-no-target-blank": "error",
            "react/no-array-index-key": "error",
            "react/no-danger": "error",
            "react/rules-of-hooks": "error",
            "react/exhaustive-deps": "error",
            "no-script-url": "error",
            "jsx-a11y/anchor-ambiguous-text": "error",
            "oxc/misrefactored-assign-op": "error",
            "array-callback-return": "error",
            "unicorn/new-for-builtins": "error",
            // Oxfmt は import 文の順だけを並べるため、{ } 内の名前は lint で並べる (vp check --fix で直る)
            "sort-imports": ["error", { ignoreDeclarationSort: true, ignoreCase: true }],
            // Biome の noUnusedImports (error) に相当する。Oxlint では未使用 import も no-unused-vars が扱う
            "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
            // Biome の noConsole: log 以外の console 呼び出しを禁止する
            "no-console": ["error", { allow: ["log"] }],
            // CI を落とさず警告に留めるもの
            // Biome の useSemanticElements より対象が広く (role="img" / "status" なども指摘する)、既存コードにも該当があるため
            "jsx-a11y/prefer-tag-over-role": "warn",
            // Biome の noGlobalIsNan / noGlobalIsFinite に相当する (unicorn/prefer-number-properties は parseFloat なども対象になるため使わない)
            "no-restricted-globals": [
                "warn",
                { name: "isNaN", message: "Use Number.isNaN instead." },
                { name: "isFinite", message: "Use Number.isFinite instead." },
            ],
            "default-case-last": "warn",
            "no-array-constructor": "warn",
            "no-empty": "warn",
            "no-extra-label": "warn",
            "no-labels": "warn",
            "no-lone-blocks": "warn",
            "no-proto": "warn",
            "no-prototype-builtins": "warn",
            "no-sequences": "warn",
            "no-template-curly-in-string": "warn",
            "no-unneeded-ternary": "warn",
            "no-useless-constructor": "warn",
            "prefer-arrow-callback": "warn",
            "prefer-const": "warn",
            "prefer-exponentiation-operator": "warn",
            "prefer-numeric-literals": "warn",
            "prefer-regex-literals": "warn",
            "prefer-rest-params": "warn",
            "typescript/adjacent-overload-signatures": "warn",
            "typescript/ban-ts-comment": "warn",
            "typescript/ban-types": "warn",
            "typescript/consistent-type-imports": "warn",
            "typescript/no-explicit-any": "warn",
            "typescript/no-invalid-void-type": "warn",
            "typescript/no-non-null-assertion": "warn",
            "typescript/no-unnecessary-type-constraint": "warn",
            "typescript/prefer-function-type": "warn",
            "typescript/prefer-literal-enum-member": "warn",
            "oxc/no-accumulating-spread": "warn",
            "oxc/no-const-enum": "warn",
            "react/jsx-no-useless-fragment": "warn",
            "unicorn/no-document-cookie": "warn",
            "unicorn/no-instanceof-array": "warn",
            "unicorn/no-static-only-class": "warn",
            "unicorn/no-useless-switch-case": "warn",
            "unicorn/prefer-array-flat-map": "warn",
            "unicorn/prefer-date-now": "warn",
            "unicorn/prefer-node-protocol": "warn",
            // Biome に相当ルールがないもの (React Compiler 向けの規則や、子コンポーネント内のテキストを辿れず誤検知する a11y 規則)
            "react/immutability": "off",
            "react/purity": "off",
            "react/refs": "off",
            "react/set-state-in-effect": "off",
            "jsx-a11y/control-has-associated-label": "off",
            // TypeScript の型と値の同名宣言 (宣言マージ) を誤検知するため使わない。本当の再宣言は tsc が検出する
            "no-redeclare": "off",
        },
        overrides: [
            {
                // Storybook のデコレーターは Story の描画中に呼ばれるため hooks を使える
                files: ["storybook/.storybook/preview.tsx"],
                rules: { "react/rules-of-hooks": "off" },
            },
        ],
    },
    run: {
        tasks: {
            // 入力が変わっていなければ Storybook を再ビルドせず、前回の storybook-static を復元する
            "build-storybook": {
                command: "vpx storybook build",
                cwd: "storybook",
                cache: {
                    // 自動追跡は pnpm の状態ファイルやキャッシュの有無まで拾い CI で毎回ミスするため、入力を明示する
                    input: [
                        // stories・.storybook・vite.config.ts・panda.config.ts と prepare の panda codegen が生成する styled-system
                        "storybook/**",
                        "!storybook/node_modules/**",
                        "!storybook/storybook-static/**",
                        "!storybook/reports/**",
                        "!storybook/test-results/**",
                        "!storybook/playwright-report/**",
                        "!storybook/__screenshots__/**",
                        "!storybook/.reg/**",
                        // stories が相対パスで読み込むコンポーネントとその tsconfig (Oxc が変換時に参照する)、panda.config.ts が読む preset
                        "packages/react/src/**",
                        "packages/react/package.json",
                        "packages/react/tsconfig.json",
                        // staticDirs で公開する docs の静的ファイル
                        "docs/public/**",
                        // Vite が上位ディレクトリまで探索する PostCSS 設定と、tsconfig の継承元
                        "postcss.config.cjs",
                        "tsconfig.base.json",
                        // 依存のバージョン
                        "package.json",
                        "pnpm-lock.yaml",
                        "pnpm-workspace.yaml",
                    ],
                    output: ["storybook/storybook-static/**"],
                    env: ["STORYBOOK_*", "VITE_*", "NODE_ENV"],
                },
            },
        },
    },
});
