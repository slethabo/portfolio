/* =============================================================================
   app.js — quest cards, project modal, recruiter mode, HUD, hash routing.
   Depends on globals from projectsData.js: `projects`, `siteConfig`.
   ========================================================================== */
/* global projects, siteConfig */
(() => {
  "use strict";

  // ---------------------------------------------------------------- helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MODE_KEY = "portfolio.mode";

  const state = {
    mode: "quest", // "quest" | "recruiter"
    activeQuest: null,
    lastFocus: null,
    resumeRendered: false,
  };

  const el = {
    questView: $("#questView"),
    resumeView: $("#resumeView"),
    questGrid: $("[data-quest-grid]"),
    loadout: $("[data-loadout]"),
    hud: $("[data-hud-stats]"),
    contact: $("[data-contact-links]"),
    modal: $("#questModal"),
    modalPanel: $("#questModal .modal-panel"),
    modalContent: $("[data-modal-content]"),
    typed: $("[data-typed]"),
  };

  // ------------------------------------------------------------ site config
  function applySiteConfig() {
    $$("[data-site-name]").forEach((n) => {
      const [first, ...rest] = siteConfig.name.split(" ");
      n.innerHTML = `${esc(first)}<br>${esc(rest.join(" "))}`;
    });
    $$("[data-site-name-inline]").forEach((n) => (n.textContent = siteConfig.name));
    $$("[data-site-tagline]").forEach((n) => (n.textContent = siteConfig.tagline));
    $$("[data-year]").forEach((n) => (n.textContent = String(new Date().getFullYear())));
    document.title = `${siteConfig.name} | ${siteConfig.title}`;
  }

  // ------------------------------------------------------------------ hero
  function renderHud() {
    el.hud.innerHTML = `<dl class="hud-stats">${siteConfig.hudStats
      .map(
        (s) => `
        <div class="hud-tile" title="${esc(s.hint || "")}">
          <dt>${esc(s.label)}</dt>
          <dd>${esc(s.value)}</dd>
        </div>`
      )
      .join("")}</dl>`;
  }

  function startTyping() {
    const roles = siteConfig.roles?.length ? siteConfig.roles : [siteConfig.title];
    if (reducedMotion || roles.length === 1) {
      el.typed.textContent = roles[0];
      return;
    }
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tick = () => {
      const word = roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      el.typed.textContent = word.slice(0, charIdx);

      let delay = deleting ? 38 : 70;
      if (!deleting && charIdx === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    tick();
  }

  // ------------------------------------------------------------- quest grid
  const stars = (n) =>
    Array.from({ length: 5 }, (_, i) => (i < n ? "★" : '<span class="off">★</span>')).join("");

  const badge = (status) =>
    status === "live"
      ? '<span class="badge badge-live"><span class="hud-dot"></span>Live</span>'
      : '<span class="badge badge-wip">In progress</span>';

  function questCard(p, i) {
    const no = String(p.quest ?? i + 1).padStart(2, "0");
    return `
      <button type="button" class="quest-card fade-up" data-quest-id="${esc(p.id)}"
              style="animation-delay:${i * 90}ms" aria-haspopup="dialog" aria-label="Open quest ${no}: ${esc(p.title)}">
        <span class="flash" aria-hidden="true"></span>
        <div class="card-head">
          <span class="quest-no">Quest ${no}</span>
          ${badge(p.status)}
        </div>
        <div>
          <h3>${esc(p.title)}</h3>
          <p class="subtitle">${esc(p.subtitle || "")}</p>
        </div>
        <p class="desc">${esc(p.description || "")}</p>
        <div class="flex flex-wrap gap-1.5">${(p.tags || [])
          .slice(0, 5)
          .map((t) => `<span class="tag">${esc(t)}</span>`)
          .join("")}</div>
        <div class="card-foot">
          <span class="metric">${esc(p.metrics || "")}</span>
          <span class="stars" title="Difficulty ${p.difficulty}/5" aria-label="Difficulty ${p.difficulty} of 5">${stars(p.difficulty || 0)}</span>
        </div>
        <div class="card-foot" style="border-top:0;padding-top:0;margin-top:0">
          <span class="coin">▸ Insert coin</span>
          <span class="text-[10px] uppercase tracking-widest text-slate-500">Open quest</span>
        </div>
      </button>`;
  }

  function renderQuests() {
    el.questGrid.innerHTML = projects.map(questCard).join("");
  }

  function onQuestGridClick(event) {
    const card = event.target.closest(".quest-card");
    if (!card) return;
    const id = card.dataset.questId;
    if (reducedMotion) {
      openQuest(id);
      return;
    }
    card.classList.add("is-pressed");
    setTimeout(() => {
      card.classList.remove("is-pressed");
      openQuest(id, { opener: card });
    }, 320);
  }

  // ---------------------------------------------------------------- loadout
  function renderLoadout() {
    el.loadout.innerHTML = Object.entries(siteConfig.skills)
      .map(
        ([group, items], i) => `
        <div class="loadout-slot fade-up" style="animation-delay:${i * 80}ms">
          <h3>${esc(group)}</h3>
          <ul>${items.map((s) => `<li class="tag">${esc(s)}</li>`).join("")}</ul>
        </div>`
      )
      .join("");
  }

  function renderContact() {
    const links = [
      { label: "Email", href: `mailto:${siteConfig.email}`, icon: "✉" },
      { label: "LinkedIn", href: siteConfig.linkedin, icon: "in" },
      { label: "GitHub", href: siteConfig.github, icon: "</>" },
    ];
    el.contact.innerHTML = links
      .map(
        (l) => `<a class="btn-neon" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">
          <span class="btn-icon" aria-hidden="true">${esc(l.icon)}</span>${esc(l.label)}</a>`
      )
      .join("");
  }

  // ------------------------------------------------------------------ media
  const mimeFor = (url) => {
    const ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
    return { mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg", mov: "video/quicktime" }[ext] || "";
  };

  function placeholderHtml(p) {
    return `
      <div class="demo-placeholder">
        <div class="glyph">▶</div>
        <p>Demo recording coming soon.</p>
        <p>Drop <code>${esc(p.demoUrl.replace("./", "/"))}</code> into the repo to light this up.</p>
      </div>`;
  }

  function mediaHtml(p) {
    if (!p.demoUrl) return placeholderHtml(p);
    if (p.demoType === "gif") {
      return `<img src="${esc(p.demoUrl)}" alt="${esc(p.title)} demo animation" loading="eager" decoding="async" data-demo-media>`;
    }
    const poster = p.posterUrl ? ` poster="${esc(p.posterUrl)}"` : "";
    return `
      <video controls autoplay muted loop playsinline preload="metadata"${poster} data-demo-media
             aria-label="${esc(p.title)} demo video">
        <source src="${esc(p.demoUrl)}" type="${esc(mimeFor(p.demoUrl))}">
        Your browser does not support HTML video.
      </video>`;
  }

  /** Swap the player for a friendly placeholder if the file is missing. */
  function wireMediaFallback(p) {
    const viewer = $("[data-demo-viewer]", el.modalContent);
    const media = $("[data-demo-media]", viewer);
    if (!media) return;
    const fail = () => {
      viewer.innerHTML = placeholderHtml(p);
      const toolbar = $("[data-demo-toolbar]", el.modalContent);
      if (toolbar) toolbar.hidden = true;
    };
    if (media.tagName === "VIDEO") {
      // Errors for a bad URL fire on the <source>, not the <video>.
      $("source", media)?.addEventListener("error", fail, { once: true });
      media.addEventListener("error", fail, { once: true });
      // Autoplay with sound is blocked by browsers; we start muted and let the
      // user unmute via the native controls or the toolbar button.
      media.play().catch(() => {});
    } else {
      media.addEventListener("error", fail, { once: true });
    }
  }

  // ------------------------------------------------------------------ modal
  function specList(title, items, ordered = false, icon = "") {
    if (!items?.length) return "";
    const tag = ordered ? "ol" : "ul";
    return `
      <div class="spec-block">
        <h3><span aria-hidden="true">${icon}</span>${esc(title)}</h3>
        <${tag}>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</${tag}>
      </div>`;
  }

  function modalHtml(p) {
    const no = String(p.quest ?? "").padStart(2, "0");
    return `
      <div class="flex flex-wrap items-center gap-3 pr-12">
        <span class="hud-label">Quest ${no}</span>
        ${badge(p.status)}
      </div>
      <h2 id="modalTitle" class="mt-3">${esc(p.title)}</h2>
      <p class="mt-2 text-sm text-slate-400">${esc(p.subtitle || "")}</p>

      <div class="demo-viewer mt-6" data-demo-viewer>${mediaHtml(p)}</div>
      <div class="demo-toolbar" data-demo-toolbar>
        <span>${p.demoType === "gif" ? "Animated demo" : "Muted by default · use the volume control to unmute"}</span>
        <div class="flex gap-2">
          ${p.demoType !== "gif" ? '<button type="button" data-unmute>🔊 Unmute</button>' : ""}
          <button type="button" data-fullscreen>⛶ Fullscreen</button>
        </div>
      </div>

      <p class="mt-6 text-sm leading-relaxed text-slate-300">${esc(p.description || "")}</p>

      <dl class="stat-grid mt-6">${(p.stats || [])
        .map((s) => `<div class="stat-tile"><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`)
        .join("")}</dl>

      <div class="mt-8 grid gap-8 md:grid-cols-2">
        ${specList("Architecture", p.architecture, true, "⬡")}
        ${specList("Threat model", p.threatModel, false, "⛨")}
      </div>

      ${
        p.mitre?.length
          ? `<div class="mt-6 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
               <span class="uppercase tracking-widest">ATT&amp;CK</span>
               ${p.mitre.map((m) => `<span class="tag">${esc(m)}</span>`).join("")}
             </div>`
          : ""
      }

      <div class="mt-6 flex flex-wrap gap-1.5">${(p.tags || [])
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join("")}</div>

      <div class="mt-8 flex flex-wrap gap-3">
        <a class="btn-neon btn-primary" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">
          <span class="btn-icon" aria-hidden="true">&lt;/&gt;</span> View Code on GitHub
        </a>
        <a class="btn-neon" href="${esc(p.threatModelUrl || p.githubUrl)}" target="_blank" rel="noopener noreferrer">
          <span class="btn-icon" aria-hidden="true">⛨</span> Read Threat Model
        </a>
      </div>`;
  }

  function openQuest(id, { opener = null, fromHash = false } = {}) {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    state.activeQuest = id;
    state.lastFocus = opener || document.activeElement;

    el.modalContent.innerHTML = modalHtml(p);
    wireMediaFallback(p);

    el.modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => el.modal.classList.add("is-open"));
    el.modalPanel.scrollTop = 0;
    el.modalPanel.focus();

    if (!fromHash) history.pushState({ quest: id }, "", `#quest/${id}`);
  }

  function closeModal({ fromHistory = false } = {}) {
    if (el.modal.hidden) return;
    const video = $("video", el.modalContent);
    if (video) video.pause();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    el.modal.classList.remove("is-open");
    const finish = () => {
      el.modal.hidden = true;
      el.modalContent.innerHTML = "";
      document.body.style.overflow = "";
      state.activeQuest = null;
      state.lastFocus?.focus?.();
    };
    reducedMotion ? finish() : setTimeout(finish, 280);

    if (!fromHistory) history.replaceState({}, "", "#quests");
  }

  function onModalClick(event) {
    if (event.target.closest("[data-close]")) return closeModal();
    if (event.target.closest("[data-fullscreen]")) {
      const viewer = $("[data-demo-viewer]", el.modalContent);
      const video = $("video", viewer);
      // Prefer the native video fullscreen (keeps controls); fall back to the container for GIFs.
      const target = video || viewer;
      (target.requestFullscreen || target.webkitRequestFullscreen)?.call(target);
      return;
    }
    if (event.target.closest("[data-unmute]")) {
      const video = $("video", el.modalContent);
      if (!video) return;
      video.muted = !video.muted;
      event.target.closest("[data-unmute]").textContent = video.muted ? "🔊 Unmute" : "🔇 Mute";
      if (!video.muted && video.paused) video.play().catch(() => {});
    }
  }

  function trapFocus(event) {
    if (event.key !== "Tab" || el.modal.hidden) return;
    const focusables = $$(
      'a[href], button:not([disabled]), video, [tabindex]:not([tabindex="-1"])',
      el.modalPanel
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // ---------------------------------------------------------------- resume
  function resumeHtml() {
    const c = siteConfig;
    const contact = [
      c.location && `<span>📍 ${esc(c.location)}</span>`,
      c.email && `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`,
      c.linkedin && `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`,
      c.github && `<a href="${esc(c.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`,
    ]
      .filter(Boolean)
      .join("");

    const projectEntries = projects
      .map(
        (p) => `
        <div class="entry">
          <div class="entry-head">
            <h3>${esc(p.title)} <span class="org">· ${esc(p.subtitle || "")}</span></h3>
            <span class="period">${p.status === "live" ? "Live" : "In progress"}</span>
          </div>
          <p class="mt-1 text-sm">${esc(p.description || "")}</p>
          <ul>${(p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
          <p class="mt-2 text-xs text-slate-400">${(p.tags || []).map(esc).join(" · ")}</p>
          <div class="links">
            <a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">Code</a>
            ${p.threatModelUrl ? `<a href="${esc(p.threatModelUrl)}" target="_blank" rel="noopener noreferrer">Threat model</a>` : ""}
            <a href="#quest/${esc(p.id)}" data-open-quest="${esc(p.id)}" class="no-print">Demo</a>
          </div>
        </div>`
      )
      .join("");

    const experience = (c.experience || [])
      .map(
        (e) => `
        <div class="entry">
          <div class="entry-head">
            <h3>${esc(e.role)} <span class="org">· ${esc(e.org)}</span></h3>
            <span class="period">${esc(e.period)}</span>
          </div>
          <ul>${(e.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>`
      )
      .join("");

    const education = (c.education || [])
      .map(
        (e) => `
        <div class="entry">
          <div class="entry-head">
            <h3>${esc(e.title)} <span class="org">· ${esc(e.org)}</span></h3>
            <span class="period">${esc(e.period)}</span>
          </div>
        </div>`
      )
      .join("");

    return `
      <article class="resume fade-up">
        <header>
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1>${esc(c.name)}</h1>
              <p class="title">${esc(c.title)}</p>
              <div class="contact-row">${contact}</div>
            </div>
            <div class="no-print flex flex-wrap gap-2">
              <a class="btn-neon btn-sm" href="${esc(c.resumePdf)}" download>⬇ Download PDF</a>
              <button type="button" class="btn-ghost btn-sm" data-print>🖨 Print</button>
            </div>
          </div>
        </header>

        <section>
          <h2>Summary</h2>
          <p class="mt-3">${esc(c.summary)}</p>
        </section>

        <section>
          <h2>Core skills</h2>
          <div class="skills-grid">${Object.entries(c.skills)
            .map(([g, items]) => `<div><h3>${esc(g)}</h3><p>${items.map(esc).join(", ")}</p></div>`)
            .join("")}</div>
        </section>

        <section>
          <h2>Projects</h2>
          ${projectEntries}
        </section>

        ${experience ? `<section><h2>Experience</h2>${experience}</section>` : ""}
        ${education ? `<section><h2>Education</h2>${education}</section>` : ""}
        ${
          c.certifications?.length
            ? `<section><h2>Certifications</h2><ul class="mt-3 grid gap-1 pl-5 list-disc">${c.certifications
                .map((x) => `<li>${esc(x)}</li>`)
                .join("")}</ul></section>`
            : ""
        }
      </article>`;
  }

  function renderResume() {
    el.resumeView.innerHTML = resumeHtml();
    state.resumeRendered = true;
  }

  // ------------------------------------------------------------------ mode
  function setMode(mode, { persist = true, updateHash = true } = {}) {
    state.mode = mode;
    const recruiter = mode === "recruiter";
    document.body.classList.toggle("mode-recruiter", recruiter);
    el.questView.hidden = recruiter;
    el.resumeView.hidden = !recruiter;
    if (recruiter && !state.resumeRendered) renderResume();

    $$("[data-mode-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(recruiter));
      const label = $("[data-mode-label]", btn);
      if (label) label.textContent = recruiter ? "Back to Game" : "Recruiter Mode";
      else btn.textContent = recruiter ? "Back to the game" : "Fast-track: Recruiter Mode";
    });

    if (persist) localStorage.setItem(MODE_KEY, mode);
    if (updateHash) {
      history.replaceState({}, "", recruiter ? "#resume" : location.pathname + location.search);
    }
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function toggleMode() {
    setMode(state.mode === "recruiter" ? "quest" : "recruiter");
  }

  // ---------------------------------------------------------- hash routing
  function routeFromHash() {
    const hash = decodeURIComponent(location.hash || "");
    const params = new URLSearchParams(location.search);

    if (hash === "#resume" || params.get("mode") === "recruiter") {
      setMode("recruiter", { updateHash: false });
      return;
    }
    const m = hash.match(/^#quest\/([\w-]+)$/);
    if (m) {
      setMode("quest", { updateHash: false, persist: false });
      openQuest(m[1], { fromHash: true });
      return;
    }
    if (!el.modal.hidden) closeModal({ fromHistory: true });
  }

  // ------------------------------------------------------------------- init
  function init() {
    applySiteConfig();
    renderHud();
    renderQuests();
    renderLoadout();
    renderContact();
    startTyping();

    // Initial mode: URL wins, then saved preference, then the game.
    const saved = localStorage.getItem(MODE_KEY);
    const hash = location.hash;
    if (hash.startsWith("#quest/") || hash === "#resume" || location.search.includes("mode=")) {
      routeFromHash();
    } else {
      setMode(saved === "recruiter" ? "recruiter" : "quest", { updateHash: false });
    }

    el.questGrid.addEventListener("click", onQuestGridClick);
    el.modal.addEventListener("click", onModalClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !el.modal.hidden) closeModal();
      trapFocus(e);
    });
    $$("[data-mode-toggle]").forEach((b) => b.addEventListener("click", toggleMode));
    document.addEventListener("click", (e) => {
      const openLink = e.target.closest("[data-open-quest]");
      if (openLink) {
        e.preventDefault();
        setMode("quest", { updateHash: false });
        openQuest(openLink.dataset.openQuest);
      }
      if (e.target.closest("[data-print]")) window.print();
    });
    window.addEventListener("popstate", routeFromHash);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
