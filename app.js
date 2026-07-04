/* MeerKit — one lookout post for all of Amir's tools.
 *
 * Tools are listed below in CURATED order; on top of that, any repo on
 * github.com/amirbukhari that has GitHub Pages enabled is auto-discovered
 * at load time and appended, so new tools show up without touching this file.
 */

const USER = "amirbukhari";
const PAGES_HOST = `https://${USER}.github.io`;
const EXCLUDE = new Set(["MeerKit", `${USER}.github.io`]);

// Curated metadata. `live: true` → embeddable GitHub Pages app.
// `live: false` → no web build; shows a card linking to the repo.
const CURATED = [
  {
    id: "better-claude-cli-ui",
    title: "Claude CLI UI",
    emoji: "🎛️",
    live: true,
    desc: "A two-pane web UI for Claude Code: live config dashboard, conversation browser and git view next to the real CLI.",
  },
  {
    id: "AgentLooper",
    title: "AgentLooper",
    emoji: "🔁",
    live: true,
    desc: "AgentOS — autonomous spawner and workspace directory schedulers for looping agents.",
  },
  {
    id: "regia",
    title: "Regia Billing",
    emoji: "🧾",
    live: true,
    desc: "delonix — an enterprise billing console demo. Invoices, payments, customers and credits, fully interactive in-browser.",
  },
  {
    id: "lsdj-midi-studio",
    title: "LSDJ MIDI Studio",
    emoji: "🎵",
    live: false,
    desc: "MIDI → LSDj .lsdsng converter and editor toolkit for Game Boy music, built on a hardened pylsdj.",
  },
];

const tools = new Map(CURATED.map((t) => [t.id, t]));

const tabbar = document.getElementById("tabbar");
const stage = document.getElementById("stage");
const panels = new Map();

/* ---------- rendering ---------- */

function toolUrl(t) {
  return `${PAGES_HOST}/${t.id}/`;
}
function repoUrl(t) {
  return `https://github.com/${USER}/${t.id}`;
}

function renderTabs() {
  tabbar.innerHTML = "";
  tabbar.appendChild(makeTab("home", "🦫", "Lookout"));
  for (const t of tools.values()) {
    tabbar.appendChild(makeTab(t.id, t.emoji, t.title));
  }
  syncSelected();
}

function makeTab(id, emoji, label) {
  const a = document.createElement("a");
  a.className = "tab";
  a.href = id === "home" ? "#/" : `#/${id}`;
  a.dataset.id = id;
  a.setAttribute("role", "tab");
  a.innerHTML = `<span>${emoji}</span><span>${esc(label)}</span>`;
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
  stage.appendChild(panel);
  panels.set("home", panel);
  renderCards();
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
        <span class="card-emoji">${t.emoji}</span>
        <h2>${esc(t.title)}</h2>
        <span class="badge ${t.live ? "" : "repo"}">${t.live ? "Live" : "Repo"}</span>
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

  if (t.live) {
    const strip = document.createElement("div");
    strip.className = "tool-strip";
    strip.innerHTML = `
      <span class="strip-title">${t.emoji} ${esc(t.title)}</span>
      <span class="strip-desc">${esc(t.desc || "")}</span>
      <a href="${toolUrl(t)}" target="_blank" rel="noopener">Open ↗</a>
      <a href="${repoUrl(t)}" target="_blank" rel="noopener">Source</a>`;
    panel.appendChild(strip);

    const frame = document.createElement("iframe");
    frame.src = toolUrl(t);
    frame.title = t.title;
    frame.loading = "lazy";
    panel.appendChild(frame);
  } else {
    panel.classList.add("repo-panel");
    panel.innerHTML = `
      <div class="repo-box">
        <div class="repo-emoji">${t.emoji}</div>
        <h2>${esc(t.title)}</h2>
        <p>${esc(t.desc || "")}</p>
        <p>This one doesn't have a web build (yet) — it lives on GitHub.</p>
        <a class="btn" href="${repoUrl(t)}" target="_blank" rel="noopener">View on GitHub ↗</a>
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
    tab.setAttribute("aria-selected", tab.dataset.id === id ? "true" : "false");
  }
}

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
          emoji: "🛠️",
          live: true,
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
