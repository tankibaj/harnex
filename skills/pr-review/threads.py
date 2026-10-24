#!/usr/bin/env python3
"""List the review threads of a GitHub PR or GitLab MR (or one of its
comment URLs), for /pr-review.

  threads.py <PR or MR URL | comment URL> [--all] [--discussions FILE]
  threads.py --parse <URL>   host, project, number, note, clone URL, kind; no fetch

Without --discussions it runs `gh api graphql` (reviewThreads) for a GitHub
PR, or `glab mr note list <iid> -R <project> --state all -F json` for a GitLab
MR. Prints JSON: host, project, iid (the PR number or MR iid), and the threads.
A comment URL (GitHub `#discussion_r<id>`, GitLab `#note_<id>`) narrows to
that comment's whole thread, even when the comment is a reply. Otherwise:
every unresolved thread (GitLab: resolvable, non-system); with --all, every
thread, resolved or not (each has `resolved`). `commented_at` is the commit
the thread was written on (GitLab diff threads: head SHA; GitHub: the first
comment's originalCommit). --discussions FILE reads the raw host output
(a GitLab list, or the GitHub graphql response) and is used by tests.
Read-only; stdlib only. Exit 2 on a bad URL, 3 when the comment is not found.
"""
import argparse
import json
import re
import subprocess
import sys

GITLAB_URL = re.compile(r"^https?://([^/]+)/(.+?)/-/merge_requests/(\d+)(?:[/?][^#]*)?(?:#note_(\d+))?$")
GITHUB_URL = re.compile(r"^https?://([^/]+)/([^/]+/[^/]+)/pull/(\d+)(?:/[^?#]*)?(?:\?[^#]*)?(?:#discussion_r(\d+))?(?:#.*)?$")

QUERY = """query($owner:String!,$name:String!,$number:Int!,$after:String){
  repository(owner:$owner,name:$name){pullRequest(number:$number){
    reviewThreads(first:100,after:$after){
      pageInfo{hasNextPage endCursor}
      nodes{id isResolved isOutdated path line originalLine
        comments(first:100){nodes{databaseId body author{login} originalCommit{oid}}}}}}}}"""


def parse_url(url):
    url = url.strip()
    m = GITLAB_URL.match(url)
    kind = "gitlab"
    if not m:
        m = GITHUB_URL.match(url)
        kind = "github"
    if not m:
        raise ValueError(f"not a GitHub PR or GitLab MR URL: {url}")
    host, project, number, note = m.groups()
    return {"host": host, "project": project, "number": int(number),
            "note": int(note) if note else None, "kind": kind}


def clone_url(ref):
    if ref["kind"] == "github":
        return f"https://{ref['host']}/{ref['project']}.git"
    return f"git@{ref['host']}:{ref['project']}.git"


def _gl_thread(d, linked=None):
    notes = [n for n in d.get("notes") or [] if not n.get("system")]
    pos = next((n.get("position") for n in notes if n.get("position")), None) or {}
    return {
        "discussion_id": d["id"],
        "path": pos.get("new_path") or pos.get("old_path"),
        "line": pos.get("new_line") or pos.get("old_line"),
        "commented_at": pos.get("head_sha"),
        "resolved": all(n.get("resolved") for n in notes if n.get("resolvable")),
        "linked_note": linked,
        "notes": [{"id": n["id"], "author": (n.get("author") or {}).get("username"), "body": n.get("body", "")}
                  for n in notes],
    }


def _gh_nodes(data):
    try:
        return data["data"]["repository"]["pullRequest"]["reviewThreads"]["nodes"] or []
    except (KeyError, TypeError) as err:
        raise ValueError("unexpected GitHub reviewThreads response") from err


def _gh_comments(t):
    return (t.get("comments") or {}).get("nodes") or []


