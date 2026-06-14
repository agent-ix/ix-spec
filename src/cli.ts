import { configureRuntimeContext } from "@agent-ix/ix-cli-core";

import { findCatalogEntry, ixHome, loadCatalog } from "./catalog.js";
import { installPlugin, listPlugins, removePlugin } from "./plugins.js";
import { specFlowNames, startSpecFlow } from "./flows.js";

interface ParsedArgs {
  command?: string;
  subcommand?: string;
  positionals: string[];
  flags: Record<string, string | boolean | string[]>;
}

const USAGE = `ix-spec

Spec workflow and catalog CLI for Agent IX.

ix-spec starts spec-domain work. ix-flow resumes, advances, acknowledges gates,
and inspects workflow runs created by ix-spec.

Built in by default:
  Artifact modules: spec-artifacts-iso, spec-artifacts-app, spec-artifacts-process
  Object modules:   spec-objects-business, spec-objects-architecture,
                    spec-objects-enterprise, spec-objects-operational,
                    spec-objects-security
  Workflows:        write-fr, write-us, write-nfr, write-str, write-it,
                    review, matrix, to-plan

Usage:
  ix-spec catalog list|validate
  ix-spec catalog show <type>
  ix-spec plugin install <path:...|github:...|package:...>
  ix-spec plugin list
  ix-spec plugin remove <name>
  ix-spec write-fr|write-us|write-nfr|write-str|write-it [--target <ref>...]
  ix-spec review|matrix|to-plan [--target <ref>...]

Global flags:
  --json
  --config-root <dir>     Defaults to ~/.ix

Examples:
  ix-spec catalog list
  ix-spec catalog show FR
  ix-spec plugin install github:agent-ix/spec-objects-custom
  ix-spec write-fr --target spec/spec.md
  ix-flow status <run-id>
`;

const CATALOG_USAGE = `ix-spec catalog

Inspect the active artifact/object catalog.

The catalog is assembled from, in order:
  1. IX_SPEC_MODULE_PATHS
  2. user/community modules installed under ~/.ix/modules
  3. bundled root artifact/object modules shipped with ix-spec
  4. sibling dev repositories, when present

Bundled artifact modules:
  spec-artifacts-iso       FR, NFR, StR, US, IT, TC, AC, CON, Spec
  spec-artifacts-app       app-level artifacts
  spec-artifacts-process   plans, reviews, matrices, ADRs, tasks, findings

Bundled object modules:
  spec-objects-business
  spec-objects-architecture
  spec-objects-enterprise
  spec-objects-operational
  spec-objects-security

Usage:
  ix-spec catalog list
  ix-spec catalog show <type>
  ix-spec catalog validate

Examples:
  ix-spec catalog show FR
  ix-spec catalog show entity
  ix-spec catalog validate --json
`;

const PLUGIN_USAGE = `ix-spec plugin

Install and manage user/community spec modules.

Root artifact/object modules are already bundled with ix-spec and do not appear
in "plugin list". Plugins are for additions or overrides stored under ~/.ix.

Supported install sources:
  path:<dir>             Use a local directory containing manifest.yaml
  github:<owner>/<repo>  Clone a GitHub repository
  github:<owner>/<repo>@<ref>
  package:<name>         Install an npm package containing a spec module

Usage:
  ix-spec plugin install <path:...|github:...|package:...>
  ix-spec plugin list
  ix-spec plugin remove <name>

Examples:
  ix-spec plugin install path:../spec-objects-custom
  ix-spec plugin install github:agent-ix/spec-objects-custom
  ix-spec plugin list
`;

const FLOW_USAGE = `ix-spec workflows

Start bundled spec workflows. ix-spec creates the workflow run in ~/.ix/flows.
Use ix-flow to inspect, resume, advance phases, and acknowledge human gates.

Available workflow launchers:
  write-fr    Create a Functional Requirement artifact
  write-us    Create a Use Case artifact
  write-nfr   Create a Non-Functional Requirement artifact
  write-str   Create a Stakeholder Requirement artifact
  write-it    Create an Integration Test intent artifact
  review      Run a composite spec review
  matrix      Build or update a requirements test matrix
  to-plan     Convert accepted requirements into an implementation plan

Usage:
  ix-spec write-fr|write-us|write-nfr|write-str|write-it [--target <ref>...]
  ix-spec review|matrix|to-plan [--target <ref>...]

Examples:
  ix-spec write-fr --target spec/spec.md
  ix-spec review --target spec/
  ix-spec matrix --target spec/
  ix-flow status <run-id>
  ix-flow resume <run-id>
`;

export async function main(argv: string[]): Promise<void> {
  const parsed = parseArgs(argv);
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
  if (specFlowNames().includes(parsed.command)) {
    return startSpecFlow(parsed.command, {
      json: parsed.flags.json === true,
      id: stringFlag(parsed, "id"),
      target: arrayFlag(parsed, "target"),
    });
  }
  throw new Error(`unknown command ${parsed.command}\n\n${USAGE}`);
}

function helpFor(parsed: ParsedArgs): string {
  if (parsed.command === "catalog") return CATALOG_USAGE;
  if (parsed.command === "plugin") return PLUGIN_USAGE;
  if (specFlowNames().includes(parsed.command ?? "")) return FLOW_USAGE;
  return USAGE;
}

function runCatalog(parsed: ParsedArgs): void {
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
      if (key === "target")
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
  const value = parsed.flags[key];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}
