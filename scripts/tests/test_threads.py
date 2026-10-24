"""Tests for skills/pr-review/threads.py. Run: python3 -m unittest discover -s scripts/tests"""
import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.join(os.path.dirname(os.path.dirname(HERE)), "skills", "pr-review")
sys.path.insert(0, SCRIPTS)
import threads  # noqa: E402

SCRIPT = os.path.join(SCRIPTS, "threads.py")


def note(nid, body="x", system=False, resolvable=True, resolved=False, path=None, line=None, author="rev",
         head_sha=None):
    return {"id": nid, "body": body, "system": system, "resolvable": resolvable, "resolved": resolved,
            "type": "DiffNote" if path else "DiscussionNote", "author": {"username": author},
            "position": {"new_path": path, "new_line": line, "head_sha": head_sha} if path else None}


# Shaped like `glab mr note list <iid> -F json` on a real MR: a 40-char discussion id,
# a reply in the same thread, a system-only discussion, and a resolved thread.
DISCUSSIONS = [
    {"id": "30f525b2025cf1966e8762830222dc1f316d639c", "individual_note": True,
     "notes": [note(8427000, "requested review from @a", system=True, resolvable=False)]},
    {"id": "69d10e1fa3b94c5e8d7f0a1b2c3d4e5f60718293", "individual_note": False,
     "notes": [note(8452001, "Null check missing here", path="src/A.java", line=89),
               note(8452427, "Also the expiry is off by one day", path="src/A.java", line=89)]},
    {"id": "aa11bb22cc33dd44ee55ff6677889900aabbccdd", "individual_note": False,
     "notes": [note(8460000, "Why a new table?")]},
    {"id": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "individual_note": False,
     "notes": [note(8470000, "rename this", path="src/B.java", line=3, resolved=True, head_sha="c0ffee1"),
               note(8470001, "fixed in 1a2b3c4d, test BTest.renamed", author="dev", resolved=True)]},
]


class ParseTest(unittest.TestCase):
    def test_note_url(self):
        r = threads.parse_url("https://git.example.com/grp/sub/svc/-/merge_requests/567#note_8452427")
        self.assertEqual(r, {"host": "git.example.com", "project": "grp/sub/svc", "number": 567, "note": 8452427,
                             "kind": "gitlab"})

    def test_mr_url_without_note_and_trailing_parts(self):
        r = threads.parse_url("https://git.example.com/grp/svc/-/merge_requests/12/diffs?x=1")
        self.assertEqual(r, {"host": "git.example.com", "project": "grp/svc", "number": 12, "note": None,
                             "kind": "gitlab"})

    def test_rejects_non_mr_url(self):
        with self.assertRaises(ValueError):
            threads.parse_url("https://jira.example.com/browse/ABC-1")

    def test_rejects_github_non_pr_url(self):
        with self.assertRaises(ValueError):
            threads.parse_url("https://github.com/octo/repo/issues/12")

    def test_github_pr_url(self):
        r = threads.parse_url("https://github.com/octo/repo/pull/42")
        self.assertEqual(r, {"host": "github.com", "project": "octo/repo", "number": 42, "note": None,
                             "kind": "github"})

    def test_github_pr_url_with_discussion_anchor_and_tail(self):
        r = threads.parse_url("https://github.com/octo/repo/pull/42/files#discussion_r2001")
        self.assertEqual(r, {"host": "github.com", "project": "octo/repo", "number": 42, "note": 2001,
                             "kind": "github"})
        r = threads.parse_url("https://github.com/octo/repo/pull/42#discussion_r2002")
        self.assertEqual(r["note"], 2002)


