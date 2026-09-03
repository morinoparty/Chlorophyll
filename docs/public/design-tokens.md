# Chlorophyll Design Tokens

常に既存のセマンティックトークンを選ぶこと。色の生値を発明しないこと。

数値スケール（`gray.9` 等）は直接使わず、必ず `bg`/`fg`/`surface`/`solid`/`contrast` 等のロールトークンを使うこと。

## Global

| token | css var | reference | rule |
| --- | --- | --- | --- |
| `border` | `var(--mpc-colors-border)` | `gray.6` | 非インタラクティブ要素（カード等）のボーダー |
| `border.muted` | `var(--mpc-colors-border-muted)` | `gray.5` | より控えめなボーダー |
| `border.subtle` | `var(--mpc-colors-border-subtle)` | `gray.4` | 最も控えめなボーダー |
| `border.interactive` | `var(--mpc-colors-border-interactive)` | `gray.7` | インタラクティブ要素のボーダー |
| `border.emphasized` | `var(--mpc-colors-border-emphasized)` | `gray.8` | フォーカスリング/強調ボーダー |
| `border.error` | `var(--mpc-colors-border-error)` | `red.7` | エラー状態のボーダー |
| `border.warning` | `var(--mpc-colors-border-warning)` | `yellow.7` | 警告状態のボーダー |
| `border.success` | `var(--mpc-colors-border-success)` | `mori.7` | 成功状態のボーダー |
| `border.info` | `var(--mpc-colors-border-info)` | `blue.7` | 情報状態のボーダー |
| `bg` | `var(--mpc-colors-bg)` | `gray.1` | 標準の背景色 |
| `bg.subtle` | `var(--mpc-colors-bg-subtle)` | `gray.2` | 控えめな背景色 |
| `bg.muted` | `var(--mpc-colors-bg-muted)` | `gray.3` | より沈んだ背景色 |
| `bg.emphasized` | `var(--mpc-colors-bg-emphasized)` | `gray.4` | 強調背景色 |
| `bg.inverted` | `var(--mpc-colors-bg-inverted)` | `gray.dark.1` | 反転面（ダーク）の背景色 |
| `bg.panel` | `var(--mpc-colors-bg-panel)` | `white` | 白背景が必要なパネル面 |
| `bg.panel.hover` | `var(--mpc-colors-bg-panel-hover)` | `gray.1` | 白いパネル状コントロールのホバー背景 |
| `bg.disabled` | `var(--mpc-colors-bg-disabled)` | `gray.4` | disabled コントロールの背景色 |
| `bg.error` | `var(--mpc-colors-bg-error)` | `red.surface` | エラー状態のアラート/バナーの地色（fg.error と組み合わせる） |
| `bg.warning` | `var(--mpc-colors-bg-warning)` | `yellow.surface` | 警告状態のアラート/バナーの地色（fg.warning と組み合わせる） |
| `bg.success` | `var(--mpc-colors-bg-success)` | `mori.surface` | 成功状態のアラート/バナーの地色（fg.success と組み合わせる） |
| `bg.info` | `var(--mpc-colors-bg-info)` | `blue.surface` | 情報状態のアラート/バナーの地色（fg.info と組み合わせる） |
| `fg` | `var(--mpc-colors-fg)` | `gray.12` | 標準テキスト色 |
| `fg.muted` | `var(--mpc-colors-fg-muted)` | `gray.11` | 控えめなテキスト色 |
| `fg.subtle` | `var(--mpc-colors-fg-subtle)` | `gray.11` | さらに控えめなテキスト色 |
| `fg.placeholder` | `var(--mpc-colors-fg-placeholder)` | `gray.11` | 入力欄・Select のプレースホルダー文字色 |
| `fg.inverted` | `var(--mpc-colors-fg-inverted)` | `white` | bg.inverted 上の文字色 |
| `fg.disabled` | `var(--mpc-colors-fg-disabled)` | `gray.9` | disabled コントロールの文字色 |
| `fg.error` | `var(--mpc-colors-fg-error)` | `red.fg` | エラーメッセージの文字色 |
| `fg.warning` | `var(--mpc-colors-fg-warning)` | `yellow.fg` | 警告メッセージの文字色 |
| `fg.success` | `var(--mpc-colors-fg-success)` | `mori.fg` | 成功メッセージの文字色 |
| `fg.info` | `var(--mpc-colors-fg-info)` | `blue.fg` | 情報メッセージの文字色 |
| `overlay` | `var(--mpc-colors-overlay)` | `rgba(0, 0, 0, 0.4)` | モーダル等の背景オーバーレイ |
| `overlay.subtle` | `var(--mpc-colors-overlay-subtle)` | `rgba(0, 0, 0, 0.2)` | 軽い背景暗転 |
| `focus.ring.error` | `var(--mpc-colors-focus-ring-error)` | `red.9` | エラー時のフォーカスリング |

