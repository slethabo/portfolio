# Lethabo Sangweni — portfolio

Personal site: projects, lab write-ups, and community work. Plain HTML, CSS
and a little vanilla JavaScript. No framework, no build step, no web fonts,
no trackers.

**Live:** https://slethabo.github.io/portfolio/

**Editing the site?** See [EDITING.md](EDITING.md) for step-by-step recipes
(adding projects, write-ups, community entries, demo videos, sections).

## Structure

```
index.html                 all static content (intro, about, projects, contact)
EDITING.md                 manual: how to edit everything
cv.html                    one-page CV / recruiter view (prints to PDF)
styles.css                 layout, light/dark palette, print styles
theme.js                   applies a saved light/dark choice before first paint
main.js                    theme toggle, renders write-ups and the community timeline
writeups/writeups.json     list of lab write-ups (edit this)
writeups/*.md | *.pdf      the write-ups themselves
community.json             volunteering and talks (edit this)
assets/
  favicon.svg
  og-image.png             1200x630 social preview (scripts/generate-og-image.py)
  demos/                   project demo videos
vercel.json                security headers for Vercel
.github/workflows/deploy.yml   checks + push-to-deploy for GitHub Pages
```

Anything still unfinished on the page is marked `[TODO …]` or `[PLACEHOLDER …]`
and shows up highlighted, so it's hard to miss. The deploy workflow also warns
about them.

## Preview locally

The write-ups and community lists are loaded with `fetch()`, which browsers
block on `file://`, so use a local server from the repo root:

```
python -m http.server 8080
# open http://localhost:8080
```

## Add a lab write-up

1. Put the write-up in `writeups/`, e.g. `writeups/2026-03-htb-example.md` or a
   `.pdf`. `writeups/placeholder-01.md` is a template you can copy.
2. Add an entry to `writeups/writeups.json`:

   ```json
   {
     "title": "Example box",
     "date": "2026-03-02",
     "platform": "Hack The Box",
     "difficulty": "medium",
     "tags": ["linux", "web"],
     "summary": "One or two lines: what the target was and how you got in.",
     "gotWrong": "The assumption or step that cost you the most time.",
     "file": "writeups/2026-03-htb-example.md"
   }
   ```

   - `date` is `YYYY-MM-DD`. Entries are sorted newest first and grouped by year.
   - `tags` drive the filter buttons; keep them short and lowercase.
   - `file` can be a relative path or a full `https://` link (e.g. the GitHub
     view of the file, which renders Markdown nicely; GitHub Pages serves
     `.md` files as plain text).
3. Delete the two placeholder entries (and their `.md` files) once you have
   real ones.

## Add a community entry

Add an object to `community.json`:

```json
{
  "date": "2026-05",
  "type": "talk",
  "title": "Talk title or your role",
  "org": "Event or organisation",
  "summary": "One line on what you did or covered.",
  "url": "https://link-to-slides-or-recording"
}
```

`date` is `YYYY-MM` or `YYYY-MM-DD`; `type` is free text (`talk`,
`volunteering`, `workshop`…); `url` is optional, leave it as `""` if there's
nothing to link.

## Edit or upload on github.com (no command line)

Every push to `main` redeploys the site, so editing on the GitHub website is
enough. The live site updates a minute or two after you commit.

- **Edit a file** (e.g. `community.json`): open it on github.com, click the
  pencil icon, make the change, then **Commit changes**.
- **Upload a file** (demo video, write-up, CV): open the folder on github.com
  (e.g. `assets/demos/` or `writeups/`), click **Add file → Upload files**,
  drag the file in, then **Commit changes**. The website upload limit is
  25 MB per file.

## Project demo video

The AWS Immune System section plays `assets/demos/aws-immune-system-demo.mp4`.
Upload a file with exactly that name and it appears; until then the page shows
a highlighted placeholder. To use a different name, change the `src` in the
`<video>` tag in `index.html`.

Screen recordings are usually too big as-is. Shrink one to a web-friendly MP4
with [ffmpeg](https://ffmpeg.org):

```
ffmpeg -i recording.mov -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart -an aws-immune-system-demo.mp4
```

If it's still over 25 MB, raise `-crf` (e.g. 32) or upload it to YouTube and
swap the `<figure class="demo">` block for a plain link to the video.

## Other edits

- **Projects, intro, about, contact** are plain HTML in `index.html`.
- **CV:** edit `cv.html` (see EDITING.md, section 4.8).
- **Social preview:** if your name or title changes, edit the constants in
  `scripts/generate-og-image.py` and run it (`pip install pillow` first).
  Check the result with LinkedIn's
  [Post Inspector](https://www.linkedin.com/post-inspector/).

## Deploy

**GitHub Pages:** repo Settings → Pages → Source: GitHub Actions. Every push to
`main` runs the checks in `deploy.yml` (JS syntax, JSON shape, missing files,
leftover TODOs as warnings) and publishes.

**Vercel:** import the repo, framework preset "Other", no build command.
`vercel.json` adds security headers and a CSP.

## License

Code: MIT. Content and copy: © Lethabo Sangweni.
