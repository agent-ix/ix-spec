#!/usr/bin/env node
/**
 * Help documentation for project scripts
 * Shows organized documentation for all available pnpm scripts
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Derive project name from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf8"),
);
const PKG_NAME = packageJson.name;
const PROJECT_SLUG = PKG_NAME.replace(/^@[^/]+\//, "");

console.log(`${PROJECT_SLUG} - Available Scripts`);
console.log("=".repeat(PROJECT_SLUG.length + 21) + "\n");

console.log("📋 CORE DEVELOPMENT");
console.log("  pnpm test              Run Jest tests");
console.log("  pnpm run test:coverage Run tests with coverage report");
console.log("  pnpm run test:json     Run tests and output JSON report");
console.log("  pnpm run lint          Lint TypeScript/React files");
console.log("  pnpm run format        Format all files with Prettier");
console.log("  pnpm run format:check  Check formatting without modifying");
console.log("  pnpm run build         Compile TypeScript and copy CSS");
console.log("  pnpm run clean         Remove all build artifacts\n");

console.log("📦 PACKAGE MANAGEMENT");
console.log("  pnpm install           Install dependencies");
console.log("  pnpm run install:frozen  Install with frozen lockfile (CI)");
console.log("  pnpm run update-lock   Update lockfile only");
console.log("  pnpm run pkg:add <pkg>       Add production dependency");
console.log("  pnpm run pkg:add-dev <pkg>   Add dev dependency");
console.log("  pnpm run pkg:update          Update dependencies");
console.log("  pnpm run pkg:update-latest   Update to latest versions");
console.log("  pnpm run pkg:use-local <pkg>     Switch to local package");
console.log("  pnpm run pkg:use-upstream <pkg>  Switch to upstream package");
console.log("  pnpm run pkg:refresh-local       Refresh all local packages\n");

console.log("🔖 VERSIONING & INFO");
console.log("  pnpm run version       Print computed dev version");
console.log("  pnpm run info          Show git repository info");
console.log("  node scripts/build-tools.js --help  Show build-tools help\n");

console.log("🐳 DOCKER & PUBLISHING");
console.log("  pnpm run docker:build  Build Docker image");
console.log("  pnpm run publish       Publish to GitHub Packages (upstream)");
console.log(
  "  pnpm run publish:dry-run  Test publish without actually publishing",
);
console.log("  pnpm run tags          Show dist-tags on GitHub Packages\n");

console.log("📖 STORYBOOK");
console.log("  pnpm run storybook         Run Storybook dev server locally");
console.log("  pnpm run build-storybook   Build static Storybook\n");

console.log("🚀 K8S DEPLOYMENT (Storybook with hot-reload)");
console.log("  pnpm run storybook:build-dev   Build dev Docker image");
console.log("  pnpm run storybook:kind-load   Load image into kind cluster");
console.log(
  "  pnpm run storybook:deploy      Full deploy (build → load → apply)",
);
console.log("  pnpm run storybook:halt        Stop k8s deployment\n");

console.log("💡 TIPS");
console.log('  • Run "pnpm run" to see all available scripts');
console.log('  • Run "make help" for Makefile targets (backwards compat)');
console.log("  • Most scripts accept additional arguments after --");
console.log("    Example: pnpm test -- --watch\n");
