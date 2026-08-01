#!/usr/bin/env python3
"""Figma などのデスクトップアプリでローカル利用するための、合成フォントを生成する。

Chlorophyll の本文フォントは「欧文 = Satoshi / 和文 = 源柔ゴシックL P」の 2 書体構成だが、
Web では font-family スタックで切り替わるのに対し、Figma のデスクトップアプリでは
1 つのフォントしか選べない。そこで両者のグリフを 1 ファイルに合成し、
OS にインストールして使えるようにする。

  欧文・記号 -> Satoshi (cmap の重複は先に指定した Satoshi 側が勝つ)
  それ以外   -> 源柔ゴシックL P

デザインシステムの fontWeights トークンに合わせて 100-900 の 9 スタイルを作る。
元書体に無い太さは最も近いものを流用するため、一部のスタイルは隣と同じ字面になる（STYLES を参照）。

生成物は .local-fonts/ に出力する（.gitignore 済み。9 スタイルで約 100MB）。

  重要: 出力したフォントは配布しないこと。
  Satoshi の EULA は改変・再配布を認めていないため、この合成フォントは
  「手元のデザイン作業で Web の見た目を再現するための実装用データ」に限る。
  Web への配信は docs/scripts/build-fonts.py が作る配信用アセットを使う。

依存: fontTools。リポジトリの依存には含めず、uv 経由で都度用意する。

    uv run --with fonttools -- python docs/scripts/build-local-font.py
    (docs/package.json の `pnpm fonts:local` も同じことをする)

元フォントは docs/scripts/build-fonts.py と同じ .font-cache/ を共有する。
"""

from __future__ import annotations

import io
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path

DOCS_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = DOCS_DIR.parent
OUTPUT_DIR = REPO_DIR / ".local-fonts"
CACHE_DIR = DOCS_DIR / ".font-cache"

SATOSHI_ZIP_URL = "https://api.fontshare.com/v2/fonts/download/satoshi"
# jikasei.me 本体は https の証明書が一致しないため、配布元が案内している OSDN ミラーを使う
GENJYUU_ZIP_URL = "https://ftp.iij.ad.jp/pub/osdn.jp/users/8/8643/genjyuugothic-l-20150607.zip"

# 合成フォントのファミリー名。元書体のどちらとも別名にして取り違えを防ぐ
FAMILY_NAME = "Chlorophyll Sans"
POSTSCRIPT_FAMILY = "ChlorophyllSans"
VERSION = "1.000"

# 源柔ゴシック側の em 単位。Satoshi(1000) をこちらに合わせて拡大する。
# 和文グリフを無変換で残したいので、字数の多い源柔ゴシックを基準にする
TARGET_UPEM = 1024


@dataclass(frozen=True)
class Style:
    """合成する 1 スタイル分の、両書体のソースと OpenType 上の属性。"""

    # nameID 17 (Typographic Subfamily)。Figma のスタイル一覧に出る名前
    style_name: str
    weight_class: int
    # Satoshi 可変フォントから取り出す wght の値
    satoshi_wght: int
    # 源柔ゴシックL P のファイル名に含まれるウェイト名
    genjyuu: str
    # RIBBI 4 スタイルに収まらない太さは、旧来の nameID 1/2 では別ファミリー扱いにする
    is_bold: bool = False


# デザインシステムの fontWeights トークンに合わせた 9 スタイル。
# 両書体とも全ウェイトを持っているわけではないので、無い太さは最も近いものを流用する:
#   - Satoshi の可変軸は wght 300-900。100/200 は下限の 300 で代用する
#   - 源柔ゴシックL P は 100/200/300/400/500/700/900 の 7 段階。
#     600 と 800 は該当が無いため、等距離の上側(700 Bold / 900 Heavy)に寄せる。
#     600 を Bold に寄せるのは、Web 側で CSS のフォントマッチングが 600 -> 700 に
#     解決するのと同じ挙動なので、実装と見た目が揃う
# 源柔ゴシックL P の各ファイルが宣言している usWeightClass。代用したかどうかの判定に使う
GENJYUU_WEIGHT_CLASS = {
    "ExtraLight": 100,
    "Light": 200,
    "Normal": 300,
    "Regular": 400,
    "Medium": 500,
    "Bold": 700,
    "Heavy": 900,
}

STYLES = (
    Style(style_name="Thin", weight_class=100, satoshi_wght=300, genjyuu="ExtraLight"),
    Style(style_name="ExtraLight", weight_class=200, satoshi_wght=300, genjyuu="Light"),
    Style(style_name="Light", weight_class=300, satoshi_wght=300, genjyuu="Normal"),
    Style(style_name="Regular", weight_class=400, satoshi_wght=400, genjyuu="Regular"),
    Style(style_name="Medium", weight_class=500, satoshi_wght=500, genjyuu="Medium"),
    Style(style_name="SemiBold", weight_class=600, satoshi_wght=600, genjyuu="Bold"),
    Style(style_name="Bold", weight_class=700, satoshi_wght=700, genjyuu="Bold", is_bold=True),
    Style(style_name="ExtraBold", weight_class=800, satoshi_wght=800, genjyuu="Heavy"),
    Style(style_name="Black", weight_class=900, satoshi_wght=900, genjyuu="Heavy"),
)

