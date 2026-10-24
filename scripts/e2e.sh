#!/usr/bin/env bash
# Installs harnex the way a user would, into throwaway config dirs, with the
# real CLIs, and asserts every skill and agent is discovered. No model calls,
# no API keys.
#
#   scripts/e2e.sh [claude|codex|opencode|all]
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
SKILLS="harnex pr-review qa retro"
AGENTS="implementer planner qa reviewer suite-runner ui-ux-reviewer validator"
fail=0
ok()  { echo "  ok   $*"; }
bad() { echo "  FAIL $*" >&2; fail=1; }
# check "<label>" <command...>: ok when the command succeeds, FAIL otherwise.
check() { local label="$1"; shift; if "$@"; then ok "$label"; else bad "$label"; fi; }

e2e_claude() {
  echo "== Claude Code ($(claude --version 2>/dev/null | head -1))"
  export CLAUDE_CONFIG_DIR="$WORK/claude"
  mkdir -p "$CLAUDE_CONFIG_DIR"
  claude plugin marketplace add "$REPO" >/dev/null
  claude plugin install harnex@harnex >/dev/null
  local d; d="$(claude plugin details harnex@harnex 2>&1 || true)"
  check "skills $SKILLS" grep -q 'Skills (4)  harnex, pr-review, qa, retro' <<<"$d"
  for a in $AGENTS; do check "agent harnex:$a" grep -qE "Agents \(7\).*\b$a\b" <<<"$d"; done
  check "metrics hooks" grep -q 'Hooks (2)  PreToolUse, UserPromptSubmit' <<<"$d"
  local log="$WORK/metrics.jsonl"
  echo '{"hook_event_name":"UserPromptSubmit","prompt":"/qa x","cwd":"/r/demo","session_id":"e2e"}' \
    | HARNEX_METRICS="$log" python3 "$REPO/scripts/metrics.py"
  check "metrics hook writes a record" grep -q '"name": "qa"' "$log"
  unset CLAUDE_CONFIG_DIR
}

e2e_codex() {
  echo "== Codex ($(codex --version 2>/dev/null | head -1))"
  export CODEX_HOME="$WORK/codex"
  mkdir -p "$CODEX_HOME"
  codex plugin marketplace add "$REPO" >/dev/null
  codex plugin add harnex@harnex >/dev/null
  codex plugin list >"$WORK/codex-list.txt" 2>&1 || true
  check "plugin installed and enabled" grep -qE '^harnex@harnex +installed, enabled' "$WORK/codex-list.txt"
  local root; root="$(find "$CODEX_HOME/plugins/cache/harnex/harnex" -mindepth 1 -maxdepth 1 -type d | head -1)"
  for s in $SKILLS; do check "skill $s" [ -f "$root/skills/$s/SKILL.md" ]; done
  HOME="$WORK/home" node "$REPO/scripts/install-agents.mjs" --codex >/dev/null
  for a in $AGENTS; do check "agent harnex-$a" grep -q "^name = \"harnex-$a\"" "$WORK/home/.codex/agents/harnex-$a.toml" 2>/dev/null; done
  unset CODEX_HOME
}

e2e_opencode() {
  echo "== OpenCode ($(opencode --version 2>/dev/null | head -1))"
  local proj="$WORK/project"
  mkdir -p "$proj" && git -C "$proj" init -q
  export XDG_CONFIG_HOME="$WORK/xdg"
  (cd "$proj" && npx -y skills@latest add "$REPO" -a opencode -y >/dev/null 2>&1)
  HOME="$WORK/home" node "$REPO/scripts/install-agents.mjs" --opencode >/dev/null
  # Outputs are large (every skill's content): write to files, grep the files.
  (cd "$proj" && { opencode debug skill >"$WORK/oc-skills.json" 2>&1; true; })
  (cd "$proj" && { opencode agent list >"$WORK/oc-agents.txt" 2>&1; true; })
  for s in $SKILLS; do check "skill $s" grep -q "\"name\": \"$s\"" "$WORK/oc-skills.json"; done
  for a in $AGENTS; do check "agent harnex-$a" grep -q "^harnex-$a (subagent)" "$WORK/oc-agents.txt"; done
  unset XDG_CONFIG_HOME
}

case "${1:-all}" in
  claude) e2e_claude ;;
  codex) e2e_codex ;;
  opencode) e2e_opencode ;;
  all) e2e_claude; e2e_codex; e2e_opencode ;;
  *) echo "usage: $0 [claude|codex|opencode|all]" >&2; exit 2 ;;
esac
if [ "$fail" = 0 ]; then echo "e2e: PASS"; else echo "e2e: FAIL" >&2; exit 1; fi
