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
  document conforms to.
- Use catalog skeletons and schemas rather than memory.
- Keep workflow definitions out of artifact/object type vocabularies.
- Validate every created or edited artifact with Quire.
- Use `spec-review` after validation for quality, consistency, and completeness review.

## Reserved OKF Files

`spec-artifacts-iso` ships two reserved archetypes for the OKF folder structure;
author them like any other type:

- `index.md` — `type: index`, body is a `## Contents` link list pointing at the
  artifacts in the folder.
- `log.md` — `type: log`, body is a `## History` of changes to the folder's specs.

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