COPYRIGHT = (
    "Latin glyphs: Satoshi, designed by Deni Anggara, (c) Indian Type Foundry. "
    "Japanese glyphs: GenJyuuGothicL-P, (c) Jikasei Font Kobo, licensed under SIL OFL 1.1. "
    "This composite font is for local design work only and must not be redistributed."
)


def download(url: str, dest: Path) -> Path:
    """URL を dest にダウンロードする。すでに存在する場合は再利用する。"""
    if dest.exists():
        print(f"  cached: {dest.name} ({dest.stat().st_size:,} bytes)")
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"  downloading: {url}")
    tmp = dest.with_suffix(dest.suffix + ".part")
    with urllib.request.urlopen(url, timeout=300) as res, tmp.open("wb") as f:
        shutil.copyfileobj(res, f)
    tmp.rename(dest)
    return dest


def prepare_satoshi(TTFont, scale_upem, instantiate, raw: bytes, wght: int, work: Path) -> Path:
    """Satoshi 可変フォントを指定ウェイトで静的化し、マージ可能な状態にして保存する。"""
    font = TTFont(io.BytesIO(raw))
    # FontForge の独自テーブル。マージャが扱えないので落とす
    if "FFTM" in font:
        del font["FFTM"]
    # wght 軸を固定して静的インスタンスにする。全軸を固定すると fvar 等も落ちる
    instantiate(font, {"wght": wght}, inplace=True)
    # em 単位が違うとマージできないため、源柔ゴシックに合わせて拡大する
    scale_upem(font, TARGET_UPEM)
    path = work / "satoshi.ttf"
    font.save(path)
    return path


def prepare_genjyuu(TTFont, raw: bytes, satoshi_os2, work: Path) -> tuple[Path, dict[str, int]]:
    """源柔ゴシックをマージ可能な状態に整えて保存し、縦メトリクスとあわせて返す。"""
    font = TTFont(io.BytesIO(raw))
    if "FFTM" in font:
        del font["FFTM"]

    # 合成後の行の高さは和文が収まるかどうかで決まるので、この書体の値を控えておく。
    # ウェイトごとに微妙に違うため、特定ウェイトの値を決め打ちにはしない
    hhea, os2_src = font["hhea"], font["OS/2"]
    metrics = {
        "ascent": hhea.ascent,
        "descent": hhea.descent,
        "lineGap": hhea.lineGap,
        "winAscent": os2_src.usWinAscent,
        "winDescent": os2_src.usWinDescent,
        "typoAscender": os2_src.sTypoAscender,
        "typoDescender": os2_src.sTypoDescender,
        "typoLineGap": os2_src.sTypoLineGap,
    }

    # OS/2 のバージョンが違うと、マージャがフィールド不足で落ちる。
    # 欧文は Satoshi から来るので、v4 で増えた欧文向けの値も Satoshi のものを採る
    os2 = font["OS/2"]
    os2.version = 4
    os2.sxHeight = satoshi_os2.sxHeight
    os2.sCapHeight = satoshi_os2.sCapHeight
    os2.usDefaultChar = 0
    os2.usBreakChar = 32
    os2.usMaxContext = satoshi_os2.usMaxContext

    # 縦書きメトリクスとヒンティングは Satoshi 側に無く、片側だけでは合成できないので落とす。
    # 画面上のデザイン用途では縦組みを使わないため実害はない
    for tag in ("vhea", "vmtx", "cvt ", "fpgm", "prep"):
        if tag in font:
            del font[tag]

    path = work / "genjyuu.ttf"
    font.save(path)
    return path, metrics


def apply_names(font, style: Style) -> None:
    """name テーブルを合成フォント用に作り直す。"""
    name = font["name"]
    name.names = []

    # 旧来の nameID 1/2 は RIBBI(Regular/Italic/Bold/Bold Italic)しか表現できない。
    # Medium のような太さは「別ファミリーの Regular」として登録するのが慣例
    if style.style_name in ("Regular", "Bold"):
        legacy_family = FAMILY_NAME
        legacy_style = style.style_name
    else:
        legacy_family = f"{FAMILY_NAME} {style.style_name}"
        legacy_style = "Regular"

    full_name = f"{FAMILY_NAME} {style.style_name}"
    ps_name = f"{POSTSCRIPT_FAMILY}-{style.style_name}"

    records = {
        0: COPYRIGHT,
        1: legacy_family,
        2: legacy_style,
        3: f"{ps_name}; {VERSION}",
        4: full_name,
        5: f"Version {VERSION}",
        6: ps_name,
        # Figma を含む現代のアプリはこちらを見て、1 ファミリー内の複数スタイルとして扱う
        16: FAMILY_NAME,
        17: style.style_name,
    }
    for name_id, value in records.items():
        # Windows(3,1,0x409) と Mac(1,0,0) の両方に入れて、OS を問わず名前が引けるようにする
        name.setName(value, name_id, 3, 1, 0x409)
        name.setName(value, name_id, 1, 0, 0)


