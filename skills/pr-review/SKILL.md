---
name: pr-review
description: "harnex PR review: checks any open GitHub PR (or GitLab MR) against every review criterion and its existing review threads, gets a fresh correctness review, renders the reviewer's guide, asks the questions a reviewer should be able to answer before approving, and posts the findings you pick as inline comments (nothing posted without a yes). Use when the user asks to review a specific PR or MR and gives its URL, number, or branch; not for local changes with no PR. Also /pr-review [PR URL | number | branch]."
---

# harnex PR review

Help a human review one PR (GitLab: MR), whether harnex made it or not:
check it against `criteria.md`, get a correctness review from
`harnex:reviewer`, show how to read it, and check that the developer
understands its risky lines. You recommend; the human decides. Never edit,
commit, approve, merge, or post without a yes. GitHub first, GitLab second.

Agent names: `harnex:<agent>` in Claude Code, `harnex-<agent>` in Codex and
OpenCode (`scripts/install-agents.mjs`). None installed: do that agent's work
yourself with the same inputs and output (see `../harnex/SKILL.md`).

## 1. Resolve the PR
Works from any directory; the session's repo does not matter.
- **PR link** (`https://github.com/<owner>/<repo>/pull/<n>`) or **MR link**
  (`https://<host>/<project path>/-/merge_requests/<iid>`): run
  `python3 <this skill's folder>/threads.py --parse <URL>` (the `threads.py`
  next to this file); it prints `host`, `project`, `number`, `clone_url`,
  and `kind` (`github` | `gitlab`). Exit 2: not a PR or MR link. Use
  `-R <owner>/<repo>` on gh calls (`-R <project>` on glab calls) below.
- **Number or branch:** the PR of the current repo (`git remote get-url
  origin` gives host and project; a `github.com` origin is GitHub, else
  GitLab); outside a git repo, ask for the link.
- **None:** the PR for the current branch.
- GitHub: `gh pr view <url|n> --json number,title,body,author,headRefName,headRefOid,baseRefName,baseRefOid,isDraft,additions,deletions,changedFiles,url,statusCheckRollup,commits`.
  Diff: `gh pr diff <url|n>`. Checks: `gh pr checks <url|n>`.
- GitLab: `glab mr view <iid> -R <project> -F json`. Use `iid`, `title`,
  `description`, `author.username`, `source_branch`, `target_branch`,
  `draft`, `web_url`, `diff_refs.base_sha`, `diff_refs.head_sha`,
  `changes_count`, `head_pipeline.status`, and `head_pipeline.id`
  (`head_pipeline` is null when no pipeline ran). Diff: `glab mr diff <iid>
  -R <project> --raw`.
First check the CLI: `gh auth status` (`--hostname <host>` when not
github.com), or `glab auth status --hostname <host>`. Missing or not logged
in: stop with the install and login command for that host (`gh auth login`,
`glab auth login --hostname <host>`); never fall back to the web UI or a
token in the environment.
No PR found, or it is merged or closed: say so and stop.

## 2. Check out the head, read-only
Pick the repo to read from, first that works:
1. The current repo, when its `origin` is the PR's project.
2. A local clone of that project: ask once for its path (offer "none").
   Check its `origin` matches; a mismatch is not used.
3. A temporary blob-less clone, deleted at the end:
   `git clone --filter=blob:none --no-checkout <clone_url> <tmp-clone>`.
Never modify the developer's own checkout: no checkout, reset, or stash.
In that repo, fetch the PR's own head ref, which also works for forks and
deleted source branches: `git fetch origin pull/<n>/head` (GitHub) or
`git fetch origin refs/merge-requests/<iid>/head` (GitLab), and the target
branch (`git fetch origin <base branch>`) so the base SHA is present. Then
`git worktree add --detach <tmp> <head sha>`. Base for every diff: the base
SHA (`baseRefOid` / `diff_refs.base_sha`). At the end, also after a failure:
`git worktree remove --force <tmp>`, and delete `<tmp-clone>` if you made
one. Say which repo you read from.

