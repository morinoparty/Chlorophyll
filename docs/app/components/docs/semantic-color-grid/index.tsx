import { useRef, useState } from "react";
import { type DisplayToken, roleGroups, type SemanticColorRole } from "./data";
import { semanticColorGridRecipe } from "./recipes";
import { SemanticColorCard } from "./token-card";
import { SemanticColorDialog } from "./token-dialog";
import { useThemeName, useTokenMetrics } from "./use-token-metrics";

interface SemanticColorGridProps {
    /** 表示する役割グループ。見出しや説明文は MDX 側（colors.mdx）で記述する */
    role: SemanticColorRole;
}

export function SemanticColorGrid({ role }: SemanticColorGridProps) {
    const styles = semanticColorGridRecipe();
    const rootRef = useRef<HTMLDivElement>(null);
    const theme = useThemeName();
    const metrics = useTokenMetrics(rootRef, theme);
    // クリックされたトークン。null 以外のとき詳細ダイアログを表示する
    const [selected, setSelected] = useState<DisplayToken | null>(null);

    const tokens = roleGroups.get(role) ?? [];

    return (
        <div ref={rootRef}>
            <div className={styles.grid}>
                {tokens.map((token) => (
                    <SemanticColorCard key={token.name} token={token} onSelect={setSelected} />
                ))}
            </div>
            <SemanticColorDialog
                selected={selected}
                theme={theme}
                metric={selected ? metrics[selected.name] : undefined}
                onClose={() => setSelected(null)}
            />
        </div>
    );
}
