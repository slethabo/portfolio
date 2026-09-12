"""Generate assets/og-image.png (1200x630) for LinkedIn / social previews.

Run from the repo root:
    python scripts/generate-og-image.py

Requires Pillow:  pip install pillow
Edit NAME / TITLE / TAGLINE / QUESTS below, or pass nothing and it will read
them from projectsData.js when Node.js is available.
"""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og-image.png"
W, H = 1200, 630

# Fallbacks if projectsData.js can't be read
NAME = "Lethabo Sangweni"
TITLE = "Cloud & AI Security Engineer"
TAGLINE = "Automated AWS remediation · Terraform purple-team labs · LLM triage with guardrails"
QUESTS = ["AWS Immune System", "Cloud Guardian", "AI Triage & Guardrails"]

INK = (11, 15, 25)
PANEL = (18, 23, 42)
VIOLET = (124, 58, 237)
PINK = (255, 79, 216)
PINK_SOFT = (255, 154, 232)
CYAN = (103, 232, 249)
TEXT = (226, 232, 240)
MUTED = (148, 163, 184)


def read_site_data() -> None:
    """Pull name/title/quests from projectsData.js via Node, if installed."""
    global NAME, TITLE, TAGLINE, QUESTS
    node = shutil.which("node")
    if not node:
        return
    script = (
        "const vm=require('vm'),fs=require('fs');const c={};"
        "vm.runInNewContext(fs.readFileSync('projectsData.js','utf8')+';this.p=projects;this.s=siteConfig;',c);"
        "console.log(JSON.stringify({name:c.s.name,title:c.s.title,tagline:c.s.tagline,quests:c.p.map(x=>x.title)}))"
    )
    try:
        out = subprocess.run([node, "-e", script], cwd=ROOT, capture_output=True, text=True, check=True).stdout
        data = json.loads(out)
        NAME, TITLE, QUESTS = data["name"], data["title"], data["quests"]
        TAGLINE = data.get("tagline") or TAGLINE
    except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
        pass


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        ["C:/Windows/Fonts/consolab.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"]
        if bold
        else ["C:/Windows/Fonts/consola.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"]
    )
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def glow_rect(base: Image.Image, box: tuple[int, int, int, int], color, radius: int, blur: int, alpha: int) -> None:
    from PIL import ImageFilter

    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle(box, radius=radius, outline=color + (alpha,), width=4)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def main() -> None:
    read_site_data()
    img = Image.new("RGBA", (W, H), INK + (255,))
    d = ImageDraw.Draw(img)

    # subtle grid
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=(124, 58, 237, 22))
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=(124, 58, 237, 22))

    # left accent bar + glowing card
    d.rectangle([(0, 0), (14, H)], fill=PINK + (255,))
    card = (70, 60, W - 70, H - 60)
    glow_rect(img, card, PINK, radius=28, blur=18, alpha=160)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(card, radius=28, fill=PANEL + (255,), outline=PINK + (200,), width=2)

    # HUD label
    d.text((120, 110), "▶ PLAYER 1 · READY", font=font(22, bold=True), fill=CYAN + (255,))

    # name + title
    d.text((120, 155), NAME.upper(), font=font(72, bold=True), fill=(255, 255, 255, 255))
    d.text((120, 245), TITLE, font=font(38), fill=PINK_SOFT + (255,))

    # tagline
    y = 315
    for line in wrap(d, TAGLINE, font(26), W - 260)[:2]:
        d.text((120, y), line, font=font(26), fill=MUTED + (255,))
        y += 36

    # quest pills
    d.text((120, 425), "SELECT YOUR QUEST", font=font(20, bold=True), fill=CYAN + (255,))
    x = 120
    pill_font = font(22, bold=True)
    for i, q in enumerate(QUESTS[:3], start=1):
        label = f"0{i}  {q}"
        tw = d.textlength(label, font=pill_font)
        box = (x, 460, x + tw + 44, 508)
        d.rounded_rectangle(box, radius=12, fill=(59, 42, 107, 255), outline=VIOLET + (255,), width=2)
        d.text((x + 22, 471), label, font=pill_font, fill=(216, 180, 254, 255))
        x += tw + 64

    # footer handle
    d.text((120, 545), "github.com/slethabo", font=font(22), fill=MUTED + (255,))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
