/**
 * フォーカスリングの共通スタイル。
 *
 * outline: "none" + ring のショートハンドは、消費側に borders.none トークンがあると var() に解決されて
 * outline-style が消える(#78)。そのためロングハンドで style / width / color / offset を明示する。
 * 太さと余白は semantic token(borderWidths.focus.ring / spacing.focus.ring.offset)から取り、
 * 色は colorPalette に追従させる
 */
export const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

/**
 * 内側に描くフォーカスリング。
 * 親が overflow: hidden で角丸を切り取る行(List / Accordion / Table の row)では、
 * 外側に出すリングの端が消えるため、負のオフセットで要素の内側に描いて全周を見せる
 */
export const focusRingInset = {
    ...focusRing,
    outlineOffset: "-focus.ring.offset",
} as const;
