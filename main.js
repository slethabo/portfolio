/* =============================================================================
   main.js: theme toggle, lab write-ups (writeups/writeups.json) and the
   community timeline (community.json). Everything else is static HTML.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);

  /** Escape, then highlight [TODO …] / [PLACEHOLDER …] so they're easy to spot. */
  const text = (value) => esc(value).replace(/\[(?:TODO|PLACEHOLDER)[^\]]*\]/g, (m) => `<span class="todo">${m}</span>`);

  /** Only allow relative, http(s) and mailto links from the JSON files. */
  const safeHref = (value) => {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : null;
    } catch {
      return null;
    }
  };

  const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));

  async function loadJson(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.json();
  }

  const loadError = (what, file) =>
    `<p class="muted">Couldn't load ${what} from <code>${file}</code>. ` +
    `If you opened index.html straight from disk, preview it with a local server instead (see README).</p>`;

  // ------------------------------------------------------------------ theme
  function initTheme() {
    const root = document.documentElement;
    const toggle = $("[data-theme-toggle]");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const current = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

    const sync = () => {
      const next = current() === "dark" ? "light" : "dark";
      toggle.textContent = next;
      toggle.setAttribute("aria-label", `Switch to ${next} theme`);
    };

    toggle.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* not persisted; still applies for this visit */
      }
      sync();
    });
    systemDark.addEventListener("change", sync);
    sync();
  }

  // -------------------------------------------------------------- write-ups
  function writeupHtml(w) {
    const href = safeHref(w.file);
    const fileName = w.file ? String(w.file).split("/").pop() : "";
    const title = href ? `<a href="${esc(href)}">${text(w.title)}</a>` : text(w.title);
    const meta = [w.platform, w.difficulty].filter(Boolean).map((m) => `<span>${text(m)}</span>`).join("");
    return `
      <li class="writeup">
        <p class="meta">
          <span class="num">no. ${String(w.no).padStart(3, "0")}</span>
          <time datetime="${esc(w.date)}">${esc(w.date)}</time>
          ${meta}
          ${fileName ? `<span>${esc(fileName)}</span>` : ""}
        </p>
        <h4>${title}</h4>
        <p class="summary">${text(w.summary)}</p>
        ${w.gotWrong ? `<p class="got-wrong"><span class="label">what I got wrong:</span> ${text(w.gotWrong)}</p>` : ""}
        ${w.tags?.length ? `<p class="tags">${w.tags.map((t) => `#${esc(t)}`).join(" ")}</p>` : ""}
      </li>`;
  }

  function renderWriteups(entries) {
    const list = $("[data-writeups]");
    const filters = $("[data-writeup-filters]");
    const count = $("[data-writeup-count]");

    const sorted = [...entries].sort(byDateDesc);
    const total = sorted.length;
    // Oldest entry is no. 001, so numbers stay put when new ones are added.
    const numbered = sorted.map((w, i) => ({ ...w, no: total - i }));
    const tags = [...new Set(sorted.flatMap((w) => w.tags || []))].sort();
    let active = null;

    filters.innerHTML = ["all", ...tags]
      .map((t) => `<button type="button" data-tag="${esc(t)}" aria-pressed="${t === "all"}">${esc(t)}</button>`)
      .join("");
    filters.hidden = tags.length === 0;

    function draw() {
      const shown = active ? numbered.filter((w) => (w.tags || []).includes(active)) : numbered;
      count.textContent = active
        ? `${shown.length} of ${total} tagged ${active}`
        : `${total} write-up${total === 1 ? "" : "s"}`;

      // Group under a ~/labs/<year>/ heading.
      let html = "";
      let year = null;
      for (const w of shown) {
        const y = String(w.date).slice(0, 4);
        if (y !== year) {
          if (year !== null) html += "</ol>";
          year = y;
          html += `<h3 class="path year">~/labs/${esc(y)}/</h3><ol class="writeup-list">`;
        }
        html += writeupHtml(w);
      }
      if (year !== null) html += "</ol>";
      list.innerHTML = html || `<p class="muted">Nothing here yet.</p>`;
    }

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-tag]");
      if (!button) return;
      active = button.dataset.tag === "all" ? null : button.dataset.tag;
      for (const b of filters.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b === button));
      draw();
    });
    draw();
  }

  // -------------------------------------------------------------- community
  function renderCommunity(entries) {
    const list = $("[data-community]");
    list.innerHTML = [...entries]
      .sort(byDateDesc)
      .map((c) => {
        const href = safeHref(c.url);
        return `
          <li>
            <p><time datetime="${esc(c.date)}">${esc(c.date)}</time>${c.type ? `<span class="kind"> · ${esc(c.type)}</span>` : ""}</p>
            <h3>${href ? `<a href="${esc(href)}">${text(c.title)}</a>` : text(c.title)}</h3>
            <p class="org">${text(c.org)}</p>
            ${c.summary ? `<p>${text(c.summary)}</p>` : ""}
          </li>`;
      })
      .join("");
  }

  // ------------------------------------------------------------------- demo
  /** Until a video file is uploaded, show a placeholder instead of a broken player. */
  function initDemos() {
    for (const figure of document.querySelectorAll("[data-demo]")) {
      const video = $("video", figure);
      const source = $("source", figure);
      if (!video || !source) continue;
      const fail = () => {
        const file = source.getAttribute("src").replace("./", "");
       // figure.innerHTML = `<p><span class="todo">[TODO: upload the demo video to ${esc(file)}]</span></p>`;
      };
      // The error may already have fired before this deferred script ran.
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fail();
      else source.addEventListener("error", fail, { once: true });
    }
  }

  // ------------------------------------------------------------------- init
  function init() {
    initTheme();
    initDemos();

    // The CV page (cv.html) shares this script but has no lists, only a print button.
    $("[data-print]")?.addEventListener("click", () => window.print());

    if ($("[data-writeups]")) {
      loadJson("./writeups/writeups.json")
        .then(renderWriteups)
        .catch((err) => {
          console.error(err);
          $("[data-writeups]").innerHTML = loadError("write-ups", "writeups/writeups.json");
        });
    }

    if ($("[data-community]")) {
      loadJson("./community.json")
        .then(renderCommunity)
        .catch((err) => {
          console.error(err);
          $("[data-community]").outerHTML = loadError("the timeline", "community.json");
        });
    }
  }

  init();
})();