class SelectTest(unittest.TestCase):
    def test_all_unresolved_skips_system_and_resolved(self):
        got = threads.select(DISCUSSIONS, None)
        self.assertEqual([t["discussion_id"][:8] for t in got], ["69d10e1f", "aa11bb22"])
        first = got[0]
        self.assertEqual(first["path"], "src/A.java")
        self.assertEqual(first["line"], 89)
        self.assertEqual([n["id"] for n in first["notes"]], [8452001, 8452427])

    def test_note_id_maps_to_its_whole_thread_even_when_it_is_a_reply(self):
        got = threads.select(DISCUSSIONS, 8452427)
        self.assertEqual(len(got), 1)
        self.assertEqual(got[0]["discussion_id"], "69d10e1fa3b94c5e8d7f0a1b2c3d4e5f60718293")
        self.assertEqual(got[0]["linked_note"], 8452427)

    def test_unknown_note_raises(self):
        with self.assertRaises(LookupError):
            threads.select(DISCUSSIONS, 1)

    def test_all_threads_include_resolved_and_general_notes_but_not_system(self):
        got = threads.select(DISCUSSIONS, None, all_threads=True)
        self.assertEqual([t["discussion_id"][:8] for t in got], ["69d10e1f", "aa11bb22", "bbbbbbbb"])
        self.assertEqual([t["resolved"] for t in got], [False, False, True])
        last = got[2]
        self.assertEqual(last["commented_at"], "c0ffee1")
        self.assertEqual([n["author"] for n in last["notes"]], ["rev", "dev"])
        self.assertIsNone(got[1]["commented_at"])

    def test_linked_note_in_a_resolved_thread_is_reported_not_dropped(self):
        got = threads.select(DISCUSSIONS, 8470000)
        self.assertEqual(len(got), 1)
        self.assertTrue(got[0]["resolved"])


class CliTest(unittest.TestCase):
    def test_reads_discussions_from_a_file_and_prints_json(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            json.dump(DISCUSSIONS, f)
        try:
            r = subprocess.run([sys.executable, "-I", SCRIPT,
                                "https://git.example.com/grp/svc/-/merge_requests/567#note_8452427",
                                "--discussions", f.name], capture_output=True, text=True)
        finally:
            os.unlink(f.name)
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual(out["project"], "grp/svc")
        self.assertEqual(out["iid"], 567)
        self.assertEqual([t["discussion_id"][:8] for t in out["threads"]], ["69d10e1f"])

    def test_parse_only_prints_the_reference_without_fetching(self):
        r = subprocess.run([sys.executable, "-I", SCRIPT, "--parse",
                            "https://git.example.com/grp/sub/svc/-/merge_requests/567"],
                           capture_output=True, text=True, env={"PATH": "/nonexistent"})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout), {"host": "git.example.com", "project": "grp/sub/svc", "number": 567,
                                                "note": None, "kind": "gitlab",
                                                "clone_url": "git@git.example.com:grp/sub/svc.git"})

    def test_bad_url_exits_2(self):
        r = subprocess.run([sys.executable, "-I", SCRIPT, "not-a-url", "--discussions", "/dev/null"],
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 2)


def gh_comment(dbid, body="x", login="rev", oid="c0ffee1"):
    return {"databaseId": dbid, "author": {"login": login}, "body": body, "originalCommit": {"oid": oid}}


def gh_thread(tid, comments, path="src/a.ts", line=10, resolved=False, outdated=False, original_line=None):
    return {"id": tid, "isResolved": resolved, "isOutdated": outdated, "path": path, "line": line,
            "originalLine": original_line if original_line is not None else line,
            "comments": {"nodes": comments}}


# Shaped like `gh api graphql` reviewThreads on a PR: an open thread with a reply, a resolved thread,
# and an outdated open thread (line is null once the code moved).
GITHUB = {"data": {"repository": {"pullRequest": {"reviewThreads": {"nodes": [
    gh_thread("PRRT_open", [gh_comment(2001, "Null check missing", oid="aaa1111"),
                            gh_comment(2002, "Also off by one", login="dev", oid="aaa1111")]),
    gh_thread("PRRT_done", [gh_comment(2003, "rename this", oid="bbb2222"),
                            gh_comment(2004, "fixed in 1a2b3c4", login="dev", oid="bbb2222")],
              path="src/b.ts", line=3, resolved=True),
    gh_thread("PRRT_old", [gh_comment(2005, "why a new table?", oid="ccc3333")],
              path="src/c.ts", line=None, outdated=True, original_line=7),
]}}}}}


