"""Tests for the metrics hook (scripts/metrics.py). Run: python3 -m unittest discover -s scripts/tests"""
import json, os, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.dirname(HERE)
sys.path.insert(0, SCRIPTS)

HOOK = os.path.join(SCRIPTS, "metrics.py")


def run_hook(payload, log):
    env = {**os.environ, "HARNEX_METRICS": log}
    r = subprocess.run([sys.executable, "-I", HOOK], input=payload, capture_output=True, text=True, env=env)
    return r.returncode, r.stdout


class HookTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.log = os.path.join(self.dir.name, "m.jsonl")

    def tearDown(self):
        self.dir.cleanup()

    def lines(self):
        if not os.path.exists(self.log):
            return []
        with open(self.log) as f:
            return [json.loads(l) for l in f]

    def test_logs_harnex_agent_skill_and_slash_only(self):
        base = {"session_id": "s", "cwd": "/r/tenant-service"}
        cases = [
            {**base, "hook_event_name": "PreToolUse", "tool_name": "Agent", "tool_input": {"subagent_type": "harnex:reviewer", "model": "sonnet", "prompt": "SECRET"}},
            {**base, "hook_event_name": "PreToolUse", "tool_name": "Skill", "tool_input": {"skill": "harnex:harnex"}},
            {**base, "hook_event_name": "UserPromptSubmit", "prompt": "/harnex:review check auth"},
            {**base, "hook_event_name": "UserPromptSubmit", "prompt": "/harnex fix the bug"},
            {**base, "hook_event_name": "PreToolUse", "tool_name": "Agent", "tool_input": {"subagent_type": "Explore"}},
            {**base, "hook_event_name": "UserPromptSubmit", "prompt": "please run /harnex later"},
        ]
        for c in cases:
            self.assertEqual(run_hook(json.dumps(c), self.log), (0, ""))
        got = [(l["tool"], l["name"], l["repo"]) for l in self.lines()]
        self.assertEqual(got, [
            ("Agent", "harnex:reviewer", "tenant-service"),
            ("Skill", "harnex:harnex", "tenant-service"),
            ("slash", "review", "tenant-service"),
            ("slash", "harnex", "tenant-service"),
        ])
        self.assertNotIn("SECRET", open(self.log).read())

    def test_never_blocks_on_garbage_or_unwritable_log(self):
        self.assertEqual(run_hook("not json", self.log), (0, ""))
        bad = os.path.join(self.dir.name, "file")
        open(bad, "w").close()
        payload = json.dumps({"hook_event_name": "UserPromptSubmit", "prompt": "/harnex x"})
        self.assertEqual(run_hook(payload, os.path.join(bad, "m.jsonl")), (0, ""))


if __name__ == "__main__":
    unittest.main()
