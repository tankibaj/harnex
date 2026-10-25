# harnex: Brief and confirm

Loaded by the `harnex` orchestrator on both flows, after the plan exists and
before any code. The developer approves the goal and the plan in under a
minute, or refines them.

## Brief
Terse; grammar sacrificed for concision. Plain words, no file dumps.

```
Flow: <quick | harnex> (<one-line reason: the risk area, if any>)
Plan: <chat | doc> · Tier: <impacted | full> · Reviewer: <sonnet | default> · UI: <yes | no>
Goal: <1–2 sentences: what changes and why, from the requirement>
Plan:
- <at most 5 bullets: what will change, in order>
Risk: <only real high risks, one line each; else none>
```

- **Flow reason** names the risk area behind `Tier: full` or `Reviewer:
  default` (auth, a new dependency, CI config...), so those never sit next
  to an unexplained `Risk: none`.
- **Settings line** per SKILL.md "Settings"; never ask for it.
- **Risk** lists only what could hurt badly if the plan is wrong: security or
  data loss (CRITICAL), or breaking callers, a public contract, or stored
  data. Take them from the plan's risks; never invent one. None at that
  level: `none`.
- `Plan: doc`: the plan doc path and the `Grounding:` line go under the brief.
- Draft acceptance criteria (input.md): list them under the brief, marked
  draft.

## Confirm
One AskUserQuestion, two or three options, recommended first; its free-text "Other"
answer is the refine:
- **Looks good, implement** (Recommended)
- **Change settings**: then one more question, multiSelect: flow (quick or
  harnex), Plan doc, Tier full, Reviewer default, UI review.
- **Try alternatives**: only when the plan has an `Approaches:` field with 2
  or more options, `/harnex` flow, one repo; runs explore.md.
- Other (free text): what to change.

**Refine:** re-plan with the feedback (Quick: yourself; `/harnex`: re-spawn
the planner with the previous plan and the feedback), show a new brief, ask
again. After the third refine, suggest `Plan: doc` or splitting the work
instead of a fourth brief.

**Change settings:** re-plan with the new settings before a new brief. Quick
to `/harnex`: spawn the planner. `Plan: doc`: plan doc, size check,
grounding check. Back to `chat` or Quick: drop the plan doc, keep what it
found. Removing `Tier: full` or `Reviewer: default` on a known risk area: warn
in one line and keep them (SKILL.md "Settings"). A change after "Looks good"
but before code (escalation) shows a new brief and asks again.

**Until "Looks good":** no branch, no source edits, no implementer. The
planner's plan doc (`Plan: doc`) is allowed. The wait is a `wait start|end`
stamp in the timings file (report.md "Timings"; not on Quick).
