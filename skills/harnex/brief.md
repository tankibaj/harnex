# harnex: Brief and confirm

Loaded by the `harnex` orchestrator on every mode, after the plan exists and
before any code. The developer approves the goal and the plan in under a
minute, or refines them.

## Brief
Terse; grammar sacrificed for concision. Plain words, no file dumps.

```
Mode: <Quick | Standard | Full> (<one-line reason: the risk area, if any>)
Goal: <1–2 sentences: what changes and why, from the requirement>
Plan:
- <at most 5 bullets: what will change, in order>
Risk: <only real high risks, one line each; else none>
```

- **Mode reason** names the risk area that forced Full (auth, a new
  dependency, CI config...), so Full never sits next to an unexplained
  `Risk: none`.
- **Risk** lists only what could hurt badly if the plan is wrong: security or
  data loss (CRITICAL), or breaking callers, a public contract, or stored
  data. Take them from the plan's risks; never invent one. None at that
  level: `none`.
- Full: the plan doc path and the `Grounding:` line go under the brief.
- Draft acceptance criteria (input.md): list them under the brief, marked
  draft.

## Confirm
One AskUserQuestion, two or three options, recommended first; its free-text "Other"
answer is the refine:
- **Looks good, implement** (Recommended)
- **Change mode**: then one more question, Quick / Standard / Full.
- **Try alternatives**: only when the plan has an `Approaches:` field with 2
  or more options, Standard or Full, one repo; runs explore.md.
- Other (free text): what to change.

**Refine:** re-plan with the feedback (Quick: yourself; Standard and Full:
re-spawn the planner with the previous plan and the feedback), show a new
brief, ask again. After the third refine, suggest a bigger mode or splitting
the work instead of a fourth brief.

**Change mode:** re-plan in the new mode before a new brief. Up to Standard
or Full: spawn the planner (Full: plan doc, size check, grounding check). Down
to Quick or Standard: drop the plan doc, keep what it found; down onto a known
risk area follows SKILL.md "forcing a path". A mode change after "Looks good"
but before code (escalation) shows a new brief and asks again.

**Until "Looks good":** no branch, no source edits, no implementer. The
planner's plan doc (Full) is allowed. The wait is a `wait start|end` stamp in
the timings file (report.md "Timings"; not on Quick).
