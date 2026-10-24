# PR review: output template

Render exactly this, in this order. Every status and row cites evidence.
Omit nothing; use `n/a`, `none`, or `NOT CHECKED: <why>` instead.

````markdown
# PR #<n>: <title>
<author> → <target> · +<add>/−<del> in <n> files · checks: <success|failed|running|none> · issue: <ref or none><, draft>

**Recommendation: <READY | NEEDS CHANGES | NEEDS DISCUSSION>**: <one line why>

<only when ac_source is draft:>
## Acceptance criteria (DRAFT, confirmed by <reviewer>, not by the issue owner)
The issue's criteria are <missing | placeholders only | unclear: "<original wording>">. Selected from the proposed candidates:
1. <testable criterion> (source: <issue summary | description line | linked issue <ref> | PR description | reviewer>)
2. <...>
Not selected: <candidate labels, or "none">
Post the selected criteria to <issue ref> for the author or owner to confirm? (y/n)

## Criteria
| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Requirement | PASS / WARN / FAIL / NOT CHECKED | <criterion → path:line, or what is missing> |
| 2 | Tests cover the change | | <test names, or the untested path:line> |
| 3 | Test integrity | | <changed test files checked> |
| 4 | Pipeline | | <`gh pr checks` summary, or pipeline id and status> |
| 5 | Security | | <scan command and result; reviewer lines> |
| 6 | Dependencies | n/a | <package, license, audit result> |
| 7 | Risk areas | n/a | <area, rollback or compatibility proof> |
| 8 | UI | n/a | <UI files; screenshots present> |
| 9 | Size and focus | | <changed lines; one purpose?> |
| 10 | Duplication | | <new path:line ↔ existing path:line, or "searched: <names>"> |
| 11 | Docs | | <invalidated line, or "still true"> |
| 12 | PR hygiene | | <what is missing; door stated vs row 7> |
| 13 | Review threads | | <checked n of m; each WARN or FAIL thread below> |

## Findings (harnex:reviewer, <model>, verbatim)
1. **<CRITICAL|MUST-FIX>** `<path>:<line>`: <concrete case>. Evidence: <...>. Fix: <one line>. If skipped: <one line>.
(or `none`; NICE-TO-HAVE listed last)

## Review threads
| Thread | `path:line` | State | Check | Evidence |
|---|---|---|---|---|
| <thread id, 8 chars> | | resolved / open | resolved without change / fix claim false / open | <diff empty since <sha>; commit not on PR; test missing> |
(or `none`; unreadable: `NOT CHECKED: <why>`)

<the reviewer's guide, per review-guide.md>

## Before you approve, you should be able to answer
1. <question tied to risk hunk 1>
2. <question tied to risk hunk 2>
3. <optional third>

Reply with your answers and I'll check them against the code.

Not checked: <what mattered and could not be checked, or `nothing`>
Post as inline comments (pick findings) and/or a summary note? Nothing is published without a second yes.
````

Example question: "`slot.ts:52` compares `end` with `start` of the next
slot. What is returned when a slot ends exactly at midnight on the day the
clocks change?"