## 3. Requirement
Follow `../harnex/input.md`, with the issue reference from the PR title,
then the branch, then the PR description (`Fixes #12`), and the PR
description as the text. For a PR:
- Candidates in "Missing or unclear criteria" may also cite the PR
  description; never the diff alone.
- A draft (`ac_source: draft`): criterion 1 is at most WARN, never PASS,
  and the recommendation is at least NEEDS DISCUSSION. Nothing selected:
  criterion 1 is `NOT CHECKED: no criteria agreed`.
- No issue reference or no way to read it: `ac_source: none`, the
  requirement is the PR description, and criterion 1 is
  `NOT CHECKED: <why>`.

## 4. Correctness review
Prior run first: run step 5's `threads.py` call now and look for threads
whose notes contain `(pr-review)`. None: a full review. Their newest
`commented_at` is the head SHA: say this head was already reviewed and ask
once, show those findings or review again. An older SHA: ask once, delta
(Recommended: the reviewer in delta mode with those findings as its previous
findings and `git diff <commented_at> <head sha>` as the fix diff) or a
full review.

Full review: spawn `harnex:reviewer` with: `Standalone review, no plan.`, the standards
file `../harnex/standards.md`, the requirement from step 3, the worktree
path as the repo, `<base>` = the base SHA, and the changed file list.
Model: your default (no `model` override) when a risk area is touched (auth, schema or
migrations, secrets, CI/build config, dependencies, a public contract);
otherwise `sonnet`.

Scope it to the change: over about 400 changed lines in non-test code, name
the files that carry the risk (entry points, migrations, auth, money,
schedulers) as the review target and list the rest as context only. Run it
in the background and do steps 5 and 6 and the requirement work meanwhile.
Timebox: 10 minutes. Still running then: stop it, and render with the
correctness findings `NOT CHECKED: reviewer timed out` and criterion 2 at
most WARN; offer to rerun it on fewer files.

Verify: when it returns CRITICAL or MUST-FIX findings, spawn one more fresh
`harnex:reviewer` (same model) in verify mode with those findings, the
requirement, the worktree path, and `<base>`; treat the marks as
`../harnex/SKILL.md` "Review loop" says (REFUTED dropped, PLAUSIBLE MUST-FIX
becomes NICE-TO-HAVE). Timebox: 5 minutes; timed out: keep the findings as
reported and add `Not checked: verify pass timed out`.

## 5. Existing threads
`python3 <this skill's folder>/threads.py <PR or MR URL> --all` (the
`threads.py` next to this file) lists every review thread with `resolved`,
`path`, `line`, `commented_at` (the commit it was written on: GitHub
`originalCommit`, GitLab head SHA), and its notes; same JSON for both hosts.
Check only change requests on code (threads with a `path`), newest first,
at most 15; skip questions and general discussion. Mechanical checks only,
each with its evidence:
- **Resolved without change:** resolved, no reply, and `git diff
  <commented_at> <head sha> -- <path>` is empty: WARN. An older commit may be
  missing locally: `git fetch origin <commented_at>`; still missing (force
  push): `NOT CHECKED: commented-on commit gone`. No `commented_at`:
  `NOT CHECKED: no commit recorded`.
- **Fix claim:** a reply naming a commit (`fixed in <sha>`): the commit is
  on the PR (`git merge-base --is-ancestor <sha> <head sha>`); a named test
  exists in the head. Either false: FAIL.
- **Still open:** unresolved: list it; the human decides if it blocks. A
  GitHub thread marked outdated is still listed, as outdated.
Never judge whether a fix is good enough, and never reply or resolve. The
script fails (no `gh`/`glab` access to the threads): `NOT CHECKED: <why>`.
These go to criterion 13.

## 6. Criteria
Evaluate each row of `criteria.md` yourself from the diff, the checks, the
issue, and the reviewer's output. Correctness findings and `Risk hunks:`
come only from the reviewer, verbatim; add none of your own. Every status
cites its evidence. If you cannot check a row, mark it
`NOT CHECKED: <why>`, never PASS.

## 7. Render
Output exactly `output.md`, with the reviewer's guide built per
`../harnex/review-guide.md` (flow `PR review`).
Recommendation:
- `NEEDS CHANGES`: any CRITICAL or MUST-FIX finding, or any FAIL.
- `NEEDS DISCUSSION`: any WARN, or `NOT CHECKED` on the requirement or a
  risk-area row.
