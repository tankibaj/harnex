# harnex

**AI agents are fast at writing code and painful to ship.** harnex gives your
agent a workflow: a short plan you approve, test-first code, independent
validation and review, and a pre-PR gate, so review, QA and production find
nothing. Any language, any stack. Claude Code, Codex, OpenCode.

[Slides (3 min)](docs/slides/harnex.html)

## The problem

| Pain | harnex |
|---|---|
| Works on my machine; review, QA or the deploy finds the rest | Runs the checks `/pr-review` uses before the PR exists (pre-PR gate) |
| I can't explain my own code | Smallest change that works, readable in one pass |
| The PR is too big to review | One purpose per PR; work over ~400 lines is split before coding |
| The plan is too big to read | A few lines in chat; ~40 lines (max 60) when risky |
| It codes for my laptop | Your repo's own test, build and run commands, not a guess |

## Install

| Agent | Command | Updates |
|---|---|---|
| Claude Code | `claude plugin marketplace add tankibaj/harnex && claude plugin install harnex@harnex` | itself |
| Codex | `codex plugin marketplace add tankibaj/harnex && codex plugin add harnex@harnex` | itself |
| OpenCode, others | `npx skills@latest add tankibaj/harnex -a opencode` | `npx skills update` |

**Sub-agents for Codex and OpenCode** (optional; Claude Code loads them from the plugin):
```bash
git clone https://github.com/tankibaj/harnex && node harnex/scripts/install-agents.mjs --all
```
Without them, harnex runs each phase itself; same workflow, less isolation.

**Browser for UI review and QA** (optional; without one these checks are reported `NOT VERIFIED`):
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
codex mcp add playwright -- npx @playwright/mcp@latest
opencode mcp add          # then: playwright, local, npx @playwright/mcp@latest
```

## Use

```text
/harnex add a dark mode toggle to the settings page
/harnex https://github.com/you/app/issues/42
/harnex full migrate sessions to the new token format
/harnex explore cache the search results
```

| Command | When |
|---|---|
| `/harnex <goal or issue URL>` | Build something. It picks the mode, shows Goal · Plan · Risk, and waits for your yes. |
| `/harnex quick\|standard\|full <goal>` | You already know it's small, or risky. |
| `/harnex explore <goal>` | Not sure which approach is best: builds 2–3 side by side, you keep one. |
| `/pr-review <PR URL>` | Review any PR (GitLab MRs too): criteria, a fresh review, questions on the risky lines. |
| `/qa <PR URL or goal>` | Manual test cases; on your yes, runs them in a real browser and against the OpenAPI. Standalone: run it on the PR `/harnex` opened. |
| `/retro` | Something slipped through. Proposes the check that would have caught it. `/retro html` saves a readable report. |

Input is mostly your goal in plain words. An issue URL (GitHub or GitLab)
adds its text. Another tracker (Jira, Linear…) works if its MCP is connected.

## How it works

```mermaid
flowchart TD
  ask["Your goal, or an issue URL"] --> plan["Plan: harnex picks the mode<br/>Quick · Standard · Full"]
  plan --> brief["Brief: Goal · Plan · Risk<br/>you approve or refine"]
  brief -- "refine" --> plan
  brief -- "looks good" --> build["1 · Implementer: failing test, then code"]
  build --> check["2 · Validator + fresh reviewer, at the same time"]
  check --> ui["3 · UI reviewer, if the UI changed"]
  ui --> found{"4 · Findings?"}
  found -- "must-fix or failing test<br/>(up to 3 rounds)" --> fix["Fix, re-check only the fix"] --> check
  found -- "critical, or still failing" --> you["Stops and asks you"]
  found -- "clean" --> gate["Pre-PR gate: /pr-review's checks, now"] --> ship["You: commit, push, open the PR"]
```

| | Quick | Standard | Full |
|---|---|---|---|
| **When** | One place, no risk area, no UI change | One repo, no risk area | Auth, schema, security, CI, dependencies, public API, several repos, or big work |
| **Plan** | harnex: change, root cause, proving test | Planner, short chat plan | Planner, plan doc (≤ 60 lines), fact-checked |
| **You approve** | The [brief](skills/harnex/brief.md): Goal, Plan, Risk | The brief | The brief + the plan doc |
| **Check** | harnex runs tests, lint, scans; fresh reviewer | Validator + reviewer at once; UI reviewer if UI changed | Same, with the full test suite |

- **Any stack:** commands come from your repo (README, CLAUDE.md/AGENTS.md, CI, package scripts). Pin them in `.harnex/tiers.md` if you like ([tiers](skills/harnex/tiers/README.md)).
- **Any run target:** localhost, `docker compose up`, a local cluster; whatever the repo says.
- **Less code:** the reviewer flags unused code, silent failures, misleading names, config keys nothing defines.
- **Host:** GitHub first (`gh`), GitLab when the remote says so (`glab`).
- **Rules:** [standards](skills/harnex/standards.md). Your repo's CLAUDE.md, AGENTS.md and `.claude/rules/` win on conventions.
- **Metrics:** a hook logs names only (never code) to `~/.harnex/metrics.jsonl`; `/retro` reads them.

## Coming next
- Reads prod for you: logs, metrics and traces, before vs after a deploy.
- Smoke test after every deploy, without being asked.

## License
MIT
