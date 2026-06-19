import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { configureRuntimeContext } from "@agent-ix/ix-cli-core";

import { findCatalogEntry, ixHome, loadCatalog } from "./catalog.js";
import { ensureDefaultModules } from "./modules.js";
import { installPlugin, listPlugins, removePlugin } from "./plugins.js";
import { specFlowNames, startSpecFlow } from "./flows.js";
import {
  createAuthoringPack,
  formatAuthoringPack,
  parseTypeList,
} from "./write.js";

interface ParsedArgs {
  command?: string;
  subcommand?: string;
  positionals: string[];
  flags: Record<string, string | boolean | string[]>;
}

const USAGE = `quoin

Spec workflow and catalog CLI for Agent IX.

quoin starts spec-domain work. ix-flow resumes, advances, acknowledges gates,
and inspects workflow runs created by quoin.

Default modules (installed on first use into ~/.ix/filament/modules):
  Artifact modules: spec-artifacts-iso, spec-artifacts-app, spec-artifacts-process
  Object modules:   spec-objects-business, spec-objects-architecture,
                    spec-objects-enterprise, spec-objects-operational,
                    spec-objects-security
  Workflows:        review, matrix, to-plan

Usage:
  quoin write <repo_dir> --types <type[,type...]>
  quoin catalog list|validate
  quoin catalog show <type>
  quoin plugin install <path:...|github:...>
  quoin plugin list
  quoin plugin remove <name>
  quoin review|matrix|to-plan [--target <ref>...]

Global flags:
  --json
  --config-root <dir>     Defaults to ~/.ix

Examples:
  quoin catalog list
  quoin catalog show FR
  quoin plugin install github:agent-ix/spec-objects-custom
  quoin write . --types FR,domain
  ix-flow status <run-id>
`;

const WRITE_USAGE = `quoin write

Build an authoring pack for spec files an agent is about to create or edit.

Pass the target repository and the artifact/object types involved in the work.
quoin resolves those types from the active catalog and returns the local
skeletons, schemas, module roots, and Quire validation command for the repo.

Usage:
  quoin write <repo_dir> --types <type[,type...]>

Examples:
  quoin write . --types FR
  quoin write . --types FR,domain,entity
  quoin write ../my-service --types fr,DOMAIN --json

Notes:
  - Type lookup is case-insensitive; FR and fr are the same type.
  - Types can be artifacts or objects from the default module set or plugins.
  - Use the returned skeletons and schemas as the authoring contract.
  - Run the returned Quire command after editing spec files.
`;

const CATALOG_USAGE = `quoin catalog

Inspect the active artifact/object catalog.

The catalog is assembled from, in order:
  1. QUOIN_MODULE_PATHS
  2. modules installed under ~/.ix/filament/modules

The default module set is installed there automatically on first catalog access,
and updated by "quoin plugin install". The same directory is read by quire-rs.

Default artifact modules:
  spec-artifacts-iso       FR, NFR, StR, US, IT, TC, AC, CON, Spec
  spec-artifacts-app       app-level artifacts
  spec-artifacts-process   plans, reviews, matrices, ADRs, tasks, findings

Default object modules:
  spec-objects-business
  spec-objects-architecture
  spec-objects-enterprise
  spec-objects-operational
  spec-objects-security

Usage:
  quoin catalog list
  quoin catalog show <type>
  quoin catalog validate

Examples:
  quoin catalog show FR
  quoin catalog show entity
  quoin catalog validate --json
`;

