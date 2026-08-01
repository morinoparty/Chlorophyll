#!/usr/bin/env python3
"""和文フォント(源柔ゴシックL P)のセルフホスト用 webfont を docs/public/fonts/ に生成する。

このデザインシステムの本文フォントは「欧文 = Satoshi / 和文 = 源柔ゴシックL P」の 2 書体構成で、
preset の fonts.sans が並べた font-family スタックによって字種ごとに切り替わる。
フォントファイル自体は結合しない（Satoshi のライセンスが改変を禁じているため結合できない）。

このスクリプトが扱うのは和文側だけである。理由は配布条件の違いにある。

- 源柔ゴシックL P: SIL OFL 1.1。サブセット化も再配布も許諾されているため、
  unicode-range 単位に 120 分割して woff2 に変換し、リポジトリに含めて自前で配信する。
- Satoshi: Indian Type Foundry の Free Font EULA。第 2 条がフォントファイルの複製・再配布を
  禁じており、公開リポジトリに置くとクローンした全員へ配布することになるため同梱しない。
  EULA が明示的に許可している Fontshare API 経由の読み込み（docs/app/routes/__root.tsx の
  api.fontshare.com への link）をそのまま使う。
  自社サーバー限りでセルフホストしたい場合は、配布 zip の Fonts/WEB/ 一式（無改変）を
  公開リポジトリの外に置いて配信すること。サブセット化は同条により行えない。

依存: fontTools と brotli。リポジトリの依存には含めず、uv 経由で都度用意する。

    uv run --with 'fonttools[woff]' -- python docs/scripts/build-fonts.py
    (docs/package.json の `pnpm fonts` も同じことをする)

元フォントは 100MB 超あるため CACHE_DIR にキャッシュし、2 回目以降は再ダウンロードしない。
"""

from __future__ import annotations

import io
import json
import shutil
import sys
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = DOCS_DIR / "public" / "fonts"
CACHE_DIR = DOCS_DIR / ".font-cache"
# unicode-range の分割定義。Google Fonts の日本語スライスと同じ 120 分割で、
# 使用頻度の高い文字ほど後ろのチャンクに寄っている
SUBSET_RANGES_PATH = Path(__file__).resolve().parent / "unicode-subsets.json"

# jikasei.me 本体は https の証明書が一致しないため、配布元が案内している OSDN ミラーを使う
GENJYUU_ZIP_URL = "https://ftp.iij.ad.jp/pub/osdn.jp/users/8/8643/genjyuugothic-l-20150607.zip"

# CSS 上のファミリー名。preset の fonts.sans が参照している名前と一致させる
GENJYUU_FAMILY = "GenJyuuGothicLP"


@dataclass(frozen=True)
class GenJyuuWeight:
    """源柔ゴシックの書体ファイルと CSS 上の font-weight の対応。"""

    # zip 内のファイル名に含まれるウェイト名
    source: str
    # 出力ファイル名に使う接尾辞
    slug: str
    # @font-face に書き出す font-weight
    css_weight: int


# 現状 docs が読み込んでいる 2 ウェイトに揃える。
# デザインシステムの本文が 500、強調が 700 で、600 は CSS のフォントマッチングで 700 に寄る
GENJYUU_WEIGHTS = (
    GenJyuuWeight(source="Medium", slug="medium", css_weight=500),
    GenJyuuWeight(source="Bold", slug="bold", css_weight=700),
)


def download(url: str, dest: Path) -> Path:
    """URL を dest にダウンロードする。すでに存在する場合は再利用する。"""
    if dest.exists():
        print(f"  cached: {dest.name} ({dest.stat().st_size:,} bytes)")
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"  downloading: {url}")
    # ダウンロード途中で失敗した中間ファイルを残さないよう、一時名で受けてから rename する
    tmp = dest.with_suffix(dest.suffix + ".part")
    with urllib.request.urlopen(url, timeout=300) as res, tmp.open("wb") as f:
        shutil.copyfileobj(res, f)
    tmp.rename(dest)
    print(f"  saved: {dest.name} ({dest.stat().st_size:,} bytes)")
    return dest


