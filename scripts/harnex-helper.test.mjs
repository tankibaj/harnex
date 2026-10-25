// Run: node --test scripts/*.test.mjs
// skills/harnex/harnex.mjs replaces the shell one-liners skills used for
// timings, metrics records, PR keys and the red check's base copy, so they
// run as one plain command (sandboxes, Windows).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HELPER = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'harnex', 'harnex.mjs');
const run = (args, opts = {}) => spawnSync('node', [HELPER, ...args], { encoding: 'utf8', ...opts });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'harnex-h-'));

function repo() {
  const dir = tmp();
  const git = (...a) => execFileSync('git', a, { cwd: dir });
  git('init', '-q');
  fs.writeFileSync(path.join(dir, 'a.txt'), 'base\n');
  git('add', '.');
  git('-c', 'user.name=t', '-c', 'user.email=t@example.invalid', 'commit', '-qm', 'base');
  return dir;
}

test('key: 12 hex chars of the URL\'s SHA-1, same as `printf %s url | shasum | cut -c1-12`', () => {
  const url = 'https://github.com/o/r/pull/7';
  const r = run(['key', url]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), crypto.createHash('sha1').update(url).digest('hex').slice(0, 12));
});

test('record: appends one JSON line with ts, to HARNEX_METRICS', () => {
  const log = path.join(tmp(), 'sub', 'm.jsonl');
  const env = { ...process.env, HARNEX_METRICS: log };
  assert.equal(run(['record', '{"kind":"run","flow":"harnex"}'], { env }).status, 0);
  assert.equal(run(['record', '{"kind":"qa","cases":3}'], { env }).status, 0);
  const rows = fs.readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.deepEqual(rows.map((r) => r.kind), ['run', 'qa']);
  assert.match(rows[0].ts, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d[+-]\d{4}$/);
});

test('record: invalid JSON or an unwritable file never fails the caller', () => {
  assert.equal(run(['record', 'not json'], { env: { ...process.env, HARNEX_METRICS: path.join(os.tmpdir(), 'x.jsonl') } }).status, 0);
  const file = path.join(tmp(), 'f');
  fs.writeFileSync(file, '');
  assert.equal(run(['record', '{"kind":"run"}'], { env: { ...process.env, HARNEX_METRICS: path.join(file, 'm.jsonl') } }).status, 0);
});

test('stamp: writes labelled stamps to .git/harnex-timings.log; --reset starts over', () => {
  const dir = repo();
  const log = path.join(dir, '.git', 'harnex-timings.log');
  assert.equal(run(['stamp', 'old'], { cwd: dir }).status, 0);
  assert.equal(run(['stamp', '--reset', 'run start'], { cwd: dir }).status, 0);
  assert.equal(run(['stamp', 'plan start'], { cwd: dir }).status, 0);
  const lines = fs.readFileSync(log, 'utf8').trim().split('\n');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^run start \d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/);
  assert.match(lines[1], /^plan start /);
});

test('base: exports <ref> into a new directory without a worktree; clean removes it', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'a.txt'), 'changed\n');
  const out = path.join(tmp(), 'base');
  const r = run(['base', 'HEAD', out], { cwd: dir });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(fs.readFileSync(path.join(out, 'a.txt'), 'utf8'), 'base\n');
  assert.equal(execFileSync('git', ['worktree', 'list'], { cwd: dir, encoding: 'utf8' }).trim().split('\n').length, 1);
  assert.equal(run(['clean', out]).status, 0);
  assert.ok(!fs.existsSync(out));
});

test('base: refuses a directory that already exists', () => {
  const dir = repo();
  const out = tmp();
  assert.notEqual(run(['base', 'HEAD', out], { cwd: dir }).status, 0);
});

test('clean: refuses a directory base did not create', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'keep.txt'), 'x');
  assert.notEqual(run(['clean', dir]).status, 0);
  assert.ok(fs.existsSync(path.join(dir, 'keep.txt')));
});

test('base: ignores export-ignore, unlike git archive (a checkout has those files)', () => {
  const dir = repo();
  fs.mkdirSync(path.join(dir, 'test'));
  fs.writeFileSync(path.join(dir, 'test', 'helper.js'), 'x\n');
  fs.writeFileSync(path.join(dir, '.gitattributes'), '/test export-ignore\n');
  execFileSync('git', ['add', '.'], { cwd: dir });
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', 'commit', '-qm', 'attrs'], { cwd: dir });
  const out = path.join(tmp(), 'base');
  assert.equal(run(['base', 'HEAD', out], { cwd: dir }).status, 0);
  assert.ok(fs.existsSync(path.join(out, 'test', 'helper.js')));
});

test('base: a bad ref fails and leaves no directory behind', () => {
  const out = path.join(tmp(), 'base');
  assert.notEqual(run(['base', 'no-such-ref', out], { cwd: repo() }).status, 0);
  assert.ok(!fs.existsSync(out));
});

test('untracked: new lists only untracked files created after save', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'mine.md'), 'developer notes\n');
  assert.equal(run(['untracked', 'save'], { cwd: dir }).status, 0);
  fs.mkdirSync(path.join(dir, '.playwright-mcp'));
  fs.writeFileSync(path.join(dir, '.playwright-mcp', 'shot.png'), 'png');
  const r = run(['untracked', 'new'], { cwd: dir });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.stdout.trim().split('\n'), ['.playwright-mcp/shot.png']);
});

test('untracked: new consumes the baseline, so a later run without save fails loudly', () => {
  const dir = repo();
  assert.equal(run(['untracked', 'save'], { cwd: dir }).status, 0);
  assert.equal(run(['untracked', 'new'], { cwd: dir }).status, 0);
  fs.writeFileSync(path.join(dir, 'developer-shot.png'), 'png');
  assert.notEqual(run(['untracked', 'new'], { cwd: dir }).status, 0);
});

test('untracked: new without a saved baseline fails instead of listing everything', () => {
  assert.notEqual(run(['untracked', 'new'], { cwd: repo() }).status, 0);
});

test('unknown command: usage and exit 2', () => {
  const r = run(['nope']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage/);
});