const PLUGIN_USAGE = `quoin plugin

Install and manage user/community spec modules.

Plugins add or override artifact/object modules under ~/.ix/filament/modules.
Use "catalog list" to see the full active catalog, including default modules and
plugins.

Supported install sources:
  path:<dir>                        Use a local directory containing manifest.yaml
  github:<owner>/<repo>             Clone a GitHub repository (manifest at root)
  github:<owner>/<repo>@<ref>       Pin to a tag, branch, or sha
  github:<owner>/<repo>//<subdir>   Manifest in a monorepo subdirectory (@<ref> ok)

Usage:
  quoin plugin install <path:...|github:...>
  quoin plugin list
  quoin plugin remove <name>
  quoin plugin ensure-defaults

Examples:
  quoin plugin install path:../spec-objects-custom
  quoin plugin install github:agent-ix/spec-objects-custom
  quoin plugin install github:agent-ix/spec-objects-security//spec_objects_security@v0.1.1
  quoin plugin list
  quoin plugin ensure-defaults
`;

const FLOW_USAGE = `quoin workflows

Start bundled spec review/planning workflows. quoin creates the workflow run in ~/.ix/flows.
Use ix-flow to inspect, resume, advance phases, and acknowledge human gates.

Available workflow launchers:
  review      Run a composite spec review
  matrix      Build or update a requirements test matrix
  to-plan     Convert accepted requirements into an implementation plan

Usage:
  quoin review|matrix|to-plan [--target <ref>...]

Examples:
  quoin review --target spec/
  quoin matrix --target spec/
  ix-flow status <run-id>
  ix-flow resume <run-id>
`;

export async function main(argv: string[]): Promise<void> {
  const parsed = parseArgs(argv);
  if (parsed.flags.version || parsed.flags.v || parsed.command === "version") {
    console.log(packageVersion());
    return;
  }
  if (!parsed.command) {
    console.log(USAGE);
    return;
  }
  if (parsed.flags.help || parsed.flags.h) {
    console.log(helpFor(parsed));
    return;
  }

  const home = stringFlag(parsed, "config-root") ?? ixHome();
  process.env.IX_HOME = home;
  configureRuntimeContext({
    configRoot: home,
    configNamespace: "ix",
    projectConfigRoot: `${process.cwd()}/.ix`,
    projectConfigEnabled: parsed.flags["no-project-config"] !== true,
  });

  if (parsed.command === "catalog") return runCatalog(parsed);
  if (parsed.command === "plugin") return runPlugin(parsed);
  if (parsed.command === "write") return runWrite(parsed);
  if (specFlowNames().includes(parsed.command)) {
    return startSpecFlow(parsed.command, {
      json: parsed.flags.json === true,
      id: stringFlag(parsed, "id"),
      target: arrayFlag(parsed, "target"),
    });
  }
  throw new Error(`unknown command ${parsed.command}\n\n${USAGE}`);
}

export function packageVersion(): string {
  const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
  const packageJson = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as { version?: unknown };
  if (typeof packageJson.version !== "string") {
    throw new Error("package.json version is missing");
  }
  return packageJson.version;
}

function helpFor(parsed: ParsedArgs): string {
  if (parsed.command === "write") return WRITE_USAGE;
  if (parsed.command === "catalog") return CATALOG_USAGE;
  if (parsed.command === "plugin") return PLUGIN_USAGE;
  // helpFor is only called after main() has returned early for
  // `!parsed.command`, so command is always defined here; the prior
  // `parsed.command ?? ""` fallback was an unreachable defensive branch.
  if (specFlowNames().includes(parsed.command as string)) return FLOW_USAGE;
  return USAGE;
}

function runWrite(parsed: ParsedArgs): void {
  const [repoDir] = parsed.positionals;
  if (!repoDir) throw new Error(`write requires <repo_dir>\n\n${WRITE_USAGE}`);
  ensureDefaultModules();
  const catalog = loadCatalog();
  const pack = createAuthoringPack(
    catalog,
    repoDir,
    parseTypeList(arrayFlag(parsed, "types")),
  );
  console.log(
    parsed.flags.json
      ? JSON.stringify(pack, null, 2)
      : formatAuthoringPack(pack),
  );
}

