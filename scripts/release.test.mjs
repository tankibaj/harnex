import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  bumpLevel,
  nextVersion,
  isConventional,
  readVersion,
  writeVersion,
  releaseNotes,
  newestReleaseTag,
  redact,
  VERSION_FILES,
} from './release.mjs';

const SCRIPT = path.join(path.dirname(new URL(import.meta.url).pathname), 'release.mjs');

const c = (subject, files = ['skills/harnex/SKILL.md'], body = '') => ({ subject, body, files });

test('feat bumps minor', () => {
  assert.equal(bumpLevel([c('fix: a'), c('feat(harnex): b')]), 'minor');
});

test('fix, refactor, perf bump patch', () => {
  for (const t of ['fix', 'refactor', 'perf']) assert.equal(bumpLevel([c(`${t}: x`)]), 'patch');
});

test('breaking change caps at minor, never major', () => {
  assert.equal(bumpLevel([c('fix!: drop flag')]), 'minor');
  assert.equal(bumpLevel([c('fix: x', undefined, 'BREAKING CHANGE: gone')]), 'minor');
  assert.equal(nextVersion('0.2.5', 'minor'), '0.3.0');
});

test('docs, ci, test, chore release nothing', () => {
  assert.equal(bumpLevel([c('docs: readme'), c('ci: job'), c('test: more'), c('chore: tidy')]), null);
});

test('the agent installer is a shipped path', () => {
  assert.equal(bumpLevel([c('fix(agents): toml quoting', ['scripts/install-agents.mjs'])]), 'patch');
});

test('feat touching only unshipped paths releases nothing', () => {
  assert.equal(bumpLevel([c('feat: ci tweak', ['.github/workflows/ci.yml', 'README.md', 'docs/x.md'])]), null);
  assert.equal(bumpLevel([c('fix(agents): x', ['agents/planner.md'])]), 'patch');
  assert.equal(bumpLevel([c('fix: x', ['scripts/tests/test_metrics.py'])]), null);
});

test('nextVersion', () => {
  assert.equal(nextVersion('0.2.0', 'patch'), '0.2.1');
  assert.equal(nextVersion('0.2.3', 'minor'), '0.3.0');
  assert.equal(nextVersion('0.2.3', null), '0.2.3');
});

test('isConventional accepts types, scopes, bang, merges; rejects free text', () => {
  for (const s of ['feat: a', 'fix(setup): b', 'feat(x)!: c', "Merge branch 'x' into 'main'", 'Revert "feat: a"']) {
    assert.ok(isConventional(s), s);
  }
  for (const s of ['Update README', 'feat:no space', 'WIP', 'bugfix: x', 'Fix: x', 'Update: x']) assert.ok(!isConventional(s), s);
});

test('release notes skip release commits and free text', () => {
  assert.equal(releaseNotes([c('feat: a'), c('chore(release): v0.3.0'), c('oops')]), '- feat: a');
});

test('the repo version files agree', () => {
  assert.match(readVersion(), /^\d+\.\d+\.\d+$/);
});

test('writeVersion updates plugin.json and readVersion reads it back', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-'));
  for (const f of VERSION_FILES) {
    fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
    fs.writeFileSync(path.join(root, f), JSON.stringify({ name: 'p', version: '0.2.0' }, null, 2));
  }
  writeVersion('0.3.0', root);
  assert.equal(readVersion(root), '0.3.0');
  fs.writeFileSync(path.join(root, VERSION_FILES[0]), JSON.stringify({ name: 'p' }));
  assert.throws(() => writeVersion('0.4.0', root), /no "version"/);
});

test('newestReleaseTag sorts numerically and skips pre-releases', () => {
  assert.equal(newestReleaseTag(['v0.9.0', 'v0.10.0', 'v0.11.0-rc1', 'v0.2.0', 'x1']), 'v0.10.0');
  assert.equal(newestReleaseTag(['v1.0.0.1', 'latest']), null);
});

test('redact removes the token and its Basic form', () => {
  const b64 = Buffer.from('x-access-token:s3cr3t').toString('base64');
  assert.equal(redact(`push https://x-access-token:s3cr3t@h failed; AUTHORIZATION: basic ${b64}`, 's3cr3t'),
    'push https://x-access-token:[MASKED]@h failed; AUTHORIZATION: basic [MASKED]');
  assert.equal(redact('nothing', ''), 'nothing');
});

