/* MeerKit — one lookout post for all of Amir's tools.
 *
 * Tools are listed below in CURATED order; on top of that, any repo on
 * github.com/amirbukhari that has GitHub Pages enabled is auto-discovered
 * at load time and appended, so new tools show up without touching this file.
 *
 * Tool fields:
 *   id     unique slug (repo name for GitHub tools)
 *   title  display name
 *   icon   symbol id from the sprite in index.html (Lucide)
 *   desc   one-line blurb
 *   url    where the tool lives (defaults to the repo's GitHub Pages URL)
 *   repo   GitHub repo URL, if it has one
 *   embed  true → runs in an iframe tab; false → open-in-new-tab panel
 *   note   shown on non-embeddable panels (why it can't be embedded)
 */

const USER = "amirbukhari";
const PAGES_HOST = `https://${USER}.github.io`;
const EXCLUDE = new Set(["MeerKit", `${USER}.github.io`]);

const CURATED = [
  {
    id: "better-claude-cli-ui",
    title: "Claude CLI UI",
    icon: "i-terminal",
    embed: true,
    desc: "A two-pane web UI for Claude Code: live config dashboard, conversation browser and git view next to the real CLI.",
  },
  {
    id: "AgentLooper",
    title: "AgentLooper",
    icon: "i-repeat",
    embed: true,
    desc: "AgentOS — autonomous spawner and workspace directory schedulers for looping agents.",
  },
  {
    id: "regia",
    title: "Regia Billing",
    icon: "i-receipt",
    embed: true,
    desc: "delonix — an enterprise billing console demo. Invoices, payments, customers and credits, fully interactive in-browser.",
  },
  {
    id: "synclair-mr-agent",
    title: "Synclair Console",
    icon: "i-bot",
    embed: true,
    url: "https://synclair-mr-agent.llws.workers.dev/",
    desc: "Synclair & Renfrey operator console, running on Cloudflare Workers.",
  },
  {
    id: "rentsync-cf-tunnels",
    title: "CF Tunnels",
    icon: "i-cloud",
    embed: false,
    url: "https://rentsync-cf-tunnels.pages.dev/",
    desc: "Rentsync Cloudflare tunnels dashboard, deployed on Cloudflare Pages.",
    note: "Protected by Cloudflare Access — sign-in can't run inside an embedded frame, so it opens in its own tab.",
    lock: true,
  },
  {
    id: "lsdj-midi-studio",
    title: "LSDJ MIDI Studio",
    icon: "i-music",
    embed: false,
    url: `https://github.com/${USER}/lsdj-midi-studio`,
    repo: `https://github.com/${USER}/lsdj-midi-studio`,
    desc: "MIDI → LSDj .lsdsng converter and editor toolkit for Game Boy music, built on a hardened pylsdj.",
    note: "No web build (yet) — this one lives on GitHub.",
  },
];

const tools = new Map();
for (const t of CURATED) {
  const external = !!t.url; // curated URL given → not a GitHub Pages tool
  if (!t.url) t.url = `${PAGES_HOST}/${t.id}/`;
  if (t.repo === undefined && !external) t.repo = `https://github.com/${USER}/${t.id}`;
  tools.set(t.id, t);
}

const tabbar = document.getElementById("tabbar");
const stage = document.getElementById("stage");
const panels = new Map();

/* ---------- rendering ---------- */

function icon(id, cls = "icon") {
  return `<svg class="${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function renderTabs() {
  tabbar.innerHTML = "";
  tabbar.appendChild(makeTab("home", "i-eye", "Lookout"));
  for (const t of tools.values()) {
    tabbar.appendChild(makeTab(t.id, t.icon, t.title));
  }
  syncSelected();
  syncTabFade();
}

function makeTab(id, iconId, label) {
  const a = document.createElement("a");
  a.className = "tab";
  a.href = id === "home" ? "#/" : `#/${id}`;
  a.dataset.id = id;
  a.innerHTML = `${icon(iconId)}<span>${esc(label)}</span>`;
  return a;
}

function renderHome() {
  const panel = document.createElement("section");
  panel.className = "panel home";
  panel.dataset.id = "home";

  const mascot = document.querySelector(".brand-logo").cloneNode(true);
  mascot.classList.remove("brand-logo");
  mascot.classList.add("hero-mascot");

  const hero = document.createElement("div");
  hero.className = "hero";
  hero.appendChild(mascot);
  hero.insertAdjacentHTML(
    "beforeend",
    `<h1>Meer<em>Kit</em></h1>
     <p>One lookout post for all of Amir's tools. Pick a tool from the tabs
        above or the cards below — live ones run right here in the page.</p>`
  );
  panel.appendChild(hero);

  const grid = document.createElement("div");
  grid.className = "card-grid";
  grid.id = "card-grid";
  panel.appendChild(grid);
  panel.insertAdjacentHTML(
    "beforeend",
    `<footer class="site-foot">Standing lookout since 2026 ·
       <a href="https://github.com/amirbukhari/MeerKit" target="_blank" rel="noopener">source</a></footer>`
  );
  stage.appendChild(panel);
  panels.set("home", panel);
  renderCards();
}

function badgeFor(t) {
  if (t.embed) return `<span class="badge live">Live</span>`;
  if (t.note && t.lock) return `<span class="badge">New tab</span>`;
  return `<span class="badge muted">Repo</span>`;
}