def build_genjyuu(genjyuu_zip: Path, out_dir: Path, ranges: list[str]) -> list[str]:
    """源柔ゴシックL P を unicode-range ごとにサブセット化し、@font-face を返す。"""
    # fontTools は uv 側で用意する想定なので、ここで初めて import する
    from fontTools import subset
    from fontTools.ttLib import TTFont

    out_dir.mkdir(parents=True, exist_ok=True)
    faces: list[str] = []

    with zipfile.ZipFile(genjyuu_zip) as z:
        # OFL の再配布条件を満たすため、ライセンスと配布元 README を同梱する
        (out_dir / "OFL.txt").write_bytes(z.read("SIL_Open_Font_License_1.1.txt"))
        (out_dir / "README_GenJyuu.txt").write_bytes(z.read("README_GenJyuu.txt"))

        for weight in GENJYUU_WEIGHTS:
            source = z.read(f"GenJyuuGothicL-P-{weight.source}.ttf")
            total = 0
            for index, unicode_range in enumerate(ranges):
                data = subset_font(TTFont, subset, source, unicode_range)
                name = f"GenJyuuGothicLP-{weight.slug}-{index}.woff2"
                (out_dir / name).write_bytes(data)
                total += len(data)
                faces.append(font_face(weight.css_weight, name, unicode_range, index))
            print(f"  {GENJYUU_FAMILY} {weight.source}: {len(ranges)} files / {total:,} bytes")

    return faces


def subset_font(TTFont, subset, source: bytes, unicode_range: str) -> bytes:
    """TTF のバイト列を指定 unicode-range だけに絞り込み、woff2 のバイト列で返す。"""
    font = TTFont(io.BytesIO(source))
    options = subset.Options(
        # web では使わないヒンティングと組版フィーチャを落として容量を削る
        hinting=False,
        layout_features=[],
        notdef_outline=False,
        glyph_names=False,
        legacy_kern=False,
        # 著作権表記とライセンス URL は name テーブルに残す
        name_IDs=[0, 1, 2, 3, 4, 5, 6, 13, 14],
        name_legacy=False,
        name_languages=[0x409],
    )
    # FontForge の独自テーブル。サブセッタが扱えず警告を出すだけなので明示的に捨てる
    options.drop_tables += ["FFTM"]

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes(unicode_range))
    subsetter.subset(font)

    # flavor は Options ではなく TTFont 側に設定しないと woff2 圧縮が効かない
    font.flavor = "woff2"
    buffer = io.BytesIO()
    font.save(buffer)
    return buffer.getvalue()


def font_face(css_weight: int, file_name: str, unicode_range: str, index: int) -> str:
    """源柔ゴシック 1 チャンク分の @font-face 定義を組み立てる。"""
    return "\n".join(
        [
            f"/* [{index}] */",
            "@font-face {",
            f"    font-family: '{GENJYUU_FAMILY}';",
            "    font-style: normal;",
            f"    font-weight: {css_weight};",
            "    font-display: swap;",
            f"    src: url(./genjyuu-gothic-lp/{file_name}) format('woff2');",
            f"    unicode-range: {unicode_range};",
            "}",
        ]
    )


def main() -> int:
    ranges: list[str] = json.loads(SUBSET_RANGES_PATH.read_text(encoding="utf-8"))

    print("1. ソースフォントを取得")
    genjyuu_zip = download(GENJYUU_ZIP_URL, CACHE_DIR / "genjyuugothic-l.zip")

    # 前回の生成物が残っていると、ウェイトを減らしたときに孤児ファイルが残るため作り直す
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    print("2. 源柔ゴシックL P をサブセット化")
    faces = build_genjyuu(genjyuu_zip, OUTPUT_DIR / "genjyuu-gothic-lp", ranges)

    header = "\n".join(
        [
            '@charset "UTF-8";',
            "",
            "/*",
            " * docs/scripts/build-fonts.py が生成したファイル。直接編集しないこと。",
            " *",
            " * 源柔ゴシックL P - (c) 自家製フォント工房",
            " *   http://jikasei.me/font/genjyuu/  (ライセンス: ./genjyuu-gothic-lp/OFL.txt)",
            " *",
            " * 欧文の Satoshi はライセンス上セルフホストできないため、",
            " * __root.tsx から Fontshare API 経由で読み込んでいる。",
            " */",
            "",
        ]
    )
    css_path = OUTPUT_DIR / "fonts.css"
    css_path.write_text(header + "\n\n".join(faces) + "\n", encoding="utf-8")

    total = sum(p.stat().st_size for p in OUTPUT_DIR.rglob("*") if p.is_file())
    print(f"3. 完了: {css_path.relative_to(DOCS_DIR)} / 合計 {total:,} bytes ({total / 1048576:.2f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
