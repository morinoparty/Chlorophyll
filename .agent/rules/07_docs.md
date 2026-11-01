# ドキュメントについて

tanstack start ssgを用いて記述します。

## コンポーネントや機能などはreactを用いて記述します。

## ドキュメントの構成

- GetStarted
  - Installation
  - QuickStart

- Tokens
  - reference token
  - system token

Tokensにおいて、サンプルとして表示する際には、docsで`pnpm generate`（`panda codegen --spec`）を実行して出力される`styled-system/specs/design-system.json`を、`app/components/docs/design-system.ts`の`getTokens`経由で利用してください。
また、pandaではtokenとsemantic tokenが存在しますが、当プロジェクトでは、reference token-> system token -> component tokenの流れで生成されるため、
ただのtokenであっても、system tokenとして扱われる場合があります。
判断については、componentで直接利用されうるか、名前でそのように扱われるかなどで統合的に判断してください。