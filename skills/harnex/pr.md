# harnex: PR description

Loaded at Delivery by the `harnex` orchestrator (report.md "Delivery") and
by `/pr-review` to check an existing description (an MR on GitLab). The
description tells a human in one screen what changed, that it works, and
how dangerous merging it is; the reviewer's guide then says how to read it.

## Rules
- No preamble, no restated issue. Prose brief; use the project's domain
  words.
- The first line is the hidden `harnex:run` marker; `/pr-review`
  uses it to tell a harnex PR from any other. Keep it on update, and put
  it back if it is missing.
- Every claim comes from this run: the plan, the implementer's report, the
  validator's output and red check, the reviewer's `Risk hunks:`. Nothing
  invented; a section you cannot ground says `NOT VERIFIED: <why>`.
- **Updating an existing description** (a PR that already exists): start
  from the current text (`gh pr view <number> --json body`; GitLab: `glab mr
  view <iid> -R <project> -F json` → `description`). Change only the sections this run changes (the
  fix's evidence, a changed merge danger, the guide's rows for the touched
  lines); keep everything else verbatim: earlier evidence, screenshots,
  links to other PRs, and any manual edits. Never replace grounded evidence
  with `NOT VERIFIED`. Show the diff of the description before updating.
- **Summary:** one sentence, then the smallest sketch that makes the point.
  Pick one, rarely two:
  - logic or an algorithm: pseudocode;
  - runtime flow: a call tree;
  - UI structure: a component tree with the state that matters;
  - a broad refactor or new files: a shallow file tree;
  - interaction between services or components: a Mermaid sequence diagram;
  - a change to a shape that already exists: a `diff` block of that shape
    (call tree, file tree, component tree, or state flow), not of the code.
  Keep only the calls, files, and states needed for the point. Skip the
  sketch when one sentence says it all.
- **Evidence:** before and after, best first: a screenshot pair for a
  visible change; else the test that failed before and passes now (the
  validator's red check, or the failing test the orchestrator wrote first on
  the Quick path), with the test name and the command; else command output.
  No red check: say `red check NOT VERIFIED`.
- **Merge danger:**
  - **Door:** `two-way` when reverting the PR fully undoes it; `one-way` when
    it does not: data migrations, deletes or rewrites of stored data, a
    published contract (REST/OpenAPI, event or message, exported module)
    others may already call, external side effects (messages sent, files shipped).
    One line why.
  - **Blast radius:** one word (`none`, `module`, `service`, `consumers`,
    `tenants`, `everyone`), then who or what breaks if it is wrong: callers,
    consumers, layouts, jobs, data. Use the reviewer's `Risk hunks:`.
- **Reviewer's guide:** per
  `review-guide.md`, unchanged; its own
  *Not verified* section is the only one in the description. Quick path: the
  guide's short form has none, so add `## Not verified` after it; wrap only
  the guide (never Summary, Evidence, or Merge danger) as
  `<details><summary>Reviewer's guide</summary>`, a blank line, the guide, a
  blank line, `</details>`, so the host renders its Markdown.
- Keep Summary, Evidence, and Merge danger under about 25 lines together; the
  guide has its own budget.

## Template

````markdown
<!-- harnex:run <run start, YYYY-MM-DDTHH:MM> <Quick|Standard|Full> -->
## Summary
<one sentence: what changed and why> · Issue: <#123 or none>

<sketch>

## Evidence
- **Before:** <failing test `<file › name>` / output / screenshot>
- **After:** <passing `<command>`: <n> passed / output / screenshot>

## Merge danger
**Door:** <one-way | two-way>: <why>
**Blast radius:** <word>: <who or what breaks if it is wrong>

<the reviewer's guide, ending with its Not verified section>
````

Example sketch, a call-tree change:

```diff
 createInvoice
   validateLines
+  applyTenantRounding
   persistInvoice
```
