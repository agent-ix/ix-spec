// Real-metrics extraction from a Claude Code session transcript (JSONL).
//
// agent-pty drives the agent but emits NO metrics. The transcript is the source of
// truth: every `assistant` line carries `message.usage` (input/output/cache tokens)
// and `tool_use` content blocks (`{name, input}`); every line carries a `timestamp`.

import { existsSync, readFileSync } from "node:fs";

export const SENTINEL_COMPLETE = "<<<EVAL-COMPLETE>>>";
export const SENTINEL_FAILED = "<<<EVAL-FAILED>>>";

const WRITE_RE = /\bix-spec\b[^\n]*?\bwrite\b/;
const VALIDATE_RE = /\bquire\b[^\n]*?\bvalidate\b/;
const FLOW_RE = /(\bix-spec\b[^\n]*?\b(review|matrix|to-plan)\b)|(\bix-flow\b)/;
const TYPES_RE = /--types[=\s]+([^\s'"]+)/g;

/** Read + JSON-parse a transcript, tolerating a trailing partial line. */
function readLines(path) {
  if (!existsSync(path)) return [];
  const out = [];
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      // partial flush of the final line; skip.
    }
  }
  return out;
}

function* toolUses(lines) {
  for (const line of lines) {
    if (line.type !== "assistant") continue;
    const content = line.message?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (block && block.type === "tool_use") yield block;
    }
  }
}

function bashCommand(block) {
  if (block.name !== "Bash") return undefined;
  const cmd = block.input?.command;
  return typeof cmd === "string" ? cmd : undefined;
}

/**
 * Did the agent reach a terminal sentinel? Returns "complete" | "failed" | null.
 * Primary signal: a Bash `echo` whose command contains the sentinel (unambiguous —
 * the agent actively ran it). Fallback: a standalone assistant text line equal to
 * the sentinel (guards against the agent merely quoting it while planning).
 */
export function findSentinel(path) {
  const lines = readLines(path);
  for (const block of toolUses(lines)) {
    const cmd = bashCommand(block);
    if (!cmd) continue;
    if (cmd.includes(SENTINEL_COMPLETE)) return "complete";
    if (cmd.includes(SENTINEL_FAILED)) return "failed";
  }
  for (const line of lines) {
    if (line.type !== "assistant") continue;
    for (const block of line.message?.content ?? []) {
      if (block?.type !== "text" || typeof block.text !== "string") continue;
      for (const textLine of block.text.split("\n")) {
        const t = textLine.trim();
        if (t === SENTINEL_COMPLETE) return "complete";
        if (t === SENTINEL_FAILED) return "failed";
      }
    }
  }
  return null;
}

/**
 * Aggregate real metrics from a transcript.
 * @returns ScenarioMetrics (see report.mjs for the persisted shape)
 */
export function extractMetrics(path) {
  const lines = readLines(path);
  const tokenUsage = {
    input: 0,
    output: 0,
    cacheCreation: 0,
    cacheRead: 0,
    contextInput: 0, // input + cacheCreation + cacheRead (true context pulled)
    total: 0, // contextInput + output (grand total tokens)
  };
  const toolBreakdown = {};
  const classified = {
    contextFetches: 0,
    validationAttempts: 0,
    skillInvocations: 0,
    edits: 0,
    flowOps: 0,
  };
  const typePacks = new Set();
  const timestamps = [];
  let assistantTurns = 0;
  let toolCalls = 0;

  for (const line of lines) {
    if (typeof line.timestamp === "string") {
      const t = Date.parse(line.timestamp);
      if (!Number.isNaN(t)) timestamps.push(t);
    }
    if (line.type !== "assistant") continue;
    assistantTurns += 1;
    const usage = line.message?.usage;
    if (usage) {
      tokenUsage.input += usage.input_tokens ?? 0;
      tokenUsage.output += usage.output_tokens ?? 0;
      tokenUsage.cacheCreation += usage.cache_creation_input_tokens ?? 0;
      tokenUsage.cacheRead += usage.cache_read_input_tokens ?? 0;
    }
  }
  tokenUsage.contextInput =
    tokenUsage.input + tokenUsage.cacheCreation + tokenUsage.cacheRead;
  tokenUsage.total = tokenUsage.contextInput + tokenUsage.output;

  for (const block of toolUses(lines)) {
    toolCalls += 1;
    toolBreakdown[block.name] = (toolBreakdown[block.name] ?? 0) + 1;
    if (block.name === "Skill") classified.skillInvocations += 1;
    if (block.name === "Edit" || block.name === "Write") classified.edits += 1;
    const cmd = bashCommand(block);
    if (!cmd) continue;
    if (WRITE_RE.test(cmd)) classified.contextFetches += 1;
    if (VALIDATE_RE.test(cmd)) classified.validationAttempts += 1;
    if (FLOW_RE.test(cmd)) classified.flowOps += 1;
    for (const m of cmd.matchAll(TYPES_RE)) typePacks.add(m[1]);
  }

  const modelActiveMs =
    timestamps.length >= 2
      ? Math.max(...timestamps) - Math.min(...timestamps)
      : 0;

  return {
    tokenUsage,
    toolCalls,
    toolBreakdown,
    classified,
    distinctTypePacks: typePacks.size,
    assistantTurns,
    modelActiveMs,
    transcriptLines: lines.length,
  };
}