function runCatalog(parsed: ParsedArgs): void {
  ensureDefaultModules();
  const catalog = loadCatalog();
  switch (parsed.subcommand) {
    case "list":
    case undefined:
      if (parsed.flags.json) {
        console.log(JSON.stringify(catalog, null, 2));
        return;
      }
      for (const module of catalog.modules) {
        console.log(
          `${module.name}@${module.version ?? "unknown"} ${module.root}`,
        );
      }
      return;
    case "show": {
      const [name] = parsed.positionals;
      if (!name) throw new Error("catalog show requires <type>");
      const entry = findCatalogEntry(catalog, name);
      if (!entry) throw new Error(`catalog type not found: ${name}`);
      console.log(
        parsed.flags.json
          ? JSON.stringify(entry, null, 2)
          : `${entry.kind} ${entry.name} from ${entry.moduleName}\n${entry.moduleRoot}`,
      );
      return;
    }
    case "validate":
      if (catalog.duplicates.length > 0) {
        console.error(
          JSON.stringify(
            { ok: false, duplicates: catalog.duplicates },
            null,
            2,
          ),
        );
        process.exitCode = 1;
        return;
      }
      console.log(
        parsed.flags.json
          ? JSON.stringify(
              { ok: true, modules: catalog.modules.length },
              null,
              2,
            )
          : `catalog ok (${catalog.modules.length} modules)`,
      );
      return;
    default:
      throw new Error(`unknown catalog command ${parsed.subcommand}`);
  }
}

function runPlugin(parsed: ParsedArgs): void {
  switch (parsed.subcommand) {
    case "list":
    case undefined:
      console.log(JSON.stringify({ plugins: listPlugins() }, null, 2));
      return;
    case "install": {
      const [source] = parsed.positionals;
      if (!source) throw new Error("plugin install requires <source>");
      console.log(JSON.stringify(installPlugin(source), null, 2));
      return;
    }
    case "remove": {
      const [name] = parsed.positionals;
      if (!name) throw new Error("plugin remove requires <name>");
      removePlugin(name);
      console.log(`removed ${name}`);
      return;
    }
    case "ensure-defaults":
      // Idempotently materialize the default module set into
      // ~/.ix/filament/modules. Exposed as an explicit command so other tools
      // (notably `quire validate`) can lazy-install the defaults by shelling
      // out here, rather than relying on the side effect of `catalog list`.
      ensureDefaultModules();
      console.log(
        JSON.stringify(
          { ensured: true, plugins: listPlugins().map((p) => p.name) },
          null,
          2,
        ),
      );
      return;
    default:
      throw new Error(`unknown plugin command ${parsed.subcommand}`);
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const flags: ParsedArgs["flags"] = {};
  const positionals: string[] = [];
  let command: string | undefined;
  let subcommand: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      const key = arg.slice(2, eq === -1 ? undefined : eq);
      const value =
        eq !== -1
          ? arg.slice(eq + 1)
          : argv[i + 1] && !argv[i + 1].startsWith("-")
            ? argv[++i]
            : true;
      if (key === "target" || key === "types")
        flags[key] = [
          ...arrayFlag({ flags } as ParsedArgs, key),
          String(value),
        ];
      else flags[key] = value;
    } else if (arg.startsWith("-") && arg.length > 1) {
      flags[arg.slice(1)] = true;
    } else if (!command) {
      command = arg;
    } else if (!subcommand && (command === "catalog" || command === "plugin")) {
      subcommand = arg;
    } else {
      positionals.push(arg);
    }
  }
  return { command, subcommand, positionals, flags };
}

function stringFlag(parsed: ParsedArgs, key: string): string | undefined {
  const value = parsed.flags[key];
  return typeof value === "string" ? value : undefined;
}

function arrayFlag(parsed: ParsedArgs, key: string): string[] {
  // Only called for `target`/`types`, which parseArgs always stores as arrays
  // (or leaves undefined on the first occurrence). The previous
  // `typeof value === "string"` case was therefore unreachable.
  const value = parsed.flags[key];
  return Array.isArray(value) ? value : [];
}
