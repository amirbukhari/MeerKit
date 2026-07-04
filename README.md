# MeerKit 🦫

*Not AmirKit — **MeerKit**.* One lookout post for all of [Amir Bukhari's](https://github.com/amirbukhari) tools.

**Live at → https://amirbukhari.github.io/MeerKit/**

## What it is

A zero-build static site (plain HTML/CSS/JS) that hosts every tool in one place, with a tab for each. Tools that have a GitHub Pages build run **embedded right inside the app**; tools without a web build get a card linking to their repo.

Current lineup:

| Tab | Repo | How it's shown |
|---|---|---|
| 🎛️ Claude CLI UI | [better-claude-cli-ui](https://github.com/amirbukhari/better-claude-cli-ui) | embedded |
| 🔁 AgentLooper | [AgentLooper](https://github.com/amirbukhari/AgentLooper) | embedded |
| 🧾 Regia Billing | [regia](https://github.com/amirbukhari/regia) | embedded |
| 🎵 LSDJ MIDI Studio | [lsdj-midi-studio](https://github.com/amirbukhari/lsdj-midi-studio) | repo card |

## Adding a tool

Usually: **do nothing.** On load, MeerKit queries the GitHub API and auto-adds any non-fork repo of `amirbukhari` that has GitHub Pages enabled. Enable Pages on a new tool repo and it appears as a tab.

To give a tool a nicer title, emoji, or blurb (or to list a repo that has no web build), add an entry to the `CURATED` array at the top of [`app.js`](app.js).

## Deploying

Pushing to `main` triggers [`deploy-pages.yml`](.github/workflows/deploy-pages.yml), which publishes the repo root to GitHub Pages. No build step.
