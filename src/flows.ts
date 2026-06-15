import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ixHome } from "./catalog.js";

const FLOW_SKILLS: Record<
  string,
  { packageSkill: string; runtimeSkill: string }
> = {
  review: { packageSkill: "spec-review", runtimeSkill: "review" },
  matrix: { packageSkill: "spec-matrix", runtimeSkill: "matrix" },
  "to-plan": { packageSkill: "spec-to-plan", runtimeSkill: "to-plan" },
};

export function specFlowNames(): string[] {
  return Object.keys(FLOW_SKILLS);
}

export async function startSpecFlow(
  flow: string,
  opts: { json?: boolean; id?: string; target?: string[] } = {},
): Promise<void> {
  const skillPath = resolveSkillPath(flow);
  const home = ixHome();
  const args = [
    "run",
    flow,
    "--path",
    skillPath,
    "--config-root",
    home,
    "--state-dir",
    join(home, "flows"),
  ];
  if (opts.id) args.push("--id", opts.id);
  if (opts.json) args.push("--json");
  for (const target of opts.target ?? []) args.push("--target", target);
  await runIxFlow(args);
}

function resolveSkillPath(flow: string): string {
  const skill = FLOW_SKILLS[flow];
  if (!skill) throw new Error(`unknown spec flow ${flow}`);
  const roots = [
    process.env.IX_SPEC_WORKFLOWS_ROOT,
    packagedSkillsRoot(),
    join(dirname(resolve(process.cwd())), "ix-spec-workflows"),
    join(homedir(), ".ix", "plugins", "ix-spec-workflows"),
  ].filter((value): value is string => !!value);
  for (const root of roots) {
    const packagedRuntime = join(
      root,
      skill.packageSkill,
      "workflow-assets",
      "skills",
      skill.runtimeSkill,
    );
    if (existsSync(packagedRuntime)) return packagedRuntime;

    const legacyCandidate = root.endsWith("skills")
      ? join(root, skill.runtimeSkill)
      : join(root, "skills", skill.runtimeSkill);
    if (existsSync(legacyCandidate)) return legacyCandidate;
  }
  throw new Error(
    `could not find ix-spec workflow skill ${skill.runtimeSkill}; set IX_SPEC_WORKFLOWS_ROOT`,
  );
}

function packagedSkillsRoot(): string {
  return join(dirname(dirname(fileURLToPath(import.meta.url))), "skills");
}

async function runIxFlow(args: string[]): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn("ix-flow", args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      process.exitCode = code ?? 1;
      resolvePromise();
    });
  });
}
