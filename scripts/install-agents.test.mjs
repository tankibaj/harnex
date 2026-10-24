// Run: node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'install-agents.mjs');
const run = (home, ...args) => spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8', env: { ...process.env, HOME: home, XDG_CONFIG_HOME: '' } });

test('installs every agent for Codex (toml) and OpenCode (md), prefixed harnex-', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'harnex-home-'));
  const r = run(home, '--all');
  assert.equal(r.status, 0, r.stderr);
  const agents = fs.readdirSync(path.join(ROOT, 'agents')).map((f) => f.replace(/\.md$/, ''));
  for (const a of agents) {
    const toml = fs.readFileSync(path.join(home, '.codex', 'agents', `harnex-${a}.toml`), 'utf8');
    assert.match(toml, new RegExp(`^name = "harnex-${a}"$`, 'm'));
    assert.match(toml, /^sandbox_mode = "(read-only|workspace-write)"$/m);
    assert.match(toml, /^developer_instructions = '''/m);
    const md = fs.readFileSync(path.join(home, '.config', 'opencode', 'agents', `harnex-${a}.md`), 'utf8');
    assert.match(md, /^---\ndescription: ".+"\nmode: subagent\n/);
  }
  // Read-only agents stay read-only.
  assert.match(fs.readFileSync(path.join(home, '.codex', 'agents', 'harnex-reviewer.toml'), 'utf8'), /sandbox_mode = "read-only"/);
  assert.match(fs.readFileSync(path.join(home, '.config', 'opencode', 'agents', 'harnex-reviewer.md'), 'utf8'), /permission:\n  edit: deny/);
  // Agents that write test artifacts and screenshots can edit in both tools.
  assert.match(fs.readFileSync(path.join(home, '.codex', 'agents', 'harnex-validator.toml'), 'utf8'), /sandbox_mode = "workspace-write"/);
  assert.doesNotMatch(fs.readFileSync(path.join(home, '.config', 'opencode', 'agents', 'harnex-validator.md'), 'utf8'), /edit: deny/);
});

test('never overwrites a file it did not write; --uninstall removes only its own', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'harnex-home-'));
  const dir = path.join(home, '.codex', 'agents');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'harnex-planner.toml'), 'mine');
  fs.writeFileSync(path.join(dir, 'other.toml'), 'keep');
  const r = run(home, '--codex');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /skip .*harnex-planner\.toml: not written by harnex/);
  assert.equal(fs.readFileSync(path.join(dir, 'harnex-planner.toml'), 'utf8'), 'mine');
  assert.equal(run(home, '--codex', '--uninstall').status, 1, 'still reports the file it would not touch');
  assert.equal(fs.readFileSync(path.join(dir, 'harnex-planner.toml'), 'utf8'), 'mine');
  assert.ok(fs.existsSync(path.join(dir, 'other.toml')));
  assert.ok(!fs.existsSync(path.join(dir, 'harnex-reviewer.toml')));
});

test('needs a target', () => {
  const r = run(fs.mkdtempSync(path.join(os.tmpdir(), 'harnex-home-')));
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--codex.*--opencode.*--all/);
});
