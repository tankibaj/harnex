# harnex: Worktrees (parallel work in one repo)

Loaded by the `harnex` orchestrator when work runs side by side in one repo:
parallel WPs (SKILL.md "/harnex" step 2, kind `wp`) and explore approaches
(explore.md, kind `explore`). You create, link, commit and remove every
worktree yourself. Never use the spawn's own worktree isolation option: it
branches from the remote default branch, not from the work so far, and
leaves the dependencies unlinked.

All paths absolute. `<main>` = the developer's checkout (stamps and its git
dir stay there). Names, per kind and id (a WP number, an approach letter):
worktree `<main>-<kind>-<id>`, branch `<kind>/<slug>-<id>`.

## Leftovers
Before creating anything, clear what an earlier run left: `git -C <main>
worktree prune`, then list the worktrees `git -C <main> worktree list` shows
under `<main>-<kind>-*` and every branch listed by `git -C <main>
for-each-ref --format='%(refname:short)' 'refs/heads/<kind>/<slug>-*'`. Any
listed: name them and ask once before removing (they may hold uncommitted
work); declined: stop. Never delete a directory `worktree list` does not
show.

## Create
1. `<from>` is a commit that holds everything the work builds on: explore,
   the `<base>` SHA; a WP, the feature branch's HEAD once the earlier WPs
   are committed there (SKILL.md "/harnex" step 2). Uncommitted work in
   `<main>` is not in a new worktree.
2. `git -C <main> worktree add -b <kind>/<slug>-<id> <main>-<kind>-<id>
   <from>`.
3. Link the checkout's dependencies into it the way standards.md
   "Independent red check" does (e.g. a link to its installed-packages
   directory). Note the path as `<link>`; none needed: no link.
4. Spawn the agent with the worktree path as its repo and no isolation
   option. Several at once: one message.

## Commit
Implementers never commit. When one returns, commit its work in its
worktree, leaving out `<link>` and any of this run's plan docs that sit
there (the paths the planner returned): `git -C <wt> add -A -- .
':(exclude)<link>' ':(exclude)<plan doc>'`, then `git -C <wt> commit -qm
"wip: <kind> <id>"`. A failed agent: nothing to commit, remove it.

## Remove
`git -C <main> worktree remove --force <wt>`, then `git -C <main> branch -D
<kind>/<slug>-<id>`, once its commit is merged or checked out elsewhere, or
its work is dropped. Every exit of the run (done, stopped, failed) removes
what it created and says which. Never touch the developer's other branches,
worktrees or files.
