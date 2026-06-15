// Builds the task brief handed to the agent. Written to a file in the scenario
// repo; the agent is told (in one typed line) to read and execute it. Keeping the
// typed input to a single line avoids multi-line paste submitting early in the REPL.

import { SENTINEL_COMPLETE, SENTINEL_FAILED } from "./metrics.mjs";

/** The single line typed into the REPL to kick off the run. */
export const TASK_FILENAME = "EVAL_TASK.md";
export function kickoffLine() {
  return `Read the file ./${TASK_FILENAME} in the current directory and complete the task it describes, following its completion protocol exactly.`;
}

/** Full task brief markdown for a scenario. `prompt` may be a string or (ctx)=>string. */
export function buildTaskBrief(scenario, ctx) {
  const task =
    typeof scenario.prompt === "function"
      ? scenario.prompt(ctx)
      : scenario.prompt;
  return `# Automated authoring task (${scenario.id})

You are completing an automated spec-authoring task in an **isolated test workspace**.
This is a measured eval: work efficiently and use the provided tooling.

- Working directory (your cwd): \`${ctx.cwd}\`
- Author spec files under the repo(s) described in the task below (a single repo's
  \`spec/\` unless the task says otherwise).

## Tooling available in this shell

- \`ix-spec\` — the spec-authoring CLI. Key commands:
  - \`ix-spec write . --types <Type[,Type...]>\` prints an *authoring pack*: the
    skeleton + schema paths and the exact \`quire validate\` command for those types.
    Add \`--json\` for machine-readable output. Fetch each type's contract **once**
    and reuse it.
  - \`ix-spec catalog list|show <Type>\` inspects available types.
  - \`ix-spec plugin install <path:...|github:...>|list|remove <name>\`.
  - \`ix-spec review|matrix|to-plan --target <dir> --id <id>\` launches a workflow.
- \`quire validate --scope . "<glob>"\` validates authored markdown (schemas are
  already provisioned via the environment).
- \`ix-flow status <id>\` inspects a launched workflow run.
- The \`/spec-*\` Claude skills are available if you prefer skill-driven authoring.

## Task

${task}

## Rules

- Use \`ix-spec write\` to obtain the authoring contract for each type **once**, then
  author the file(s) under \`spec/\` from the skeleton(s).
- When you believe the work is done, run \`quire validate --scope <repo> "<glob>"\` over
  the files you changed and ensure it passes (exit code 0).
- Do not modify files outside \`${ctx.cwd}\`.

## Completion protocol (required)

Your **final action** must be a single shell command that prints the result marker:

- On success (files authored and validation passes):
  \`\`\`
  echo '${SENTINEL_COMPLETE}'
  \`\`\`
- If you cannot complete the task:
  \`\`\`
  echo '${SENTINEL_FAILED}'
  \`\`\`

Print exactly one marker, only as the very last step. Do not print it earlier.
`;
}
