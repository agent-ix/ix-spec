---
type: log
title: "Update Log"
description: "Chronological log of structural changes to this bundle."
---

# Update Log

## History

- **2026-06-15** — Adopted OKF-compatible bundle structure with directory indexes.
- **2026-06-19** — Extended FR-001 with the explicit `quoin plugin ensure-defaults` command: performs the default-module lazy-install on demand and reports the registry, so external tools (e.g. `quire validate` lazy-init) trigger the bootstrap explicitly rather than via the `catalog`/`write` side effect. Updated the Module Store section and mapped `cli.test.ts` :: "ensure-defaults runs the installer and reports the registry" in matrix.md.
- **2026-06-21** — Spec overhaul: backported `quoin`'s behavior from `src/` and `tests/` into discrete, `/specify`-compliant artifact files. Added a stakeholder layer (`stakeholder/StR-001…006`), split the functional and non-functional requirements out of `spec.md` into `functional/FR-001…023` and `non-functional/NFR-001…008` (FR/NFR IDs unchanged; FR-023 runtime-configuration added; FR-016 typed `data_schema`, FR-023 typed `configuration`), and added an integration-test layer (`integration/IT-001…002`) for the live-git boundaries. Rewrote `spec.md` as the master-requirements index in positive "what the system does" language (Out of Scope → Delegated Responsibilities) and added per-directory indexes.
