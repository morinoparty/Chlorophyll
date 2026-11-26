import { useEffect, useState } from "react";
import { css, cx } from "styled-system/css";

type Theme = "mori" | "umi";

interface ColorPaletteToggleProps {
    className?: string;
}

// mori / umi を切り替えるピル型のボタン。現在のパレットの色の点と名前を出す
const toggleStyle = css({
    display: { base: "none", md: "inline-flex" },
    alignItems: "center",
    gap: "2",
    height: "9",
    paddingX: "3.5",
    borderRadius: "full",
    bg: "colorPalette.surface.subtle",
    fontSize: "sm",
    fontWeight: "bold",
    color: "colorPalette.fg",
    cursor: "pointer",
    transition: "colors",
    _hover: { bg: "colorPalette.surface" },
});

const dotStyle = css({
    width: "2.5",
    height: "2.5",
    borderRadius: "full",
    bg: "colorPalette.solid",
});

export function ColorPaletteToggle({ className }: ColorPaletteToggleProps) {
    // SSR 時は既定の mori で描き、マウント後に保存済みのパレットへ合わせる
    const [theme, setTheme] = useState<Theme>("mori");

    useEffect(() => {
        const savedTheme = localStorage.getItem("color-palette") as Theme | null;
        if (savedTheme === "mori" || savedTheme === "umi") {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme: Theme = theme === "mori" ? "umi" : "mori";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-color-palette", newTheme);
        localStorage.setItem("color-palette", newTheme);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={cx(toggleStyle, className)}
            aria-label={`カラーパレットを切り替える(現在: ${theme})`}
        >
            <span className={dotStyle} />
            {theme}
        </button>
    );
}
