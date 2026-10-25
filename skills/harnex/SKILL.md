---
name: harnex
description: "harnex: plan → your approval → implement → validate → review with phase sub-agents. Two flows: /harnex [requirement] (planner, work packages, the gates once on the merged change) and /harnex quick [requirement] (inline, then a fresh reviewer); settings derived from the change; build several approaches and pick one with /harnex explore <requirement>. On demand only: runs when the user types /harnex."
disable-model-invocation: true
---

# harnex (orchestrated)

You orchestrate. The goal is a change that does what was asked, is proven by
tests someone other than its author ran, and has had a fresh correctness
review, with rigor scaled to risk and size separately. Phase agents (`harnex:planner`,
`harnex:implementer`, `harnex:validator`, `harnex:reviewer`,
`harnex:ui-ux-reviewer`) carry their own rules and output
formats; all of them follow
`standards.md` next to this file. Read it first, and read
`brief.md`: every flow shows its brief
and waits for "Looks good" before any code. Then resolve the tier profile
per `tiers/README.md`. At Completion,
follow `report.md`. If you are a
sub-agent, never invoke this skill.

Pass every phase agent the standards path and the resolved tier profile path
as absolute paths; they cannot resolve relative paths on their own.
Agent names differ per tool: `harnex:<agent>` in Claude Code, `harnex-<agent>`
in Codex and OpenCode (installed by `scripts/install-agents.mjs`). No such
agent available: run that phase yourself, in order, with the same inputs
and output rules (the phase is described in this file and `standards.md`).

## Repos and precedence
- Work in the repo(s) the requirement touches; the current directory may be
  one repo or a workspace holding several. Resolve each target repo
  (`git -C <dir> rev-parse --show-toplevel`) and pass it to every agent.
- A repo's own CLAUDE.md, AGENTS.md, and `.claude/rules/` win on conventions
  (naming, structure, branching, test style, design system). harnex wins on
  process gates (test-first, red check, fresh review, tests as goalposts).

## Explore
The requirement starts with `explore`: follow
`explore.md` after "Requirement first";
the rest is the requirement. The same file runs when the developer picks
"Try alternatives" on a brief.

## Requirement first
Before choosing the flow, build the requirement per
`input.md`: plain text (enough on its own), an issue URL, or both. Every
phase gets that requirement and its acceptance criteria verbatim; the
planner turns each criterion into a `Done checks:` item. A text-versus-issue
conflict is an open question (`/harnex`, Plan: doc). Criteria agreed as a
draft: show them with the plan; nothing selected for an issue-only input:
stop and ask for the goal.

## Two flows
**Risk areas:** auth/authz, schema/migrations/data model, security fixes or
secret handling, CI/build/test-runner/tooling config, new or upgraded
dependencies, a public contract (REST/OpenAPI, an event or message, an
exported module).
- **`/harnex quick`**: no planner, no WPs, no worktrees. You plan in chat,
  implement inline, run the checks, then a fresh reviewer (and the UI
  reviewer when UI changed). Picked automatically for one repo, one place,
  no risk area, no open question; a bug needs a reproduction and a
  single-place root cause.
- **`/harnex`** (everything else): planner, implementers (one per WP), then
  the gates once on the merged change.

State the flow in one line: `Flow: <quick | harnex>, <reason>`. When
unsure, take `/harnex`. Quick escalates to `/harnex` in one line, carrying
over what you learned, the moment the work spans repos, needs WPs, grows
past about 400 changed lines, or hits an open question.

**Settings**, derived from the change, never asked; one line in the brief
(brief.md):
- **Plan:** `doc` (plan doc, size check, grounding check, WPs allowed) when
  the work splits into WPs or a sequence, exceeds about 400 changed lines,
  spans several repos, or has an open question; else `chat`. Quick: always
  `chat`.
