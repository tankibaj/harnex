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
  assert.equal(run(['stamp', '--reset', 'old'], { cwd: dir }).status, 0);
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

test('untracked: new skips Claude Code agent worktrees', () => {
  const dir = repo();
  assert.equal(run(['untracked', 'save'], { cwd: dir }).status, 0);
  fs.mkdirSync(path.join(dir, '.claude', 'worktrees', 'agent-1'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.claude', 'worktrees', 'agent-1', 'f.js'), 'x');
  fs.writeFileSync(path.join(dir, 'shot.png'), 'png');
  assert.deepEqual(run(['untracked', 'new'], { cwd: dir }).stdout.trim().split('\n'), ['shot.png']);
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

test('coverage: exits 0 only when every journey id is walked; prints each gap', () => {
  const ok = run(['coverage', 'J1,J2', 'Coverage: J1=walked J2=walked']);
  assert.equal(ok.status, 0, ok.stderr);
  const gaps = run(['coverage', 'J1,J2,J3,J4', 'Coverage: J1=walked J2=skipped(no seed data) J3=blocked(login) J1=blocked']);
  assert.equal(gaps.status, 1);
  assert.deepEqual(gaps.stdout.trim().split('\n'), ['J1 blocked', 'J2 skipped', 'J3 blocked', 'J4 missing']);
});

test('coverage: needs ids and a line', () => {
  assert.equal(run(['coverage', 'J1']).status, 1);
});

test('coverage: reason text never reads as an entry, case and spaces are tolerated', () => {
  const r = run(['coverage', 'J1, J2,J3', 'Coverage: J3=blocked(needs J2=walked first, can\'t log in) J1 = Walked']);
  assert.equal(r.status, 1);
  assert.deepEqual(r.stdout.trim().split('\n'), ['J2 missing', 'J3 blocked']);
});

test('coverage: walked with a reason is partial, a gap', () => {
  const r = run(['coverage', 'J1', 'Coverage: J1=walked(partial)']);
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'J1 partial');
});

test('coverage: agent-added J<n>+ ids must be walked too', () => {
  assert.equal(run(['coverage', 'J1', 'Coverage: J1=walked J4+=walked']).status, 0);
  const r = run(['coverage', 'J1', 'Coverage: J1=walked J4+=blocked(no data)']);
  assert.equal(r.status, 1);
  assert.equal(r.stdout.trim(), 'J4+ blocked');
});

test('coverage: a re-run line checked on its own clears the gap', () => {
  assert.equal(run(['coverage', 'J2', 'Coverage: J2=walked']).status, 0);
  assert.equal(run(['coverage', 'J1,J2', 'Coverage: J1=blocked(x) J2=walked J1=walked']).status, 1);
});

test('coverage: walked with a spaced or unterminated reason, and bare partial, are gaps', () => {
  for (const line of ['J1=walked (state X untested)', 'J1=walked(', 'J1=partial']) {
    const r = run(['coverage', 'J1', line]);
    assert.equal(r.status, 1, line);
    assert.equal(r.stdout.trim(), 'J1 partial');
  }
});

test('coverage: an ids argument with no ids fails instead of passing', () => {
  assert.equal(run(['coverage', ',', 'Coverage: J1=walked']).status, 1);
  assert.equal(run(['coverage', ' ', 'Coverage: J1=walked']).status, 1);
});

test('coverage: nested parentheses stay inside the reason; glued status text is no entry', () => {
  const r = run(['coverage', 'J1,J2,J3', 'Coverage: J3=blocked(see (SSO) J2=walked) J1=walked-partial']);
  assert.equal(r.status, 1);
  assert.deepEqual(r.stdout.trim().split('\n'), ['J1 missing', 'J2 missing', 'J3 blocked']);
  const open = run(['coverage', 'J1,J2', 'Coverage: J1=blocked( J2=walked']);
  assert.deepEqual(open.stdout.trim().split('\n'), ['J1 blocked', 'J2 missing']);
});

test('note: posts the file body to glab as one non-resolvable MR note', () => {
  const dir = tmp();
  const out = path.join(dir, 'args.json');
  fs.writeFileSync(path.join(dir, 'glab'), `#!/bin/sh\nnode -e 'require("fs").writeFileSync(process.argv[1], JSON.stringify(process.argv.slice(2)))' "${out}" "$@"\n`, { mode: 0o755 });
  const file = path.join(dir, 'body.md');
  fs.writeFileSync(file, 'line "one"\n$(not run)\n');
  const r = run(['note', '12', 'g/p', file], { env: { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}` } });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(out, 'utf8')),
    ['mr', 'note', 'create', '12', '-R', 'g/p', '--resolvable=false', '-m', 'line "one"\n$(not run)\n']);
});

test('note: no glab, a failing glab, or a huge body fail with a clear message', () => {
  const dir = tmp();
  const file = path.join(dir, 'body.md');
  fs.writeFileSync(file, 'x');
  const bare = spawnSync(process.execPath, [HELPER, 'note', '1', 'g/p', file], { encoding: 'utf8', env: { ...process.env, PATH: dir } });
  assert.equal(bare.status, 1);
  assert.match(bare.stderr, /glab not found/);
  fs.writeFileSync(path.join(dir, 'glab'), '#!/bin/sh\nexit 3\n', { mode: 0o755 });
  const failing = run(['note', '1', 'g/p', file], { env: { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}` } });
  assert.match(failing.stderr, /glab failed \(exit 3\)/);
  fs.writeFileSync(path.join(dir, 'glab'), '#!/bin/sh\nkill -TERM $$\n', { mode: 0o755 });
  assert.match(run(['note', '1', 'g/p', file], { env: { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}` } }).stderr, /glab failed \(SIGTERM\)/);
  fs.writeFileSync(file, 'x'.repeat(100001));
  assert.match(run(['note', '1', 'g/p', file]).stderr, /too large/);
});

test('note: needs iid, project and file', () => {
  assert.equal(run(['note', '12']).status, 1);
});

function timingsRepo(lines) {
  const dir = repo();
  fs.writeFileSync(path.join(dir, '.git', 'harnex-timings.log'), `${lines.join('\n')}\n`);
  return dir;
}

test('timings: sums each phase, reports waits apart, counts the count-only stamps', () => {
  const dir = timingsRepo([
    'run start 2026-01-05 10:00:00',
    'plan start 2026-01-05 10:00:00',
    'plan patch 2026-01-05 10:02:00',
    'plan end 2026-01-05 10:04:00',
    'wait start 2026-01-05 10:04:00',
    'wait end 2026-01-05 10:06:00',
    'review start 2026-01-05 10:06:00',
    'review end 2026-01-05 10:09:00',
    'review start 2026-01-05 10:20:00',
    'review end 2026-01-05 10:21:30',
    'run end 2026-01-05 10:27:00',
  ]);
  const r = run(['timings'], { cwd: dir });
  assert.equal(r.status, 0, r.stderr);
  const [line, json] = r.stdout.trim().split('\n');
  assert.equal(line, 'Timings: plan 4m, review 5m, waits 2m, total 27m, plan patch 1');
  assert.deepEqual(JSON.parse(json), { minutes: { plan: 4, review: 4.5, total: 27 }, waits_min: 2, patches: 1, refines: 0, open: [] });
});

test('stamp: without a started run in this repo it fails and writes no file', () => {
  const dir = repo();
  const r = run(['stamp', 'run end'], { cwd: dir });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /no run started in .*stamp from the target repo/);
  assert.equal(fs.existsSync(path.join(dir, '.git', 'harnex-timings.log')), false);
});

test('timings: a run with no end is listed as open', () => {
  const r = run(['timings'], { cwd: timingsRepo(['run start 2026-01-05 10:00:00']) });
  assert.equal(r.status, 0, r.stderr);
  const [line, json] = r.stdout.trim().split('\n');
  assert.equal(line, 'Timings: waits 0m, total 0m, open: run');
  assert.deepEqual(JSON.parse(json).open, ['run']);
});

test('timings: a start with no end is listed as open and adds no time; no run end uses the last stamp', () => {
  const dir = timingsRepo([
    'run start 2026-01-05 23:59:50',
    'implement start 2026-01-05 23:59:50',
    'plan refine 2026-01-06 00:00:10',
  ]);
  const r = run(['timings'], { cwd: dir });
  assert.equal(r.status, 0, r.stderr);
  const [line, json] = r.stdout.trim().split('\n');
  assert.equal(line, 'Timings: implement 0m, waits 0m, total <1m, plan refine 1, open: implement, run');
  assert.deepEqual(JSON.parse(json).open, ['implement', 'run']);
  assert.equal(JSON.parse(json).refines, 1);
});

test('timings: no file or no stamps fails with a clear message', () => {
  const none = run(['timings'], { cwd: repo() });
  assert.equal(none.status, 1);
  assert.match(none.stderr, /no timings file/);
  const empty = run(['timings'], { cwd: timingsRepo(['garbage']) });
  assert.equal(empty.status, 1);
  assert.match(empty.stderr, /no stamps/);
});
