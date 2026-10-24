# harnex: Reviewer's guide

Loaded at Completion by the `harnex` orchestrator and by `/pr-review`.
The guide tells a human reviewer how to read a change: in what order, which
decisions to judge, where the risk is, and what proves each done item.

## Sources
- **harnex run:** the plan (approach, `Done checks:`), the implementer's
  key decisions and deviations, the validator's test names and red check,
  and the reviewer's `Risk hunks:`.
- **`/pr-review`:** the PR diff and description, the linked issue,
  the CI run, and the reviewer's `Risk hunks:`. If the PR description
  already has a guide, check it against the diff: keep the rows that hold,
  fix the rest, and say which you changed.

## Rules
- Every row cites a `path:line` range or a test name from this run or the
  PR; nothing invented. A row you cannot ground is dropped.
- **Read in this order:** the entry point or contract first (endpoint,
  exported type, event, migration), then the core logic, then callers, then
  tests. At most 7 steps. Generated files, lockfiles, and snapshots go under
  *Skip*.
- **Key decisions:** 3–5, each with the alternative rejected and why. A
  small change may have fewer; never pad.
- **Where the risk is:** the reviewer's `Risk hunks:`, verbatim. A hunk with
  no covering test shows `NOT COVERED: <why>` and is repeated under *Not
  verified*.
- **Proof per done item:** one row per plan `Done checks:` item (PR review:
  per acceptance criterion). The result says who ran it (`validator`,
  `orchestrator`, `CI run <id>`), or NOT VERIFIED.
- Quick path: only *Read in this order* and *Proof per done item*.
- Stay under about 40 lines; the point is less to read, not more.

## Template

````markdown
## Reviewer's guide
**Change:** <one sentence: what changed and why>
**Issue:** <#123 or none> · **Size:** <n> files, +<add>/−<del> · **Path:** <Quick|Standard|Full|PR review>

### Read in this order
1. `<path>:<from>-<to>`: <what it does; why read it first>
2. `<path>:<from>-<to>`: <...>
3. `<test path>`: <what the tests pin>

### Key decisions
- <decision>: <why>; rejected <alternative> because <reason>.

### Where the risk is
| Lines | Risk | Covered by |
|---|---|---|
| `<path>:<from>-<to>` | <what could go wrong, concretely> | `<test file › test name>` |
| `<path>:<from>-<to>` | <...> | NOT COVERED: <why> |

### Proof per done item
| Done item | Proof | Result |
|---|---|---|
| <item> | `<test name>`, `<command>`, or browser step | pass (<who>), red check proven |

### Not verified
- <item: why> (or `nothing`)

### Skip
- <generated, lockfile, snapshot paths> (or `nothing`)
````

Example risk row: `` `src/booking/slot.ts:41-58` `` · end time compared in
local time, wrong across a DST change · `slot.test.ts › rejects overlap
across DST`.