def apply_metrics(font, style: Style, metrics: dict[str, int]) -> None:
    """ウェイトと縦メトリクスを整える。"""
    os2 = font["OS/2"]
    os2.usWeightClass = style.weight_class

    # fsSelection / macStyle の太字ビットを、実際の太さに合わせる
    #   bit0 = ITALIC, bit5 = BOLD, bit6 = REGULAR
    os2.fsSelection &= ~((1 << 0) | (1 << 5) | (1 << 6))
    os2.fsSelection |= (1 << 5) if style.is_bold else (1 << 6)
    font["head"].macStyle = 1 if style.is_bold else 0

    # 行の高さは和文が収まるかどうかで決まるので、源柔ゴシック側の値をそのまま採る。
    # マージャは両書体の最大値を採ってしまい、Satoshi の値が混ざると行間が広がる
    hhea = font["hhea"]
    hhea.ascent = metrics["ascent"]
    hhea.descent = metrics["descent"]
    hhea.lineGap = metrics["lineGap"]
    os2.usWinAscent = metrics["winAscent"]
    os2.usWinDescent = metrics["winDescent"]
    os2.sTypoAscender = metrics["typoAscender"]
    os2.sTypoDescender = metrics["typoDescender"]
    os2.sTypoLineGap = metrics["typoLineGap"]


def build(TTFont, scale_upem, instantiate, Merger, satoshi_zip: Path, genjyuu_zip: Path, style: Style) -> Path:
    """1 スタイル分の合成フォントを生成し、出力パスを返す。"""
    with zipfile.ZipFile(satoshi_zip) as sz, zipfile.ZipFile(genjyuu_zip) as gz:
        satoshi_raw = sz.read("Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.ttf")
        genjyuu_raw = gz.read(f"GenJyuuGothicL-P-{style.genjyuu}.ttf")

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        satoshi_path = prepare_satoshi(TTFont, scale_upem, instantiate, satoshi_raw, style.satoshi_wght, work)
        satoshi_os2 = TTFont(satoshi_path)["OS/2"]
        genjyuu_path, metrics = prepare_genjyuu(TTFont, genjyuu_raw, satoshi_os2, work)

        # 先に渡した書体の cmap が優先される。欧文を Satoshi にしたいので Satoshi が先
        merged = Merger().merge([str(satoshi_path), str(genjyuu_path)])

    apply_names(merged, style)
    apply_metrics(merged, style, metrics)

    out_path = OUTPUT_DIR / f"{POSTSCRIPT_FAMILY}-{style.style_name}.ttf"
    merged.save(out_path)
    return out_path


def main() -> int:
    # fontTools は uv 側で用意する想定なので、ここで初めて import する
    from fontTools.merge import Merger
    from fontTools.ttLib import TTFont
    from fontTools.ttLib.scaleUpem import scale_upem
    from fontTools.varLib.instancer import instantiateVariableFont

    print("1. ソースフォントを取得")
    satoshi_zip = download(SATOSHI_ZIP_URL, CACHE_DIR / "satoshi.zip")
    genjyuu_zip = download(GENJYUU_ZIP_URL, CACHE_DIR / "genjyuugothic-l.zip")

    # 前回より少ないスタイル数で作り直したときに、古いファイルが残らないようにする
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True)

    print("2. 合成")
    for style in STYLES:
        path = build(TTFont, scale_upem, instantiateVariableFont, Merger, satoshi_zip, genjyuu_zip, style)
        # 元書体に無い太さを代用した箇所は、後から見て分かるように印を付ける
        marks = []
        if style.satoshi_wght != style.weight_class:
            marks.append(f"欧文=wght {style.satoshi_wght}")
        if GENJYUU_WEIGHT_CLASS[style.genjyuu] != style.weight_class:
            marks.append(f"和文={style.genjyuu}({GENJYUU_WEIGHT_CLASS[style.genjyuu]})")
        note = f"  [代用: {' / '.join(marks)}]" if marks else ""
        print(f"  {style.weight_class:>3} {path.name}: {path.stat().st_size:,} bytes{note}")

    # 出力先に、配布してはいけない旨を残しておく
    (OUTPUT_DIR / "README.txt").write_text(
        "\n".join(
            [
                "docs/scripts/build-local-font.py が生成した、ローカル作業用の合成フォントです。",
                "",
                "欧文グリフ: Satoshi (c) Indian Type Foundry - https://www.fontshare.com/fonts/satoshi",
                "和文グリフ: 源柔ゴシックL P (c) 自家製フォント工房 - http://jikasei.me/font/genjyuu/",
                "",
                "Satoshi の EULA は改変・再配布を認めていないため、このフォントは配布しないでください。",
                "手元の Figma などで Web の見た目を再現するためだけに使ってください。",
                "Web 配信用のアセットは docs/scripts/build-fonts.py が生成します。",
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(f"3. 完了: {OUTPUT_DIR.relative_to(REPO_DIR)}/ (OS にインストールして Figma から選択できます)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