// End to end against a throwaway repo, a bare remote, and a stub `gh`: no network.
function sandbox() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-e2e-'));
  const repo = path.join(dir, 'repo');
  const g = (...a) => execFileSync('git', a, { cwd: repo, encoding: 'utf8' }).trim();
  fs.mkdirSync(path.join(repo, 'scripts'), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(repo, 'scripts', 'release.mjs'));
  for (const f of VERSION_FILES) {
    fs.mkdirSync(path.dirname(path.join(repo, f)), { recursive: true });
    fs.writeFileSync(path.join(repo, f), JSON.stringify({ name: 'harnex', version: '0.1.0' }, null, 2));
  }
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 't@t'); g('config', 'user.name', 't');
  g('add', '-A'); g('commit', '-qm', 'feat: initial');
  const remote = path.join(dir, 'remote.git');
  execFileSync('git', ['clone', '-q', '--bare', repo, remote]);
  g('remote', 'add', 'origin', remote);
  // Stub gh: `release view` fails (no release yet), `release create` records its args.
  const bin = path.join(dir, 'bin');
  fs.mkdirSync(bin);
  const log = path.join(dir, 'gh.log');
  fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/sh\necho "$@" >> ${log}\n[ "$2" = view ] && exit 1\nexit 0\n`, { mode: 0o755 });
  const commit = (subject, file) => {
    fs.mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    fs.writeFileSync(path.join(repo, file), subject);
    g('add', '-A'); g('commit', '-qm', subject);
  };
  const run = (...args) => spawnSync('node', [path.join(repo, 'scripts', 'release.mjs'), ...args], {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, GH_TOKEN: 'tok-SECRET', GITHUB_REF_NAME: 'main' },
  });
  const ghLog = () => (fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '');
  return { repo, remote, g, commit, run, ghLog };
}

test('release: first run tags the baseline; a feat then bumps minor, pushes commit + tag, creates the release', () => {
  const s = sandbox();
  let r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /release v0\.1\.0 \(baseline\)/);
  assert.match(s.ghLog(), /release create v0\.1\.0/);
  s.commit('feat(harnex): new skill', 'skills/harnex/x.md');
  r = s.run();
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /release v0\.2\.0 \(since v0\.1\.0\)/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(s.repo, VERSION_FILES[0]), 'utf8')).version, '0.2.0');
  assert.match(execFileSync('git', ['tag'], { cwd: s.remote, encoding: 'utf8' }), /v0\.2\.0/);
  assert.match(execFileSync('git', ['log', '-1', '--format=%s %an', 'main'], { cwd: s.remote, encoding: 'utf8' }), /chore\(release\): v0\.2\.0 github-actions\[bot\]/);
  assert.match(s.ghLog(), /release create v0\.2\.0/);
  // A docs-only change releases nothing.
  s.commit('docs: readme', 'README.md');
  assert.match(s.run().stdout, /no release: nothing shipped since v0\.2\.0/);
});

test('release: a rejected push fails without printing the token, and tags nothing', () => {
  const s = sandbox();
  s.commit('fix: x', 'skills/harnex/y.md');
  execFileSync('git', ['tag', 'v0.1.0', 'HEAD~1'], { cwd: s.repo });
  const other = path.join(path.dirname(s.repo), 'other');
  execFileSync('git', ['clone', '-q', s.remote, other]);
  execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '--allow-empty', '-m', 'ci: x'], { cwd: other });
  execFileSync('git', ['push', '-q', 'origin', 'main'], { cwd: other });
  const r = s.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /rejected|failed/);
  assert.doesNotMatch(r.stderr + r.stdout, /tok-SECRET/);
  assert.doesNotMatch(execFileSync('git', ['tag'], { cwd: s.remote, encoding: 'utf8' }), /v0\.1\.1/, 'atomic: no tag without the branch');
});

test('lint: needs a base and rejects non-Conventional subjects', () => {
  const s = sandbox();
  assert.match(s.run('--lint').stderr, /usage/);
  s.commit('bugfix: x', 'a.txt');
  const r = s.run('--lint', 'HEAD~1');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /not a Conventional Commit: \w+ bugfix: x/);
});
