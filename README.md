# IX Spec

`ix-spec` is the focused spec-domain CLI for Agent IX. It owns spec catalog
discovery, spec module/plugin install state, bundled root artifact/object
vocabulary, and agent-facing authoring contracts for direct spec work.

The workflow lifecycle itself is handled by `ix-flow`.

## Install

Install `ix-spec` with `ix-flow` so the spec launcher and workflow lifecycle
commands are both available:

```bash
npm install -g @agent-ix/ix-spec@latest @agent-ix/ix-flow@latest --registry https://npm.pkg.github.com
```

## Usage

```bash
ix-spec catalog list
ix-spec catalog show FR
ix-spec catalog validate
ix-spec plugin install path:../spec-objects-business
ix-spec plugin list
ix-spec write . --types FR,domain,entity
ix-spec review
ix-spec matrix
ix-spec to-plan
```

Config, plugin registry, installed modules, and workflow state default to
`~/.ix`. Use `--config-root <dir>` for isolated runs.

### New features (OKF)

- **Author reserved OKF index/log files.** `index` and `log` are first-class
  archetypes declared by `spec-artifacts-iso`, so they resolve through the
  normal catalog like any other type — there is no special allowlist:

  ```bash
  ix-spec write . --types index   # OKF directory index.md (type: index)
  ix-spec write . --types log     # OKF change log.md (type: log)
  ```

  `write` returns the `index`/`log` skeleton + schema paths from the catalog;
  author the file directly using that contract. By OKF convention every
  directory carries an `index.md` listing its sibling artifacts, and the
  bundle-root `index.md` carries an `okf_version` field.

- **Typed optional frontmatter.** quire-rs (v0.6.0+) ships a base "concept"
  frontmatter schema that all archetypes inherit: `type` is **required and
  non-empty** (it is the OKF discriminator), and the optional `description`
  (string) and `tags` (string array) fields are typed and validated. Set them
  in any spec file's frontmatter; quire validates their types.

- **Read foreign OKF bundles.** `quire validate --okf <bundle>` runs a
  permissive OKF posture for bundles authored elsewhere: unknown `type`s,
  broken `ix://` links, and `index.md` completeness gaps become **warnings**
  (untyped documents are still errors). The same command runs an
  **index-completeness check** — every directory's `index.md` must list its
  sibling artifacts and the bundle-root `index.md` must declare `okf_version`.
  This completeness/validation check lives entirely in quire; ix-spec only
  authors the files. (The per-file scope validation that `ix-spec write`
  prints — `quire validate --scope <repo> "spec/**/*.md"` — is the strict
  posture for the repo you own; `--okf` is for reading bundles you don't.)

## Plugin / module system

`ix-spec` has no built-in artifact/object vocabulary. All types come from
**Filament modules** discovered at runtime: a committed default set plus any
user/community plugins.

### How a module is declared

A module is a directory containing `manifest.yaml`:

| Field                             | Purpose                                                       |
| --------------------------------- | ------------------------------------------------------------- |
| `name`                            | Module identity (used for dedupe and as the registry key).    |
| `version`                         | Module version (shown by `catalog list`).                     |
| `artifact_types` / `object_types` | Lists of `{ name, frontmatter_schema_ref? }` entries.         |
| `<type>.frontmatter_schema_ref`   | Path (relative to the module root) to the type's JSON Schema. |
| `skeletons/<type>.md`             | The skeleton resolved for that type by `write`.               |

For each declared type, the catalog resolves a `skeletonPath`
(`skeletons/<type>.md`, case-insensitive) and, for artifacts, a `schemaPath`
from `frontmatter_schema_ref`. Type lookup is case-insensitive everywhere.

### Default module set

The committed `default-modules.yaml` is the canonical default set. Each entry
is a `git-subdir` source pinned to the same tag its Python wheel is built from.
On first catalog access (`catalog` or `write`), `ensureDefaultModules()` lazily
reconciles that set via `@agent-ix/ts-plugin-kit` into
`~/.ix/filament/modules/<name>/`. Reconcile is idempotent and does **no git
once each module is installed and pinned**, so repeated invocations are
offline-safe.

### Where state lives

- **Module store:** `~/.ix/filament/modules/` — one directory per installed
  module. This is the **same directory quire-rs reads**, so authoring and
  validation see an identical catalog.
- **Plugin registry:** `~/.ix/filament/registry.json` — install records, owned
  by `ts-plugin-kit`.
- `--config-root <dir>` (or `IX_HOME`) relocates the whole `~/.ix` tree for
  isolated runs.

### Catalog discovery order

The catalog is assembled from module roots in order:

1. `IX_SPEC_MODULE_PATHS` — colon-separated dev/override roots.
2. `~/.ix/filament/modules` — installed modules (default set + plugins).

The first module to claim a given `name` wins; duplicates across modules are
reported by `catalog validate`.

### Managing plugins

```bash
ix-spec plugin install <source>   # install/update a module
ix-spec plugin list               # list installed plugins (from registry.json)
ix-spec plugin remove <name>      # remove module dir + registry record
```

Install source forms:

| Source                            | Meaning                                                   |
| --------------------------------- | --------------------------------------------------------- |
| `path:<dir>`                      | Local directory containing `manifest.yaml`.               |
| `github:<owner>/<repo>`           | GitHub repo with `manifest.yaml` at its root.             |
| `github:<owner>/<repo>@<ref>`     | Pin to a tag, branch, or sha.                             |
| `github:<owner>/<repo>//<subdir>` | `manifest.yaml` in a monorepo subdirectory (`@<ref>` ok). |

A bare argument (no prefix) is treated as `path:`. (A `package:`/npm form is
forward-declared but `ts-plugin-kit` does not yet support npm sources, so it
fails at install time; it is not advertised.)

## Development

```bash
pnpm install
pnpm run build
pnpm test
pnpm run lint
```

This package builds on `@agent-ix/ix-cli-core` from the standalone
`ix-cli-core` repo. `ix-spec write` prints compact skeleton/schema/module paths
so agents can author files directly and validate changed spec files with Quire.
The eval scenarios are defined in `spec/evals.md` and run by the agent-pty-driven
harness in `evals/` (`make evals` / `make evals-all`): it profiles a **real** agent
running the skills/workflows and records token/tool/latency metrics from the Claude
Code transcript. Unit tests cover the mechanical CLI behavior; see `evals/README.md`.
