---
name: harnex
description: "harnex: plan → your approval → implement → validate → review with phase sub-agents, scaled by risk (Quick/Standard/Full, picked automatically; force with /harnex quick|standard|full [requirement]; build several approaches and pick one with /harnex explore <requirement>). On demand only: runs when the user types /harnex."
disable-model-invocation: true
---

# harnex (orchestrated)

You orchestrate. The goal is a change that does what was asked, is proven by
tests someone other than its author ran, and has had a fresh correctness
review, with rigor scaled to risk, not size. Phase agents (`harnex:planner`,
`harnex:implementer`, `harnex:validator`, `harnex:reviewer`,
`harnex:ui-ux-reviewer`) carry their own rules and output
formats; all of them follow
`standards.md` next to this file. Read it first, and read
`brief.md`: every mode shows its brief
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
an optional mode word may follow `explore`, the rest is the requirement. The same file runs when the developer picks
"Try alternatives" on a brief.

## Requirement first
Before choosing the path, build the requirement per
`input.md`: plain text (enough on its own), an issue URL, or both. Every
phase gets that requirement and its acceptance criteria verbatim; the
planner turns each criterion into a `Done checks:` item. A text-versus-issue
conflict is an open question (Full path). Criteria agreed as a draft: show
them with the plan; nothing selected for an issue-only input: stop and ask
for the goal.

## Risk decides the path
**Risk areas:** auth/authz, schema/migrations/data model, security fixes or
secret handling, CI/build/test-runner/tooling config, new or upgraded
dependencies, a public contract (REST/OpenAPI, an event or message, an
exported module). State the path in one line: `Path: <path>, <reason>`.
- **Quick**: one repo, one place, no risk area, UI scope `none`, no open
  question; a bug needs a reproduction and a single-place root cause. You
  implement inline and run the tests yourself.
- **Standard**: one repo, no risk area, no open question. The planner
  returns a chat plan; you show its brief and wait for approval.
- **Full**: a risk area, an open question, more than one repo, or work the
  planner splits into a sequence or WPs. Plan doc, its brief and approval,
  FULL test tier, reviewer on the default model.

Escalate (Quick → Standard → Full) in one line the moment a condition
breaks, carrying over what you learned. When unsure, take the bigger path.
Once code is written, the path never shrinks, and a newly found risk area
only adds its safeguards (FULL tier, default-model reviewer) with a one-line
note.

`/harnex quick|standard|full <requirement>` forces a path: the first word
is the mode, the rest is the requirement. The mode word alone: ask for the
goal once, then build the requirement from the answer (Requirement first)
with the forced mode kept. Forcing up is
always followed. Forcing down onto a known risk area: warn in one line, keep
the forced path, and keep the risk safeguards. Never ask which path to
take; the brief's "Change mode" option is how the developer overrides it.

## Quick
1. Plan it yourself: the change, the root cause (bugs), the test that
   proves it. Show it as the brief (brief.md) and wait for "Looks good".
   Then branch off the default branch if on it.
2. Bugs and new behavior: write the test, show it failing, then the change.
3. Run the profile's impacted tests, lint, typecheck, and the secret scan
   yourself; add smoke if a smoke-covered path is touched. Webapps: walk the
   flow.
4. Spawn a fresh `harnex:reviewer` (`model: "sonnet"`) with the requirement,
   the chat plan, and your test output. Then "Review loop".

## Standard and Full
1. **Plan** (`harnex:planner`): input is the requirement and its acceptance
   criteria verbatim (from "Requirement first"), the path,
   the target repo(s), the tier profile, and today's timestamp. Ask its open
   questions in one AskUserQuestion call, recommended option first; any open
   question moves Standard to Full (re-spawn the planner with the answers).
   Standard: show the brief (brief.md) and wait for "Looks good".
   Full: a plan over 60 lines (checklist and WPs excluded; `wc -l`) or a
   change estimated over about 400 lines goes back to the planner once to
   cut or split it before the grounding check.
   Full: run the grounding check (spawn `Explore`, `model: "haiku"`, with the
   plan path: confirm each cited `path:line` and each `Assumptions:` line;
   return anchors checked, mismatches, assumptions confirmed or refuted), fix
   the plan, then show the brief (brief.md) with the plan path and
   `Grounding: N anchors, M fixed, K unverified`, and wait for "Looks good".
2. **Implement** (`harnex:implementer`): branch first, in every target repo.
   Input: the plan (path, or the chat plan verbatim) and WP path. Independent
   WPs in the same repo run concurrently, each with `isolation: "worktree"`;
   merge them back after. WPs in different repos are already isolated and run
   concurrently without it. A sequence runs steps 2-4 per change, in order.
3. **Validate ∥ review**, in one message: `harnex:validator` (plan,
   implementation report, tier, tier profile, dev-server URL) and
   `harnex:reviewer` (requirement, plan; `model: "sonnet"` on Standard,
   default model on Full). Multi-repo: one validator per repo, one reviewer
   across all of them (the contracts between repos are the point).
4. **UI review** (`harnex:ui-ux-reviewer`), only after the validator passes,
   when UI scope is not `none`. Scope is the plan's `UI scope` widened by the
   changed files (standards.md "UI and UX review"): `git diff --name-only
   <base>...HEAD` plus uncommitted and untracked, where `<base>` is
   `git symbolic-ref --short refs/remotes/origin/HEAD`, else `develop`, else
   `main`, else `master`. Re-evaluate it every round.

Webapps, every path: start the dev server once before the first validation,
the way the repo says (standards.md "Run target"; desktop app:
`preview_start`), pass its URL on, stop it at Completion.

## Review loop
- Only CRITICAL, MUST-FIX, and failing tests open a round. Any other label
  counts as MUST-FIX; NICE-TO-HAVE goes to the report.
- **Escalate and wait** instead of fixing when a finding is CRITICAL, a fix
  would change scope, architecture, a public contract, or an existing test
  the plan doesn't name, a new dependency is copyleft, or the plan doesn't
  settle the call. Present finding, options, recommendation.
- **Fix:** a few lines outside any risk area and no failing test: fix it
  yourself. Otherwise `harnex:implementer` gets the combined list of
  failures and findings.
- **Re-check the delta only:** the reviewer gets its previous findings and
  the fix diff and verifies those, not the whole change. Re-run the tests
  (yourself on Quick and after your own fix; the validator on the plan's tier
  otherwise). The UI reviewer re-runs in delta mode when UI findings or UI
  files were touched.
- **Cap: 3 rounds**, inline fixes included. Still failing: stop and escalate
  with what remains, what was tried, and a recommendation.

## Completion
Follow report.md, including the metrics record. Quick: four report lines, no
timings. Standard and Full: timings (stamped from `run start`), the full
report lines, follow-ups. Every path: the reviewer's guide per
`review-guide.md`, the pre-PR gate
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
- On Standard and Full, test numbers come from the validator, never from you
  or the implementer. Yours there are NOT VERIFIED.
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
