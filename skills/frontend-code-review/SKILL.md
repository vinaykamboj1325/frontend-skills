---
name: frontend-code-review
description: Reviews frontend code changes for bugs, accessibility, state and rendering problems, styling consistency and missing UI states, checked against the project's conventions and the feature's acceptance criteria. Use when the user asks to review a diff, branch, pull request or component, says "check my changes", "is this ready to merge", "review this before I open the PR", or wants a second look at UI code in React, Vue, Angular, Svelte, HTML or CSS.
---

# Frontend code review

Find the problems a careful senior frontend developer would raise, and only those. A review with thirty comments where three matter teaches the author to ignore reviews, so report what is wrong and would cost something, in order of cost.

## 1. Get the inputs

- **The change:** the working tree diff by default; or the branch, pull request or files the user named. Read whole files around the changed lines, since many frontend bugs sit in how a change meets the code next to it.
- **The conventions:** `.claude/frontend-conventions.md`. If it is missing, infer conventions from neighbouring files.
- **The intent:** the feature document in `docs/features/` that matches the change, if there is one. Its Acceptance criteria and States sections are the definition of done.

## 2. Review in this order

Go through `references/checklist.md` section by section. The order is by cost of the problem:

1. **Correctness** — does it do what the feature needs, in every state
2. **Accessibility** — can everyone use it
3. **State and data** — races, stale data, wasted renders that the user can feel
4. **Security** — injection and leaked data
5. **Conventions and styling** — does it look like the rest of the codebase
6. **Tests** — is the new behaviour covered

Check each finding before reporting it: read the code path, and where it is cheap, run the type check, lint and tests. A finding that turns out to be wrong costs the author more time than a missed one.

## 3. Check against the feature document

If a feature document exists, go through its acceptance criteria one by one and mark each as met, not met, or cannot tell from the code. Then check that each state in its States table is handled. Missing states are the most common gap between "works on my machine" and done.

## 4. Decide what to report

Report a finding when you can say what goes wrong for a user or a developer. Leave out:

- style preferences that the linter and formatter do not enforce and the conventions file does not mention
- rewrites that are merely different
- problems in code the change did not touch, unless the change makes them worse; mention those in one line at the end

## 5. Report format

Start with a one-line verdict: ready, ready after small fixes, or needs changes. Then the findings, most serious first:

```
### [Blocker | Should fix | Suggestion] Short title
File: path/to/file.tsx:42
Problem: what goes wrong, and when.
Fix: the specific change.
```

- **Blocker** — a bug, a broken state, an accessibility failure that stops a user, a security problem.
- **Should fix** — works, but will cause a problem soon: missing error state, convention broken, untested logic.
- **Suggestion** — a clear improvement that can wait.

After the findings, add the acceptance-criteria table if a feature document was used, and one line on what was not checked (for example, "not run in a browser").

Offer to apply the fixes. Do not apply them unasked; the author may disagree with a finding.
