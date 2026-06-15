// Fixture helpers for scenario `setup(ctx)` hooks (brownfield edits, broken files,
// local plugins, sibling dev modules). Ported/adapted from the old deterministic
// runner.

import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** Copy a module skeleton (from the snapshotted modules) into the scenario repo. */
export function copySkeleton(ctx, moduleName, skeletonFile, repoRelTarget) {
  const src = join(ctx.modulesDir, moduleName, "skeletons", skeletonFile);
  const target = join(ctx.repo, repoRelTarget);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(src, target);
  return target;
}

/**
 * Multi-repo workspace: create `work/<name>/spec` for each name and repoint the
 * agent cwd + validation scope at `work` (the parent holding all sub-repos).
 * Returns the sub-repo names.
 */
export function makeRepos(ctx, names) {
  for (const name of names) {
    mkdirSync(join(ctx.work, name, "spec"), { recursive: true });
  }
  ctx.cwd = ctx.work;
  ctx.scope = ctx.work;
  ctx.data.repos = names;
  return names;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Remove a `## <heading>` section (through to the next `## ` or EOF). */
export function removeSection(absPath, heading) {
  const text = readFileSync(absPath, "utf8");
  const pattern = new RegExp(
    `\\n## ${escapeRegExp(heading)}\\n[\\s\\S]*?(?=\\n## |$)`,
  );
  writeFileSync(absPath, text.replace(pattern, "\n"));
}

/** Build a local plugin fixture dir with one object type + skeleton. Returns its root. */
export function makeLocalPlugin(parentDir, moduleName, typeName, marker = "") {
  const rootDir = join(parentDir, moduleName);
  mkdirSync(join(rootDir, "skeletons"), { recursive: true });
  writeFileSync(
    join(rootDir, "manifest.yaml"),
    `manifest_version: 1.0.0
name: ${moduleName}
version: 0.0.1
artifact_types: []
object_types:
  - name: ${typeName}
    data_schema:
      type: object
    body_extraction:
      yield_pattern:
        match:
          id:
            from: frontmatter_field
            path: [id]
            required: true
          title:
            from: frontmatter_field
            path: [title]
            required: true
          artifact_type:
            from: frontmatter_field
            path: [artifact_type]
            required: true
          summary:
            from: section_body
            after_heading: Summary
            required: true
`,
  );
  writeFileSync(
    join(rootDir, "skeletons", `${typeName}.md`),
    `---
id: ${typeName}-001
title: "${typeName} fixture"
artifact_type: ${typeName}
---
# [${typeName}-001] ${typeName} fixture

## Summary

${marker || `This ${typeName} fixture provides a deterministic plugin object.`}
`,
  );
  return rootDir;
}

/**
 * Build a sibling "dev" module that redefines an object `type`, reusing the REAL
 * installed skeleton (so it still validates against the real archetype) plus a
 * marker. Used to prove `IX_SPEC_MODULE_PATHS` is preferred over the default set.
 * Returns the dev module root (point IX_SPEC_MODULE_PATHS at it).
 */
export function makeDevModule(ctx, { moduleName, type, srcModule, marker }) {
  const root = join(ctx.work, moduleName);
  mkdirSync(join(root, "skeletons"), { recursive: true });
  const realSkeleton = readFileSync(
    join(ctx.modulesDir, srcModule, "skeletons", `${type}.md`),
    "utf8",
  );
  writeFileSync(
    join(root, "skeletons", `${type}.md`),
    `${realSkeleton.trimEnd()}\n\n<!-- ${marker} -->\n`,
  );
  writeFileSync(
    join(root, "manifest.yaml"),
    `manifest_version: 1.0.0
name: ${moduleName}
version: 0.0.1
artifact_types: []
object_types:
  - name: ${type}
    data_schema:
      type: object
`,
  );
  return root;
}