## Color palette roles

利用可能な brand: gray / mori / umi / red / yellow / blue（`{brand}` を置き換えて使うこと）

| token | css var | reference | rule |
| --- | --- | --- | --- |
| `{brand}.bg` | `var(--mpc-colors-{brand}-bg)` | `{brand}.3 × gray.3 50%` | ページの地色（白いパネルを浮かせる沈んだ背景） |
| `{brand}.bg.subtle` | `var(--mpc-colors-{brand}-bg-subtle)` | `{brand}.1` | bg より淡い背景色 |
| `{brand}.surface.subtle` | `var(--mpc-colors-{brand}-surface-subtle)` | `{brand}.2` | 白いパネルの上にごく薄く色を差す面（表の見出し行・縞・カードの hover） |
| `{brand}.surface` | `var(--mpc-colors-{brand}-surface)` | `{brand}.3` | カード等の表面色 |
| `{brand}.surface.hover` | `var(--mpc-colors-{brand}-surface-hover)` | `{brand}.4` | surface のホバー色 |
| `{brand}.surface.active` | `var(--mpc-colors-{brand}-surface-active)` | `{brand}.5` | surface のアクティブ色 |
| `{brand}.border.subtle` | `var(--mpc-colors-{brand}-border-subtle)` | `{brand}.4` | brand 用の最も控えめなボーダー |
| `{brand}.border.muted` | `var(--mpc-colors-{brand}-border-muted)` | `{brand}.5` | brand 用の控えめなボーダー |
| `{brand}.border` | `var(--mpc-colors-{brand}-border)` | `{brand}.6` | brand 用ボーダー色（非インタラクティブ要素） |
| `{brand}.border.interactive` | `var(--mpc-colors-{brand}-border-interactive)` | `{brand}.7` | brand 用のインタラクティブ要素のボーダー |
| `{brand}.border.emphasized` | `var(--mpc-colors-{brand}-border-emphasized)` | `{brand}.8` | brand 用の強調ボーダー |
| `{brand}.fg` | `var(--mpc-colors-{brand}-fg)` | `{brand}.12 × {brand}.11 70%` | 標準テキスト色 |
| `{brand}.fg.muted` | `var(--mpc-colors-{brand}-fg-muted)` | `gray.11` | 控えめなテキスト色 |
| `{brand}.fg.subtle` | `var(--mpc-colors-{brand}-fg-subtle)` | `{brand}.11` | さらに控えめなテキスト色 |
| `{brand}.solid` | `var(--mpc-colors-{brand}-solid)` | `{brand}.9` | アクセントの塗り色（ボタン等） |
| `{brand}.solid.emphasized` | `var(--mpc-colors-{brand}-solid-emphasized)` | `{brand}.10` | solid の強調色（hover 等） |
| `{brand}.solid.active` | `var(--mpc-colors-{brand}-solid-active)` | `{brand}.10 × {brand}.12 20%` | solid の押下色（active） |
| `{brand}.contrast` | `var(--mpc-colors-{brand}-contrast)` | `white` | solid 上のコントラスト色 |
| `{brand}.focus.ring` | `var(--mpc-colors-{brand}-focus-ring)` | `{brand}.9` | brand に追従するフォーカスリング |

補足: `contrast` は brand ごとに参照が異なる場合がある（実装値は styled-system の生成結果を確認すること）。`focus.ring` も brand ごとに異なり、yellow のみ `yellow.11`（他の brand は step 9）を参照する。

## Secondary tokens (mori / umi only)

| token | css var | reference | rule |
| --- | --- | --- | --- |