- **Tier:** `full` for a risk area or a shared core module; else `impacted`.
- **Reviewer:** `default` model for a risk area; else `sonnet`.
- **UI:** `yes` when UI scope is not `none` (standards.md "UI and UX
  review"), re-evaluated against the changed files every round.

Once code is written, settings only grow: a newly found risk area adds
`Tier: full` and `Reviewer: default` with a one-line note.

`/harnex quick <requirement>` forces Quick: the first word is the flow, the
rest is the requirement. The word alone: ask for the goal once, then build
the requirement from the answer (Requirement first). Forcing Quick onto a
known risk area: warn in one line, keep Quick, keep the risk settings.
`/harnex standard` or `/harnex full` (the old modes, also after
`explore`): say `modes merged, running /harnex` in one line, drop the word,
and run the `/harnex` flow (never auto-Quick). Never ask which
flow to take; the brief's "Change settings" option is how the developer
overrides it.

## Quick
1. Plan it yourself: the change, the root cause (bugs), the test that
   proves it, the UI scope. Show it as the brief (brief.md) and wait for
   "Looks good". Then branch off the default branch if on it.
2. Bugs and new behavior: write the test, show it failing, then the change.
3. Run the profile's impacted tests, lint, typecheck, and the secret scan
   yourself; add smoke if a smoke-covered path is touched. Webapps: walk
   the flow. `Tier: full`: spawn `harnex:validator` on the full tier
   instead (never a full regression in the main context).
4. Spawn a fresh `harnex:reviewer` (model per settings) with the
   requirement, the chat plan, and your test output. `UI: yes`: after your
   tests pass, `harnex:ui-ux-reviewer` per "/harnex" step 4. Then "Review
   loop".

## /harnex
1. **Plan** (`harnex:planner`): input is the requirement and its acceptance
   criteria verbatim (from "Requirement first"), the target repo(s), the
   tier profile, and today's timestamp. Ask its open questions in one
   AskUserQuestion call, recommended option first; any open question means
   `Plan: doc` (re-spawn the planner with the answers). Derive the settings
   from its `Risk areas:`, `UI scope`, WPs, sequence, and size estimate.
   `Plan: chat`: show the brief (brief.md) and wait for "Looks good".
   `Plan: doc`: a plan over 60 lines (checklist and WPs excluded; `wc -l`)
   or a change estimated over about 400 lines goes back to the planner once
   to cut or split it before the grounding check. Then the grounding check
   (spawn `Explore`, `model: "haiku"`, with the plan path: confirm each
   cited `path:line` and each `Assumptions:` line; return anchors checked,
   mismatches, assumptions confirmed or refuted), fix the plan, then show
   the brief with the plan path and `Grounding: N anchors, M fixed, K
   unverified`, and wait for "Looks good".
2. **Implement** (`harnex:implementer`): branch first, in every target repo.
   Input: the plan (path, or the chat plan verbatim) and its WP path. One
   implementer per WP (no WPs: one implementer). WPs the planner marks
   `parallel: yes` in the same repo run concurrently, each with
   `isolation: "worktree"`, its worktree linked to the checkout's installed
   dependencies the way standards.md "Independent red check" does; WPs in
   different repos run concurrently without it; a WP with `depends:` starts
   after those it names. Each implementer runs its inner loop (failing test
   first, its WP's impacted tests, lint, typecheck) and reports numbers that
   are not authoritative. Merge every WP back before the gates.
   `early-review: yes` on a WP: spawn a `harnex:reviewer` on that WP's diff
   when it returns, and fix its findings ("Review loop") before the WPs
   that depend on it start.
3. **Gates, once on the merged change**, in one message: `harnex:validator`
   (plan, every implementation report, tier, tier profile, dev-server URL)
   and `harnex:reviewer` (requirement, plan, model per settings), both on
   the whole diff across all WPs. Multi-repo: one validator per repo, one
   reviewer across all of them (the contracts between WPs and repos are the
   point).
4. **UI review** (`harnex:ui-ux-reviewer`), once, after the validator
   passes, when `UI: yes`, over every changed screen. Scope is the plan's
   `UI scope` widened by the changed files (standards.md "UI and UX
   review"): `git diff --name-only <base>...HEAD` plus uncommitted and
   untracked, where `<base>` is `git symbolic-ref --short
   refs/remotes/origin/HEAD`, else `develop`, else `main`, else `master`.
   Re-evaluate it every round.
5. **Sequences** (the planner's `Delivery:` line): `separate PRs`: each
   change runs steps 2-4 and Completion in order, since each merges alone.
   `together`: implement the changes in order, then steps 3-4 once.

Webapps, both flows: start the dev server once before the first validation,
the way the repo says (standards.md "Run target"; desktop app:
`preview_start`), pass its URL on, stop it at Completion.

## Review loop
- Only CRITICAL, MUST-FIX, and failing tests open a round. Any other label
  counts as MUST-FIX; NICE-TO-HAVE goes to the report.
- **Escalate and wait** instead of fixing when a finding is CRITICAL, a fix
  would change scope, architecture, a public contract, or an existing test
  the plan doesn't name, a new dependency is copyleft, or the plan doesn't
  settle the call. Present finding, options, recommendation.
- **Fix:** Quick, or a few lines outside any risk area with no failing
  test: fix it yourself. Otherwise route each failure and finding to the
  `harnex:implementer` of the WP that owns its file (a file no WP owns:
  the WP whose change caused it; no WPs: one implementer), each with only
  its own list. The WPs are merged, so in one
  repo they run one after another.
- **Re-check the delta only:** the reviewer gets its previous findings and
  the fix diff and verifies those, not the whole change. Re-run the tests
  (yourself on Quick and after your own fix, except Quick on `Tier: full`;
  the validator on the plan's tier otherwise). The UI reviewer re-runs in delta mode when UI findings or UI
  files were touched.
- **Cap: 3 rounds**, inline fixes included. Still failing: stop and escalate
  with what remains, what was tried, and a recommendation.

## Completion
Follow report.md, including the metrics record: one report shape for both
flows, timings on `/harnex` only (stamped from `run start`). Both flows: the
reviewer's guide per `review-guide.md`, the pre-PR gate
(report.md: the `/pr-review` criteria, so the second reviewer finds
nothing), and delivery
(report.md "Delivery"): commit, push, and the PR are each optional and only
on the developer's yes; an opened PR's link is the last line.

## Gotchas
- Handoffs are the agent's entire context. Pass docs as paths and reports
  verbatim; a summary drops the line that mattered.
- Never substitute `general-purpose`, `harnex:suite-runner`, or a repo's own
  agent of a similar name (a repo `reviewer`, `test-runner`) for a harnex
  phase agent.
- On `/harnex`, test numbers come from the validator, never from you or the
  implementers. Theirs and yours there are NOT VERIFIED.
- Agents relabel severities (SHOULD, MINOR). Treat them as MUST-FIX; never
  downgrade a finding yourself.
- A failing test reported by a reviewer is a validation failure, not a
  review finding.
- `NOT VERIFIED: no browser tool` is an environment gap: fix the tool and
  re-run that reviewer. It is not a fix round and never goes to the
  implementer.
- Never run the UI reviewer on a failing build or alongside another browser
  session.
- Green by loosening a test is not green (standards.md "Tests are the
  goalposts").
- Diff against `<base>` from `origin/HEAD`, never a hardcoded branch.
- A NICE-TO-HAVE never opens a round; three rounds of polish is the failure
  mode the cap exists for.
