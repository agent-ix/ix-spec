import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
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
  expect(findCatalogEntry(catalog, "entity")?.kind).toBe("object");
  expect(catalog.modules.map((module) => module.name)).toContain(
    "spec-artifacts-iso",
  );
  expect(catalog.modules.map((module) => module.name)).toContain(
    "spec-objects-business",
  );
});
