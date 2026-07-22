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

// park-ui のトップに倣った、境界線を引かない 1 行だけの最小フッター。
// 余白だけでコンテンツと区切り、ヘッダーと同じ横幅の使い方に揃える
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={css({ marginTop: "auto" })}>
            <div
                className={flex({
                    paddingX: { base: "5", md: "8" },
                    paddingY: "8",
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
