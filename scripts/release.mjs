#!/usr/bin/env node
// Automatic release from Conventional Commits. Runs in CI on main:
//   node scripts/release.mjs          compute, bump, commit, tag, push, GitHub release
//   node scripts/release.mjs --dry    print what it would do
//   node scripts/release.mjs --lint <base>   fail on non-Conventional commits since <base>
// Bump: feat -> minor; fix, refactor, perf -> patch; breaking (`!` or
// BREAKING CHANGE) -> minor too: a major is only ever a manual edit.
// Only commits that touch SHIPPED paths count; docs/CI/test-only merges release nothing.
// Re-runnable: when HEAD is already a release tag, it only makes sure the
// GitHub release exists. Runs in GitHub Actions with GITHUB_TOKEN (contents: write).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// marketplace.json carries no version (the plugin's own version drives updates).
export const VERSION_FILES = ['.claude-plugin/plugin.json'];

export const SHIPPED = ['skills/', 'agents/', 'hooks/', '.claude-plugin/', 'scripts/metrics.py', 'scripts/install-agents.mjs'];

export const TYPES = ['feat', 'fix', 'refactor', 'perf', 'docs', 'test', 'ci', 'chore', 'build', 'style', 'revert'];
const CONVENTIONAL = new RegExp(`^(${TYPES.join('|')})(\\([^)]*\\))?(!)?: \\S`);
const PATCH_TYPES = new Set(['fix', 'refactor', 'perf']);
const RELEASE_TAG = /^v\d+\.\d+\.\d+$/;
export const RELEASE_PREFIX = 'chore(release):';
const BASELINE_NOTES = '- Baseline release.';

export function isConventional(subject) {
  return CONVENTIONAL.test(subject) || /^Merge /.test(subject) || /^Revert "/.test(subject);
}

// commits: [{ subject, body, files }] -> 'minor' | 'patch' | null
export function bumpLevel(commits) {
  let level = null;
  for (const c of commits) {
    if (!c.files.some((f) => SHIPPED.some((p) => f === p || f.startsWith(p)))) continue;
    const m = CONVENTIONAL.exec(c.subject);
    if (!m) continue;
    const [, type, , bang] = m;
    if (type === 'feat' || bang || /^BREAKING[ -]CHANGE:/m.test(c.body)) return 'minor';
    if (PATCH_TYPES.has(type)) level = 'patch';
  }
  return level;
}

export function nextVersion(current, level) {
  const [maj, min, pat] = current.split('.').map(Number);
  if (level === 'minor') return `${maj}.${min + 1}.0`;
  if (level === 'patch') return `${maj}.${min}.${pat + 1}`;
  return current;
}

// Newest strict vX.Y.Z tag; pre-release or suffixed tags (v1.0.0-rc1) never count.
export function newestReleaseTag(tags) {
  const key = (t) => t.slice(1).split('.').map(Number);
  return tags.filter((t) => RELEASE_TAG.test(t)).sort((a, b) => {
    const [x, y] = [key(a), key(b)];
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  }).at(-1) ?? null;
}

// Returns the single version all VERSION_FILES agree on; throws on drift.
export function readVersion(root = REPO) {
  const versions = VERSION_FILES.map((f) => {
    const j = JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
    return j.version ?? j.metadata?.version;
  });
  if (new Set(versions).size !== 1) {
    throw new Error(`version drift: ${VERSION_FILES.map((f, i) => `${f}=${versions[i]}`).join(', ')}`);
  }
  return versions[0];
}

