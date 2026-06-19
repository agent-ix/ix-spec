---
type: log
title: "Update Log"
description: "Chronological log of structural changes to this bundle."
---

# Update Log

## History

- **2026-06-15** — Adopted OKF-compatible bundle structure with directory indexes.
- **2026-06-19** — Extended FR-001 with the explicit `quoin plugin ensure-defaults` command: performs the default-module lazy-install on demand and reports the registry, so external tools (e.g. `quire validate` lazy-init) trigger the bootstrap explicitly rather than via the `catalog`/`write` side effect. Updated the Module Store section and mapped `cli.test.ts` :: "ensure-defaults runs the installer and reports the registry" in matrix.md.
