---
name: retro
description: "harnex retro: reviews a coding session (default: the current one) and proposes environment improvements (navigation pointers, automated checks, reviewer rules, steering-file cleanups, tool economy, information access), ranked by severity. Markdown in chat, or a self-contained HTML page on request. Propose only. Runs only when the user types /retro [session | run] [html]."
disable-model-invocation: true
---

# harnex retro

Look back at one coding session and propose changes to the agent's
**environment** (the repo's checks, steering files, docs, and tools) so the
next run goes better. Not part of the harnex flow; runs only on request.
Propose only: never edit, commit, or file anything without a yes.

## 1. Sources (read-only)
Arguments:
- `html`, in any position: also write the HTML page (step 4).
- none or `session`: the current session.
- `run`: the last `/harnex` run in this repo (its timings and metrics
  records), plus the current session if it ran it.
- `session <id or path>`: a past Claude Code session. Find its transcript
  with `grep -l '"cwd":"<repo path>"'` over the `*.jsonl` files under
  `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects/` (never derive the folder
  name from the path); newest first, ask which one when unsure. Codex: transcripts
  live under `~/.codex/sessions/` (match on the recorded cwd the same way).
  OpenCode: past sessions are not supported; say so and use the current
  one.

Read:
- **harnex run data, when the session ran `/harnex`:** the timings file
  (`harnex-timings.log` in the git dir, `git rev-parse --absolute-git-dir`, of the repo or
  worktree the run used; a different checkout: skip timings and say so), the last
  records in `~/.harnex/metrics.jsonl` (or `HARNEX_METRICS`) for this repo
  (`flow`, `settings`, `rounds`, `findings`, `escaped`, `tests`,
  `red_check`; older records carry `path`: `Quick` reads as `flow: quick`,
  `Standard` and `Full` as `flow: harnex`), and on `Plan: doc` the plan
  doc's `Follow-ups` and the run's `Lessons:`.
- **Escapes:** pr-review records with `harnex_pr: true` and CRITICAL or
  MUST-FIX `findings` or `fail_rows`. For this repo's PRs: `gh pr view
  <pr_number> --json url` (GitLab: `glab mr view <pr_number> -F json` →
  `web_url`); use it only when `node <this skill's folder>/../harnex/harnex.mjs key <url>`
  equals the record's `pr_key`, then `python3 <this skill's folder>/../pr-review/threads.py <url>
  --all`. No match or another repo: list the record and its `fail_rows`,
  and say so. Each one escaped `/harnex` and is the first candidate for a
  new check.
- **The repo's guardrails:** its check commands (`package.json` scripts, the
  build tool's lint/check/test targets), pre-commit hooks, and CI config;
  its CLAUDE.md, AGENTS.md, and `.claude/rules/`; the user-scope steering
  file (`${CLAUDE_CONFIG_DIR:-$HOME/.claude}/CLAUDE.md`, or OpenCode's
  `~/.config/opencode/AGENTS.md`) when it exists.

## 2. Find candidates
Look for these, each tied to something that happened in the session:
- **Navigation:** the agent took long to find a file, or missed a hidden
  dependency between files. Fix: a navigation pointer (one line in
  CLAUDE.md or a doc linked from it).
- **Automated checks:** the agent made a mistake a check could have caught.
  Read the repo's own check commands and CI first: a check that exists but is
  not wired into the hook or CI, or silently broken, is the finding, not a
  new one. A repo with no guardrail at all (no pre-commit hook and no CI job
  running lint, typecheck, and tests) is itself a finding.
- **Review rules:** the reviewer missed a mistake. Classify it first:
  - **mechanical** (a banned API, an import shape, a file-location rule, a
    fixed syntactic pattern): a deterministic check in the repo's own linter,
    a pre-commit hook, or a CI job, whichever is cheapest there. Prefer the
    check over a written rule.
  - **judgement** (cross-file consistency, matching the surrounding style):
    a rule in the repo's own standards (`.claude/rules/` or the file its
    CLAUDE.md points to), which the reviewer reads.
- **Steering files:** CLAUDE.md or AGENTS.md (repo or user scope) holds
  instructions that belong in a check or a review rule, or lines that change
  nothing about the agent's behavior (no-ops). These files reach every
  agent's context; they should hold little beyond navigation pointers.
- **Tool economy:** expensive tool calls (whole-file reads, unfiltered
  output, repeated searches, a token-heavy CLI or MCP) that a narrower
  command, a script, or a pointer would avoid.
- **Information access:** a crucial fact the agent could not get (dev-server
  logs, a read-only view of a third-party service, test data). Fix: give
  access, read-only by default.

Where the fix lives: implementation carries the most context pressure, review
the least, so standards are enforced in review or by checks, not by more
instructions to the implementer. A gap in harnex itself (a phase agent's
prompt, a tier profile, a standards rule) is labelled `harnex issue`;
propose it, never edit the installed plugin.

## 3. Report
Up to 7 candidates, most severe first (severity: how often it will recur ×
what it cost this session in time, rounds, or escaped defects). Per candidate:

```
<n>. [<category>] <one-line problem>
   Evidence: <transcript moment, tool call, or path:line>; cost: <minutes, rounds, or tokens>
   Change:   <the exact check, rule, pointer, or access, and the file it goes in>
   Effort:   <S | M | L>
```

Nothing worth changing: say so in one line. Then ask once with
AskUserQuestion: apply one candidate now, file them as issues (`gh issue
create`, else `glab issue create`; Jira only when its MCP is connected), or
nothing; and, unless `html` was given, "Save as HTML?". Act only on the
answer; an applied change follows the repo's rules and is proven like any
other change.

## 4. HTML (optional)
Only on `/retro html` or a yes to "Save as HTML?". Write one self-contained,
human-readable page, `retro-<YYYY-MM-DD>.html`, with the same candidates:
- **Where:** `harnex/` inside the git dir (`git rev-parse --absolute-git-dir`;
  never committed; `mkdir -p` it) unless the user names a path. Outside a
  git repo: the current directory. Print the path, then offer `open <path>`
  (macOS; `xdg-open` elsewhere); run it only on a yes.
- **Style:** Apple-like. System font stack (`-apple-system,
  BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`), white page and
  true black (`#000`) in dark, hairline separators (1px, low-contrast), one
  accent color, generous whitespace, a narrow centered column. Light and
  dark via `prefers-color-scheme` with CSS variables. No external
  resources: no web fonts, scripts, images, or links out; inline CSS only.
- **Content:** a title, the date, repo name, and source (session or run); a
  one-line summary; then the candidates as a ranked list. Each: rank,
  category tag, the one-line problem, Evidence and cost, Change (code
  formatted, with its file), Effort. End with what was not checked. Escape
  all transcript text as HTML; never include secrets or `.env` values.
- Write the file once; do not iterate on the design unless asked.

## Gotchas
- Ground every candidate in this session; no generic advice.
- Never quote secrets, tokens, or `.env` values from the transcript.
- Never write to `~/.harnex/metrics.jsonl` or the timings file; the retro
  reads them.
