"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { stat } from "styled-system/recipes";

type StatSize = "sm" | "md" | "lg";
type StatAlign = "start" | "center";

// 各パーツには Ark UI と同じ data-scope / data-part を付ける。
// レシピの Group から子の Root(区切り線を引く 2 つ目以降の Stat)を参照するときに使う

// Group が子の Root に配る既定の size / align。
// Group の中にいるかどうかで Root の要素(<div> / <dl>)も切り替える
interface StatGroupContextValue {
    size?: StatSize;
    align?: StatAlign;
}
const StatGroupContext = createContext<StatGroupContextValue | null>(null);

// Root で解決したスロットのクラス名を各パーツに配る Context。
// size / align でスロットの見た目が変わるため、Root で 1 回だけ解決して共有する
type StatStyles = ReturnType<typeof stat>;
const StatStylesContext = createContext<StatStyles | null>(null);

const useStatStyles = (component: string): StatStyles => {
    const styles = useContext(StatStylesContext);
    if (!styles) {
        throw new Error(`Stat.${component} must be used within Stat.Root`);
    }
    return styles;
};

interface StatRootProps extends HTMLArkProps<"dl"> {
    /** 文字の大きさ。既定は md(Group の中では Group の size) */
    size?: StatSize;
    /** 文字の揃え方。既定は start(Group の中では Group の align) */
    align?: StatAlign;
}

/**
 * 1 つの統計値を包む Root。中に Stat.Label / Stat.Value / Stat.HelpText を置く。
 *
 * - 単独で使うときは <dl> で描画する
 * - Stat.Group の中では、Group の <dl> の中で dt / dd の組をまとめる <div> で描画する
 */
const StatRoot = ({ className, size, align, ...props }: StatRootProps) => {
    const group = useContext(StatGroupContext);
    // 自分の props を優先し、指定が無ければ Group から受け取った値を使う
    const styles = stat({ size: size ?? group?.size, align: align ?? group?.align });
    // <div> の中に dt / dd を直接置くのは不正なので、Group の外では自分が <dl> になる。
    // props の型は <dl> 基準なので、Group の中で使う ark.div も同じ型として扱う
    // (受け付ける属性は同じで、違うのはイベントや ref の要素型だけ)
    const Element = group ? (ark.div as unknown as typeof ark.dl) : ark.dl;
    return (
        <StatStylesContext.Provider value={styles}>
            <Element data-scope="stat" data-part="root" {...props} className={cx(styles.root, className)} />
        </StatStylesContext.Provider>
    );
};

type StatLabelProps = HTMLArkProps<"dt">;

// 値の名前(例: どんぐり / 保護ブロック)。<dt> なので Value より前に置く
const StatLabel = ({ className, ...props }: StatLabelProps) => {
    const styles = useStatStyles("Label");
    return <ark.dt data-scope="stat" data-part="label" {...props} className={cx(styles.label, className)} />;
};

type StatValueProps = HTMLArkProps<"dd">;

// 数値本体。Stat.Unit を中に置くと、数値と単位が 1 つの値として読み上げられる
const StatValue = ({ className, ...props }: StatValueProps) => {
    const styles = useStatStyles("Value");
    return <ark.dd data-scope="stat" data-part="value" {...props} className={cx(styles.value, className)} />;
};

type StatUnitProps = HTMLArkProps<"span">;

// 数値の横に小さく添える単位(例: 時間 / 日)。Stat.Value の中に置く
const StatUnit = ({ className, ...props }: StatUnitProps) => {
    const styles = useStatStyles("Unit");
    return <ark.span data-scope="stat" data-part="unit" {...props} className={cx(styles.unit, className)} />;
};

type StatHelpTextProps = HTMLArkProps<"dd">;

// 前回比や期間などの補足。dt / dd の組の中に置けるよう 2 つ目の <dd> にする
const StatHelpText = ({ className, ...props }: StatHelpTextProps) => {
    const styles = useStatStyles("HelpText");
    return <ark.dd data-scope="stat" data-part="help-text" {...props} className={cx(styles.helpText, className)} />;
};

interface StatGroupProps extends HTMLArkProps<"dl"> {
    /** 子の Stat.Root の既定の size と、区切り線の前後の余白。既定は md */
    size?: StatSize;
    /** 子の Stat.Root の既定の align。既定は start */
    align?: StatAlign;
}

/**
 * 複数の Stat.Root を横一列に並べ、間に縦の区切り線を引く <dl>(プロフィールの統計の帯など)。
 * size / align は子の Stat.Root の既定値になる
 */
const StatGroup = ({ className, size, align, ...props }: StatGroupProps) => {
    // Group 自身は Root の外にあるので、自分のスロット(group)のクラス名はここで解決する
    const styles = stat({ size, align });
    return (
        <StatGroupContext.Provider value={{ size, align }}>
            <ark.dl data-scope="stat" data-part="group" {...props} className={cx(styles.group, className)} />
        </StatGroupContext.Provider>
    );
};

// Compound Component パターン: Stat.Root / Label / Value / Unit / HelpText / Group
const Stat = Object.assign(StatRoot, {
    Root: StatRoot,
    Label: StatLabel,
    Value: StatValue,
    Unit: StatUnit,
    HelpText: StatHelpText,
    Group: StatGroup,
});

export type {
    StatAlign,
    StatGroupProps,
    StatHelpTextProps,
    StatLabelProps,
    StatRootProps,
    StatSize,
    StatUnitProps,
    StatValueProps,
};
export { Stat };
