import { Link } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { flex, hstack } from "styled-system/patterns";

// フッターのテキストリンク共通スタイル
const footerLink = css({
    color: "colorPalette.fg.muted",
    textDecoration: "none",
    transition: "colors",
    _hover: { color: "colorPalette.fg" },
});

// park-ui / shadcn のトップページに倣った 1 行だけの最小フッター。
// 左にコピーライト、右に主要リンクを並べる
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className={css({
                borderTop: "[1px solid]",
                borderColor: "border.subtle",
                marginTop: "auto",
            })}
        >
            <div
                className={flex({
                    maxWidth: "6xl",
                    marginX: "auto",
                    paddingX: { base: "5", md: "8" },
                    paddingY: "6",
                    flexDirection: { base: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { base: "start", sm: "center" },
                    gap: "4",
                    fontSize: "sm",
                })}
            >
                <p className={css({ color: "colorPalette.fg.muted" })}>
                    &copy; {currentYear} Morinoparty. All rights reserved.
                </p>
                <nav className={hstack({ gap: "6" })}>
                    <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }} className={footerLink}>
                        Docs
                    </Link>
                    <Link to="/docs/$" params={{ _splat: "theme" }} className={footerLink}>
                        Theme
                    </Link>
                    <a
                        href="https://github.com/morinoparty/chlorophyll"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={footerLink}
                    >
                        GitHub
                    </a>
                </nav>
            </div>
        </footer>
    );
}
