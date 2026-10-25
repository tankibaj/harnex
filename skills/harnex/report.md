# harnex: Completion

Loaded by the `harnex` orchestrator at Completion.

One report shape for both flows. Quick has no timings file and no plan
doc; everything else applies to both.

## Timings (`/harnex` only)
Stamp to a file, never to memory; each stamp is one self-contained command
(the file sits inside `.git`, never committed):
`echo "<label> $(date '+%F %T')" >> "$(git rev-parse --absolute-git-dir)/harnex-timings.log"`
- `run start` before the plan phase (truncate first with `: > "$(git rev-parse --absolute-git-dir)/harnex-timings.log"`),
  `<phase> start|end` per phase, `wait start|end` around each user wait,
  `run end`.
- At Completion, `cat` the file and compute every duration from it; never
  estimate. Report waits separately. `Plan: doc`: a `## Timings` section in
  the plan. `Plan: chat`: one line (`Timings: plan 4m, implement 12m,
  gates 6m, fixes 0, total 27m`).

## Plan doc (`Plan: doc`)
Set the plan (and WP docs) to `Done` once every checklist item is `[x]` or an
approved `[~] skipped`, validation passed, and every reviewer approved.
Accepted findings go to a `## Follow-ups` section: severity, file:line, one
line.

## Final report lines (none dropped)
- `Flow:` the flow and the settings line, why, and any override warning.
- `Timings:` from the timings file (`/harnex` only).
- `Tests (<who>):` commands and numbers (`validator`, or `orchestrator` on
  Quick and after inline fixes), plus the red check (or NOT VERIFIED; Quick:
  the failing-before run).
- `Review:` each reviewer's verdict and the model it ran on.
- `UI review:` the `ui-ux-reviewer` verdict, or `UI scope none` checked
  against the changed-file set. UI scope with no UI review means not done.
- `Checklist:` every plan item (Quick: the chat plan's) with its evidence (command and result, test
  name, reviewer line) or `[~] skipped: <reason>`. Skipped gates (e2e,
  browser walk, red check) are listed, never omitted. An item with neither
  is not done: do it, or ask the user to approve the skip.
- `Done checks:` each with its evidence, or NOT VERIFIED.
- `Security scans:` secret scan, and the dependency audit when a lockfile
  changed.
- `Not verified:` what could not be checked, or `nothing`.
- `Follow-ups:` accepted findings (severity, file:line, one line) or `none`.
  Offer to file them as issues (`gh issue create`, else `glab issue
  create`; the tracker's MCP if the run came from one); never file without a
  yes.
- `Guide:` the reviewer's guide (next section), shown in full after these
  lines.
- `Lessons:` up to 2 proposed mechanical guards (lint rule, hook, test, type,
  CLAUDE.md line) that would have caught a CRITICAL, MUST-FIX, or failing
  test from this run before review, or `none`. Propose only.
- `Criteria:` the pre-PR gate (next section).

## Pre-PR gate (both flows)
The same bar `/pr-review` applies, so the second reviewer finds
nothing. Fill rows 1–12 of
`../pr-review/criteria.md` from this run's
evidence, as its "In /harnex" column says; re-derive nothing an agent
already proved. On Quick, you are the validator and the chat plan is the
plan: rows 2, 3, 5, and 6 come from your own test and scan output and the
fresh reviewer. On either flow, row 7 is n/a only when no risk area is
touched, row 8 only when no UI is touched.
- Row 4 is the tier result (no pipeline yet). Rows 8 and 12 are judged on
  the draft PR title and description you will propose at Delivery. A
  text-only run with no issue: the issue reference in row 12 is n/a.
- One line, n/a rows left out of the count: `Criteria: 9/9 PASS (n/a 6, 7,
  8)`, or the failing rows (`Criteria: 7/9, 9 WARN 640 lines, 11 FAIL README
  run command`).
- A FAIL from a reviewer or validator finding is already in the review loop;
  it adds no round. Rows 9, 11, and 12: fix inline once (no reviewer round),
  then re-check the row. A WARN left: ask once, with the delivery question,
  to accept it with a reason; an accepted WARN goes into the PR
  description's `Not verified`.

## Reviewer's guide (both flows)
Build it per `review-guide.md` from
this run's plan, implementer report, validator output, and the reviewer's
final `Risk hunks:`. Quick: the short form. It goes into the PR description
unchanged.

## Metrics record (both flows, passive)
Append one JSON line, never blocking and never sent anywhere; skip silently
if it fails:
`f="${HARNEX_METRICS:-$HOME/.harnex/metrics.jsonl}"; mkdir -p "$(dirname "$f")" && echo '<json>' >> "$f"`
with keys `ts`, `kind: "run"`, `repo` (basename(s)), `flow` (`quick` or
`harnex`), `settings` (`{plan, tier, reviewer, ui}`), `wps` (count, 0 on
Quick), `ticket` (issue
reference, or null), `minutes` (per phase and total from the timings file; Quick: null),
`waits_min`, `rounds`, `findings` (`{critical, must_fix, nice}` across all
reviewers), `escaped` (findings reviewers raised that the validator's tests
missed, count), `tests` (`PASS|FAIL|NOT VERIFIED`), `red_check`
(`proven|n/a|NOT VERIFIED`), `ui_review` (`APPROVE|CHANGES|none`), `explore` (`{rounds, built, kept}`, explore runs only, also when none was kept). No code,
file contents, requirement text, or names. `/pr-review`
and `/qa` write their own kinds with the keys their skills list.

## Delivery (both flows, always ask first)
Opening the PR is optional and needs the developer's yes; never push or open
one on your own. Host per standards.md "Hosting" (`gh` first, `glab` on
GitLab, where it is an MR).
- **Ask** with AskUserQuestion, one question:
  - Commit, push, and open the PR (Recommended), or as a draft PR;
  - commit and push only;
  - commit only (local);
  - nothing, I'll do it myself.
  For a small or personal project, also offer a direct merge.
- **Show first, then act:** before pushing, show the PR title and the target
  branch. The title is `type(scope): summary`, with the issue reference when
  there is one. The target is the repo's default branch (`git symbolic-ref
  --short refs/remotes/origin/HEAD`, minus `origin/`) unless the developer
  names another.
- **Open it:** write the description to a temp file per `pr.md` (summary,
  evidence, merge danger, the reviewer's guide, anything NOT verified). Then
  `git push -u origin <branch>` and
  `gh pr create --base <target> --title "<title>" --body-file <file>
  --label harnex [--draft]`
  (GitLab: `glab mr create --source-branch <branch> --target-branch <target>
  --title "<title>" --description-file <file> --label harnex [--draft]
  --yes`). Delete the temp file. A missing `harnex` label: retry once without
  `--label`.
- **A PR already exists** for the branch (`gh pr view <branch> --json url`
  succeeds; GitLab: `glab mr view <branch> -F json`): push only, never open
  a second; offer to update its description with the new reviewer's guide,
  merged into the current text (pr.md "Updating an existing description").
- **Print the link** as the last line of the run, ready to hand to the
  reviewer: `PR: <url> → next: /pr-review <url>`.
- Multi-repo: one PR per repo, each linking the others and stating merge
  order; print every link.
- No remote: offer to merge the feature branch into the default branch.
- Ask follow-ups, lessons, and skip approvals in the same message as the
  delivery question.
- A project spec or PRD this change affects: mention it in one line; never
  update it unasked.
