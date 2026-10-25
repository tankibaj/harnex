---
name: qa
description: "harnex QA: writes manual test cases for a PR (GitLab: MR) or a goal from its requirement, acceptance criteria and diff, then (on your yes) runs the ones you pick against a local or non-prod environment through the real UI and the service's OpenAPI, and reports pass/fail. Report only; never edits code. Runs only when the user types /qa [PR URL | goal]."
disable-model-invocation: true
---

# harnex QA

Manual test cases for one change and, if you want, a run of them in a real
environment. For a QA engineer or a second developer on any PR, or for a
goal on the current branch. Report only: never edit code, commit, approve, or merge;
never post or run anything without a yes. Never prod.

Agent names: `harnex:<agent>` in Claude Code, `harnex-<agent>` in Codex and
OpenCode (`scripts/install-agents.mjs`). None installed: do that agent's work
yourself with the same inputs and output (see `../harnex/SKILL.md`).

## 1. Resolve the change
- **PR link, number, or branch:** resolve the PR as
  `../pr-review/SKILL.md` step 1 does (GitHub first, GitLab second; the
  `threads.py --parse` next to that skill; CLI auth check; stop with the
  login command when missing). Read the head the way step 2 there does
  (read-only worktree at the head, the base SHA for every diff, removed at
  the end).
- **Goal or nothing:** the current repo; the diff is the branch against
  `origin/HEAD` plus uncommitted files. No diff and no goal: ask for one.
- Requirement: `../harnex/input.md` (issue reference from the PR title,
  then the branch; the PR description or the goal as the text). Nothing
  usable: say `no acceptance criteria` and derive the cases
  from the diff alone.
- No UI and no API in the diff (docs, config, internals only): say so in one
  line and stop.

## 2. Cases
Spawn `harnex:qa` in mode `cases` with the requirement, criteria, repo (the
worktree), base SHA, and the standards path
`../harnex/standards.md`. Show its table as is
(ID, Precondition, Steps, Expected, Type; max 10, happy first).

## 3. Offer to run
Ask with AskUserQuestion, one question at a time:
1. **Run them?** Run the happy cases (Recommended) / Run all / Cases only.
   Other (free text): the case IDs to run.
2. **Where?** Local dev server / A non-prod stage (Other: its URL). Then
   confirm the origin in one line: "`<origin>` is not prod?" (yes / no).
   Not confirmed, or it looks like prod: stop at cases only.
   - **Local, on a PR:** only your own PR or a collaborator's in the same
     repo; never a fork. The dev server runs PR code on your machine: start
     it as the repo says (README/CLAUDE.md, compose, a local cluster) with
     integration tokens unset (e.g. `env -u GITHUB_TOKEN -u GH_TOKEN -u
     GITLAB_TOKEN <cmd>`), stop it at the end. A service that needs a
     database or broker the repo does not start itself: offer a stage
     instead.
3. **Login:** say "A browser window will open; sign in yourself. I never see
   or type passwords."

Cases only, or no environment: step 5 with `QA SKIPPED (<why>)`.

## 4. Run
Spawn `harnex:qa` in mode `run` with the picked IDs, the confirmed origin,
and the screenshot directory `harnex-qa/` inside the git dir (`git rev-parse --absolute-git-dir`)
(inside `.git`, never committed; delete it after step 6).
- `NEEDS LOGIN`: tell the human to sign in in the open window and wait for
  "done", then re-spawn with the cases not yet run and the results so far.
  Second time: stop, remaining cases `NOT VERIFIED: login`.
- `BLOCKED`: relay the reason; remaining cases `NOT VERIFIED`.
- Timebox: about 10 minutes of wall time. Past it, do not re-spawn; cases
  not yet run are `NOT VERIFIED: timebox`.
- Records left over in its report: name them to the human; never delete
  them yourself.
Only CRITICAL or HIGH failures are findings (max 5): repro steps, expected
vs actual, MUST-FIX. Lower failures: one line `Not reported: n minor`.
A finding with no screenshot or response line as evidence is dropped.

## 5. Report
The cases table with a result column, the findings, `Not reported`, test
data cleaned up, and what was `NOT VERIFIED`. Verdict: `QA PASS`, `QA FAIL`
(any finding), or `QA SKIPPED (<why>)`. Skipped is never an error.

## 6. Post (ask first)
Ask once, `multiSelect: true`: post the cases (and results, if run) to the
PR and/or to the linked issue. PR: write the body to a temp file, then
`gh pr comment <n> -R <owner>/<repo> --body-file <file>` (GitLab: `glab mr
note create <iid> -R <project> --resolvable=false -m "$(cat <file>)"`);
delete the file after. Issue: `gh issue comment <n> --body-file <file>`
(GitLab: `glab issue note`); Jira only when its MCP is connected (load with
ToolSearch if deferred). The body ends with `(harnex:qa)`. Never include a
token, a password, a header, or response data; describe screenshots, do not
attach them. No issue reference: the issue is not offered.

## 7. Metrics
Append one line (`../harnex/report.md` "Metrics
record") with `kind: "qa"`, `repo`, `pr_key` (12-character hash of the web
URL: `node <this skill's folder>/../harnex/harnex.mjs key <web_url>`; omit for a goal), `cases`,
`run`, `failed`, `findings` (`{critical, high}`), `env`
(`local|stage|none`), `posted`. No names, URLs, or text. Skip silently on
failure.

Standalone: `/harnex` never runs or offers it. Run `/qa` yourself, e.g. on
the PR `/harnex` opened.

## Gotchas
- The worktree is the target; never test the current checkout unless it is
  the PR head.
- "Cases only" is a complete run, not a failure.
- Never substitute a repo's own QA agent for `harnex:qa`.
