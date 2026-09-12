# Lethabo Sangweni — Cloud & AI Security Portfolio

A single-page, arcade-styled portfolio for a Cloud & AI Security Engineer.
Static HTML + Tailwind (Play CDN) + vanilla JavaScript. No build step, no
trackers, deploys for free to GitHub Pages or Vercel on every push to `main`.

**Live:** https://slethabo.github.io/portfolio/ (update after first deploy)

## Features

- **Select Your Quest**: three arcade cards that open a project view with a
  video/GIF demo, architecture, threat model, MTTR-style stats, ATT&CK
  mapping, and GitHub / threat-model buttons.
- **Recruiter Mode**: a persistent top-right toggle that swaps the game for a
  clean, printable resume. Deep-linkable via `#resume` or `?mode=recruiter`.
- **Deep links**: `#quest/aws-remediation` opens a project directly.
- **Media-agnostic demo viewer**: `.mp4`, `.webm`, or `.gif`; autoplays muted,
  native volume + fullscreen controls, graceful placeholder if the file is
  missing.
- Accessible: keyboard-navigable cards, focus trap in the modal, `Esc` to
  close, `prefers-reduced-motion` respected, skip link.
- Security headers + CSP (Vercel headers and an in-page `<meta>` CSP for
  GitHub Pages), OpenGraph + Twitter card tags for rich LinkedIn previews.

## Structure

```
index.html              page shell, meta/OG tags, section markup
styles.css              neon theme, cards, modal, recruiter + print styles
app.js                  rendering, modal, mode toggle, hash routing
projectsData.js         <-- edit this: your info, resume content, projects, media paths
tailwind.config.js      Tailwind Play CDN theme (colours, fonts)
assets/
  avatar.svg            hero character illustration (animated, reduced-motion aware)
  favicon.svg
  og-image.png          1200x630 social preview (regenerate with scripts/generate-og-image.py)
  demos/                put demo videos / GIFs / posters here (see demos/README.md)
scripts/generate-og-image.py
vercel.json             headers + clean URLs for Vercel
.github/workflows/deploy.yml   push-to-deploy for GitHub Pages
```

## Run locally

Any static server works. From the repo root:

```
python -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly from disk also works, but hash deep-links and
video autoplay behave better over http.

## Customise (all in `projectsData.js`)

1. `siteConfig`: name, title, location, email, LinkedIn, resume PDF path,
   summary, skills, experience, education, certifications, HUD stats.
   Search for `TODO` to find the placeholders.
2. `projects`: one object per quest. To swap a demo, change one line:

   ```js
   demoUrl: "./assets/demos/aws-remediation-demo.mp4",   // or .webm / .gif
   demoType: "video",                                    // "video" | "gif"
   ```

3. Drop your resume PDF at `assets/Lethabo-Sangweni-Resume.pdf` (or change
   `resumePdf`). Recruiter Mode also has a Print button that produces a clean
   PDF via the browser.
4. Update the absolute URLs in `index.html` (`canonical`, `og:url`,
   `og:image`) once you know your final domain. LinkedIn requires absolute
   image URLs. Regenerate the image after editing your name/title:

   ```
   pip install pillow
   python scripts/generate-og-image.py
   ```

   Preview how LinkedIn will render it with the
   [Post Inspector](https://www.linkedin.com/post-inspector/).

## Deploy

### GitHub Pages (free, uses the included workflow)

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow syntax-checks the JS, validates
   `projectsData.js`, warns about missing media, and publishes.
4. Your site is at `https://<user>.github.io/<repo>/`. All asset paths are
   relative, so the sub-path works without changes.

### Vercel (free, zero-config)

1. Import the repo at https://vercel.com/new. Framework preset: **Other**.
   No build command, output directory: `.`
2. Every push to `main` deploys. `vercel.json` adds security headers, a CSP,
   and immutable caching for `assets/`.
3. Add your custom domain in the Vercel dashboard if you have one.

## Notes on the tech choices

- **Tailwind Play CDN** keeps the repo build-free. If you later want a
  smaller CSS payload, compile with the Tailwind CLI and drop the CDN script.
- **CSP** allows only `self`, the Tailwind CDN, and Google Fonts. Inline
  scripts are not allowed, which is why the Tailwind theme lives in
  `tailwind.config.js` rather than a `<script>` block.
- **No frameworks, no analytics.** The whole site is ~40 KB of your own code
  plus fonts.

## License

Code: MIT. Content, copy, and the avatar illustration: © Lethabo Sangweni.
