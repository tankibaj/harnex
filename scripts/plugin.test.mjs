// Checks the plugin layout and that nothing employer-specific or from the
// old project name leaks into what ships. Run: node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHIPPED = ['skills', 'agents', 'hooks', 'docs', 'README.md'];
// Public, generic checks. Private words (names that must never ship) go one per
// line in the git-ignored `.leakwords` file; the test adds them when present.
const PRIVATE = path.join(ROOT, '.leakwords');
// Stale names from the project this was copied from, and removed skills.
const LEAKS = ['CLAUDE_PLUGIN_ROOT', 'gradle.md', 'yarn-jest', 'setup.sh', 'workspace.sh',
  'devflow', 'DevFlow', 'plugins/', 'mr-resolve', 'deploy-check', 'mr_threads', 'ticket.md', 'mr-description', '/harnex:review', 'stats.py',
  ...(fs.existsSync(PRIVATE) ? fs.readFileSync(PRIVATE, 'utf8').split('\n').map((w) => w.trim()).filter(Boolean) : [])];

function files(p) {
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) return [];
  if (fs.statSync(abs).isFile()) return [abs];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) =>
    e.name === '__pycache__' ? [] : files(path.join(p, e.name)));
}

test('nothing employer-specific or from the old name ships', () => {
  for (const f of SHIPPED.flatMap(files)) {
    const s = fs.readFileSync(f, 'utf8');
    // Hooks run in Claude Code, which expands CLAUDE_PLUGIN_ROOT there; skills must use relative paths.
    const allowed = path.relative(ROOT, f) === path.join('hooks', 'hooks.json') ? ['CLAUDE_PLUGIN_ROOT'] : [];
    for (const bad of LEAKS) if (!allowed.includes(bad)) assert.ok(!s.includes(bad), `${path.relative(ROOT, f)} contains ${bad}`);
  }
});

test('every skill has SKILL.md whose name matches its folder and is listed in plugin.json', () => {
  const plugin = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin/plugin.json'), 'utf8'));
  const dirs = fs.readdirSync(path.join(ROOT, 'skills'));
  assert.deepEqual([...plugin.skills].sort(), dirs.map((d) => `./skills/${d}`).sort());
  for (const d of dirs) {
    const md = fs.readFileSync(path.join(ROOT, 'skills', d, 'SKILL.md'), 'utf8');
    assert.match(md, new RegExp(`^---\\nname: ${d}\\n`), `skills/${d}/SKILL.md name`);
  }
});

test('every agent has name, description and a model the CLIs accept', () => {
  for (const f of fs.readdirSync(path.join(ROOT, 'agents'))) {
    const md = fs.readFileSync(path.join(ROOT, 'agents', f), 'utf8');
    assert.match(md, new RegExp(`^---\\nname: ${path.basename(f, '.md')}\\n`), f);
    assert.match(md, /\ndescription: /, f);
    assert.match(md, /\nmodel: (inherit|sonnet|haiku|opus)\n/, f);
  }
});

