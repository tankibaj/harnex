# harnex: Plan template

Loaded by the `harnex:planner` (and by the orchestrator when it plans a
Quick change itself). The fields of a plan, in order. Rules for writing one
live in the planner; this file is only the shape.

**Core** fields appear in every plan. **When it applies** fields appear only
when they have something to say: leave the line out instead of writing
"none". A field left out means none, and the grounding check reads it that
way.

## Header (doc only)
Directly under the H1: `**Status:** Draft | **Owner:** harnex | **Updated:**
<YYYY-MM-DD HH:MM>`, then a `- [ ]` checklist.

## Core
- `Settings: Plan: <chat | doc> · Tier: <impacted | full> · Reviewer:
  <sonnet | default> · UI: <yes | no>`, derived per SKILL.md "Settings"
  (risk area or shared core: `Tier: full`; risk area: `Reviewer: default`)
- `UI scope: none | visual | flow | both` with a one-line reason (standards.md
  "UI and UX review"; `flow` when a user flow, form, navigation, or its
  empty/error/loading state changes, and a journey with `ui: yes` raises `none` to `flow` and `visual` to `both`; a desktop or native UI also lists its minimum, default and large window sizes)
- `Journeys:` one line per end-user journey the change builds or alters,
  ids `J1`, `J2`... (multi-repo: `<entry>` is `<repo>:<entry>`, the repo that owns
  the journey): `J<n> | <actor> | <entry> | <steps> | states: <happy,
  empty, error, loading as they apply> | ui: yes|no | src: <AC cited |
  requirement | code>`. Source order: every acceptance criterion a user can
  exercise maps to a journey; with none given, each functionality the
  requirement states; with neither, the user-reachable behavior the change
  adds or alters in code (route, handler, control), cited by `path:line`. A
  journey backed by an endpoint with no screen is `ui: no`. Backend-only
  change with no user-visible journey: "none". The gates walk exactly this list
  (standards.md "Journeys")
- `Live smoke:` the headline user action of the change, run once through the
  real entry point with nothing faked at the host edge, and the effect to
  assert (standards.md "Live smoke"); or `none: <reason>` when nothing is
  user-reachable. A tool or permission it needs goes under `Assumptions:`
- requirement restated
- files to change and approach
- `Blast radius:` callers and consumers of every signature, field, export, or
  behavior that changes, with paths, or "none"
- `Risk areas:` each risk area the change touches (auth, schema/migrations,
  security, CI/build/tooling config, dependencies, a public contract;
  SKILL.md "Two flows") with its path, or "none". The orchestrator checks
  the settings against this line.
- `Context:` per repo, the exact test, lint, and typecheck commands resolved
  from the tier profile (impacted test selection included) and the key
  files, so later phases don't re-explore
- validation plan: tier (IMPACTED or FULL) with a one-line reason, exact test
  commands, e2e flows, the manual browser flow to walk, test-first order
- `Done checks:` one item per acceptance criterion you were given (cite
  it), plus your own definition-of-done items, each with its proof (standards.md
  "Done checks"): a test name, a command and its expected result, or a
  browser step and what must render. The WP that wires a piece in (the last WP
  of a dependency chain, or the only WP) has a done check with one test
  through the real entry point or composition root, not the unit alone, so a
  piece built but never wired in fails it. Add, as `QA:` items, the cases a
  tester would try first, only for what this change introduces: a new input
  gets an invalid-input case, a new permission- or tenant-scoped read or
  action gets a denied case, a new list or query gets an empty case. Each
  cites the line it could break; prefer a parametrized row in an existing
  test over a new test; endpoint cases already in `API checks:` are not
  repeated. A `QA:` item is never moved to `Not building:`: it gets a test
  or a browser step, or it is a blocking open question
- `## Open questions`: only blocking ones (a blocker, a CRITICAL risk, or an
  answer the implementation depends on), each `Q<n>` with 2-4 options and one
  marked recommended, or "none". The plan is written as if every recommended
  option was picked; each plan line that would change with another answer
  ends with `(Q<n>)`
- `## Decisions`: trivial ambiguities you settled yourself (naming, defaults
  with no behavioral or security weight), one line each with the reason, or
  "none"

## When it applies
- a bug: root-cause note (what breaks, why, where)
- a refactor or tech debt: the behavior the characterization tests must pin
- `Reuse:` existing helpers, components, or patterns to use, with paths
- `Not building:` what nobody asked for, one line
- a new dependency or schema change, with the checks from standards.md
- risks
- `Assumptions:` every claim about the code you did not confirm by reading
  it (a default, a value, a behavior), one line each
- `API checks:` for each new or changed endpoint, one done check per
  operation, validation case, and error case, per standards.md "API
  endpoints", each naming its integration test
- `Approaches:` only when there are 2 or 3 genuinely different ways to meet
  the requirement with real trade-offs (not variations of one), one line
  each: name, idea, trade-off. Asked for "explore: 2-3 approaches": give
  each its own short plan (max 3 bullets) instead.
- `Early UI candidates:` a UI WP that later WPs build on (shared layout,
  navigation shell, design-system component); never a WP field
- `Delivery: separate PRs | together`, for a sequence of changes

## Patched plans
A plan the planner patched (new answers or developer feedback) keeps its
path and its fields; `**Updated:**` moves. Nothing else marks the patch: the
planner's final message lists what changed.
