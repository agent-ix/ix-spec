import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  createAuthoringPack,
  defaultModuleRoots,
  findCatalogEntry,
  loadCatalog,
  main,
} from "../src";

test("exports the ix-spec CLI entrypoint", () => {
  expect(typeof main).toBe("function");
});

test("loads packaged spec artifact and object modules without workspace siblings", () => {
  const isolatedHome = mkdtempSync(join(tmpdir(), "ix-spec-catalog-"));
  const isolatedCwd = mkdtempSync(join(tmpdir(), "ix-spec-cwd-"));
  const catalog = loadCatalog(defaultModuleRoots(isolatedCwd, isolatedHome));
  expect(findCatalogEntry(catalog, "FR")?.kind).toBe("artifact");
  expect(findCatalogEntry(catalog, "fr")?.kind).toBe("artifact");
  expect(findCatalogEntry(catalog, "entity")?.kind).toBe("object");
  expect(catalog.modules.map((module) => module.name)).toContain(
    "spec-artifacts-iso",
  );
  expect(catalog.modules.map((module) => module.name)).toContain(
    "spec-objects-business",
  );
});

test("creates authoring packs for case-insensitive artifact and object types", () => {
  const isolatedHome = mkdtempSync(join(tmpdir(), "ix-spec-write-"));
  const isolatedCwd = mkdtempSync(join(tmpdir(), "ix-spec-write-cwd-"));
  const catalog = loadCatalog(defaultModuleRoots(isolatedCwd, isolatedHome));
  const pack = createAuthoringPack(catalog, isolatedCwd, ["fr", "DOMAIN"]);
  expect(pack.repoRoot).toBe(isolatedCwd);
  expect(pack.types.map((type) => type.name)).toEqual(["FR", "domain"]);
  expect(pack.types[0]?.schemaPath).toContain("fr-frontmatter.schema.json");
  expect(pack.types[0]?.skeletonPath).toContain("skeletons/fr.md");
  expect(pack.validation.command).toContain("quire validate --scope");
});