test('SKILL.md "Models and effort" matches the agents\' model and effort', () => {
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  const want = { 'suite-runner': ['haiku', 'low'], planner: ['opus', 'medium'], implementer: ['sonnet', 'medium'],
    validator: ['sonnet', 'medium'], 'ui-ux-reviewer': ['sonnet', 'medium'], qa: ['sonnet', 'medium'] };
  assert.match(skill, /## Models and effort/);
  for (const [name, [model, effort]] of Object.entries(want)) {
    const md = fs.readFileSync(path.join(ROOT, 'agents', `${name}.md`), 'utf8');
    assert.match(md, new RegExp(`\\nmodel: ${model}\\neffort: ${effort}\\n`), name);
  }
});

test('/qa is standalone: the /harnex workflow never runs or offers it', () => {
  for (const f of files('skills/harnex')) {
    const s = fs.readFileSync(f, 'utf8');
    for (const bad of ['harnex:qa', 'harnex-qa', '../qa/SKILL.md']) {
      assert.ok(!s.includes(bad), `${path.relative(ROOT, f)} still wires in QA (${bad})`);
    }
  }
});

test('design skills: every reference file is dated and cites the HIG', () => {
  for (const d of ['apple-design', 'web-design']) {
    const refs = files(path.join('skills', d, 'references')).filter((f) => f.endsWith('.md'));
    assert.ok(refs.length > 0, `skills/${d}/references is empty`);
    for (const f of refs) {
      const s = fs.readFileSync(f, 'utf8');
      assert.match(s, /\nlast-checked: \d{4}-\d{2}-\d{2}\n/, `${path.relative(ROOT, f)} has no last-checked date`);
      assert.ok(s.includes('developer.apple.com/design/human-interface-guidelines/'), `${path.relative(ROOT, f)} cites no HIG page`);
    }
    // SKILL.md routes to `references/...md`; a renamed file must not break the route.
    const skill = fs.readFileSync(path.join(ROOT, 'skills', d, 'SKILL.md'), 'utf8');
    for (const m of skill.matchAll(/`(references\/[a-zA-Z0-9_./-]+\.md)`/g)) {
      assert.ok(fs.existsSync(path.join(ROOT, 'skills', d, m[1])), `skills/${d}/SKILL.md -> ${m[1]}`);
    }
  }
});

test('skills reference their own files by relative path that exists', () => {
  for (const d of fs.readdirSync(path.join(ROOT, 'skills'))) {
    for (const f of files(path.join('skills', d))) {
      const s = fs.readFileSync(f, 'utf8');
      for (const m of s.matchAll(/`\.\.\/([a-z-]+)\/([a-zA-Z0-9_./-]+\.md)`/g)) {
        assert.ok(fs.existsSync(path.join(ROOT, 'skills', m[1], m[2])), `${path.relative(ROOT, f)} -> ../${m[1]}/${m[2]}`);
      }
    }
  }
});

test('harnex runs two flows: no stray Quick/Standard/Full mode wording ships', () => {
  // `/harnex quick` and `/harnex` replaced the three modes; old words would steer agents back.
  const STRAY = [/\bStandard\b/, /\bFull path\b/i, /quick\\?\|standard\\?\|full/i, /Change mode/, /Risk decides the path/];
  for (const f of ['skills/harnex', 'agents', 'README.md', 'docs/slides/harnex.html'].flatMap(files)) {
    const s = fs.readFileSync(f, 'utf8');
    for (const re of STRAY) assert.ok(!re.test(s), `${path.relative(ROOT, f)} still says ${re}`);
  }
});

test('work packages always mean a plan doc, never a chat plan', () => {
  // A test run planned 3 WPs in a chat plan and skipped the plan doc and grounding check.
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  const planner = fs.readFileSync(path.join(ROOT, 'agents/planner.md'), 'utf8');
  assert.match(skill, /chat\s+plan\s+that\s+has\s+WPs\s+or\s+a\s+sequence\s+goes\s+back\s+to\s+the\s+planner/);
  assert.match(planner, /WPs\s+or\s+a\s+sequence:\s+always\s+a\s+doc\s+plan/);
});

test('Reviewer: default spawns with no model override', () => {
  // A test run turned `default` into `model: "opus"`, which the provider did not serve.
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  assert.match(skill, /`default`\s+means\s+no\s+`model`\s+override/);
});

test('grounding check skips anchors for code the plan adds', () => {
  // A test run counted three anchors to not-yet-written code as mismatches.
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  const planner = fs.readFileSync(path.join(ROOT, 'agents/planner.md'), 'utf8');
  assert.match(skill, /\*\*planned\*\*/);
  assert.match(planner, /`path\s+\(new\)`/);
});

test('skills call harnex.mjs, not shell one-liners, for timings, metrics and keys', () => {
  // Permission-restricted runs deny `$(...)`, redirects and pipes; timings and metrics were lost.
  for (const f of files('skills').filter((x) => !/apple-design|web-design/.test(x))) {
    const s = fs.readFileSync(f, 'utf8');
    for (const bad of ['| shasum', '$(git ', '$(cat ', '${HARNEX_METRICS:-']) {
      assert.ok(!s.includes(bad), `${path.relative(ROOT, f)} still uses ${bad}`);
    }
  }
});

test('test-run gaps stay closed: completion reads, red-check fallback, browser artifacts, headless', () => {
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  const standards = fs.readFileSync(path.join(ROOT, 'skills/harnex/standards.md'), 'utf8');
  const completion = skill.slice(skill.indexOf('## Completion'), skill.indexOf('## Gotchas'));
  assert.ok(completion.includes('`review-guide.md`') && completion.includes('`../pr-review/criteria.md`'), 'Completion names the files it reads');
  assert.match(standards, /harnex\.mjs base/, 'red check works without git worktree');
  assert.match(standards, /\.playwright-mcp\//, 'browser artifacts are covered');
  assert.match(skill, /\n## Headless\n/, 'headless contract');
});

test('the orchestrator makes its own worktrees, never the spawn isolation option', () => {
  // The tool's isolation worktree branches from the remote default branch, so a WP that
  // depends on another was built without it, and nobody linked its dependencies.
  for (const f of ['skills/harnex', 'agents'].flatMap(files)) {
    assert.ok(!/isolation:\s*"?worktree/.test(fs.readFileSync(f, 'utf8')), `${path.relative(ROOT, f)} spawns with isolation: worktree`);
  }
  const read = (f) => fs.readFileSync(path.join(ROOT, 'skills/harnex', f), 'utf8');
  const step2 = read('SKILL.md').slice(read('SKILL.md').indexOf('2. **Implement**'), read('SKILL.md').indexOf('3. **Gate review**'));
  assert.ok(step2.includes('`worktrees.md`'), 'step 2 follows worktrees.md');
  assert.match(step2, /before\s+creating\s+a\s+worktree/i, 'earlier WPs are committed before a worktree branches from HEAD');
  assert.ok(read('explore.md').includes('`worktrees.md`'), 'explore follows worktrees.md');
  const wt = read('worktrees.md');
  assert.match(wt, /worktree add -b/, 'worktrees.md creates the worktree');
  assert.match(wt, /':\(exclude\)<link>'/, 'worktrees.md keeps the dependency link out of the commit');
});

test('the report says whether the metrics record was written', () => {
  // A test run skipped `record` and nothing in the report showed it.
  const report = fs.readFileSync(path.join(ROOT, 'skills/harnex/report.md'), 'utf8');
  assert.match(report, /- `Metrics:` `written`/);
});

test('untracked new runs once, and Delivery defers to Headless', () => {
  // A rerun called `untracked new` twice and read the Delivery question as a conflict.
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  const report = fs.readFileSync(path.join(ROOT, 'skills/harnex/report.md'), 'utf8');
  assert.match(skill, /untracked new`\s+once/);
  assert.match(report, /## Delivery[^\n]*\n[^#]*Headless/);
});

test('plan format lives in plan-template.md, with the fields later phases read as core', () => {
  // The planner prompt carried ~20 mandatory fields on every plan, so small plans spent their lines on format.
  const planner = fs.readFileSync(path.join(ROOT, 'agents/planner.md'), 'utf8');
  const tpl = fs.readFileSync(path.join(ROOT, 'skills/harnex/plan-template.md'), 'utf8');
  assert.ok(planner.includes('`plan-template.md`'), 'planner reads the template');
  assert.ok(!planner.includes('`Journeys:` one line per end-user journey'), 'the format is not duplicated in the planner');
  const core = tpl.slice(tpl.indexOf('\n## Core\n'), tpl.indexOf('\n## When it applies\n'));
  assert.ok(core.length > 0 && tpl.includes('\n## When it applies\n'), 'template has Core and When it applies');
  for (const field of ['`Settings:', '`UI scope:', '`Journeys:`', '`Live smoke:`', '`Blast radius:`', '`Risk areas:`', '`Context:`', '`Done checks:`', '`## Open questions`', '`## Decisions`']) {
    assert.ok(core.includes(field), `${field} is a core field`);
  }
});

test('answers, refines and fix rounds patch the work instead of redoing it', () => {
  // Every open-question answer and every refine re-spawned a planner that explored the repo again.
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const skill = read('skills/harnex/SKILL.md');
  assert.match(read('agents/planner.md'), /\nPatch mode: /, 'planner patch mode');
  assert.match(read('agents/implementer.md'), /\nPatch mode: /, 'implementer patch mode');
  assert.ok(!skill.includes('re-spawn the planner with the answers'), 'answers no longer mean a new plan');
  assert.match(skill, /every\s+answer\s+is\s+the\s+recommended\s+one,\s+keep\s+the\s+plan/, 'recommended answers skip the planner');
  assert.match(skill, /re-spawn\s+the\s+planner\s+in\s+patch\s+mode/, 'other answers patch');
  assert.match(read('skills/harnex/brief.md'), /planner\s+in\s+patch\s+mode\s+with\s+the\s+previous\s+plan\s+and\s+the\s+feedback/, 'refine patches');
  const loop = skill.slice(skill.indexOf('## Review loop'), skill.indexOf('## Completion'));
  assert.match(loop, /in\s+patch\s+mode/, 'fix rounds patch');
});

test('grounding check also reports callers the plan did not list', () => {
  // The check confirmed cited anchors only; a caller missing from Blast radius reached review.
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  assert.match(skill, /\*\*unlisted\*\*/);
  assert.match(skill, /K\s+unverified,\s+U\s+unlisted/);
});

test('the brief shows what the planner decided without asking', () => {
  const brief = fs.readFileSync(path.join(ROOT, 'skills/harnex/brief.md'), 'utf8');
  for (const line of ['\nNot building: ', '\nDecided for you: ', '\nUnconfirmed: ']) assert.ok(brief.includes(line), line.trim());
});

test('planning is measured: patch and refine stamps, and a planning key in the metrics record', () => {
  const report = fs.readFileSync(path.join(ROOT, 'skills/harnex/report.md'), 'utf8');
  const skill = fs.readFileSync(path.join(ROOT, 'skills/harnex/SKILL.md'), 'utf8');
  const brief = fs.readFileSync(path.join(ROOT, 'skills/harnex/brief.md'), 'utf8');
  assert.match(report, /`planning` \(`\{open_questions, patches, refines, grounding: /);
  assert.match(skill, /stamp\s+`plan\s+patch`/);
  assert.match(brief, /stamp\s+`plan\s+refine`/);
});
