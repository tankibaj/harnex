#!/usr/bin/env node
// Small helpers harnex skills run instead of shell one-liners, so each step is
// one plain command that works in sandboxes and on macOS, Linux and Windows.
// Node only, no dependencies.
//
//   node harnex.mjs stamp [--reset] <label>   append "<label> <time>" to .git/harnex-timings.log
//   node harnex.mjs record '<json>'           append one metrics line (adds ts) to ~/.harnex/metrics.jsonl
//   node harnex.mjs key <PR web URL>          12-character hash of the URL (pr_key)
//   node harnex.mjs base <ref> <dir>          check out <ref> into a new <dir>, no worktree (red check)
//   node harnex.mjs clean <dir>               remove a <dir> that base created
//   node harnex.mjs untracked save|new        save the untracked files now | list the ones added since
//   node harnex.mjs coverage <ids> <line>     check a `Coverage:` line walked every journey id (J1,J2); exit 1 on gaps
//
// record never fails the caller: metrics are passive.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const MARKER = '.harnex-base';
const p = (n) => String(Math.abs(n)).padStart(2, '0');
const date = (d) => `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
const time = (d) => `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
// 2026-10-25T00:12:34+0200: the same format scripts/metrics.py writes.
function timestamp(d = new Date()) {
  const off = -d.getTimezoneOffset();
  return `${date(d)}T${time(d)}${off >= 0 ? '+' : '-'}${p(Math.trunc(off / 60))}${p(off % 60)}`;
}

function stamp(args) {
  const reset = args[0] === '--reset';
  const label = (reset ? args.slice(1) : args).join(' ');
  if (!label) throw new Error('stamp needs a label');
  const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim();
  const log = path.join(gitDir, 'harnex-timings.log');
  const d = new Date();
  const line = `${label} ${date(d)} ${time(d)}\n`;
  if (reset) fs.writeFileSync(log, line);
  else fs.appendFileSync(log, line);
}

function record(json) {
  try {
    const entry = { ts: timestamp(), ...JSON.parse(json) };
    const log = process.env.HARNEX_METRICS || path.join(os.homedir(), '.harnex', 'metrics.jsonl');
    fs.mkdirSync(path.dirname(log), { recursive: true });
    fs.appendFileSync(log, `${JSON.stringify(entry)}\n`);
  } catch {
    // Passive: a metrics line that cannot be written is skipped.
  }
}

const key = (url) => crypto.createHash('sha1').update(url).digest('hex').slice(0, 12);

// Checks <ref> out through a throwaway index, so the red check still runs where
// `git worktree` is unavailable or denied. Unlike `git archive`, it ignores
// export-ignore, so <dir> has every file a checkout has.
function base([ref, dir]) {
  if (!ref || !dir) throw new Error('base needs <ref> <dir>');
  if (fs.existsSync(dir)) throw new Error(`${dir} already exists`);
  const index = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'harnex-index-')), 'index');
  const env = { ...process.env, GIT_INDEX_FILE: index };
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, MARKER), `${ref}\n`);
    execFileSync('git', ['read-tree', ref], { env, stdio: ['ignore', 'ignore', 'inherit'] });
    execFileSync('git', ['checkout-index', '-a', '-f', `--prefix=${path.resolve(dir)}/`], { env, stdio: ['ignore', 'ignore', 'inherit'] });
  } catch (e) {
    fs.rmSync(dir, { recursive: true, force: true });
    throw e;
  } finally {
    fs.rmSync(path.dirname(index), { recursive: true, force: true });
  }
}

function clean([dir]) {
  if (!dir || !fs.existsSync(path.join(dir, MARKER))) throw new Error(`${dir} was not created by base`);
  fs.rmSync(dir, { recursive: true, force: true });
}

// Untracked, not ignored files: the run-start baseline, so Completion removes
// only the artifacts this run created, never the developer's own files.
function untracked([mode]) {
  const top = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  // Claude Code's agent worktrees are its own scratch, not this run's artifacts.
  const list = () => execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: top, encoding: 'utf8' })
    .split('\n').filter((f) => f && !f.startsWith('.claude/worktrees/'));
  const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim();
  const saved = path.join(gitDir, 'harnex-untracked.txt');
  if (mode === 'save') return fs.writeFileSync(saved, list().join('\n'));
  if (mode !== 'new') throw new Error('untracked needs save or new');
  if (!fs.existsSync(saved)) throw new Error('no baseline: run `untracked save` at run start');
  const before = new Set(fs.readFileSync(saved, 'utf8').split('\n'));
  for (const f of list()) if (!before.has(f)) console.log(f);
  // One baseline per run: a later run that skips `save` fails instead of
  // reading this run's list and flagging the developer's newer files.
  fs.rmSync(saved);
}

// A gate agent's `Coverage: J1=walked J2=blocked(reason) J3=partial(reason)` line
// against the plan's journey ids. Only a bare `walked` counts. A missing id,
// blocked, skipped, partial, or `walked` carrying a reason (even `walked (x)` or
// an unterminated `walked(`) is a gap, and so is any agent-added `J<n>+` id that
// is not walked. A status glued to more text (`walked-partial`) is no entry. A
// reason is skipped to its matching parenthesis (nested ones included, an
// unterminated one runs to the end), so its text never reads as an entry. An id
// seen twice stays a gap unless every occurrence is walked. Prints one line per gap.
function coverage([ids, ...line]) {
  if (!ids || !line.length) throw new Error('coverage needs <ids> <coverage line>');
  const want = new Set(ids.split(',').map((id) => id.trim().toUpperCase()).filter(Boolean));
  if (!want.size) throw new Error('coverage needs at least one journey id');
  const text = line.join(' ');
  const re = /\b(J\d+\+?)\s*=\s*(walked|partial|blocked|skipped)(?![\w\-/:])/gi;
  const seen = new Map();
  for (let m; (m = re.exec(text));) {
    let i = re.lastIndex;
    while (/\s/.test(text[i] ?? '')) i++;
    const reason = text[i] === '(';
    if (reason) {
      for (let depth = 0; i < text.length; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')' && --depth === 0) { i++; break; }
      }
      re.lastIndex = i;
    }
    const id = m[1].toUpperCase();
    const word = m[2].toLowerCase();
    const status = reason && word === 'walked' ? 'partial' : word;
    if (!seen.has(id) || seen.get(id) === 'walked') seen.set(id, status);
  }
  for (const id of seen.keys()) if (id.endsWith('+')) want.add(id);
  const gaps = [...want].filter((id) => seen.get(id) !== 'walked');
  for (const id of gaps) console.log(`${id} ${seen.get(id) ?? 'missing'}`);
  if (gaps.length) process.exitCode = 1;
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === 'stamp') stamp(args);
  else if (cmd === 'record') record(args.join(' '));
  else if (cmd === 'key' && args[0]) console.log(key(args[0]));
  else if (cmd === 'base') base(args);
  else if (cmd === 'clean') clean(args);
  else if (cmd === 'untracked') untracked(args);
  else if (cmd === 'coverage') coverage(args);
  else {
    console.error('usage: harnex.mjs stamp [--reset] <label> | record <json> | key <url> | base <ref> <dir> | clean <dir> | untracked save|new | coverage <ids> <line>');
    process.exitCode = 2;
  }
} catch (e) {
  console.error(`harnex.mjs ${cmd}: ${e.message}`);
  process.exitCode = 1;
}
