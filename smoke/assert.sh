#!/usr/bin/env bash
#
# Deterministic assertions. Reads expected.txt (lines: "plugin <name>",
# "skill <slug>", "workflow <name>") and verifies, after the marketplace
# install, that each artifact is present AND usable. Evidence:
#   * filesystem — the cloned plugin under ~/.claude/plugins (skill/workflow files)
#   * session init — the `system/init` event from `claude -p`, listing loaded
#     plugins[], plugin_errors, and skills as slash_commands. init is emitted
#     before auth, so these checks are deterministic and need no credentials.
#
# A skill that exists on disk but is NOT exposed as a /command is a FAIL — that
# is the "installed but I don't see it in Claude" failure mode this guards.
# Exit non-zero on any miss.
set -uo pipefail

STREAM="${1:-/dev/null}"
SMOKE_DIR="$(cd "$(dirname "$0")" && pwd)"
EXPECTED="$SMOKE_DIR/expected.txt"
export HOME="${HOME:-/root}"
CACHE="$HOME/.claude/plugins"
fail=0

PLUGIN_NAME="$(awk '/^plugin /{print $2; exit}' "$EXPECTED")"

INIT=""
[ -s "$STREAM" ] && INIT="$(jq -c 'select(.type=="system" and .subtype=="init")' "$STREAM" 2>/dev/null | head -1)"

echo
echo "## Assertions  (cache: $CACHE)"
if [ ! -d "$CACHE" ]; then
  echo "   FAIL  no plugin cache at $CACHE — marketplace install did not run"
  sed 's/^/         /' /tmp/claude.err 2>/dev/null | head -20
  exit 1
fi
if [ -z "$INIT" ]; then
  echo "   FAIL  no Claude session init captured — cannot confirm the plugin loaded"
  echo "         (claude -p must emit a system/init event; claude stderr:)"
  sed 's/^/         /' /tmp/claude.err 2>/dev/null | head -20
  fail=1
fi

# Is <skill> exposed as a usable slash command (e.g. "ix-flow:ix-flow")?
slash_has() {
  [ -n "$INIT" ] || return 1
  echo "$INIT" | jq -e --arg s "$1" '(.slash_commands // []) | any(endswith(":"+$s) or . == $s)' >/dev/null 2>&1
}

while read -r kind name _; do
  [ -z "${kind:-}" ] && continue
  case "$kind" in
    \#*) continue ;;
    plugin)
      if [ -n "$(find "$CACHE" -type d -name "$name" 2>/dev/null | head -1)" ]; then
        echo "   PASS  plugin cloned: $name"
      else echo "   FAIL  plugin not cloned: $name"; fail=1; fi
      if [ -n "$INIT" ]; then
        if echo "$INIT" | jq -e --arg n "$name" '(.plugins // []) | any(.name==$n)' >/dev/null 2>&1; then
          echo "   PASS  plugin loaded in Claude session: $name"
        else echo "   FAIL  plugin NOT loaded in Claude session: $name"; fail=1; fi
        errs="$(echo "$INIT" | jq -c '(.plugin_errors // []) | select(length>0)' 2>/dev/null)"
        [ -n "$errs" ] && { echo "   FAIL  plugin_errors reported by Claude: $errs"; fail=1; }
      fi
      ;;
    skill)
      if [ -n "$(find "$CACHE" -path "*/skills/$name/SKILL.md" 2>/dev/null | head -1)" ]; then
        echo "   PASS  skill file present: $name"
      else echo "   FAIL  skill file MISSING: $name"; fail=1; fi
      if slash_has "$name"; then
        echo "   PASS  skill usable as /command: $name"
      else echo "   FAIL  skill NOT usable as a /command: $name"; fail=1; fi
      ;;
    workflow)
      if [ -n "$(find "$CACHE" -path "*/workflows/$name/def.yaml" 2>/dev/null | head -1)" ]; then
        echo "   PASS  workflow present: $name"
      else echo "   FAIL  workflow MISSING: $name"; fail=1; fi
      ;;
  esac
done < "$EXPECTED"

echo
if [ "$fail" -eq 0 ]; then
  echo "## RESULT: PASS — $PLUGIN_NAME installs from public npm; skills present and usable as /commands"
else
  echo "## RESULT: FAIL — see misses above"
fi
exit "$fail"
