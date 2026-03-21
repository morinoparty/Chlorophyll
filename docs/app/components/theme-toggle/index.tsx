import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { css, cx } from "styled-system/css";

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    // hydration errorを防ぐため、マウント後にのみ状態を確定させる
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setMounted(true);
        const newIsDark = document.documentElement.classList.contains("dark");
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
        document.documentElement.setAttribute("data-theme", newIsDark ? "dark" : "light");
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
    }, []);

    const toggleMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
        document.documentElement.setAttribute("data-theme", newIsDark ? "dark" : "light");
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
    };

    return (
        <button
            type="button"
            onClick={toggleMode}
            className={cx(
                css({
                    bg: "[transparent]",
                    border: "[none]",
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
            aria-label="Toggle mode"
        >
            {/* SSR時は常にMoonを表示し、hydration後に正しいアイコンに切り替える */}
            {mounted ? isDark ? <Moon /> : <Sun /> : <Moon />}
        </button>
    );
}
