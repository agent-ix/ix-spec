#!/usr/bin/env node
/**
 * Storybook deployment script
 * Chains: build-dev → kind-load → k8s apply
 *
 * Usage:
 *   node scripts/storybook-deploy.js [command]
 *
 * Commands:
 *   build-dev   Build the dev Docker image
 *   kind-load   Load image into kind cluster
 *   deploy      Full deployment (build → load → apply)
 *   halt        Stop the k8s deployment
 *   health      Check deployment health
 *   logs        Stream deployment logs
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Derive project name from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf8"),
);
const PKG_NAME = packageJson.name; // e.g. @agent-ix/login-box
const PROJECT_SLUG = PKG_NAME.replace(/^@[^/]+\//, ""); // e.g. login-box

const IMAGE_NAME = `ghcr.io/agent-ix/${PROJECT_SLUG}`;
const LOCAL_NPM_REGISTRY =
  process.env.LOCAL_NPM_REGISTRY || "https://npm.pkg.github.com";
const DEV_PATH =
  process.env.DEV_PATH ||
  (process.env.IX_DEV
    ? `${process.env.IX_DEV}/${PROJECT_SLUG}`
    : process.cwd());
const WATCH_POLLING = process.env.WATCH_POLLING || "false";
const DEPLOYMENT_NAME = `${PROJECT_SLUG}-storybook`;
const APP_URL = `http://${PROJECT_SLUG}.ix`;

function exec(cmd, options = {}) {
  console.log(`$ ${cmd}`);
  try {
    return execSync(cmd, { encoding: "utf8", stdio: "inherit", ...options });
  } catch (error) {
    if (!options.ignoreError) {
      process.exit(1);
    }
  }
}

function execQuiet(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", ...options }).trim();
  } catch {
    return options.fallback || "";
  }
}

function getDockerNetworkArgs() {
  return "";
}

function buildDev() {
  const version = execQuiet("node scripts/build-tools.js version");
  console.log(`🔨 Building DEV version: ${version}`);

  const networkArgs = getDockerNetworkArgs();
  exec(
    `docker build ${networkArgs} --target dev --build-arg NPM_REGISTRY_URL=${LOCAL_NPM_REGISTRY} -t ${IMAGE_NAME} .`,
  );
}

function kindLoad() {
  console.log("🔍 Looking for active kind cluster...");

  const kindExists = execQuiet("command -v kind");
  if (!kindExists) {
    console.log("❌ kind not found. Skipping kind image load.");
    return;
  }

  const context = execQuiet("kubectl config current-context", { fallback: "" });
  if (!context) {
    console.log("❌ No kubectl context found.");
    return;
  }

  let clusterName = "";

  if (context.startsWith("kind-")) {
    clusterName = context.replace("kind-", "");
    console.log(`✅ Found kind cluster context: ${context} -> ${clusterName}`);
  } else {
    const clusters = execQuiet("kind get clusters", { fallback: "" });
    if (clusters.split("\n").includes(context)) {
      clusterName = context;
      console.log(`✅ Found kind cluster matching context: ${context}`);
    } else if (clusters.includes("platform")) {
      clusterName = "platform";
      console.log(
        '⚠️ Context does not look like a kind cluster. Trying fallback to "platform"...',
      );
      console.log('✅ Found "platform" cluster.');
    } else {
      console.log(
        "❌ Could not determine kind cluster name. Skipping image load.",
      );
      return;
    }
  }

  exec(`kind load docker-image ${IMAGE_NAME} --name ${clusterName}`);
}

function deploy() {
  // Chain: build → load → apply
  buildDev();

  console.log("🔍 Running pre-flight build check in Docker...");
  // Validate build in the exact environment it will run in
  try {
    exec(
      `docker run --rm -v ${DEV_PATH}:/app ${IMAGE_NAME} pnpm build-storybook --quiet`,
    );
    console.log("✅ Pre-flight build check passed");
  } catch (e) {
    console.error(
      "❌ Pre-flight build failed in Docker! Fix the errors above.",
    );
    process.exit(1);
  }

  kindLoad();

  console.log("🚀 Deploying to kind cluster with hot-reload...");
  console.log(`📁 Using dev path: ${DEV_PATH}`);

  // Check src exists
  if (!existsSync(`${DEV_PATH}/src`)) {
    console.error(`❌ Error: Directory ${DEV_PATH}/src does not exist`);
    process.exit(1);
  }

  // Apply k8s resources
  exec("kubectl apply -f k8s/storybook/service.yaml");
  exec("kubectl apply -f k8s/storybook/ingress.yaml");

  // Apply deployment with envsubst
  exec(
    `DEV_PATH=${DEV_PATH} WATCH_POLLING=${WATCH_POLLING} envsubst < k8s/storybook/deployment.yaml.template | kubectl apply -f -`,
  );

  exec(`kubectl rollout restart deployment ${DEPLOYMENT_NAME}`);

  console.log(
    `✅ Dev deployment complete. Code changes will hot-reload at ${APP_URL}`,
  );

  if (WATCH_POLLING === "true") {
    console.log("⚠️  Using polling mode (may have 1-2s delay)");
  } else {
    console.log("✅ Using native file events (instant HMR)");
    console.log(
      "💡 If changes aren't detected, try: WATCH_POLLING=true pnpm run storybook:deploy",
    );
  }
}

function halt() {
  console.log("🛑 Stopping kind deployment...");
  exec("kubectl delete -f k8s/storybook/ingress.yaml --ignore-not-found", {
    ignoreError: true,
  });
  exec("kubectl delete -f k8s/storybook/service.yaml --ignore-not-found", {
    ignoreError: true,
  });
  exec(
    "DEV_PATH=/dev/null envsubst < k8s/storybook/deployment.yaml.template | kubectl delete -f - --ignore-not-found",
    { ignoreError: true },
  );
  exec(`kubectl delete deployment ${DEPLOYMENT_NAME} --ignore-not-found`, {
    ignoreError: true,
  });
}

function health() {
  console.log(
    "\x1b[1m\x1b[90m=== \x1b[0m\x1b[1m\x1b[36mKubernetes Status\x1b[0m\x1b[1m\x1b[90m ===\x1b[0m",
  );
  console.log("");

  console.log(
    "\x1b[1m\x1b[90m--- \x1b[0m\x1b[36mPods\x1b[0m\x1b[1m\x1b[90m ---\x1b[0m",
  );
  exec(`kubectl get pods -l app=${DEPLOYMENT_NAME}`, { ignoreError: true });
  console.log("");

  console.log(
    "\x1b[1m\x1b[90m--- \x1b[0m\x1b[36mServices\x1b[0m\x1b[1m\x1b[90m ---\x1b[0m",
  );
  exec(`kubectl get svc ${DEPLOYMENT_NAME}`, { ignoreError: true });
  console.log("");

  console.log(
    "\x1b[1m\x1b[90m--- \x1b[0m\x1b[36mEndpoints\x1b[0m\x1b[1m\x1b[90m ---\x1b[0m",
  );
  exec(`kubectl get endpoints ${DEPLOYMENT_NAME}`, { ignoreError: true });
  console.log("");

  console.log(
    "\x1b[1m\x1b[90m=== \x1b[0m\x1b[1m\x1b[36mApp Health Check\x1b[0m\x1b[1m\x1b[90m ===\x1b[0m",
  );
  const httpCode = execQuiet(
    `curl -s -o /dev/null -w "%{http_code}" ${APP_URL}`,
    { fallback: "000" },
  );
  if (httpCode === "200") {
    console.log(`\x1b[32m✅ 200 OK\x1b[0m - ${APP_URL}`);
  } else {
    console.log(
      `\x1b[33m⚠️  App health check failed (Status: ${httpCode})\x1b[0m`,
    );
    exec(`curl -v ${APP_URL}`, { ignoreError: true });
  }
}

function logs() {
  console.log(`🔍 Streaming logs for ${DEPLOYMENT_NAME}...`);
  exec(`kubectl logs -l app=${DEPLOYMENT_NAME} -f`);
}

const commands = {
  "build-dev": buildDev,
  "kind-load": kindLoad,
  deploy: deploy,
  halt: halt,
  health: health,
  logs: logs,
};

const cmd = process.argv[2];

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(`Storybook Deployment Script for ${PROJECT_SLUG}`);
  console.log("=".repeat(50));
  console.log("");
  console.log(
    "PURPOSE: Deploy Storybook to a local Kind cluster with hot-reload support.",
  );
  console.log(
    "The Docker image contains all npm dependencies (for webpack HMR), while",
  );
  console.log(
    "source code is volume-mounted from the host for instant hot-reload.",
  );
  console.log("");
  console.log("USAGE: node scripts/storybook-deploy.js <command>");
  console.log("");
  console.log("COMMANDS:");
  console.log("");
  console.log("  deploy      [RECOMMENDED] Full deployment pipeline.");
  console.log(
    "              Chains: build-dev → kind-load → k8s apply → restart",
  );
  console.log(
    "              Use this to start or update the Storybook deployment.",
  );
  console.log(`              After running, Storybook is at ${APP_URL}`);
  console.log("");
  console.log(
    "  halt        Stop and remove all k8s resources for this deployment.",
  );
  console.log(
    "              Use when done developing or to free cluster resources.",
  );
  console.log("");
  console.log("  health      Check deployment status and connectivity.");
  console.log(
    "              Shows: pods, services, endpoints, and HTTP health check.",
  );
  console.log("              Use to diagnose deployment issues.");
  console.log("");
  console.log("  logs        Stream pod logs (follows with -f).");
  console.log("              Use to debug Storybook/webpack issues.");
  console.log("");
  console.log("  build-dev   Build the dev Docker image only (no deploy).");
  console.log(
    "              Rarely needed standalone; deploy calls this automatically.",
  );
  console.log("");
  console.log("  kind-load   Load Docker image into Kind cluster only.");
  console.log(
    "              Rarely needed standalone; deploy calls this automatically.",
  );
  console.log("");
  console.log("ENVIRONMENT VARIABLES:");
  console.log(
    `  DEV_PATH           Source directory to mount (default: CWD or IX_DEV/${PROJECT_SLUG})`,
  );
  console.log(
    '  WATCH_POLLING      Set to "true" if HMR doesn\'t detect file changes (default: false)',
  );
  console.log(
    "  LOCAL_NPM_REGISTRY Registry for @agent-ix packages (default: https://npm.pkg.github.com)",
  );
  console.log("");
  console.log("TYPICAL WORKFLOW:");
  console.log(
    "  1. pnpm run storybook:deploy    # Start Storybook with hot-reload",
  );
  console.log("  2. Edit components in src/      # Changes appear instantly");
  console.log("  3. pnpm run storybook:health    # Check if running ok");
  console.log("  4. pnpm run storybook:halt      # Stop when done");
  process.exit(0);
}

if (!commands[cmd]) {
  console.error(`Error: Unknown command '${cmd}'`);
  process.exit(1);
}

commands[cmd]();
