import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { configureRuntimeContext } from "@agent-ix/ix-cli-core";
import {
  WorkflowCommandRunner,
  jsonEnvelope,
} from "@agent-ix/workflow-cli-plugin";

import { ixHome } from "./catalog.js";

const FLOW_SKILLS: Record<string, string> = {
  review: "review",
  matrix: "matrix",
  "to-plan": "to-plan",
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
  configureRuntimeContext({
    configRoot: home,
    configNamespace: "ix",
    projectConfigRoot: resolve(process.cwd(), ".ix"),
    projectConfigEnabled: true,
  });
  const runner = new WorkflowCommandRunner({
    config: {
      stateDir: join(home, "flows"),
      defaultDefinition: flow,
      output: opts.json ? "json" : "human",
    },
    actor: { kind: "agent", id: "ix-spec" },
  });
  const result = await runner.create({
    id: opts.id,
    name: flow,
    skillPath,
    targets: opts.target?.map((ref) => ({ kind: "file", ref })),
  });
  if (opts.json) {
    console.log(jsonEnvelope(result));
    return;
  }
  if (!result.ok) {
    console.error(
      `${result.error?.code ?? "workflow_error"}: ${result.error?.message ?? "failed to start spec flow"}`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(`started spec flow: ${flow}`);
  if (result.instance_id) {
    console.log(`run: ${result.instance_id}`);
    console.log(`next: ix-flow status ${result.instance_id}`);
    console.log(`next: ix-flow resume ${result.instance_id}`);
  }
}

function resolveSkillPath(flow: string): string {
  const skillName = FLOW_SKILLS[flow];
  if (!skillName) throw new Error(`unknown spec flow ${flow}`);
  const roots = [
    process.env.IX_SPEC_WORKFLOWS_ROOT,
    packagedWorkflowRoot(),
    join(dirname(resolve(process.cwd())), "ix-spec-workflows"),
    join(homedir(), ".ix", "plugins", "ix-spec-workflows"),
  ].filter((value): value is string => !!value);
  for (const root of roots) {
    const candidate = join(root, "skills", skillName);
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `could not find ix-spec-workflows skill ${skillName}; set IX_SPEC_WORKFLOWS_ROOT`,
  );
}

function packagedWorkflowRoot(): string {
  return join(
    dirname(dirname(fileURLToPath(import.meta.url))),
    "builtin-workflows",
  );
}
