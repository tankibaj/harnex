#!/usr/bin/env python3
"""harnex passive metrics hook (PreToolUse Agent|Skill, UserPromptSubmit).

Appends one JSONL line per harnex agent/skill spawn or /harnex command to
~/.harnex/metrics.jsonl (override with HARNEX_METRICS). Logs names only,
never prompts or code. Never blocks: always exits 0.
"""
import json, os, re, sys, time

LOG = os.environ.get("HARNEX_METRICS", os.path.expanduser("~/.harnex/metrics.jsonl"))
SLASH = re.compile(r"^\s*/(?:harnex(?::(\w[\w-]*))?|(pr-review|qa|retro))\b")


def entry(d):
    base = {"ts": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "kind": "spawn",
            "session": d.get("session_id"), "repo": os.path.basename(d.get("cwd") or "")}
    if d.get("hook_event_name") == "UserPromptSubmit":
        m = SLASH.match(d.get("prompt") or "")
        return {**base, "tool": "slash", "name": m.group(1) or m.group(2) or "harnex"} if m else None
    tool, ti = d.get("tool_name"), d.get("tool_input") or {}
    name = ti.get("subagent_type") if tool == "Agent" else ti.get("skill") if tool == "Skill" else None
    if not name or not (name.startswith("harnex") or name in ("pr-review", "qa", "retro")):
        return None
    return {**base, "tool": tool, "name": name, "model": ti.get("model")}


def main():
    try:
        e = entry(json.load(sys.stdin))
        if e:
            os.makedirs(os.path.dirname(LOG), exist_ok=True)
            with open(LOG, "a") as f:
                f.write(json.dumps(e) + "\n")
    except Exception:
        pass


if __name__ == "__main__":
    main()
    sys.exit(0)
