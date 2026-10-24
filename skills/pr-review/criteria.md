# PR review criteria

Each row: what to check, and when it is PASS, WARN, or FAIL. `n/a` when the
PR does not touch the area; `NOT CHECKED: <why>` when it does and you could
not check it. Rules come from `../harnex/standards.md`;
the repo's own CLAUDE.md, AGENTS.md, and `.claude/rules/` win on conventions.
The same rows gate `/harnex` before its PR (the pre-PR gate in
`../harnex/report.md`); the
last column says which phase proves each row there. A row that fails here on
a harnex PR escaped that gate.

| # | Criterion | How to check | PASS | WARN | FAIL | In /harnex |
|---|---|---|---|---|---|---|
| 1 | Requirement | Map each acceptance criterion to the `path:line` that does it; use the reviewer's requirement findings | every criterion from the issue mapped | a criterion only partly visible in the diff, or the criteria are a reviewer-selected DRAFT (SKILL.md step 3) | a criterion not done, or a reviewer requirement finding | reviewer check 1, `Done checks:` |
| 2 | Tests cover the change | New or changed branches, parsers, money, security, and data writes have a test that would fail on a plausible wrong version; every new or changed endpoint operation, validation, and error case has an integration test through the real endpoint, using the repo's own HTTP test setup (standards.md "API endpoints"); reviewer check 5 | covered | covered only by e2e or manual steps, or endpoint cases tested only at the handler level | untested logic of those kinds, or an endpoint operation with no test | validator, reviewer check 5 |
| 3 | Test integrity | Diff every changed test, snapshot, and golden file against the base (standards.md "Tests are the goalposts") | nothing weakened | a test change explained in the PR | a deleted, skipped, `.only`, loosened, or regenerated test with no reason | reviewer check 6 |
| 4 | Pipeline | `gh pr checks` on the head SHA (GitLab: the head pipeline status) | success | running, manual jobs pending, or no checks (repo has no CI) | failed | validator (tier tests; checks after push) |
| 5 | Security | Secret scan over the diff (the project's scanner, else `gitleaks`, else grep for keys, tokens, and password assignments); reviewer security findings | no hits, no findings | a placeholder hit, explained | a real hit, or a CRITICAL | validator scans, reviewer check 3 |
| 6 | Dependencies | Manifest or lockfile changed: each new or upgraded package's license and audit result | justified, permissive, no high/critical advisory | a pre-existing advisory | copyleft, or a new high/critical advisory | validator audit, plan |
| 7 | Risk areas | Migrations: a down migration or rollback note. Public contract (REST/OpenAPI, event or message, exported module): backward compatible or consumers listed | proven | proof only described | missing | plan, reviewer |
| 8 | UI | UI files changed (standards.md "UI and UX review"): screenshots or a recording in the PR; accessibility basics in the diff (names, labels, focus) | present | partial | none for a visible change | ui-ux-reviewer |
| 9 | Size and focus | Changed lines excluding generated files and lockfiles; one purpose (no refactor mixed with behavior) | ≤ 400 lines, one purpose | > 400 lines, or mixed but separable | > 1000 lines with no split | orchestrator: `git diff --shortstat <base>...HEAD` plus untracked files, excluding lockfiles (`*.lock`, `*lock.json`, `*lock.yaml`, `go.sum`) and generated paths |
| 10 | Duplication | For each new function, component, or helper, grep the repo for an existing one with the same job | none found | a near-duplicate worth a look | re-implements an existing helper (`new path:line ↔ existing path:line`) | reviewer check 7 (the re-implementation case) |
| 11 | Docs | A changed entry point, script, flag, endpoint, env var, or command that CLAUDE.md, AGENTS.md, or README still describes the old way | still true | — | invalidated and not updated | orchestrator: standards.md "Project documentation" |
| 12 | PR hygiene | Conventional Commits title (`type(scope): summary`), an issue reference if there is one (`Fixes #12`, a linked issue), a description that says what and why, and its merge danger (one-way or two-way door, blast radius; `../harnex/pr.md`). The door must match row 7: a migration, data delete, or public contract change is one-way | all stated, door matches | one or two missing (a PR without merge danger is at most WARN) | title and description both missing, or a one-way change stated as two-way | orchestrator: PR title, issue reference, door vs row 7 |
| 13 | Review threads | SKILL.md step 5: resolved threads, fix claims, open threads | all addressed | a thread resolved without change, or open change requests | a fix claim that is false (commit not on the PR, or the named test missing) | n/a (no threads yet) |