export function writeVersion(version, root = REPO) {
  for (const f of VERSION_FILES) {
    const p = path.join(root, f);
    const text = fs.readFileSync(p, 'utf8');
    const next = text.replace(/("version":\s*")[^"]+(")/, `$1${version}$2`);
    if (next === text) throw new Error(`no "version" in ${f}`);
    fs.writeFileSync(p, next);
  }
}

export function releaseNotes(commits) {
  const lines = commits
    .filter((c) => CONVENTIONAL.test(c.subject) && !c.subject.startsWith(RELEASE_PREFIX))
    .map((c) => `- ${c.subject}`);
  return lines.length ? lines.join('\n') : '- No notable changes.';
}

// Removes the token (raw and as a Basic credential) from any text bound for the log.
export function redact(text, token) {
  if (!token) return text;
  // actions/checkout sends the token as Basic x-access-token:<token>.
  const forms = ['x-access-token', 'oauth2'].map((u) => Buffer.from(`${u}:${token}`).toString('base64'));
  return forms.reduce((t, b) => t.split(b).join('[MASKED]'), text.split(token).join('[MASKED]'));
}

const git = (...args) => execFileSync('git', args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const lines = (s) => s.split('\n').filter(Boolean);

const tagAt = (ref) => newestReleaseTag(lines(git('tag', '--points-at', ref)));
// null when ref does not resolve (the parent of a root commit).
const lastTag = (ref) => {
  try { return newestReleaseTag(lines(git('tag', '--merged', ref))); } catch { return null; }
};

function commitsSince(from, to = 'HEAD') {
  return lines(git('rev-list', '--no-merges', from ? `${from}..${to}` : to)).map((sha) => ({
    sha,
    subject: git('log', '-1', '--format=%s', sha),
    body: git('log', '-1', '--format=%b', sha),
    files: lines(git('diff-tree', '--root', '--no-commit-id', '--name-only', '-r', sha)),
  }));
}

// GitHub Actions' bot identity; tags and commits show as github-actions[bot].
const IDENTITY = { name: 'github-actions[bot]', email: '41898282+github-actions[bot]@users.noreply.github.com' };

const gh = (...args) => execFileSync('gh', args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function ensureGithubRelease(tag, notes) {
  try { gh('release', 'view', tag); return console.log(`GitHub release ${tag} already exists`); } catch {}
  gh('release', 'create', tag, '--title', tag, '--notes', notes, '--verify-tag');
}

function lint(base) {
  if (!base) throw new Error('usage: release.mjs --lint <base ref>');
  const bad = lines(git('rev-list', '--no-merges', `${base}..HEAD`))
    .map((sha) => [sha.slice(0, 8), git('log', '-1', '--format=%s', sha)])
    .filter(([, s]) => !isConventional(s));
  for (const [sha, s] of bad) console.error(`not a Conventional Commit: ${sha} ${s}`);
  if (bad.length) {
    console.error(`Use type(scope): summary, type one of ${TYPES.join(', ')}. The release version comes from these.`);
    process.exit(1);
  }
  console.log('commit messages: ok');
}

async function main(argv) {
  if (argv[0] === '--lint') return lint(argv[1]);
  const dry = argv.includes('--dry');
  const branch = process.env.GITHUB_REF_NAME || 'main';
  if (!dry && !process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) throw new Error('GH_TOKEN or GITHUB_TOKEN is not set');

  // Retry of a job whose push already landed: only the GitHub release may be missing.
  const headTag = tagAt('HEAD');
  if (headTag) {
    const prev = lastTag(`${headTag}^`);
    const notes = prev ? releaseNotes(commitsSince(prev, headTag)) : BASELINE_NOTES;
    console.log(`HEAD is already ${headTag}`);
    if (!dry) ensureGithubRelease(headTag, notes);
    return;
  }

  const current = readVersion();
  const tag = lastTag('HEAD');
  let version = current;
  let notes = BASELINE_NOTES;
  if (tag) {
    const commits = commitsSince(tag);
    const level = bumpLevel(commits);
    if (!level) return console.log(`no release: nothing shipped since ${tag}`);
    version = nextVersion(current, level);
    notes = releaseNotes(commits);
  }
  const newTag = `v${version}`;
  console.log(`release ${newTag}${tag ? ` (since ${tag})` : ' (baseline)'}\n${notes}`);
  if (dry) return;

  // Identity via env, not `git config`, so a local run leaves the repo's config alone.
  const { name, email } = IDENTITY;
  Object.assign(process.env, {
    GIT_AUTHOR_NAME: name, GIT_AUTHOR_EMAIL: email,
    GIT_COMMITTER_NAME: name, GIT_COMMITTER_EMAIL: email,
  });
  if (version !== current) {
    writeVersion(version);
    git('add', '--', ...VERSION_FILES);
    git('commit', '-m', `${RELEASE_PREFIX} ${newTag}`);
  }
  git('tag', '-a', newTag, '-m', newTag);
  // actions/checkout persisted GITHUB_TOKEN credentials for this push.
  git('push', '--atomic', 'origin', `HEAD:refs/heads/${branch}`, `refs/tags/${newTag}`);
  ensureGithubRelease(newTag, notes);
  console.log(`released ${newTag}`);
}

// realpath: on macOS the temp dir is a symlink, and import.meta.url is the resolved path.
if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(redact(`${e.message}\n${e.stderr ?? ''}`.trim(), process.env.GH_TOKEN || process.env.GITHUB_TOKEN));
    process.exit(1);
  });
}
