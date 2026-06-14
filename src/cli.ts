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
`;

export async function main(argv: string[]): Promise<void> {
  const parsed = parseArgs(argv);
  if (!parsed.command || parsed.flags.help || parsed.flags.h) {
    console.log(USAGE);
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
