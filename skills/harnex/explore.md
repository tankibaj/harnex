# harnex: Explore (several solutions, you pick one)

Loaded by the `harnex` orchestrator for `/harnex explore [standard|full]
<requirement>`, or when the developer picks "Try alternatives" on a brief.
Code is cheap; picking the wrong approach is not. Build up to 3 approaches
side by side, compare them, keep one.

## When
- **Offered** on a Standard or Full brief (brief.md) only when the plan has
  an `Approaches:` field with 2 or more options, and the change is in one
  repo. Never on Quick, never across several repos.
- **Forced:** `/harnex explore <requirement>`; a mode word may follow
  `explore` (`/harnex explore full <requirement>`). Quick-sized or one
  obvious approach: say so in one line and run the normal flow. Several
  repos: say explore is single-repo, run the normal flow.
- **Clean start:** the developer's checkout must have no uncommitted or
  untracked changes (`git status --porcelain` empty). Otherwise ask them to
  commit or stash first, and stop.

## 1. Approaches (this is the brief)
Reuse the plan's `Approaches:`; only on a forced explore spawn
`harnex:planner` with "explore: 2-3 approaches". Show them as one brief,
in brief.md's format, with Goal shared and one block per approach:

```
Mode: <Standard | Full> (<reason>)
Goal: <shared, 1–2 sentences>
A: <name> · Plan: <max 3 bullets> · Trade-off: <one line> · Risk: <or none>
B: ...
Cost: about N× the time and tokens of one.
```

Ask (wait stamps around it), `multiSelect: true`, one option per approach:
two or three picked: build them; exactly one: no explore, the normal flow
with that approach's plan; Other: stop or refine. Full: before any build,
the planner writes one plan doc per picked approach
(`docs/plan/<feature-slug>-<x>-<YYYYMMDD-HHmm>.md` in the checkout), each
through the size check and the grounding check (SKILL.md "Standard and
Full" step 1); show the `Grounding:` lines and ask once more. Nothing is
built before that last yes.

## 2. Build
All paths absolute. `<main>` = the developer's checkout (stamps and its git
dir stay there). `base=$(git -C <main> rev-parse HEAD)` once; every later
`<base>` is that SHA. Before creating anything, clear leftovers of an
earlier run: `git -C <main> worktree prune`, then remove any
`<main>-explore-*` directory and every branch listed by `git -C <main>
for-each-ref --format='%(refname:short)' 'refs/heads/explore/<slug>-*'`.

Per picked approach X: `git -C <main> worktree add -b explore/<slug>-x
<main>-explore-x <base>`, then link the checkout's dependencies the way
standards.md "Independent red check" does (e.g. a link to its installed-packages directory).
In one message, one `harnex:implementer` per worktree (the worktree path is
its repo; no `isolation` option), the shared requirement, and only its own
plan (Full: its plan doc path). When each returns, commit its work in its
worktree, leaving the dependency link out: `git -C <wt> add -A -- .
':(exclude)<link>' && git -C <wt> commit -qm "wip: explore <x>"`. A failed
implementer: its approach is out; continue with the rest.

## 3. Check, one at a time
Per worktree, in turn (shared ports, servers, and test databases): a
`harnex:validator` on the IMPACTED tier without e2e or a browser walk, and
a `harnex:reviewer` (`<base>` = the SHA), the worktree as the repo. One
pass: no fix rounds, no UI review, no QA.

## 4. Compare
One table, measured with `git -C <wt> diff --shortstat <base>...HEAD`
excluding lockfiles and generated paths:

| | A | B | C |
|---|---|---|---|
| Lines changed | | | |
| Files | | | |
| Tests (validator) | PASS / FAIL n | | |
| Reviewer | CRITICAL n, MUST-FIX n | | |
| New dependencies | | | |
| Reads like | one plain-words line | | |

Recommend one (fewest lines that pass and review clean; ties: the
simplest). Ask: keep one (one option per approach), or Other: refine
(once per run) or stop.

## 5. Keep one
1. Check `git -C <wt-kept> log -1` shows the wip commit, then
   `git -C <main> worktree remove --force <wt-kept>`.
2. In `<main>` (still clean, still at `<base>`): `git checkout -b <feature
   branch> explore/<slug>-<kept>` (standards.md "Branches", issue
   reference included), then `git reset --soft <base>`, so the change is staged and
   uncommitted for the normal loop.
3. Full: keep the kept approach's plan doc, delete the others.
4. Continue in `<main>` at SKILL.md "Review loop" (fixes, UI review, QA,
   pre-PR gate, report, Delivery) with the kept plan as the plan.

## Cleanup (every exit)
Kept, refined, stopped, or failed: `git -C <main> worktree remove --force`
every other `<main>-explore-*`, delete every branch from the `for-each-ref`
list above (one `git branch -D <name>` each), and say which. A refine
starts a new round only after the old one is gone. Never touch the
developer's other branches or files.

## Metrics
`explore: {rounds, built, kept}` (`built`: approaches built across rounds;
`kept`: the letter, or `null`). Kept: it goes into the normal run record
at Completion. Stopped or failed: write the run record now (report.md
"Metrics record", `path` the mode, `tests: "NOT VERIFIED"`, other keys
null).
