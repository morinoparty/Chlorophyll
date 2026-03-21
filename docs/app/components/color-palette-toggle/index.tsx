import { TreePine, Waves } from "lucide-react";
import { useEffect, useState } from "react";
import { css, cx } from "styled-system/css";

type Theme = "mori" | "umi";

interface ColorPaletteToggleProps {
    className?: string;
}

export function ColorPaletteToggle({ className }: ColorPaletteToggleProps) {
    // hydration errorを防ぐため、マウント後にのみ状態を確定させる
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<Theme>("mori");

    useEffect(() => {
        setMounted(true);
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
            className={cx(
                css({
                    bg: "red.1",
                    border: "var(--mpc-borders-border-lg)",
                    cursor: "pointer",
                    color: "colorPalette.fg.muted",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "colors",
                    _hover: { color: "colorPalette.fg" },
                }),
                className,
            )}
            aria-label="Toggle theme"
        >
            {/* SSR時は常にTreePineを表示し、hydration後に正しいアイコンに切り替える */}
            {mounted ? theme === "mori" ? <TreePine /> : <Waves /> : <TreePine />}
        </button>
    );
}
