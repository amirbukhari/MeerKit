<p align="center">
  <img src="assets/logo.png" alt="MeerKit logo — a meerkat mascot standing lookout" width="320" />
</p>

# MeerKit 🦫

*Not AmirKit — **MeerKit**.* One lookout post for all of [Amir Bukhari's](https://github.com/amirbukhari) tools.

**Live at → https://amirbukhari.github.io/MeerKit/**

## What it is

A zero-build static site (plain HTML/CSS/JS) that hosts every tool in one place, with a tab for each. Tools that allow embedding run **inside the app in an iframe**; tools that can't be framed (auth walls, no web build) get an open-in-new-tab panel.

Design follows the [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) dark developer-tool profile: OLED-deep warm palette, Inter, Lucide SVG icons (no emoji-as-icons), WCAG-AA-verified contrast, visible focus rings, 44px touch targets, `prefers-reduced-motion` support, and loading feedback on embeds.

Current lineup:

| Tab | Where it lives | How it's shown |
|---|---|---|
| Claude CLI UI | [better-claude-cli-ui](https://github.com/amirbukhari/better-claude-cli-ui) | embedded |
| AgentLooper | [AgentLooper](https://github.com/amirbukhari/AgentLooper) | embedded |
| Regia Billing | [regia](https://github.com/amirbukhari/regia) | embedded |
| Synclair Console | [synclair-mr-agent.llws.workers.dev](https://synclair-mr-agent.llws.workers.dev/) | embedded |
| CF Tunnels | [rentsync-cf-tunnels.pages.dev](https://rentsync-cf-tunnels.pages.dev/) | new-tab panel (Cloudflare Access blocks framing) |
| LSDJ MIDI Studio | [lsdj-midi-studio](https://github.com/amirbukhari/lsdj-midi-studio) | repo panel |

## Adding a tool

Usually: **do nothing.** On load, MeerKit queries the GitHub API and auto-adds any non-fork repo of `amirbukhari` that has GitHub Pages enabled. Enable Pages on a new tool repo and it appears as a tab.

To give a tool a nicer title, emoji, or blurb (or to list a repo that has no web build), add an entry to the `CURATED` array at the top of [`app.js`](app.js).

## Deploying

Pushing to `main` triggers [`deploy-pages.yml`](.github/workflows/deploy-pages.yml), which publishes the repo root to GitHub Pages. No build step.
