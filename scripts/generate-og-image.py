"""Generate assets/og-image.png (1200x630) for LinkedIn / social previews.

Run from the repo root:
    python scripts/generate-og-image.py

Requires Pillow:  pip install pillow
Edit NAME / LINE / URL below if they change.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og-image.png"
W, H = 1200, 630

NAME = "Lethabo Sangweni"
LINE = "Junior penetration tester, Cape Town"
URL = "slethabo.github.io/portfolio"

PAPER = (247, 245, 239)
INK = (31, 29, 26)
MUTED = (95, 90, 80)
RULE = (214, 208, 194)
ACCENT = (179, 54, 30)


def font(kind: str, size: int) -> ImageFont.FreeTypeFont:
    candidates = {
        "serif": ["C:/Windows/Fonts/georgia.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"],
        "mono": ["C:/Windows/Fonts/consola.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"],
    }[kind]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main() -> None:
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # notebook margin line and a few faint ruled lines
    for y in range(110, H, 56):
        d.line([(0, y), (W, y)], fill=RULE, width=1)
    d.line([(130, 0), (130, H)], fill=ACCENT, width=3)

    d.text((170, 70), "~/portfolio", font=font("mono", 26), fill=MUTED)
    d.text((170, 230), NAME, font=font("serif", 88), fill=INK)
    d.text((172, 350), LINE, font=font("serif", 40), fill=MUTED)
    d.text((170, 530), URL, font=font("mono", 26), fill=ACCENT)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
