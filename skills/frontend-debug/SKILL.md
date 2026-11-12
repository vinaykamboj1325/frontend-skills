---
name: frontend-debug
description: Finds the root cause of a frontend bug by reproducing it, reading the console, network and component state, and then fixes it with a regression test. Use when the user reports that something in the UI is broken, such as a blank page, a button that does nothing, a wrong value on screen, a layout glitch, an infinite re-render or request loop, a hydration mismatch, stale data, a memory leak, a console error or a stack trace, or says "it works locally but not in production" or "why is this not updating".
---

# Frontend debug

Find why the bug happens before changing anything. A fix made without the cause usually moves the bug somewhere else, or hides it until a user finds it again.

## 1. State the bug exactly

Write down, in one short block: what the user did, what they expected, what happened, and where (browser, device, route, account type, environment). Ask for whatever is missing only if it cannot be found by trying. An exact error message or stack trace is worth more than a description; ask for it when the user only paraphrased.

## 2. Reproduce

Reproduce it before reading much code. Start the app with the command from `.claude/frontend-conventions.md` or `package.json`, and with a browser tool follow the steps while watching:

- **Console:** errors and warnings, with their stack traces. Read the first error; later ones are often consequences.
- **Network:** the failing or unexpected request: status, payload, response, timing, and whether it was sent at all or sent twice.
- **DOM and styles:** for visual bugs, the computed styles and box sizes of the element.

Without a browser tool, reproduce with a failing test, or ask the user to run specific steps and paste the console and network output.

If it cannot be reproduced, say so, and find what differs between where it fails and where it works: data, build mode, browser, screen size, feature flags, timing, cached state.

## 3. Narrow down

Use the symptom to pick where to look first:

| Symptom | Look first at |
|---|---|
| Blank page or crash | First console error; error boundary; a value that is `undefined` on first render |
| UI does not update | State mutated in place; missing dependency in an effect or memo; stale closure; a non-reactive value; cache not invalidated |
| Infinite loop of renders or requests | An effect that sets state it depends on; a new object or function created each render and used as a dependency or query key |
| Wrong data shown | Response from an older request arriving last; wrong key in a list; cache key missing a parameter |
| Hydration mismatch | Server and client render different output: dates, random values, `window` checks, invalid HTML nesting, browser extensions |
| Works in dev, fails in production | Environment variables; minification with name-based logic; strict-mode double effects hiding a missing cleanup; case-sensitive file paths; base URL |
| Layout glitch | Computed styles; overflow; stacking context for `z-index`; a parent's `min-width`; late-loading fonts or images |
| Handler does not fire | An element on top catching the click; `disabled` or `pointer-events`; the listener bound to the wrong element; the event stopped by a parent |
| Slow or growing memory | Listeners, timers or subscriptions without cleanup |

Then cut the search space in half each step: check whether the data is right at the network, then in the store, then in the props, then in the render. The bug is in the first place where reality differs from what the code assumes. Add temporary logs or use the debugger to confirm; do not conclude from reading alone when a check is cheap.

If the bug appeared recently, look at recent commits to the affected files, or bisect.

## 4. Confirm the cause

Before fixing, state the cause in one sentence that explains every observed symptom: "The list shows old results because the response of the previous search arrives after the newer one and overwrites it." If the sentence does not explain all of what was seen, keep looking; there may be a second cause.

## 5. Fix

- Fix the cause, at the place it originates. A guard like `if (!data) return null` added where the crash happens only hides a missing loading state.
- Keep the change small and in the project's existing style.
- Search for the same mistake elsewhere in the code and report other places; fix them if they are clearly the same bug.
- Remove every temporary log.

## 6. Prove it

1. Repeat the reproduction steps and confirm the bug is gone.
2. Add a test that fails without the fix and passes with it, at the level the project tests such behaviour.
3. Run the type check, lint and the surrounding tests.

## 7. Report

The cause in one or two sentences, the fix and the files changed, the test added, other places with the same problem, and anything that could not be verified (for example, "not confirmed on Safari").
