# How to edit this site

A step-by-step manual for keeping the portfolio up to date. Every change
follows the same routine: **edit → preview → publish**. Recipes for each kind of
change are in [section 4](#4-recipes).

Contents

1. [How the site is put together](#1-how-the-site-is-put-together)
2. [Two ways to make changes](#2-two-ways-to-make-changes)
3. [Before you publish: checklist](#3-before-you-publish-checklist)
4. [Recipes](#4-recipes)
5. [Adding a whole new section](#5-adding-a-whole-new-section)
6. [Troubleshooting](#6-troubleshooting)
7. [Writing tips](#7-writing-tips)

---

## 1. How the site is put together

| File / folder | What it holds | How often you'll touch it |
|---|---|---|
| `index.html` | All the words on the page: intro, About, projects, contact. Also the illustration and the bunny. | Often |
| `cv.html` | Your one-page CV (the "Recruiter view") | When your CV changes |
| `writeups/writeups.json` | The list of lab write-ups | Often |
| `writeups/` | The write-up files themselves (`.md` or `.pdf`) | Often |
| `community.json` | Volunteering and talks timeline | Sometimes |
| `assets/demos/` | Project demo videos | Sometimes |
| `assets/` | CV PDF, favicon, social preview image | Rarely |
| `styles.css` | Colours, fonts, spacing, layout | Rarely |
| `main.js`, `theme.js` | The code that builds the write-up and community lists and the light/dark toggle | Almost never |
| `.github/workflows/deploy.yml` | Publishes the site when you push to `main` | Never |

In `index.html`, each section starts with a comment banner, so search the
file for the section name:

```html
<!-- ================================ ABOUT ================================ -->
```

Anything unfinished is marked `[TODO …]` and shows up **highlighted in yellow**
on the page so you can't miss it. Search for `TODO` to find them all.

---

## 2. Two ways to make changes

### A. On github.com (easiest, nothing to install)

- **Edit a file:** open it on github.com → click the **pencil icon** → make the
  change → **Commit changes**.
- **Upload a file:** open the folder → **Add file → Upload files** → drag the
  file in → **Commit changes**. The limit is 25 MB per file.

The site rebuilds automatically. Check the **Actions** tab: a green tick means
it's live (usually within 1–2 minutes). A red cross means something failed; see
[Troubleshooting](#6-troubleshooting).

You can't preview on github.com, so for anything bigger than a text change, use
option B.

### B. On your computer (lets you preview first)

1. Open the folder in VS Code.
2. Start a preview server in the terminal, from the project folder:

   ```
   python -m http.server 8080
   ```

3. Open http://localhost:8080. Refresh after each save. (Opening `index.html`
   by double-clicking won't work fully, because the write-up and community
   lists can't load from a plain file.)
4. When you're happy, publish:

   ```
   git add -A
   git commit -m "Describe what you changed"
   git push
   ```

---

## 3. Before you publish: checklist

- [ ] Search for `TODO` and `PLACEHOLDER`. Is anything left that you didn't mean to publish?
- [ ] Preview the page and click the theme button to check both **light and dark**.
- [ ] Make the browser window narrow (or open it on your phone) to check the mobile layout.
- [ ] Click any new links.
- [ ] If you changed `styles.css` or `main.js`, bump the version number (see [4.12](#412-make-sure-visitors-see-your-css-or-js-changes)).

---

## 4. Recipes

### 4.1 Change the intro sentence or the status note

In `index.html`, find the `INTRO` section.

- The big sentence is inside `<h1 class="intro-line">…</h1>`.
- The "now / studying / certs" note beside it is a list of pairs:

  ```html
  <dt>Now</dt>
  <dd>Junior penetration tester, Nascent</dd>
  ```

  Edit the text inside `<dd>`. To add a new line (e.g. "Based"), add another
  `<dt>` + `<dd>` pair in the same place.

### 4.2 Edit the About section

Find `ABOUT` in `index.html`. Each paragraph is a `<p>…</p>`. Edit the
words, or copy a whole `<p>…</p>` block to add a new paragraph.

**Margin notes** (the small text with a red line beside it) look like this:

```html
<aside class="note">
  Your short side comment here.
</aside>
```

Put a note **just before** the paragraph it belongs to. On wide screens it sits
in the right margin; on phones it appears inline.

### 4.3 Add a certification

In the intro status note, add it to the `<dd>` under `<dt>Certs</dt>`,
separated by a comma:

```html
<dd>ISC2 CC, CompTIA Security+, CompTIA A+, AWS [exact badge name]</dd>
```

### 4.4 Add a project

Projects live in the `PROJECTS` section of `index.html`. There are two styles:

- **Featured project**: a full write-up with demo, problem, what I built, what
  went wrong and result. AWS Immune System uses this. Use it for your best one
  or two projects.
- **Compact list**: a short numbered entry, one paragraph. Use it for
  everything else.

#### Option A: add a project to the compact list (quick)

Paste this **after** the closing `</article>` of the featured project, just
before the `</div>` that ends the section. If the list already exists, paste
only a new `<li>…</li>` inside it.

```html
<h3 class="list-head">More projects</h3>
<ol class="compact">
  <li>
    <span class="num">02</span>
    <div>
      <h4>Project name <span class="muted">· one-line description</span></h4>
      <p>
        Two or three sentences: what it does, what you used, and what you
        learned or what the result was.
      </p>
      <p class="tags">python · burp-suite · android</p>
      <p class="mono muted small">repo: <a href="https://github.com/slethabo/REPO-NAME">github.com/slethabo/REPO-NAME</a></p>
    </div>
  </li>
</ol>
```

Number entries in order: the featured project is `01`, so the next is `02`, and so on.

#### Option B: add another featured project (full write-up)

Copy the whole AWS block, from `<article class="featured prose" …>` down to its
`</article>`, and paste the copy right after it. Then in the copy:

1. Change `aria-labelledby="p-aws"` and `id="p-aws"` to a new unique name,
   e.g. `p-apk`. **Both must match.**
2. Change the number `01` in `<p class="meta">`, the status (`live` /
   `in progress`), and the tech list.
3. Change the title `<h3>` and the subtitle `<p class="sub">`.
4. Rewrite the text under each `<h4>` heading: **Problem**, **What I built**,
   **What went wrong**, **Result**. Delete any code blocks (`<figure class="code">`
   or `<figure class="term">`) you don't need.
5. Update the links at the bottom in `<p class="links">`.
6. Demo video: change the file name in the `<source src="…">` and
   `<figcaption>`, or delete the whole `<figure class="demo" data-demo>…</figure>`
   block if there's no demo.

To **move a project from the list to featured** (or back), cut its text from
one style and paste it into the other.

To **remove a project**, delete its whole `<li>…</li>` (compact) or
`<article>…</article>` (featured) block.

### 4.5 Add or replace a project demo video

1. Export your recording as `.mp4`. If it's over 25 MB, shrink it:

   ```
   ffmpeg -i recording.mov -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart -an my-demo.mp4
   ```

   Still too big? Use `-crf 32`, or upload to YouTube instead (below).
2. Upload it to `assets/demos/`.
3. Make sure the name matches the `src` in that project's `<video>` block, e.g.
   `./assets/demos/aws-immune-system-demo.mp4`.

Until the file exists, the page shows a yellow `[TODO: upload the demo video…]`
note instead of a broken player.

**YouTube or Loom instead:** replace the whole `<figure class="demo" …>…</figure>`
with a link. The site's security settings don't allow embedded players from
other websites.

```html
<p class="links"><a href="https://youtu.be/YOUR-VIDEO">Watch the demo</a></p>
```

### 4.6 Add a lab write-up

1. Write it up. Copy `writeups/TEMPLATE.md` as a starting point, or export a PDF.
2. Upload it to `writeups/`. A name like `2026-11-htb-boxname.md` keeps things tidy.
3. Open `writeups/writeups.json` and add an entry. Add it **after** the
   opening `[`, then put a comma after its closing `}`:

   ```json
   [
     {
       "title": "Box name",
       "date": "2026-11-02",
       "platform": "Hack The Box",
       "difficulty": "medium",
       "tags": ["linux", "web"],
       "summary": "One or two lines: what the target was and how you got in.",
       "gotWrong": "The assumption or step that cost you the most time.",
       "file": "writeups/2026-11-htb-boxname.md"
     },
     { …the entries that were already there… }
   ]
   ```

   - `date` must be `YYYY-MM-DD`. The site sorts newest first and groups by year.
   - `tags` become the filter buttons. Keep them short and lowercase.
   - `file` can also be a full `https://…` link.
4. **Required:** every entry needs `title`, `date` and `summary`, or the
   deploy fails with a red cross. `platform`, `difficulty`, `tags`,
   `gotWrong` and `file` are optional; leave out any you don't have.

Tip: GitHub Pages shows `.md` files as plain text. If you want the write-up
nicely formatted, upload a PDF, or set `file` to the GitHub view of the file:
`https://github.com/slethabo/portfolio/blob/main/writeups/2026-11-htb-boxname.md`.

### 4.7 Add community work (volunteering, talks)

Open `community.json` and add an entry, following the same comma rules as above:

```json
{
  "date": "2026-11",
  "type": "volunteering",
  "title": "Your role or the talk title",
  "org": "Organisation or event",
  "summary": "One line on what you did or covered.",
  "url": "https://link-to-slides-or-recording"
}
```

- `date`: `YYYY-MM` or `YYYY-MM-DD`. Newest shows first.
- `type`: anything short: `talk`, `volunteering`, `workshop`, `mentoring`, `ctf`.
- `url`: optional. Use `""` if there's nothing to link.

Delete the two `[PLACEHOLDER]` entries once you've added real ones.

### 4.8 Update your CV (recruiter view)

Your CV is its own page, `cv.html`, linked from the **Recruiter view (CV)**
button in the header and from the Contact section. Recruiters can read it on
screen or click **Print / save as PDF** to get a clean PDF.

To update it, edit `cv.html`. It's plain HTML in the same patterns as the
main page:

- **Contact line:** the links inside `<p class="cv-contact">`.
- **Summary:** the `<p>` under `<h2>Summary</h2>`.
- **A new job:** copy a whole `<div class="cv-entry">…</div>` block under
  Experience and change the role, company, dates and bullet points (`<li>`).
- **A new project:** same idea, under Projects. Keep it to 2–3 bullets and the repo link.
- **Skills:** each line is a `<dt>` label + `<dd>` list.
- **Certifications:** one `<li>` per certificate.

When you change something that's also on the main page (job title, certs,
projects), update **both** `index.html` and `cv.html`.

After editing, click **Print / save as PDF** to check the layout. Two pages
is fine; just make sure nothing looks cut off at the page break.

Prefer a PDF you made yourself (e.g. in Word)? Upload it to `assets/` and
change the Contact-section CV link in `index.html` to point at it:

```html
<dd><a href="./assets/Lethabo-Sangweni-CV.pdf" download>Download CV (PDF)</a></dd>
```

### 4.9 Change contact links (e.g. add LinkedIn)

In the `CONTACT` section, copy a `<dt>` + `<dd>` pair:

```html
<dt>LinkedIn</dt>
<dd><a href="https://www.linkedin.com/in/lethabo-sangweni/">linkedin.com/in/lethabo-sangweni</a></dd>
```

### 4.10 The illustration and the bunny

- **The illustration** is drawn in code inside `<figure class="portrait">` in
  the About section. Its colours are in `styles.css` under `/* illustration */`.
  For example, `.ill .sweater { fill: #d9a441; }` is the sweater colour, and
  `.ill .skin` is the skin tone.
- **To use a real photo or your own artwork instead**, replace the whole
  `<svg class="ill" …>…</svg>` with:

  ```html
  <img src="./assets/me.jpg" alt="Short description of the picture" width="320" height="260">
  ```

  Keep the image small: around 600 px wide and under 150 KB.
- **The bunny** is drawn once, at the top of `<body>` (`<symbol id="bunny">`),
  and reused in the header, the footer, and on the laptop sticker. To add
  another bunny anywhere:

  ```html
  <svg class="bunny" aria-hidden="true" focusable="false"><use href="#bunny"/></svg>
  ```

  To remove one, delete that line. The browser-tab icon is a separate copy in
  `assets/favicon.svg`.

### 4.11 Colours and fonts

All in `styles.css`, at the very top, under `:root`:

```css
--accent: light-dark(#b3361e, #e8765c);
```

Each colour has two values: **light mode first, dark mode second**. Change
`--accent` to change the red-pen colour everywhere. `--serif` and `--mono` set
the fonts. Keep them as system fonts so the site stays fast and doesn't load
anything from other websites.

### 4.12 Make sure visitors see your CSS or JS changes

Browsers cache `styles.css` and `main.js`. After changing either one, bump the
version number in the `<head>` of **both** `index.html` and `cv.html`:

```html
<link rel="stylesheet" href="./styles.css?v=2.3">   →   ?v=2.4
<script src="./main.js?v=2.3" defer></script>        →   ?v=2.4
```

### 4.13 Page title and link previews (LinkedIn, WhatsApp)

- The title and description are in the `<head>` of `index.html`: `<title>`,
  `<meta name="description">`, and the `og:` / `twitter:` lines. Update all of
  them together.
- The preview image is `assets/og-image.png`. If your name or title changes,
  edit `NAME` / `LINE` in `scripts/generate-og-image.py` and run:

  ```
  pip install pillow
  python scripts/generate-og-image.py
  ```

- LinkedIn caches previews. Paste your URL into the
  [Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it.

---

## 5. Adding a whole new section

For example, a "Certifications" or "Tools I've built" section. Copy this
template into `index.html` where you want it, e.g. just before `CONTACT`:

```html
<!-- ============================== NEW SECTION ============================== -->
<section id="tools" class="sec sec-tools">
  <div class="wrap grid">
    <p class="path" aria-hidden="true">~/tools/</p>
    <div class="col prose">
      <h2>Tools</h2>
      <p>Your content here.</p>
    </div>
  </div>
</section>
```

Then:

1. Use the same word in `id="tools"`, the `~/tools/` label and the heading.
2. Add it to the menu at the top of the page, in `<nav>`:

   ```html
   <li><a href="#tools">Tools</a></li>
   ```

3. Optional spacing: add a rule to `styles.css`, e.g.
   `.sec-tools { padding: 3rem 0; }`. Sections deliberately use different
   spacing so the page doesn't feel like a template.

---

## 6. Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Write-ups or community list says "Couldn't load…" | A typo in the JSON file. Usually a missing or extra comma, or a missing quote. | Paste the file into https://jsonlint.com to find the line. The **Actions** tab on GitHub shows the error too. |
| Write-ups show "Couldn't load…" only on your computer | You opened `index.html` directly | Use `python -m http.server 8080` (see [2B](#b-on-your-computer-lets-you-preview-first)). |
| Demo still shows the yellow TODO | The file name doesn't match `src` exactly (it's case-sensitive), or the file wasn't uploaded to `assets/demos/` | Check the spelling on both sides. |
| Changes aren't on the live site | The deploy is still running or failed, or your browser is caching | Check the **Actions** tab; hard-refresh with Ctrl+F5; bump the `?v=` number (4.12). |
| Red cross in Actions | The deploy checks failed. Most often a write-up is missing `summary`, or a community entry is missing `title`, `date` or `org`. | Click the failed run; the red step tells you which file and entry, e.g. `writeups.json[0] missing "summary"`. Yellow warnings (leftover TODOs, placeholders) don't block publishing. |
| Layout broke after editing HTML | A tag was opened but not closed | Every `<p>`, `<li>`, `<div>`, `<article>` needs its matching `</…>`. Undo your last change and redo it carefully. |

---

## 7. Writing tips

- **Only write what's true.** No guessed numbers. If you haven't measured
  something yet, leave a `[TODO]` until you have.
- **Be specific:** "Found an IDOR in the order API" beats "Performed comprehensive testing".
- **Use first person, plain words.** Avoid "passionate", "cutting-edge" and
  "bridging the gap", and avoid three-part slogans.
- **"What went wrong" is a strength.** Hiring managers like seeing how you
  debug and what you learned.
- **Never publish client details from Nascent work.** Keep lab write-ups to
  public platforms and your own labs.
