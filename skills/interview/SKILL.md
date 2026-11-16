---
name: interview
description: "harnex interview: interviews the user relentlessly about a plan, decision, or idea, round by round, until nothing is left silently assumed; looks up the facts itself, pushes back on answers that contradict each other or the facts, and ends with a numbered list of decisions. Decides only, never builds. Use when the user wants to stress-test their thinking, asks to be grilled or interviewed about a plan, or types /interview [plan, decision or idea]."
---

# harnex interview

Interview the user until you reach a shared understanding of the plan,
decision, or idea they gave. Not part of the harnex flow; runs only on
request. Decide only: never edit, build, or commit anything. No one can
answer (a scripted or delegated run): say so and stop.

## 1. Start
Read what the subject names (the files, the document, the issue), nothing
wider; an idea with no code needs no reading. Open with one paragraph: the
goal as you understand it and what is already fixed. Then map the subject
as a **design tree**: every decision branches into the decisions that hang
off it. The **frontier** is every decision whose prerequisites are settled:
the questions you can ask now without guessing at answers you have not
heard.

## 2. Rounds
Ask the frontier in rounds, most consequential first, about five questions
a round; when more are waiting, end the round with `<n> more waiting`.
Numbers run on across rounds. Then wait for the answers.

```
**Q1** - **<question title>**: <question body, with the options when there are several>
Recommended: <option>, because <why>; it costs <what it gives up>.

**Q2** - ...

Defaults (say so to change one): <decision> = <value>; ...
Decisions so far: D1: ...; D2: ...
```

Word each question so "yes" accepts the recommended option. A question
whose answer depends on another still open in this round belongs to a later
round.

Who decides: a decision goes to the user when another answer would change
an interface, a dependency, the data, the scope, or what is costly to
reverse. Anything smaller you set yourself and list under `Defaults` every
round, so none is silent; a default is never a `D<n>`.

After each round:
- An unanswered question stays on the frontier. "Yes to all" accepts every
  recommended option.
- Check every answer, a "yes" too, against the earlier answers and the
  facts found. A contradiction goes back once as a question naming both
  sides; still unresolved, it moves to `Open:`.
- A changed earlier answer reopens every decision that hung off it.
- Recompute the frontier and ask the next round.

## 3. Facts
Finding facts is your job, never the user's: never ask for anything you
could look up. One file or one search: look it up yourself. Wider: send a
read-only sub-agent with a fresh context (no sub-agent tool: do it
yourself) and do not block on it: only the questions downstream of it wait
for its report; ask the rest of the frontier now. State each fact with
where it came from.

## 4. Done
The frontier is empty: every branch visited, nothing silently assumed.
Before closing, one last round: for each way this plan most likely fails,
the question whose answer would change a decision; none: skip the round.
Then print, and ask the user to confirm it is the shared understanding:

```
Decisions:
D<n>: <question> -> <answer>
Rejected: <option> (<why>), one line per option turned down
Assumptions: <the defaults still standing, or none>
Open: <what the user left undecided, or none>
```

Do not act on it until they confirm. Once confirmed, stop: the block is
theirs to hand on, for example as part of a `/harnex` requirement.
