/// <reference types="vitest" />
import { execSync } from "node:child_process";
import { builtinModules } from "node:module";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Truthful version baked into the bundle at build time. `git describe` yields the
// bare tag on a clean release commit (e.g. v0.5.2) and a drift-revealing string
// otherwise (e.g. v0.5.1-3-gabc123-dirty); we strip the leading `v`. Only computed
// for `vite build` — under vitest (serve) it stays "" so packageVersion() exercises
// its package.json fallback. Empty on a no-git build (e.g. tarball) too.
function gitVersion(): string {
  try {
    return execSync("git describe --tags --dirty --always", {
      encoding: "utf8",
    })
      .trim()
      .replace(/^v/, "");
  } catch {
    return "";
  }
}

const external = [
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
  /^@agent-ix\//,
  /^@napi-rs\/keyring/,
  "@clack/prompts",
  "@oclif/core",
  "age-encryption",
  "react",
  "yaml",
  "zod",
];

export default defineConfig(({ command }) => ({
  define: {
    __QUOIN_VERSION__: JSON.stringify(command === "build" ? gitVersion() : ""),
  },
  plugins: [dts({ rollupTypes: true, include: ["src"] })],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        cli: "src/cli.ts",
      },
      name: "Ixspec",
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    target: "node18",
    rollupOptions: {
      external,
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,js}"],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
}));