- `READY`: otherwise.

## 8. Questions
Ask 2-3 questions, each tied to one risk hunk and answerable from the
code: what happens on a given input, why a line is needed, what breaks if it
is removed. Never ask about style. When the description states no merge
danger, or calls a one-way change two-way (criterion 12), one of them names
the risky lines: what undoes `<path:line>` if this PR is reverted? When the
developer answers, judge each answer right, partly right, or wrong against
the code, cite `path:line`, and give the correct answer for any that miss.

## 9. Post (ask first)
Ask once with AskUserQuestion, `multiSelect: true`: each CRITICAL and
MUST-FIX finding (selected by default), each NICE-TO-HAVE (not selected),
and the summary note (recommendation, criteria, guide). A finding already
raised in an open thread is not offered; cite that thread instead.
- **Findings, GitHub:** one batched review, posted in one go: build the
  JSON in a temp file and show the list (path, line, body) first. Post only
  on the second yes: `gh api [--hostname <host>, when not github.com]
  repos/<owner>/<repo>/pulls/<n>/reviews --input <file>` with
  `{"commit_id": "<head sha>", "event": "COMMENT", "comments": [{"path":
  "<path>", "line": <n>, "side": "RIGHT", "body": "<body>"}]}`. A finding
  on a line outside the diff goes in the summary note instead (GitHub
  rejects it inline). `event` is always `COMMENT`, never `APPROVE` or
  `REQUEST_CHANGES`. If the call fails: put the findings in the summary
  note.
- **Findings, GitLab:** one pending comment each, visible only to you:
  `glab mr note draft create <iid> -R <project> --file <path> --line <n> -m
  "<body>"`; a line outside the diff: `--file <path>` only. Then show `glab
  mr note draft list <iid> -R <project>` and ask again; publish all at once
  with `glab mr note draft publish <iid> -R <project>` only on that second
  yes. A draft command fails: delete the drafts you made (`glab mr note
  draft delete <draft-note-id> <iid> -R <project>`) and put the findings in
  the summary note instead.
- **Body:** severity, the concrete case, the fix, and `(pr-review)`. On
  GitHub, a fix of at most 5 lines on the commented lines that fully fixes
  the finding goes in a ```` ```suggestion ```` block; any other fix stays
  prose.
- **Summary note:** write the body to a temp file, post it, delete the
  file. GitHub: `gh pr comment <n> -R <host>/<owner>/<repo> --body-file
  <file>`.
  GitLab: `glab mr note create <iid> -R <project> --resolvable=false -m
  "$(cat <file>)"` (does not block merging).
- Never approve, merge, or resolve a thread. Posted findings are ordinary
  threads: the author answers them.

## 10. Metrics
Append one line (`../harnex/report.md` "Metrics record") with
`kind: "pr-review"`, `repo` (the last segment of the project path),
`pr_key` (a 12-character hash of the PR's web URL: `node <this skill's
folder>/../harnex/harnex.mjs key <url>`; no names leave the machine), `verdict`, `findings`
(`{critical, must_fix, nice}`), `criteria` (`{pass, warn, fail,
not_checked}`), `diff_lines`, `ac_source`, `threads` (`{checked, open,
warn, fail}`), `refuted` (findings the verify pass dropped), `posted` (inline comments published), `harnex_pr` (true
when the description has the `<!-- harnex:run` marker: its `findings` and
criteria FAILs on rows 1-3 and 5-12 escaped the harnex run; rows 4 and 13
happen after the push), `fail_rows` (the failing row numbers), `pr_number`,
and `answered` (true once the developer answered the questions). Write it
after the questions are settled, or at the end of the session if they were
not answered. Skip silently on failure.

## Gotchas
- The worktree is the review target; never review the current checkout
  unless it is the PR head.
- `glab mr view` without `-F json` drops the SHAs; always use JSON.
- A draft PR is reviewed, but say it is a draft in the header.
- Checks still running are `WARN`, not PASS.
- Never substitute a repo's own reviewer agent for `harnex:reviewer`.
