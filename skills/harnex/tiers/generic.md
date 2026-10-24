# Profile: generic

The profile for every repo without a `.harnex/tiers.md`. Derive each command
from the repo, in this order: its README, CLAUDE.md or AGENTS.md, its CI
config, its build or package manifest scripts (hints: README.md in this
folder). State each derived command with its source
(`path:line`) in the plan's `Context:` line.

| Tier | Command |
|---|---|
| typecheck | the compiler or type checker the build uses, without emitting |
| lint | the linter CI runs |
| impacted | the test runner's related or changed mode; else the tests next to the changed files |
| smoke | build + the fastest critical-path tests, or build, start, main entry responds |
| full | the test command CI runs |
| e2e | the e2e command CI runs, if it can run locally |
| dev server | the repo's documented way to run it (standards.md "Run target") |

Any tier with no command found: `n/a`, reported NOT VERIFIED. Suggest a
`.harnex/tiers.md` override in the report's `Follow-ups:`; never add one
unasked.
