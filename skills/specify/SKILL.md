---
name: specify
description: Create or update spec files using ix-spec catalog authoring packs and Quire validation.
---

# Specify

Use this skill when turning an agreed design, feature, or change request into
spec artifacts and supporting spec objects.

## Process

1. Identify the repository that owns the spec files.
2. Identify every artifact and object type that will be created or edited.
3. Run `ix-spec write <repo_dir> --types <type[,type...]>` once for the full set of types.
4. Use the returned skeletons, schemas, module roots, and examples as the authoring contract.
5. Author or edit the files directly in the target repo.
6. Run `quire validate <glob> [glob2 ...]` over the changed spec scope.
7. Fix validation errors before moving to review, matrix, or planning work.

## Type Selection

Request all needed types together so the agent does not repeatedly fetch the
same templates.

Examples:

```bash
ix-spec write . --types FR,domain,entity
ix-spec write ../service --types StR,US,FR,NFR
ix-spec write . --types process,configuration,value_object
```

Type lookup is catalog-driven and case-insensitive. Types may come from bundled
`spec-artifacts-*`, bundled `spec-objects-*`, user-installed modules, or
community modules.

## Authoring Rules

- Let frontmatter identify exactly what each file is. The discriminator field is
  `type` (e.g. `type: FR`, `type: master-requirements`); it names the archetype the
  document conforms to. `type` is **required and non-empty** — quire treats a
  missing/empty `type` as an error.
- `description` (string) and `tags` (string array) are optional, typed
  frontmatter fields inherited by every archetype. Set them when useful; quire
  validates their types.
- Use catalog skeletons and schemas rather than memory.
- Keep workflow definitions out of artifact/object type vocabularies.
- Validate every created or edited artifact with Quire.
- Use `spec-review` after validation for quality, consistency, and completeness review.

## Reserved OKF Files

`spec-artifacts-iso` ships two reserved archetypes for the OKF folder structure.
They are first-class catalog types (no allowlist), so author them with `write`
like any other type:

```bash
ix-spec write . --types index   # resolves the index.md skeleton + schema
ix-spec write . --types log     # resolves the log.md skeleton + schema
```

- `index.md` — `type: index`, body is a `## Contents` link list pointing at the
  artifacts in the folder. By OKF convention every directory carries one and the
  bundle-root `index.md` declares an `okf_version` field.
- `log.md` — `type: log`, body is a `## History` of changes to the folder's specs.

## OKF Completeness & Validation

Two distinct validations, both owned by quire (ix-spec authors; quire validates):

- **Strict, for the repo you own:** `quire validate --scope <repo> "spec/**/*.md"`
  (the command `ix-spec write` prints). Use it after every authored/edited file.
- **Permissive, for foreign bundles you read:** `quire validate --okf <bundle>`.
  It downgrades unknown types, broken `ix://` links, and `index.md` completeness
  gaps to warnings (untyped docs stay errors) and runs the **index-completeness
  check** (each directory's `index.md` lists its siblings; the bundle root carries
  `okf_version`). Do **not** build a separate ix-spec completeness lint — this
  check lives in quire.

## Common Spec Layout

```text
spec/
├── spec.md
├── stakeholder/
├── usecase/
├── functional/
├── non-functional/
├── integration/
├── matrix/
└── analysis/
```
