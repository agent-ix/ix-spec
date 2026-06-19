#!/usr/bin/env bash
#
# Deterministic assertions. Reads expected.txt (lines: "plugin <name>",
# "skill <slug>", "workflow <name>") and verifies each artifact landed after the
# marketplace install. Two evidence sources:
#   * filesystem — the cloned plugin under ~/.claude/plugins (always available;
#     auth-independent, since marketplace cloning is plain git on a public repo)
#   * live session — the `system/init` event from a real `claude -p` turn, which
#     lists loaded plugins[], plugin_errors, and skills as slash_commands
#     (available only when host subscription creds were mounted)
# Exit non-zero on any miss.
set -uo pipefail

STREAM="${1:-/dev/null}"
SMOKE_DIR="$(cd "$(dirname "$0")" && pwd)"
EXPECTED="$SMOKE_DIR/expected.txt"
export HOME="${HOME:-/root}"
CACHE="$HOME/.claude/plugins"
fail=0

PLUGIN_NAME="$(awk '/^plugin /{print $2; exit}' "$EXPECTED")"

# The live session init event (only present when auth succeeded).
INIT=""
if [ -s "$STREAM" ]; then
  INIT="$(jq -c 'select(.type=="system" and .subtype=="init")' "$STREAM" 2>/dev/null | head -1)"
fi

echo
echo "## Assertions  (cache: $CACHE)"
if [ ! -d "$CACHE" ]; then
  echo "   FAIL  no plugin cache at $CACHE — marketplace install did not run"
  sed 's/^/         /' /tmp/claude.err 2>/dev/null | head -20
  exit 1
fi

# Is <skill> loaded as a Claude slash command (e.g. "quoin:specify")?
live_has_skill() {
  [ -n "$INIT" ] || return 2
  echo "$INIT" | jq -e --arg s "$1" '(.slash_commands // []) | any(endswith(":"+$s) or . == $s)' >/dev/null 2>&1
}

while read -r kind name _; do
  [ -z "${kind:-}" ] && continue
  case "$kind" in
    \#*) continue ;;
    plugin)
      fs="$(find "$CACHE" -type d -name "$name" 2>/dev/null | head -1)"
      if [ -n "$fs" ]; then echo "   PASS  plugin cloned: $name"
      else echo "   FAIL  plugin not cloned: $name"; fail=1; fi
      if [ -n "$INIT" ]; then
        if echo "$INIT" | jq -e --arg n "$name" '(.plugins // []) | any(.name==$n)' >/dev/null 2>&1; then
          echo "   PASS  plugin loaded in live Claude session: $name"
        else
          echo "   FAIL  plugin NOT loaded in live Claude session: $name"; fail=1
        fi
        errs="$(echo "$INIT" | jq -c '.plugin_errors // empty' 2>/dev/null)"
        if [ -n "$errs" ] && [ "$errs" != "null" ] && [ "$errs" != "[]" ]; then
          echo "   FAIL  plugin_errors reported by Claude: $errs"; fail=1
        fi
      fi
      ;;
    skill)
      hit="$(find "$CACHE" -path "*/skills/$name/SKILL.md" 2>/dev/null | head -1)"
      if [ -n "$hit" ]; then echo "   PASS  skill present: $name"
      else echo "   FAIL  skill MISSING: $name"; fail=1; fi
      live_has_skill "$name" && echo "         · loaded as a Claude command"
      ;;
    workflow)
      hit="$(find "$CACHE" -path "*/workflows/$name/def.yaml" 2>/dev/null | head -1)"
      if [ -n "$hit" ]; then echo "   PASS  workflow present: $name"
      else echo "   FAIL  workflow MISSING: $name"; fail=1; fi
      ;;
  esac
done < "$EXPECTED"

echo
[ -z "$INIT" ] && echo "   note: no live Claude session captured (no/invalid creds) — live-load checks skipped"
if [ "$fail" -eq 0 ]; then
  echo "## RESULT: PASS — $PLUGIN_NAME installs from public npm and its skills/workflows are present"
else
  echo "## RESULT: FAIL — see misses above"
fi
exit "$fail"
