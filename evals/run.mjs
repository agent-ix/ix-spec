#!/usr/bin/env node
// ix-spec agent-pty eval harness.
//
// Drives the REAL `claude` agent (via agent-pty) through the spec-authoring CLI +
// skills for each selected scenario, captures REAL metrics from the Claude Code
// session transcript, asserts success (files + `quire validate`), and writes
// evals/reports/latest.json.
//
// Usage:
//   node evals/run.mjs --canary --model <id>
//   node evals/run.mjs --all --model <id> [--repeats N]
//   node evals/run.mjs --filter EV-008 --model <id> [--keep] [--reseed]
//
// A scenario selector (--canary | --all | --filter) is REQUIRED so a full,
// token-costly run is never triggered by accident. --model is REQUIRED so token
// counts are comparable across runs.

import {
  ixSpecBin,
  findQuire,
  findAgentPty,
  quireVersion,
  shimDir,
} from "./lib/resolve.mjs";
import { buildSeedOnce } from "./lib/seed.mjs";
import { makeScenarioWorkspace } from "./lib/env.mjs";
import { runAgent } from "./lib/agent.mjs";
import { extractMetrics } from "./lib/metrics.mjs";
import { assertExpectations } from "./lib/assert.mjs";
import {
  buildResult,
  buildReport,
  writeLatest,
  printSummaryTable,
} from "./lib/report.mjs";
import { selectScenarios } from "./scenarios/index.mjs";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}
function flag(name) {
  return process.argv.includes(name);
}

async function main() {
  const model = arg("--model");
  const repeats = Number(arg("--repeats") ?? "1");
  const keep = flag("--keep");
  const selection = {
    canary: flag("--canary"),
    all: flag("--all"),
    filter: arg("--filter"),
  };

  if (!model)
    throw new Error(
      "--model <id> is required (token counts must be comparable)",
    );
  const scenarios = selectScenarios(selection);
  if (scenarios.length === 0) {
    throw new Error(
      "no scenarios selected. Pass --canary, --all, or --filter EV-00X.",
    );
  }

  const seed = buildSeedOnce({
    force: flag("--reseed"),
    log: (m) => console.log(m),
  });
  const shimPath = shimDir();
  const quireBin = findQuire();
  const { entry: agentPtyPath } = await findAgentPty();

  console.log(
    `running ${scenarios.length} scenario(s) x${repeats} | model=${model} | quire=${quireVersion(quireBin)}`,
  );

  const results = [];
  for (const scenario of scenarios) {
    const runs = [];
    for (let i = 0; i < repeats; i++) {
      const label =
        repeats > 1 ? `${scenario.id} (${i + 1}/${repeats})` : scenario.id;
      process.stdout.write(`▶ ${label} ... `);
      const ctx = makeScenarioWorkspace(scenario.id);
      try {
        scenario.setup?.(ctx);
        const extraEnv = scenario.env ? scenario.env(ctx) : {};
        const runResult = await runAgent(scenario, ctx, {
          model,
          modulesDir: ctx.modulesDir,
          shimPath,
          extraEnv,
        });
        const metrics = extractMetrics(ctx.transcriptPath);
        const assertion = assertExpectations(ctx, scenario.expect, runResult, {
          quireBin,
          modulesDir: ctx.modulesDir,
          extraEnv,
        });
        const ok = assertion.ok;
        runs.push({
          ok,
          runResult,
          metrics,
          assertion,
          workdir: ctx.work,
          sessionId: ctx.sessionId,
          transcriptPath: ctx.transcriptPath,
        });
        console.log(
          `${ok ? "PASS" : "FAIL"} ${(runResult.wallMs / 1000).toFixed(0)}s ` +
            `[${runResult.exitReason}] tokens=${metrics.tokenUsage.total} tools=${metrics.toolCalls}` +
            (ok ? "" : `\n   ${assertion.failures.join("; ")}`),
        );
        if (!ok && runResult.exitReason === "timeout") {
          console.log(`   screen tail:\n${indent(runResult.screenTail)}`);
        }
      } finally {
        if (!keep) ctx.cleanup();
      }
    }
    results.push(buildResult(scenario, runs));
  }

  const report = buildReport(results, {
    generatedAt: new Date().toISOString(),
    model,
    repeats,
    quireBin,
    quireVersion: quireVersion(quireBin),
    ixSpecBin: ixSpecBin(),
    agentPtyPath,
    seedDir: seed.seedDir,
  });
  const path = writeLatest(report);
  printSummaryTable(report);
  console.log(`\nreport: ${path}`);
  process.exit(report.ok ? 0 : 1);
}

function indent(text, pad = "   ") {
  return (text ?? "")
    .split("\n")
    .map((l) => pad + l)
    .join("\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
