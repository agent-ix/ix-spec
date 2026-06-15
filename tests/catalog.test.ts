import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { stringify as stringifyYaml } from "yaml";

import {
  defaultModuleRoots,
  filamentModulesDir,
  findCatalogEntry,
  ixHome,
  loadCatalog,
} from "../src/catalog";

function tmp(prefix: string): string {
  return mkdtempSync(join(tmpdir(), `ix-spec-${prefix}-`));
}

function writeModule(
  dir: string,
  body: Record<string, unknown>,
  files: Record<string, string> = {},
): string {
  mkdirSync(join(dir, "skeletons"), { recursive: true });
  writeFileSync(join(dir, "manifest.yaml"), stringifyYaml(body));
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(join(dir, file, ".."), { recursive: true });
    writeFileSync(join(dir, file), content);
  }
  return dir;
}

describe("ixHome", () => {
  const original = process.env.IX_HOME;
  afterEach(() => {
    if (original === undefined) delete process.env.IX_HOME;
    else process.env.IX_HOME = original;
  });

  test("uses IX_HOME when set and non-empty", () => {
    process.env.IX_HOME = "/custom/home";
    expect(ixHome()).toBe("/custom/home");
    expect(filamentModulesDir()).toBe("/custom/home/filament/modules");
  });

  test("falls back to ~/.ix when IX_HOME is unset", () => {
    delete process.env.IX_HOME;
    expect(ixHome()).toBe(join(homedir(), ".ix"));
  });

  test("falls back to ~/.ix when IX_HOME is empty", () => {
    process.env.IX_HOME = "";
    expect(ixHome()).toBe(join(homedir(), ".ix"));
  });
});

describe("defaultModuleRoots", () => {
  const originalPaths = process.env.IX_SPEC_MODULE_PATHS;
  afterEach(() => {
    if (originalPaths === undefined) delete process.env.IX_SPEC_MODULE_PATHS;
    else process.env.IX_SPEC_MODULE_PATHS = originalPaths;
  });

  test("includes IX_SPEC_MODULE_PATHS entries and installed module dirs", () => {
    const home = tmp("home");
    const installed = filamentModulesDir(home);
    writeModule(join(installed, "spec-objects-business"), {
      name: "spec-objects-business",
      object_types: [{ name: "domain" }],
    });
    const extraRoot = tmp("extra");
    process.env.IX_SPEC_MODULE_PATHS = `${extraRoot}::`; // trailing empties filtered
    const roots = defaultModuleRoots(home);
    expect(roots).toContain(extraRoot);
    expect(roots).toContain(join(installed, "spec-objects-business"));
  });

  test("omits installed dirs when none have been installed", () => {
    delete process.env.IX_SPEC_MODULE_PATHS;
    const home = tmp("empty-home");
    expect(defaultModuleRoots(home)).toEqual([]);
  });
});

