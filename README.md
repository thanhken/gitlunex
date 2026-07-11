# GitLunex

A lightweight, cross-platform **local Git GUI client** (Sourcetree-like) built with **Tauri v2 + React**. Small binary, low memory — primary target **Ubuntu**, also runs on **Windows** and **macOS**.

Git operations shell out to the system `git` CLI, so every repo — with all its hooks, config and credential helpers — works exactly as it does on the command line.

## Download

Grab the installer for your platform from the **[latest release](https://github.com/thanhken/gitlunex/releases/latest)**.

| Platform | File |
|----------|------|
| Linux    | `.AppImage` (portable) or `.deb` |
| Windows  | `.msi` or `-setup.exe` |
| macOS    | `.dmg` (universal — Intel + Apple Silicon) |

### Install notes

- **Linux (.AppImage):** `chmod +x GitLunex_*.AppImage && ./GitLunex_*.AppImage`
- **Linux (.deb):** `sudo apt install ./GitLunex_*.deb`
- **Windows:** run the `.msi` / `-setup.exe`. SmartScreen may warn (unsigned) — choose *More info → Run anyway*.
- **macOS:** the app is ad-hoc signed but **not notarized**. First launch: **right-click the app → Open** once to bypass Gatekeeper.

## Features

- **Working copy** — staged / unstaged / untracked lists; stage, unstage, discard; live diff preview.
- **Commit** — write a message and commit staged changes (`Ctrl/Cmd+Enter`).
- **History graph** — branch-aware commit graph across all refs, with per-commit changed files and diffs.
- **Branches / remotes / tags** — sidebar listing; double-click to checkout; create / delete local branches.
- **Remote sync** — Fetch / Pull / Push with ahead/behind indicators.
- **Interactive rebase** — side-by-side 3-way conflict editor with per-hunk controls, progress and jump-to-next.
- **Embedded terminal** — a real PTY (xterm.js) rooted at the repo, plus system-terminal and file-manager shortcuts.
- **Tabbed workspace** — a single window with browser-style tabs: one draggable tab per open repo, per-tab state that survives switches. `Ctrl/Cmd+T` open, `Ctrl/Cmd+W` close, `Ctrl/Cmd+Tab` cycle, `Ctrl/Cmd+1..9` jump.
- **Repository organizer** — a Home launcher that lists recent repos in nestable folders; drag to reorganize.

## Requirements

- **Linux:** WebKitGTK 4.1 (`libwebkit2gtk-4.1-0`) — preinstalled on most modern desktops.
- A working **`git`** on your `PATH`.

## License

See the release notes for licensing details.

---

*Releases are built and published automatically from CI. Issues and feedback welcome.*