function renderCards() {
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";
  for (const t of tools.values()) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `#/${t.id}`;
    card.innerHTML = `
      <div class="card-top">
        <span class="card-icon">${icon(t.icon)}</span>
        <h2>${esc(t.title)}</h2>
        ${badgeFor(t)}
      </div>
      <p>${esc(t.desc || "")}</p>
      ${t.pushed ? `<span class="card-meta">Updated ${t.pushed}</span>` : ""}`;
    grid.appendChild(card);
  }
}

function buildToolPanel(t) {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.dataset.id = t.id;

  if (t.embed) {
    const strip = document.createElement("div");
    strip.className = "tool-strip";
    strip.innerHTML = `
      <span class="strip-title">${icon(t.icon)} ${esc(t.title)}</span>
      <span class="strip-desc">${esc(t.desc || "")}</span>
      <a href="${t.url}" target="_blank" rel="noopener">Open ${icon("i-external", "icon icon-sm")}</a>
      ${t.repo ? `<a href="${t.repo}" target="_blank" rel="noopener">Source ${icon("i-code", "icon icon-sm")}</a>` : ""}`;
    panel.appendChild(strip);

    const wrap = document.createElement("div");
    wrap.className = "frame-wrap";
    wrap.innerHTML = `<div class="frame-loader" role="status" aria-label="Loading ${esc(t.title)}">
      <img class="loader-mascot" src="assets/logo-mark.png" alt="" width="56" height="56" />
      <span>Standing lookout — loading ${esc(t.title)}…</span>
    </div>`;
    const frame = document.createElement("iframe");
    frame.src = t.url;
    frame.title = t.title;
    frame.loading = "lazy";
    frame.addEventListener("load", () => wrap.classList.add("loaded"));
    wrap.appendChild(frame);
    panel.appendChild(wrap);
  } else {
    panel.classList.add("repo-panel");
    panel.innerHTML = `
      <div class="repo-box">
        <span class="repo-icon">${icon(t.lock ? "i-lock" : t.icon, "icon icon-xl")}</span>
        <h2>${esc(t.title)}</h2>
        <p>${esc(t.desc || "")}</p>
        <p class="repo-note">${esc(t.note || "")}</p>
        <a class="btn" href="${t.url}" target="_blank" rel="noopener">
          ${t.repo && t.url === t.repo ? "View on GitHub" : "Open in new tab"} ${icon("i-external", "icon icon-sm")}
        </a>
      </div>`;
  }

  stage.appendChild(panel);
  panels.set(t.id, panel);
  return panel;
}

/* ---------- routing ---------- */

function currentRoute() {
  const id = location.hash.replace(/^#\/?/, "");
  return tools.has(id) ? id : "home";
}

function activate(id) {
  for (const [pid, panel] of panels) panel.classList.toggle("active", pid === id);
  if (id !== "home" && !panels.has(id)) {
    buildToolPanel(tools.get(id)).classList.add("active");
  }
  syncSelected();
  const t = tools.get(id);
  document.title = t ? `${t.title} · MeerKit` : "MeerKit — Amir's tool lookout";
}

function syncSelected() {
  const id = currentRoute();
  for (const tab of tabbar.querySelectorAll(".tab")) {
    if (tab.dataset.id === id) {
      tab.setAttribute("aria-current", "page");
      // Only scroll when the tab is actually off-screen. Chromium resets the
      // keyboard sequential-focus starting point whenever scrollIntoView() runs,
      // even as a no-op — calling it unconditionally on every load/route change
      // hijacks Tab navigation, making the very first Tab press jump into the
      // tabbar and skip the skip-link, brand link, and home tab entirely.
      const tabRect = tab.getBoundingClientRect();
      const barRect = tabbar.getBoundingClientRect();
      if (tabRect.left < barRect.left || tabRect.right > barRect.right) {
        tab.scrollIntoView({ inline: "nearest", block: "nearest" });
      }
    } else tab.removeAttribute("aria-current");
  }
}

/* fade the tabbar's right edge only while there is more to scroll */
function syncTabFade() {
  const more = tabbar.scrollLeft + tabbar.clientWidth < tabbar.scrollWidth - 4;
  tabbar.classList.toggle("has-more", more);
}
tabbar.addEventListener("scroll", syncTabFade, { passive: true });
window.addEventListener("resize", syncTabFade);

window.addEventListener("hashchange", () => activate(currentRoute()));

/* ---------- auto-discovery of new tools ---------- */

async function discover() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`
    );
    if (!res.ok) return;
    const repos = await res.json();
    let changed = false;
    for (const r of repos) {
      if (EXCLUDE.has(r.name)) continue;
      const known = tools.get(r.name);
      if (known) {
        // freshen metadata from the API
        known.pushed = r.pushed_at.slice(0, 10);
        if (!known.desc && r.description) known.desc = r.description;
        changed = true;
      } else if (r.has_pages && !r.fork) {
        tools.set(r.name, {
          id: r.name,
          title: r.name,
          icon: "i-wrench",
          embed: true,
          url: `${PAGES_HOST}/${r.name}/`,
          repo: r.html_url,
          desc: r.description || "",
          pushed: r.pushed_at.slice(0, 10),
        });
        changed = true;
      }
    }
    if (changed) {
      renderTabs();
      renderCards();
    }
  } catch {
    /* offline or rate-limited — curated list already rendered */
  }
}

/* ---------- utils & boot ---------- */

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

renderTabs();
renderHome();
activate(currentRoute());
discover();
