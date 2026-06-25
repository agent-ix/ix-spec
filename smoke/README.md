# Community install smoke test

A clean-room, repeatable check that a brand-new developer can install `quoin`
from **public npm** and use it as a plugin in the coding agent of their choice —
**Claude Code, OpenAI Codex, opencode, and GitHub Copilot** — with no Agent-IX
internal config and no Anthropic API key.

```bash
make install-smoke                       # from the repo root (real community path)
PLUGIN_SOURCE=local ./smoke/run.sh       # validate the working tree (what CI runs)
PKG_VERSION=0.2.1 ./smoke/run.sh         # pin for byte-for-byte reproducibility
```

## Plugin source

- `PLUGIN_SOURCE=github` (default) installs from `agent-ix/quoin` on GitHub's
  default branch — the exact path a community user follows.
- `PLUGIN_SOURCE=local` installs from the mounted checkout — validates the
  manifests in _this_ revision before they reach the default branch. CI uses this
  (see `.github/workflows/install-smoke.yml`) so a PR's own changes are tested.

The Claude Code and Codex stages honor `PLUGIN_SOURCE` (they install this repo's
plugin manifests). The opencode and Copilot stages add **no repo-specific files**
— they install the existing `skills/` tree with the exact `gh skill install
<repo>` command users run — so they always install from the published `agent-ix/`
repo. Note: in `PLUGIN_SOURCE=github`, the Codex stage needs this repo's
`.codex-plugin/` + `.agents/plugins/marketplace.json` to already be on the default
branch; before they are pushed, use `PLUGIN_SOURCE=local`.

## What it does

A fresh `node:24` container with **no `.npmrc` and no `@agent-ix` scope override**
(exactly an outside user's machine), with `gh` (≥ 2.90, GitHub's official apt
repo) and the Claude Code + Codex CLIs preinstalled:

1. **Stage 1 — public npm.** `npm install -g @agent-ix/quoin` from
   `registry.npmjs.org` and runs the `quoin` bin. Proves the published CLI and
   its full dependency tree resolve from public npm with zero auth.
2. **Stage 2 — Claude Code plugin.** `claude plugin marketplace add` + `plugin
install` (the CLI form of the README's `/plugin` steps) clone and install the
   plugin, then assert against [`expected.txt`](./expected.txt) (14 skills + 3
   workflows): every artifact is present in the plugin cache **and** — the part
   that matters to a user — each skill is exposed as a usable `/command` (from
   Claude's pre-auth `system/init` event: loaded `plugins[]`, `plugin_errors`,
   skills as `slash_commands`). A skill on disk but missing from the command list
   is a FAIL.
3. **Stage 3 — Codex / opencode / Copilot** ([`agents.sh`](./agents.sh)).
   Filesystem-install depth: each agent's documented install path runs and every
   `skill <name>` from `expected.txt` must land as a `SKILL.md` on disk (the 3
   workflow entries are a Claude-plugin concept and are not checked here).
   - **Codex** — `codex plugin marketplace add` + `codex plugin add
<plugin>@<marketplace>`, exercising this repo's `.codex-plugin/plugin.json`
     and `.agents/plugins/marketplace.json`. Git + local cache, no OpenAI auth.
   - **opencode** — `gh skill install <repo> --all --agent opencode`.
   - **GitHub Copilot** — `gh skill install <repo> --all --agent github-copilot`.

The cross-agent depth is intentionally filesystem-level (install succeeds + skill
files present) — the analog of the "skills present" half of the Claude check. The
richer "loaded and usable as a command" assertion stays Claude-specific.

## Auth

The Claude stage needs none — plugin install is plain git and the slash-command
check reads the pre-auth init event. The opencode/Copilot stages use **`gh skill`,
which authenticates with `GH_TOKEN`**: `run.sh` passes your `GH_TOKEN`/`GITHUB_TOKEN`
or `gh auth token` through to the container (read-only; never persisted in the
image). Without a token those two stages may fail or rate-limit. Codex needs no
auth for marketplace/plugin add.

(`run.sh` also bind-mounts `~/.claude/.credentials.json` read-only if present, so
the `claude -p` probe can complete a real turn on your subscription; optional,
changes no assertions.)

This complements the `agent-pty` evals (`make evals`), which measure a real
agent's token/tool/latency behavior; this harness only verifies installability.
