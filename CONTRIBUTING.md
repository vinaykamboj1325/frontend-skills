# Contributing

## How the set is organised

- Each skill is a folder in `skills/` with a `SKILL.md`. Optional folders: `references/` (docs read on demand), `assets/` (templates), `scripts/` (code that must run the same way each time).
- Every skill reads `.claude/frontend-conventions.md` from the user's project when it exists and falls back to detecting the stack. Keep that behaviour in any new skill, so the set stays consistent.
- The feature document template in `skills/feature-doc/assets/` is a contract: `doc-to-figma`, `test-writer` and `frontend-code-review` read its sections by heading. If you rename a heading, update those skills in the same pull request.

## Rules for a good skill

1. **One skill, one job.** If the description needs "and also", split it.
2. **The description is the trigger.** Say what the skill does and the words a user would type when they need it.
3. **Do not teach what the model already knows.** Leave out general React or CSS tutorials; write the decisions, order of steps and checks that make results consistent.
4. **Give the reason for each rule.** A rule with a reason is followed in cases the rule did not predict.
5. **Stay framework-neutral in `SKILL.md`.** Put framework-specific detail in a `references/` file and point to it.
6. **Keep `SKILL.md` under about 300 lines.**

## Test cases

Tested skills have an `evals/` folder with one folder per test case:

- `prompt.md`: the request, as a user would type it
- `case.yaml`: what a good result looks like
- `graders/`: one checkable statement per file
- `files/`: the sample project the test runs on

With a recent Claude Code, run a skill's cases from its folder. This runs each case with and without the skill and uses real, billed model calls:

```
claude plugin eval . --allow-tools Write,Edit,Bash --scaffold
```

A skill that scores the same with and without is not broken, but the change you are making to it is probably not earning its place.

## Changing a skill

1. Run the skill's test cases, or try it on two or three real prompts if it has none, and save the results.
2. Make the change.
3. Run the same cases again and compare.
4. Put a short before/after note in the pull request, and add a test case for behaviour you fixed.

## Releasing

Users stay on the `version` in `.claude-plugin/plugin.json` until it changes, so raise it in every release. Before pushing, check the manifests:

```
claude plugin validate .
```

## Adding a skill

1. Open an issue first with the job it does and three example prompts.
2. Copy the structure of an existing skill.
3. Add a row to the table in `README.md`.
