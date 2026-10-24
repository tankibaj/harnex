# harnex: maintainer guide

For agents working ON this repo. What users run lives in `skills/` and
`agents/`; the workflow rules are `skills/harnex/standards.md`, not here.

## Layout
- `skills/harnex/`: the `/harnex` orchestrator (`SKILL.md`) and its files:
  `standards.md`, `brief.md`, `explore.md`, `report.md`, `pr.md`,
  `review-guide.md`, `input.md`, `tiers/`.
- `skills/pr-review/` (+ `threads.py`), `skills/qa/`, `skills/retro/`:
  standalone skills, never part of the `/harnex` run.
- `agents/`: the 7 phase agents. Claude Code loads them from the plugin;
  `scripts/install-agents.mjs` converts them for Codex and OpenCode.
- `hooks/hooks.json` + `scripts/metrics.py`: passive metrics.
- `.claude-plugin/`: `plugin.json` (skills list, version) and
  `marketplace.json` (single-plugin marketplace; Codex reads it too).
- `docs/slides/harnex.html`: the deck.

## Rules
- Skills are self-contained: reference sibling files by name and other skills
  as `../<skill>/<file>`. Never `${CLAUDE_PLUGIN_ROOT}` in a skill (only
  `hooks/hooks.json` uses it). No build step.
- A new skill: a folder under `skills/` with `SKILL.md` whose `name` matches,
  added to `plugin.json` `skills`. A test enforces it.
- Agent frontmatter: `name`, `description`, `tools` | `disallowedTools`,
  `model` (`inherit|sonnet|haiku|opus`).
- Stay generic: no employer, team, product, or person names; no stack
  assumptions. A leak test enforces the common ones.
- Never bump `version` by hand: the Release workflow does it from
  Conventional Commits (`feat` minor; `fix`/`refactor`/`perf` patch) when a
  commit touches shipped paths (`skills/`, `agents/`, `hooks/`,
  `.claude-plugin/`, `scripts/metrics.py`, `scripts/install-agents.mjs`).
  Preview: `npm run release:dry`.
- Dev loop: `scripts/link-skills.sh` symlinks the skills into
  `~/.claude/skills` and `~/.agents/skills`.

## Verify
- `npm test`: plugin layout + leak test, release, agent install (node),
  metrics hook and `threads.py` (python).
- `npm run validate`: `claude plugin validate .`.