class GithubSelectTest(unittest.TestCase):
    def test_unresolved_only_keeps_outdated_open_threads(self):
        got = threads.select(GITHUB, None)
        self.assertEqual([t["discussion_id"] for t in got], ["PRRT_open", "PRRT_old"])
        first = got[0]
        self.assertEqual((first["path"], first["line"]), ("src/a.ts", 10))
        self.assertEqual(first["commented_at"], "aaa1111")
        self.assertFalse(first["resolved"])
        self.assertEqual([(n["id"], n["author"]) for n in first["notes"]], [(2001, "rev"), (2002, "dev")])

    def test_outdated_thread_falls_back_to_original_line(self):
        got = threads.select(GITHUB, None)
        self.assertEqual(got[1]["line"], 7)

    def test_all_includes_resolved(self):
        got = threads.select(GITHUB, None, all_threads=True)
        self.assertEqual([t["discussion_id"] for t in got], ["PRRT_open", "PRRT_done", "PRRT_old"])
        self.assertEqual([t["resolved"] for t in got], [False, True, False])
        self.assertEqual(got[1]["commented_at"], "bbb2222")

    def test_discussion_id_maps_to_whole_thread_even_for_a_reply(self):
        got = threads.select(GITHUB, 2002)
        self.assertEqual([t["discussion_id"] for t in got], ["PRRT_open"])
        self.assertEqual(got[0]["linked_note"], 2002)
        self.assertEqual(len(got[0]["notes"]), 2)

    def test_linked_comment_in_resolved_thread_is_reported(self):
        got = threads.select(GITHUB, 2003)
        self.assertTrue(got[0]["resolved"])

    def test_unknown_comment_raises(self):
        with self.assertRaises(LookupError):
            threads.select(GITHUB, 1)

    def test_thread_shape_matches_gitlab(self):
        gl = threads.select(DISCUSSIONS, None)[0]
        gh = threads.select(GITHUB, None)[0]
        self.assertEqual(set(gl), set(gh))
        self.assertEqual(set(gl["notes"][0]), set(gh["notes"][0]))


class GithubCliTest(unittest.TestCase):
    def run_cli(self, url, *extra):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            json.dump(GITHUB, f)
        try:
            return subprocess.run([sys.executable, "-I", SCRIPT, url, "--discussions", f.name, *extra],
                                  capture_output=True, text=True)
        finally:
            os.unlink(f.name)

    def test_pr_url_prints_unresolved_threads_in_the_shared_shape(self):
        r = self.run_cli("https://github.com/octo/repo/pull/42")
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual((out["host"], out["project"], out["iid"]), ("github.com", "octo/repo", 42))
        self.assertEqual([t["discussion_id"] for t in out["threads"]], ["PRRT_open", "PRRT_old"])

    def test_all_flag(self):
        r = self.run_cli("https://github.com/octo/repo/pull/42", "--all")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(len(json.loads(r.stdout)["threads"]), 3)

    def test_discussion_anchor_narrows_to_its_thread(self):
        r = self.run_cli("https://github.com/octo/repo/pull/42#discussion_r2004")
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual([t["discussion_id"] for t in out["threads"]], ["PRRT_done"])

    def test_unknown_anchor_exits_3(self):
        r = self.run_cli("https://github.com/octo/repo/pull/42#discussion_r1")
        self.assertEqual(r.returncode, 3)

    def test_parse_only(self):
        r = subprocess.run([sys.executable, "-I", SCRIPT, "--parse",
                            "https://github.com/octo/repo/pull/42#discussion_r2001"],
                           capture_output=True, text=True, env={"PATH": "/nonexistent"})
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout), {"host": "github.com", "project": "octo/repo", "number": 42,
                                                "note": 2001, "kind": "github",
                                                "clone_url": "https://github.com/octo/repo.git"})

    def test_graphql_shape_in_a_gitlab_url_run_is_rejected_cleanly(self):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            json.dump(GITHUB, f)
        try:
            r = subprocess.run([sys.executable, "-I", SCRIPT, "https://git.example.com/g/s/-/merge_requests/1",
                                "--discussions", f.name], capture_output=True, text=True)
        finally:
            os.unlink(f.name)
        self.assertEqual(r.returncode, 1)



class GithubFetchArgsTest(unittest.TestCase):
    def test_owner_and_name_are_sent_as_strings(self):
        # gh's -F coerces 123/true/null; repo names like that must stay strings (-f).
        calls = []
        orig = threads._run
        threads._run = lambda cmd: calls.append(cmd) or {"data": {"repository": {"pullRequest": {"reviewThreads": {
            "nodes": [], "pageInfo": {"hasNextPage": False, "endCursor": None}}}}}}
        try:
            threads.fetch_github("github.com", "2fa/true", 5)
        finally:
            threads._run = orig
        cmd = calls[0]
        self.assertEqual(cmd[cmd.index("owner=2fa") - 1], "-f")
        self.assertEqual(cmd[cmd.index("name=true") - 1], "-f")
        self.assertEqual(cmd[cmd.index("number=5") - 1], "-F")

if __name__ == "__main__":
    unittest.main()
