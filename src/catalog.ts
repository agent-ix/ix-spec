import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse as parseYaml } from "yaml";

export interface SpecCatalogEntry {
  name: string;
  kind: "artifact" | "object";
  moduleName: string;
  moduleRoot: string;
  schemaRef?: string;
  skeletonPath?: string;
}

export interface SpecModule {
  name: string;
  version?: string;
  root: string;
  artifactTypes: string[];
  objectTypes: string[];
}

export interface SpecCatalog {
  modules: SpecModule[];
  entries: SpecCatalogEntry[];
  duplicates: Array<{
    kind: "artifact" | "object";
    name: string;
    modules: string[];
  }>;
}

const BASE_MODULE_REPOS = [
  ["spec-artifacts-iso", "spec_artifacts_iso"],
  ["spec-artifacts-app", "spec_artifacts_app"],
  ["spec-artifacts-process", "spec_artifacts_process"],
  ["spec-objects-business", "spec_objects_business"],
  ["spec-objects-architecture", "spec_objects_architecture"],
  ["spec-objects-enterprise", "spec_objects_enterprise"],
  ["spec-objects-operational", "spec_objects_operational"],
  ["spec-objects-security", "spec_objects_security"],
] as const;

export function ixHome(): string {
  return process.env.IX_HOME && process.env.IX_HOME.length > 0
    ? process.env.IX_HOME
    : join(homedir(), ".ix");
}

export function defaultModuleRoots(
  cwd = process.cwd(),
  home = ixHome(),
): string[] {
  const roots: string[] = [];
  const env = process.env.IX_SPEC_MODULE_PATHS;
  if (env) roots.push(...env.split(":").filter(Boolean));

  const installed = join(home, "modules");
  if (existsSync(installed)) {
    for (const name of readdirSync(installed))
      roots.push(join(installed, name));
  }

  roots.push(...packagedModuleRoots());

  const devRoot = dirname(resolve(cwd));
  for (const [repo, pkg] of BASE_MODULE_REPOS) {
    roots.push(join(devRoot, repo, pkg));
  }
  return roots;
}

export function loadCatalog(moduleRoots = defaultModuleRoots()): SpecCatalog {
  const modules: SpecModule[] = [];
  const entries: SpecCatalogEntry[] = [];
  const seenRoots = new Set<string>();
  const seenModuleNames = new Set<string>();

  for (const candidate of moduleRoots) {
    const moduleRoot = locateModuleRoot(candidate);
    if (!moduleRoot || seenRoots.has(moduleRoot)) continue;
    seenRoots.add(moduleRoot);

    const manifestPath = join(moduleRoot, "manifest.yaml");
    const manifest = parseYaml(readFileSync(manifestPath, "utf8")) as Record<
      string,
      unknown
    >;
    const moduleName = stringValue(manifest.name) ?? basename(moduleRoot);
    if (seenModuleNames.has(moduleName)) continue;
    seenModuleNames.add(moduleName);

    const artifactTypes = arrayObjects(manifest.artifact_types);
    const objectTypes = arrayObjects(manifest.object_types);

    modules.push({
      name: moduleName,
      version: stringValue(manifest.version),
      root: moduleRoot,
      artifactTypes: artifactTypes.map((entry) => String(entry.name)),
      objectTypes: objectTypes.map((entry) => String(entry.name)),
    });

    for (const artifact of artifactTypes) {
      const name = String(artifact.name);
      entries.push({
        name,
        kind: "artifact",
        moduleName,
        moduleRoot,
        schemaRef: stringValue(artifact.frontmatter_schema_ref),
        skeletonPath: skeletonPath(moduleRoot, name),
      });
    }
    for (const object of objectTypes) {
      const name = String(object.name);
      entries.push({
        name,
        kind: "object",
        moduleName,
        moduleRoot,
        skeletonPath: skeletonPath(moduleRoot, name),
      });
    }
  }

  return { modules, entries, duplicates: findDuplicates(entries) };
}

function packagedModuleRoots(): string[] {
  const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
  return BASE_MODULE_REPOS.map(([, pkg]) =>
    join(packageRoot, "builtin-modules", pkg),
  );
}

export function findCatalogEntry(
  catalog: SpecCatalog,
  name: string,
): SpecCatalogEntry | undefined {
  return catalog.entries.find((entry) => entry.name === name);
}

function locateModuleRoot(candidate: string): string | undefined {
  const root = resolve(candidate);
  if (!existsSync(root)) return undefined;
  if (existsSync(join(root, "manifest.yaml"))) return root;
  if (!statSync(root).isDirectory()) return undefined;
  for (const child of readdirSync(root)) {
    const childRoot = join(root, child);
    if (existsSync(join(childRoot, "manifest.yaml"))) return childRoot;
  }
  return undefined;
}

function skeletonPath(
  moduleRoot: string,
  typeName: string,
): string | undefined {
  const candidates = [
    join(moduleRoot, "skeletons", `${typeName}.md`),
    join(moduleRoot, "skeletons", `${typeName.toLowerCase()}.md`),
  ];
  return candidates.find((path) => existsSync(path));
}

function arrayObjects(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is Record<string, unknown> =>
          !!entry && typeof entry === "object" && "name" in entry,
      )
    : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function findDuplicates(
  entries: SpecCatalogEntry[],
): SpecCatalog["duplicates"] {
  const grouped = new Map<string, Set<string>>();
  for (const entry of entries) {
    const key = `${entry.kind}:${entry.name}`;
    const modules = grouped.get(key) ?? new Set<string>();
    modules.add(entry.moduleName);
    grouped.set(key, modules);
  }
  return [...grouped.entries()]
    .filter(([, modules]) => modules.size > 1)
    .map(([key, modules]) => {
      const [kind, name] = key.split(":") as ["artifact" | "object", string];
      return { kind, name, modules: [...modules].sort() };
    });
}
