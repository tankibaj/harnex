#!/usr/bin/env bash
# Dev only: symlinks each skill into the local skill folders, so edits in this
# repo show up at once. Users install the plugin instead (README).
#   ~/.claude/skills   Claude Code
#   ~/.agents/skills   Codex and other Agent Skills harnesses
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
for DEST in "$HOME/.claude/skills" "$HOME/.agents/skills"; do
  if [ -L "$DEST" ]; then
    case "$(readlink -f "$DEST")" in "$REPO"|"$REPO"/*) echo "error: $DEST points into this repo; remove it first" >&2; exit 1 ;; esac
  fi
  mkdir -p "$DEST"
  for src in "$REPO"/skills/*/; do
    name="$(basename "$src")"; target="$DEST/$name"
    if [ -e "$target" ] && [ ! -L "$target" ]; then echo "skip $target: not a link" >&2; continue; fi
    ln -sfn "${src%/}" "$target"; echo "linked $name -> $DEST"
  done
done
