# harnex Standards

Loaded by the `harnex` skill. Applies to the orchestrator and every phase
agent. Paths, review loop, and escalation live in SKILL.md; test commands
live in the tier profile (`tiers/`).

## Ground rules
- The target repo's own CLAUDE.md, AGENTS.md, and `.claude/rules/` win on
  conventions (naming, structure, branching, test style, design system).
  These standards win on process gates.
- Commits: Conventional Commits (`type(scope): summary`), the issue
  reference (`#123`) in the summary or body when one exists. No AI
  attribution trailers.
- Never push, merge, or open a PR without the user's yes (host: "Hosting").
- Never print, log, or echo values from `.env*` files, credential stores, or
  secret environment variables; reference names only.
- Ask before deleting files you did not create in this run.
- Issue reference, if any: from the branch name or the requirement (`#123`,
  an issue URL, or a tracker key), else none; `<ticket>` below means that
  reference, else the feature slug. Reading an issue: `input.md`.

## Hosting
- Read `git remote get-url origin`. A github.com remote, or a host
  `gh auth status --hostname <host>` knows: use `gh` (`gh pr create`,
  `gh pr view`, `gh issue view`). Otherwise GitLab: `glab` (merge requests,
  `glab mr ...`, `glab issue view`). Other files say "PR" (MR on GitLab) and
  show the `gh` command first, `glab` second.

## Run target
- The dev environment is whatever the repo's README, CLAUDE.md, AGENTS.md,
  compose file, or k8s manifests say: localhost, `docker compose up`, a local
  cluster (kind, minikube). Never assume one. Cannot start it: NOT VERIFIED,
  with why.

## Planning
- Full: a plan doc at `docs/plan/<feature-slug>-<YYYYMMDD-HHmm>.md`, about 40 lines (checklist and WPs excluded), never over 60: a person approves it in a minute. Quick and Standard: a chat plan.
- **Reviewable size:** each change in the plan stays under about 400 changed lines (lockfiles and generated files excluded). Bigger work is a sequence of small changes, each its own PR, planned up front, never split after the code exists.
- **Done checks:** every definition-of-done item names its proof: a test name, a command with its expected result, or a browser step with what must render. An item with no runnable proof goes under `Not building:`. Unproven at the end means NOT VERIFIED.
- Mermaid diagram only when the change alters control flow, data flow, state, or architecture across components.
- **Spikes:** when uncertainty blocks a credible plan, spike first (read-only sub-agent or throwaway branch, timeboxed), findings at `docs/spike/<feature-slug>-<YYYYMMDD-HHmm>.md`. Spike code never ships.
- **Small changes:** one change, one purpose; refactors ship separately from behavior changes. Work that cannot be reviewed as one coherent diff becomes a sequence of changes in dependency order.
- **Work packages:** only for truly independent areas: `docs/wp/wp<N>-<slug>.md` with goal, owned files (disjoint), dependencies, tests, done checks.

### Open questions
- Never guess at an unclear requirement. **Blocking** (a CRITICAL or security risk, or an answer the implementation depends on): an open question with 2-4 options and one recommendation. **Trivial** (naming, defaults with no behavioral or security weight): decide it and record it under Decisions. When unsure, it is blocking.

### Bug fixes
- Reproduce before fixing. The plan has a root-cause note: what breaks, why, where.
- The first test reproduces the bug and is shown failing before the fix.

### Refactors and tech debt
- First add characterization tests pinning current behavior (error and edge paths included), passing on the unchanged code; then refactor with the same tests passing unchanged.

### Branches
- If on the default branch, create the repo's branch pattern (its rules or CLAUDE.md), else `feature/<ticket>-<slug>`. Parallel WPs in one repo each get a worktree; the orchestrator merges them.

### Multiple repos
- One plan doc, in the primary repo (the one the requirement is about; else the first). Each WP names its `repo:`. Each repo gets its own branch, validation, and PR; the PRs link each other. Contract changes ship provider-first and stay backward compatible until every consumer is merged.

### Database migrations
- Every schema change ships with a tested down migration or a written rollback note, is run against realistic existing data, and runs the FULL tier.

### New dependencies
- The plan justifies each: why existing code or the standard library won't do; license, maintenance, size. Copyleft (GPL, AGPL, LGPL) escalates to the user (license compliance).

