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