def _gh_thread(t, linked=None):
    comments = _gh_comments(t)
    first = comments[0] if comments else {}
    return {
        "discussion_id": t["id"],
        "path": t.get("path"),
        "line": t.get("line") if t.get("line") is not None else t.get("originalLine"),
        "commented_at": (first.get("originalCommit") or {}).get("oid"),
        "resolved": bool(t.get("isResolved")),
        "linked_note": linked,
        "notes": [{"id": c.get("databaseId"), "author": (c.get("author") or {}).get("login"),
                   "body": c.get("body", "")} for c in comments],
    }


def kind_of(data):
    """'github' for a graphql response (a dict), 'gitlab' for a glab note list."""
    return "github" if isinstance(data, dict) else "gitlab"


def select(data, note_id, all_threads=False):
    github = kind_of(data) == "github"
    items, to_thread = (_gh_nodes(data), _gh_thread) if github else (data, _gl_thread)

    def ids(t):
        return [c.get("databaseId") for c in _gh_comments(t)] if github else [n.get("id") for n in t.get("notes") or []]

    def keep(t):
        if github:
            return bool(_gh_comments(t)) and (all_threads or not t.get("isResolved"))
        return _gl_keep(t, all_threads)
    if note_id is not None:
        for t in items:
            if note_id in ids(t):
                return [to_thread(t, note_id)]
        raise LookupError(f"comment {note_id} not found on this PR/MR")
    return [to_thread(t) for t in items if keep(t)]


def _gl_keep(d, all_threads):
    notes = [n for n in d.get("notes") or [] if not n.get("system")]
    return bool(notes) and (all_threads or any(n.get("resolvable") and not n.get("resolved") for n in notes))


def _run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip() or f"{cmd[0]} failed")
    return json.loads(r.stdout)


def fetch_gitlab(project, iid):
    return _run(["glab", "mr", "note", "list", str(iid), "-R", project, "--state", "all", "-F", "json"])


def fetch_github(host, project, number):
    owner, name = project.split("/", 1)
    nodes, after = [], None
    while True:
        cmd = ["gh", "api", "graphql"] + (["--hostname", host] if host != "github.com" else []) + [
            "-f", f"query={QUERY}", "-f", f"owner={owner}", "-f", f"name={name}", "-F", f"number={number}"]
        if after:
            cmd += ["-F", f"after={after}"]
        page = _run(cmd)
        nodes += _gh_nodes(page)
        info = page["data"]["repository"]["pullRequest"]["reviewThreads"]["pageInfo"]
        if not info.get("hasNextPage"):
            break
        after = info["endCursor"]
    return {"data": {"repository": {"pullRequest": {"reviewThreads": {"nodes": nodes}}}}}


def main(argv):
    p = argparse.ArgumentParser()
    p.add_argument("url")
    p.add_argument("--discussions", help="read the raw host output from this file instead of gh/glab")
    p.add_argument("--parse", action="store_true", help="print the parsed reference only; no gh/glab call")
    p.add_argument("--all", action="store_true", help="every thread, resolved ones too")
    a = p.parse_args(argv)
    try:
        ref = parse_url(a.url)
    except ValueError as e:
        print(e, file=sys.stderr)
        return 2
    if a.parse:
        print(json.dumps({**ref, "clone_url": clone_url(ref)}))
        return 0
    try:
        if a.discussions:
            with open(a.discussions) as f:
                data = json.load(f)
            if kind_of(data) != ref["kind"]:
                raise ValueError(f"file holds {kind_of(data)} threads but the URL is a {ref['kind']} URL")
        elif ref["kind"] == "github":
            data = fetch_github(ref["host"], ref["project"], ref["number"])
        else:
            data = fetch_gitlab(ref["project"], ref["number"])
        threads = select(data, ref["note"], a.all)
    except LookupError as e:
        print(e, file=sys.stderr)
        return 3
    except (RuntimeError, OSError, ValueError) as e:
        print(f"could not read the review threads: {e}", file=sys.stderr)
        return 1
    print(json.dumps({"host": ref["host"], "project": ref["project"], "iid": ref["number"],
                      "threads": threads}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
