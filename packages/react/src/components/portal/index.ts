"use client";
// Menu / Drawer / Tooltip などのフローティング系コンポーネントは、
// クリッピングやスタッキングコンテキストの影響を避けるため Portal でくるんで使う。
// 利用側に @ark-ui/react の直接依存を強いないよう、ライブラリからそのまま再エクスポートする
export { Portal, type PortalProps } from "@ark-ui/react/portal";
