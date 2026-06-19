# Community install smoke test

A clean-room, repeatable check that a brand-new developer can install `quoin`
from **public npm** and use it **inside Claude Code** with no Agent-IX internal
config and no Anthropic API key.

```bash
make install-smoke                       # from the repo root (real community path)
PLUGIN_SOURCE=local ./smoke/run.sh       # validate the working tree (what CI runs)
PKG_VERSION=0.2.1 ./smoke/run.sh         # pin for byte-for-byte reproducibility
```

## Plugin source

- `PLUGIN_SOURCE=github` (default) installs the plugin from `agent-ix/quoin` on
  GitHub's default branch — the exact path a community user follows.
- `PLUGIN_SOURCE=local` installs the plugin from the mounted checkout — validates
  the manifest in *this* revision before it reaches the default branch. CI uses
  this (see `.github/workflows/install-smoke.yml`) so a PR's own changes are
  tested. No credentials needed; the live-load check is simply skipped.

## What it does

A fresh `node:24` container with **no `.npmrc` and no `@agent-ix` scope
override** (exactly an outside user's machine):

1. **Stage 1 — public npm.** `npm install -g @agent-ix/quoin` from
   `registry.npmjs.org` and runs the `quoin` bin. Proves the published CLI and
   its full dependency tree resolve from public npm with zero auth.
2. **Stage 2 — Claude plugin.** Configures the `/plugin marketplace add
   agent-ix/quoin` + `/plugin install quoin@quoin` flow non-interactively (via
   `~/.claude/settings.json` + `CLAUDE_CODE_SYNC_PLUGIN_INSTALL=1`) and lets
   Claude Code clone + install the plugin from the public GitHub repo.
3. **Assert.** Verifies the plugin cloned and every skill/workflow in
   [`expected.txt`](./expected.txt) is present (14 skills + 3 workflows). If the
   host's Claude subscription credential is available it also confirms the live
   session loaded the plugin.

## Auth

`run.sh` bind-mounts `~/.claude/.credentials.json` **read-only**; the token is
never read or extracted, so the live load-check runs on your subscription with
no API key. Marketplace cloning is plain git on a public repo, so the
"skills present" assertions pass even without credentials — only the bonus
live-load confirmation needs them.

This complements the `agent-pty` evals (`make evals`), which measure a real
agent's token/tool/latency behavior; this harness only verifies installability.
