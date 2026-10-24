# harnex: Requirement from text, an issue, or both

Loaded by the `harnex` orchestrator before choosing the path, and by
`/pr-review` (step 3) and `/qa`. The result is the requirement every phase
works from, plus its acceptance criteria.

## Input
| Input | Requirement |
|---|---|
| Text only (`fix the date filter on the invoice list`) | The text. Enough on its own; no issue lookup. |
| Issue only (a GitHub or GitLab issue URL, `#123`) | The issue: title, description, acceptance criteria. |
| Both (`goal is to fix the date filter: <issue URL>`) | The text is the goal; the issue adds acceptance criteria and context. Where the two disagree (scope or behavior), that is a blocking open question, never a silent pick. |

Read an issue with the host's CLI (standards.md "Hosting"):
`gh issue view <url> --json title,body` on GitHub, `glab issue view <url>`
on GitLab. Any other tracker (Jira, Linear...): only when its MCP is
connected (load its tools with ToolSearch if deferred); otherwise ask the
user to paste the text. A bare `#123` is read from the current repo.
`/pr-review` takes the issue reference from the PR title, then the branch.
No CLI or MCP, issue not found, or no permission: say so in one line and
continue from the text. Issue only and no lookup possible: ask for a
one-line goal; never guess one from the reference.

## Acceptance criteria
- Read them from the issue description, under a heading or bold line that
  says "Acceptance criteria" (any case, any markup: `##`, `**...**`), as a
  bullet, numbered, or task list. Use it only when it has **real**
  criteria. Template placeholders are not criteria: items like `criteria
  1`, `TBD`, `...`, or an empty section.
- Any issue type can carry them (feature, task, bug). Bugs without a
  criteria section: the expected result in the description is the
  requirement.
- Text only: no criteria to read. The planner's `Done checks:` come from the
  text as today.
- Otherwise, go to "Missing or unclear criteria". A description with an
  explicit scope (numbered scope items, "Requirements" bullets) is the main
  source for the candidates there.

Record the source as `ac_source`: `description`, `bug-expected`, `draft`,
`text`, or `none`.

## Missing or unclear criteria
Missing: an issue with no criteria, only placeholders, and for a bug no
expected result; or a text-only goal with no observable outcome. Unclear: a
criterion that cannot be checked against code (no observable outcome, e.g.
"works well", "UX is good"), or two that contradict each other. Let the
human choose the criteria; never decide them alone:
1. **Propose** up to 8 candidate criteria, each one testable (an input or
   action and its observable result) and citing its source: the issue title,
   description or scope lines, linked issues, the user's text, and for a PR
   its description. Never propose one from a diff alone, since that only
   restates what the code does. Skip "out of scope" items. Rewrite an
   unclear criterion as a testable candidate, and keep the original's
   wording in the source.
2. **Recommend:** mark the candidates the issue or the user's text states
   explicitly as `(Recommended)`. Leave unmarked those that are inferred
   (from linked issues or the PR) or that touch an open "to clarify" item.
3. **Ask** with AskUserQuestion, `multiSelect: true`, recommended options
   first. Each option's label is the criterion (≤ 5 words), and its
   description is the testable wording plus the source. Up to 4 options per
   question and up to 4 questions per call, so group them (e.g.
   "Functional", "Validation and errors", "Non-functional"). The human can
   add their own through "Other".
4. **Use** only what the human selected (plus their "Other" text), labelled
   `DRAFT, confirmed by the requester`; `ac_source: draft`. Nothing
   selected: no criteria agreed (each caller says what that means for it).
5. Offer once to post the selected criteria as a comment on the issue for
   its owner to confirm. Never edit the issue's description.

## Output
Hand on, verbatim: the requirement (text, issue title, or both), the
acceptance criteria with their sources, `ac_source`, the issue reference and
URL (if any), and any open question from a text-versus-issue conflict.
