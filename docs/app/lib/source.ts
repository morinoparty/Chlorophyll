import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
// lucide-react 全体（約1600アイコン）を barrel import するとサーバーバンドルが肥大化するため、
// meta.json / frontmatter で実際に使用しているアイコンだけを named import する。
import { Album, Braces, Milestone } from "lucide-react";
import { createElement } from "react";
import { docs, meta } from "../../.source/server";

// 使用中のアイコンのみを保持する小さなマップ。新しいアイコンを使う際はここに追記する。
const iconMap = {
    Album,
    Braces,
    Milestone,
};

export const source = loader({
    baseUrl: "/docs",
    source: toFumadocsSource(docs, meta),
    icon(icon) {
        if (!icon) return;
        // マップに存在するアイコンのみ描画し、未知のアイコンは従来通り undefined を返す。
        if (icon in iconMap) return createElement(iconMap[icon as keyof typeof iconMap]);
    },
});