## Writing code: smallest complete change
- Read the code the change touches first and list every place it must reach: callers, tests, fixtures, config, exports.
- Take the first option that fully works: not needed at all; already in the codebase; standard library or platform; an installed dependency; one line; otherwise the minimum code. Never add a dependency for a few lines.
- No abstraction, option, or "for later" code without a requirement. Keep the codebase's conventions.
- Lazy about the solution, never about the change: finish every caller, test, and fixture it breaks. Moved code keeps its validation and error handling.
- Readable in one pass: names say what a thing is or does, the file's existing patterns win, comments only say *why* the code can't show, no dead or commented-out code.
- **Never cut:** validation at trust boundaries, error handling that prevents data loss, security, accessibility, anything the user asked for.
- A deliberate limit gets `TODO(<ticket>): <limit>, <when to revisit>`. With a trigger it is a decision; without one it is a finding.

## Doc status
- Generated docs under `docs/` start with `**Status:** In Progress | **Owner:** harnex | **Updated:** <YYYY-MM-DD HH:MM>` after the H1. Values: `Draft`, `Ready`, `In Progress`, `Blocked` (blocker on the next line), `Done`, `Superseded -> <path>`.
- Plans and WPs carry a `- [ ]` checklist. Items end `[x]` (with evidence) or `[~] skipped: <reason>` (user-approved). Never report done while a doc says `In Progress`.

## Testing
- Test first: write the failing test, then the code. Changes with no behavior change skip TDD but still run the tier.
- E2E for new or changed user-facing workflows, critical paths only. No e2e suite in the repo: the planner decides (never asks) to cover the flow with integration tests through real controls plus the browser walk, and adds `TODO(<ticket>): add an e2e journey for <flow>, when an e2e suite is introduced`.
- **API endpoints:** every new or changed endpoint (REST/HTTP handler, RPC, GraphQL resolver) gets a done check per operation it exposes (create, read, update, delete, list, or its own verbs), plus its validation (a rejected input), its main error cases (not found, conflict, unauthorized or forbidden), and tenant isolation in a multi-tenant service. Each is proven by an integration test that calls the real endpoint through the repo's own HTTP test setup and asserts the status and the response body or the persisted state; a test that calls the handler class directly does not count. An operation the change does not touch keeps its existing test. No integration-test setup in the repo: unit tests on the handler plus `TODO(<ticket>): add API integration test for <endpoint>, when an HTTP test setup is introduced`, and those checks are NOT VERIFIED.
- Who runs the tier: on Standard and Full, the numbers come from the `validator`, never the `implementer`. On Quick, the orchestrator implements and its own run counts, backed by the failing-test-first evidence and the fresh `reviewer`. Never run a full regression in the main context.

### Tests are the goalposts
- Never delete, skip (`.skip`, `.only`, `xit`, `@pytest.mark.skip`, `xfail`), or `@flaky`-tag an existing test, loosen an assertion, change an expected value, accept a regenerated snapshot or golden file, or raise a timeout or retry count to get green.
- A test change is allowed only when the plan names it with a reason, or for a refactor's moved tests with the same assertions. An existing test that looks wrong is reported, not edited; it changes acceptance criteria, so it escalates.

### Deterministic tests and mocks
- A test's result depends only on the code: fake the clock, seed randomness, stub the network at the boundary, isolate state, wait on conditions, never `sleep`.
- Mock only at process boundaries (network, clock, randomness, filesystem, third-party services). Never mock the unit under test, an in-repo module the behavior depends on, or the value asserted. Prefer a real or in-memory collaborator when it is fast.