describe("loadCatalog", () => {
  test("discovers a manifest one level deep under a candidate dir", () => {
    const parent = tmp("nested");
    writeModule(join(parent, "inner"), {
      name: "spec-objects-business",
      object_types: [{ name: "domain" }],
    });
    const catalog = loadCatalog([parent]);
    expect(catalog.modules.map((m) => m.name)).toEqual([
      "spec-objects-business",
    ]);
    expect(findCatalogEntry(catalog, "domain")?.kind).toBe("object");
  });

  test("skips a non-manifest child while scanning one level deep, then finds the manifest sibling", () => {
    const parent = tmp("nested-mixed");
    // A child with no manifest (loop must skip it) plus a sibling that has one.
    mkdirSync(join(parent, "00-empty-child"), { recursive: true });
    writeModule(join(parent, "01-real"), {
      name: "spec-objects-business",
      object_types: [{ name: "domain" }],
    });
    const catalog = loadCatalog([parent]);
    expect(catalog.modules.map((m) => m.name)).toEqual([
      "spec-objects-business",
    ]);
  });

  test("skips candidates that do not resolve to a module root", () => {
    const missing = join(tmp("none"), "missing");
    const empty = tmp("empty-dir"); // exists, no manifest, no nested manifest
    const catalog = loadCatalog([missing, empty]);
    expect(catalog.modules).toEqual([]);
  });

  test("skips a candidate that is a file, not a directory", () => {
    const dir = tmp("file-candidate");
    const file = join(dir, "afile.txt");
    writeFileSync(file, "hi");
    const catalog = loadCatalog([file]);
    expect(catalog.modules).toEqual([]);
  });

  test("handles modules with and without a version and artifacts with/without schemaRef", () => {
    const root = tmp("versions");
    writeModule(
      join(root, "with-version"),
      {
        name: "with-version",
        version: "9.9.9",
        artifact_types: [
          { name: "FR", frontmatter_schema_ref: "schemas/fr.json" },
        ],
      },
      { "schemas/fr.json": "{}" },
    );
    writeModule(join(root, "no-version"), {
      name: "no-version",
      // no version field, artifact with no schema ref
      artifact_types: [{ name: "AC" }],
    });
    const catalog = loadCatalog([
      join(root, "with-version"),
      join(root, "no-version"),
    ]);
    const versioned = catalog.modules.find((m) => m.name === "with-version");
    const unversioned = catalog.modules.find((m) => m.name === "no-version");
    expect(versioned?.version).toBe("9.9.9");
    expect(unversioned?.version).toBeUndefined();
    expect(findCatalogEntry(catalog, "FR")?.schemaPath).toContain(
      "schemas/fr.json",
    );
    expect(findCatalogEntry(catalog, "AC")?.schemaPath).toBeUndefined();
  });

  test("deduplicates repeated module roots and module names", () => {
    const root = tmp("dedup");
    const dir = writeModule(join(root, "mod"), {
      name: "dup-name",
      object_types: [{ name: "domain" }],
    });
    // Same root listed twice -> seenRoots dedup; a second dir with the same
    // declared name -> seenModuleNames dedup.
    const otherDir = writeModule(join(root, "mod2"), {
      name: "dup-name",
      object_types: [{ name: "entity" }],
    });
    const catalog = loadCatalog([dir, dir, otherDir]);
    expect(catalog.modules).toHaveLength(1);
    expect(catalog.modules[0]?.name).toBe("dup-name");
    // entity from the duplicate-named module is not added.
    expect(findCatalogEntry(catalog, "entity")).toBeUndefined();
  });

  test("falls back to the directory basename when manifest has no name", () => {
    const root = tmp("noname");
    writeModule(join(root, "anon-module"), {
      object_types: [{ name: "domain" }],
    });
    const catalog = loadCatalog([join(root, "anon-module")]);
    expect(catalog.modules[0]?.name).toBe("anon-module");
  });

  test("ignores non-array and malformed type entries", () => {
    const root = tmp("malformed");
    writeModule(join(root, "mod"), {
      name: "mod",
      artifact_types: "not-an-array",
      object_types: [{ name: "domain" }, "string-entry", { noName: true }],
    });
    const catalog = loadCatalog([join(root, "mod")]);
    expect(catalog.modules[0]?.artifactTypes).toEqual([]);
    expect(catalog.modules[0]?.objectTypes).toEqual(["domain"]);
  });
});

describe("findDuplicates", () => {
  test("reports a type declared by two modules", () => {
    const root = tmp("dups");
    writeModule(join(root, "a"), {
      name: "module-a",
      object_types: [{ name: "domain" }],
    });
    writeModule(join(root, "b"), {
      name: "module-b",
      object_types: [{ name: "domain" }],
    });
    const catalog = loadCatalog([join(root, "a"), join(root, "b")]);
    expect(catalog.duplicates).toEqual([
      { kind: "object", name: "domain", modules: ["module-a", "module-b"] },
    ]);
  });

  test("reports no duplicates when type names are unique", () => {
    const root = tmp("nodups");
    writeModule(join(root, "a"), {
      name: "module-a",
      object_types: [{ name: "domain" }],
    });
    writeModule(join(root, "b"), {
      name: "module-b",
      object_types: [{ name: "entity" }],
    });
    const catalog = loadCatalog([join(root, "a"), join(root, "b")]);
    expect(catalog.duplicates).toEqual([]);
  });
});
