import { findCatalogEntry, loadCatalog, main } from "../src";

test("exports the ix-spec CLI entrypoint", () => {
  expect(typeof main).toBe("function");
});

test("loads bundled spec artifact and object modules from the dev workspace", () => {
  const catalog = loadCatalog();
  expect(findCatalogEntry(catalog, "FR")?.kind).toBe("artifact");
  expect(findCatalogEntry(catalog, "entity")?.kind).toBe("object");
  expect(catalog.modules.map((module) => module.name)).toContain(
    "spec-artifacts-iso",
  );
  expect(catalog.modules.map((module) => module.name)).toContain(
    "spec-objects-business",
  );
});