### Independent red check
- New behavior and bug-reproduction tests must fail without the change. The `validator` proves it: `git worktree add --detach <tmp> <base>` (reuse the checkout's dependencies, e.g. link its installed-packages directory), copy in only the new and changed test files, run them, `git worktree remove --force <tmp>`. On Quick, the failing run shown before the change is the red check.
- One that passes on `<base>` proves nothing and is a validation failure. Characterization tests are the reverse: they must pass on `<base>`. `<base>` is the merge-base with the default branch. Cannot run: NOT VERIFIED, never PASS.

### Test organization
- Commands come from the resolved tier profile (`tiers/README.md`): the repo's `.harnex/tiers.md` if present, else `generic.md`. Use them exactly; never improvise when they exist. A profile gap is NOT VERIFIED for that tier, never a reason to add scripts or tooling to the repo outside the plan.
- Follow the repo's existing test layout and tags; add none of your own.
- Artifacts (screenshots, traces, `test-results/`, coverage) go to ignored paths only. Whoever runs tests records `git status --porcelain` before and after; a tracked file the runs modified (snapshots, baselines) is restored with `git checkout -- <path>` unless the plan names its update, and reported.

### Validation tiers
- **IMPACTED** (default): the profile's impacted and smoke commands (fallback without smoke: build, start, main entry responds; say which ran), lint, typecheck, impacted e2e, and for webapps the browser walk.
- **FULL**: the profile's full command and all e2e it lists, when the change touches a risk area (SKILL.md) or shared core modules, or the user asks. Test setup files and fixtures are test code, not tooling; test-runner config is tooling.
- When unsure, state the tier chosen and why in one line.

### Security scans (every path)
- **Secret scan** over changed and untracked files: the project's scanner, else `gitleaks`, else a grep of the diff for keys, tokens, and credential assignments (`secret scan: fallback (grep)`). Any hit fails until shown to be a placeholder.
- **Dependency audit** when a lockfile or manifest changes (`npm audit`, `pip-audit`, ...). High or critical in an added or upgraded package fails; pre-existing advisories are listed.
- Report each with command and result, or NOT VERIFIED naming the missing tool.

### Manual browser verification (webapps)
- After tests pass, walk the impacted flow through the real controls, whenever the change touches a code path the UI exercises. A curl never substitutes when a browser tool exists.
- Desktop app: the in-app browser (`mcp__Claude_Browser__*`), dev server via `preview_start`. CLIs: a browser MCP (`playwright`, `chrome-devtools`).
- A login wall: ask the user to sign in in that browser session and wait; never type, store, or automate credentials.
- Read the network too: an unexpected 4xx/5xx is a failure, and the key action's response must match what renders. A screenshot you did not open is not evidence.
- Report the flow, a screenshot of the key state, console errors, failed requests. No browser tool: NOT VERIFIED.

### E2E must verify the real flow
- Assert the observable effect, not a flag already true. Drive actions through visible controls (API calls only for setup and outcome checks). Green with a broken screenshot means the test is wrong.

## Code review
- A FRESH sub-agent reviews; it never wrote or edits the code. `reviewer` reports correctness only; `ui-ux-reviewer` covers UI and UX.
- Every finding names a concrete case: this input or situation leads to this wrong result. No case, no finding; no taste or style findings, except the reviewer's mechanical checks for an unused addition, a silent failure, and a misleading name (reviewer checks 7, 4, 2), each proven by a grep or the lines.
- Severities: CRITICAL (security or data-loss risk), MUST-FIX, NICE-TO-HAVE. Any other label counts as MUST-FIX. CHANGES only with a CRITICAL or MUST-FIX, else APPROVE.
- **Severity follows impact, not fix size:** one bad input or upstream record that fails a whole endpoint, page, or job is MUST-FIX even when the fix is one line.

### UI and UX review
- **UI scope** is `none`, `visual`, `flow`, or `both`:
  - `visual` when a changed file matches `*.tsx *.jsx *.vue *.svelte *.astro *.html *.css *.scss *.sass *.less`, `tailwind.config.*`, `postcss.config.*`, a path segment `components/ layouts/ styles/ views/`, or a static asset under `public/`.
  - `flow` when the plan says a user flow, form, navigation, or its empty, error, or loading state changes.
  - Never UI on their own: `app/api/**`, `pages/api/**`, `route.*`, `middleware.*`, `'use server'` files, `*.server.*`, tests, `*.stories.*`, `*.d.ts`, non-asset files under `public/`.
  - The plan's `UI scope` can widen the file-based scope, never narrow it. Server code behind a UI action still gets the browser walk.
- Bar: WCAG 2.2 AA via the accessibility snapshot and a keyboard walk. Findings cite the repo's design system (from its CLAUDE.md or rules, e.g. a shared UI library), a WCAG criterion, or a concrete user cost; pure taste is NICE-TO-HAVE.

## Project documentation
- Update CLAUDE.md or README only when the change invalidates something they state (entry point, script, flag, endpoint, invariant, dependency, env var, command). README is user-facing, CLAUDE.md agent-facing; never restate what the code shows.
