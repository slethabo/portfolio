# Demo media

Drop your recordings here and point `demoUrl` / `posterUrl` in
`../../projectsData.js` at them. Nothing else needs to change.

Expected files (rename or edit the paths in projectsData.js):

| Quest | File | Type |
|---|---|---|
| AWS Immune System | `aws-remediation-demo.mp4` + `aws-remediation-thumb.png` | video |
| Cloud Guardian | `cloud-guardian-demo.gif` | gif |
| AI Triage & Guardrails | `ai-triage-demo.mp4` + `ai-triage-thumb.png` | video |

## Keep files small

GitHub Pages and Vercel serve these directly, so aim for under 10 MB each.

Compress a screen recording to a web-friendly MP4 (H.264, no audio track
needed if the demo is silent):

```
ffmpeg -i raw.mov -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -movflags +faststart -an aws-remediation-demo.mp4
```

Grab a poster frame at 3 seconds:

```
ffmpeg -ss 3 -i aws-remediation-demo.mp4 -frames:v 1 aws-remediation-thumb.png
```

Convert a short clip to an optimised GIF:

```
ffmpeg -i clip.mp4 -vf "fps=12,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" cloud-guardian-demo.gif
```

Terminal-only demos: record with [asciinema](https://asciinema.org) and
render to GIF with [agg](https://github.com/asciinema/agg).

If a referenced file is missing, the site shows a "demo coming soon"
placeholder instead of a broken player.
