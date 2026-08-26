# スタイルの記述
- styleを記述する際は、panda-cssで記述してください。
- panda-cssのレシピを使用して、スタイルを記述してください。
- figma mcpからデザインを取得して、記述を求められた場合は、コード内にコメントを記述する量は最小限にしてください。
- また、figmaの方で色が指定してある場合であっても、theme/semantic-tokens/colors.tsにあるtokenをできるだけ使用してください。 
  - ex) var(--mpc-colors-bg-subtle)

# スタイリングの方法
- docs/ においては、panda-cssのsvaを使用してスタイルを記述してください。
- components/ においては、panda-cssのレシピを使用してスタイルを記述してください。

記述した後は、playwright mcpを利用してスクリーンショットを取得し、スタイルの確認を行ってください。サーバーはすでに5173番ポートで起動してるので、起動しようとしないでください。widthが1200px以下の場合は、widthを1200pxに設定してください。

# 前景色（文字・アイコン）の選び方
- コンポーネントの文字やアイコンの色は、グローバルの `fg` / `fg.muted` / `fg.subtle` ではなく、colorPalette 側の `colorPalette.fg` / `colorPalette.fg.muted` / `colorPalette.fg.subtle` を使ってください。
  - コンポーネントが置かれたパレット（mori / umi / red など）に前景色まで追従させるためです。
  - ex) `color: "colorPalette.fg"` / `color: "colorPalette.fg.muted"`
- ラベルやグループの見出しなど、本文より一段引いて読ませる箇所には `colorPalette.fg.subtle` を使ってください。
  - `colorPalette.fg.subtle` は半透明（transparent 25%）なので合成先で Lc が変わります。装飾的な見出しに限って許容しています。
- `fg.disabled` のように colorPalette 側に対応するトークンが無いものは、グローバルのトークンをそのまま使ってください。

# コントラスト（アクセシビリティ）の評価
- 色のコントラストは WCAG 2 のコントラスト比（4.5:1 / 3:1）ではなく、**APCA（Accessible Perceptual Contrast Algorithm）の Lc 値**で評価してください。
  - このプロジェクトでは Storybook の a11y アドオンに APCA（silver）のチェックを登録し（`storybook/.storybook/a11y/`）、axe 標準の `color-contrast` ルールは無効化しています。
- 目安となる閾値:
  - 本文テキスト: Lc 75 以上（silver の表ではフォントサイズ・ウェイトごとに閾値が変わる）
  - 補助的なテキスト: Lc 60 以上
  - プレースホルダー・無効状態のテキスト: Lc 30 以上
  - フォーカスリング・アイコン・枠線など意味のある非テキスト要素: Lc 45 以上（絶対下限は Lc 30）
- 計測には `apca-w3` の `calcAPCA` を使い、白（`bg.panel`）とページ背景（`colorPalette.bg`）の両方に対して確認してください。トークンやレシピのコメントには計測した Lc を残してください。
- 半透明（a ステップ）の色は合成先で値が変わるため、コントラストが必要な用途では不透明なステップを使ってください。
