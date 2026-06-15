// Report assembly: per-run results, percentile aggregates, latest.json, and a
// human-readable stdout summary. Extends the old runner's shape with REAL token
// usage + a tool breakdown.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { evalsRoot } from "./resolve.mjs";

export function reportsDir() {
  return join(evalsRoot(), "reports");
}

function percentile(values, p) {
  const xs = values.filter((v) => typeof v === "number").sort((a, b) => a - b);
  if (xs.length === 0) return null;
  const idx = Math.min(xs.length - 1, Math.floor((p / 100) * xs.length));
  return xs[idx];
}

function summarize(values) {
  return { p50: percentile(values, 50), p95: percentile(values, 95) };
}

/** Combine one scenario's run(s) into per-run result objects. */
export function buildResult(scenario, runs) {
  // runs: [{ ok, runResult, metrics, assertion }]
  const samples = runs.map((run) => ({
    ok: run.ok,
    latencyMs: run.runResult.wallMs,
    modelActiveMs: run.metrics.modelActiveMs,
    exitReason: run.runResult.exitReason,
    tokenUsage: run.metrics.tokenUsage,
    toolCalls: run.metrics.toolCalls,
    toolBreakdown: run.metrics.toolBreakdown,
    ...run.metrics.classified,
    distinctTypePacks: run.metrics.distinctTypePacks,
    assistantTurns: run.metrics.assistantTurns,
    validation: run.assertion.validation,
    matchedFiles: run.assertion.matchedFiles,
    checks: run.assertion.checks,
    failures: run.assertion.failures,
    workdir: run.workdir,
    sessionId: run.sessionId,
    transcriptPath: run.transcriptPath,
  }));
  const passCount = samples.filter((s) => s.ok).length;
  return {
    id: scenario.id,
    useCase: scenario.useCase,
    ok: passCount === samples.length,
    passRate: `${passCount}/${samples.length}`,
    aggregate: {
      latencyMs: summarize(samples.map((s) => s.latencyMs)),
      tokensIn: summarize(samples.map((s) => s.tokenUsage.contextInput)),
      tokensOut: summarize(samples.map((s) => s.tokenUsage.output)),
      toolCalls: summarize(samples.map((s) => s.toolCalls)),
    },
    runs: samples,
  };
}

export function buildReport(results, meta) {
  const flat = results.flatMap((r) => r.runs);
  return {
    ok: results.every((r) => r.ok),
    generatedAt: meta.generatedAt,
    model: meta.model,
    repeats: meta.repeats,
    quireBin: meta.quireBin,
    quireVersion: meta.quireVersion,
    ixSpecBin: meta.ixSpecBin,
    agentPtyPath: meta.agentPtyPath,
    seedDir: meta.seedDir,
    results,
    aggregates: {
      successRate: `${results.filter((r) => r.ok).length}/${results.length}`,
      latencyMs: summarize(flat.map((s) => s.latencyMs)),
      tokensIn: summarize(flat.map((s) => s.tokenUsage.contextInput)),
      tokensOut: summarize(flat.map((s) => s.tokenUsage.output)),
      toolCalls: summarize(flat.map((s) => s.toolCalls)),
    },
  };
}

export function writeLatest(report) {
  mkdirSync(reportsDir(), { recursive: true });
  const path = join(reportsDir(), "latest.json");
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
  return path;
}

function k(n) {
  if (n == null) return "-";
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
function secs(ms) {
  return ms == null ? "-" : `${(ms / 1000).toFixed(0)}s`;
}

export function printSummaryTable(report) {
  const rows = report.results.map((r) => {
    const a = r.aggregate;
    return [
      r.id,
      r.ok ? "✓" : "✗",
      r.passRate,
      secs(a.latencyMs.p50),
      `${k(a.tokensIn.p50)}/${k(a.tokensOut.p50)}`,
      k(a.toolCalls.p50),
    ];
  });
  const header = ["ID", "OK", "pass", "lat", "in/out", "tools"];
  const widths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((row) => String(row[i]).length)),
  );
  const fmt = (cells) =>
    cells.map((c, i) => String(c).padEnd(widths[i])).join("  ");
  console.log("");
  console.log(fmt(header));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of rows) console.log(fmt(row));
  const g = report.aggregates;
  console.log("");
  console.log(
    `success ${g.successRate} | latency p50 ${secs(g.latencyMs.p50)} p95 ${secs(
      g.latencyMs.p95,
    )} | tokens(in) p50 ${k(g.tokensIn.p50)} | tools p50 ${k(g.toolCalls.p50)} | model ${report.model}`,
  );
}
