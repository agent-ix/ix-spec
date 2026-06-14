import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, join, resolve } from "node:path";

import { parse as parseYaml } from "yaml";

import { ixHome } from "./catalog.js";

export interface InstalledSpecPlugin {
  name: string;
  source: string;
  moduleRoot?: string;
  installedAt: string;
}

interface PluginRegistry {
  plugins: InstalledSpecPlugin[];
}

export function registryPath(home = ixHome()): string {
  return join(home, "plugins", "registry.json");
}

export function listPlugins(home = ixHome()): InstalledSpecPlugin[] {
  return readRegistry(home).plugins;
}

export function removePlugin(name: string, home = ixHome()): void {
  const registry = readRegistry(home);
  registry.plugins = registry.plugins.filter((plugin) => plugin.name !== name);
  rmSync(join(home, "modules", name), { force: true, recursive: true });
  writeRegistry(registry, home);
}

export function installPlugin(
  source: string,
  home = ixHome(),
): InstalledSpecPlugin {
  mkdirSync(join(home, "plugins"), { recursive: true });
  mkdirSync(join(home, "modules"), { recursive: true });

  const moduleRoot = installSource(source, home);
  const name = readModuleName(moduleRoot);
  const target = join(home, "modules", name);
  if (!existsSync(target)) symlinkSync(moduleRoot, target, "dir");

  const registry = readRegistry(home);
  const plugin: InstalledSpecPlugin = {
    name,
    source,
    moduleRoot,
    installedAt: new Date().toISOString(),
  };
  registry.plugins = [
    ...registry.plugins.filter((entry) => entry.name !== name),
    plugin,
  ];
  writeRegistry(registry, home);
  return plugin;
}

function installSource(source: string, home: string): string {
  if (source.startsWith("path:")) return resolve(source.slice("path:".length));
  if (source.startsWith("github:"))
    return installGithub(source.slice("github:".length), home);
  if (source.startsWith("package:"))
    return installPackage(source.slice("package:".length), home);
  if (existsSync(source)) return resolve(source);
  throw new Error(`unsupported plugin source ${source}`);
}

function installGithub(ref: string, home: string): string {
  const [repoPart, checkout] = ref.split("@");
  const repo = repoPart.endsWith(".git") ? repoPart : `${repoPart}.git`;
  const url = repo.startsWith("http") ? repo : `https://github.com/${repo}`;
  const target = join(
    home,
    "plugins",
    "sources",
    "github.com",
    repoPart.replaceAll("/", "__"),
  );
  if (!existsSync(target)) {
    mkdirSync(join(target, ".."), { recursive: true });
    execFileSync("git", ["clone", "--depth", "1", url, target], {
      stdio: "inherit",
    });
  }
  if (checkout)
    execFileSync("git", ["-C", target, "checkout", checkout], {
      stdio: "inherit",
    });
  return target;
}

function installPackage(pkg: string, home: string): string {
  const prefix = join(home, "plugins", "packages");
  mkdirSync(prefix, { recursive: true });
  if (!existsSync(join(prefix, "package.json"))) {
    writeFileSync(
      join(prefix, "package.json"),
      JSON.stringify({ private: true }, null, 2),
    );
  }
  execFileSync("pnpm", ["add", pkg, "--prefix", prefix], { stdio: "inherit" });
  return join(prefix, "node_modules", pkg);
}

function readModuleName(moduleRoot: string): string {
  const manifestPath = existsSync(join(moduleRoot, "manifest.yaml"))
    ? join(moduleRoot, "manifest.yaml")
    : join(moduleRoot, basename(moduleRoot), "manifest.yaml");
  if (!existsSync(manifestPath))
    throw new Error(`no manifest.yaml found under ${moduleRoot}`);
  const manifest = parseYaml(readFileSync(manifestPath, "utf8")) as {
    name?: unknown;
  };
  if (typeof manifest.name !== "string" || manifest.name.length === 0) {
    throw new Error(`manifest ${manifestPath} has no name`);
  }
  return manifest.name;
}

function readRegistry(home: string): PluginRegistry {
  const path = registryPath(home);
  if (!existsSync(path)) return { plugins: [] };
  return JSON.parse(readFileSync(path, "utf8")) as PluginRegistry;
}

function writeRegistry(registry: PluginRegistry, home: string): void {
  const path = registryPath(home);
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, `${JSON.stringify(registry, null, 2)}\n`);
}
