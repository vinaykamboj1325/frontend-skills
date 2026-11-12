---
name: test-writer
description: Writes unit, component and end-to-end tests for frontend code using the project's own test tools and style, covering user-visible behaviour, edge cases and error states. Use when the user asks to write or add tests, improve coverage, test a component, hook, composable, store, form or page, write Playwright or Cypress tests for a flow, turn acceptance criteria into tests, or fix flaky frontend tests.
---

# Test writer

Write tests that fail when the feature breaks and stay green when the code is only reorganised. A test tied to implementation details does the opposite: it breaks on every refactor and misses real bugs.

## 1. Find the setup

Read `.claude/frontend-conventions.md`, section Testing. If it is missing, find the runner (Vitest, Jest, Karma or Jasmine, Playwright, Cypress), the component testing library (Testing Library, Vue Test Utils, Angular TestBed), the network mocking approach (MSW, fixtures, route interception), and open two existing tests to copy their structure, naming, helpers and custom render functions.

If the project has no test setup, propose the standard one for the stack and ask before installing anything.

## 2. Decide what to test and at which level

Read the code under test, and the feature document's Acceptance criteria if one exists; each criterion should map to at least one test.

| Level | Use for |
|---|---|
| Unit | Pure functions, formatters, reducers, validation schemas, hooks and composables with logic |
| Component | What a component renders and does when a user interacts: variants, callbacks, states, forms |
| End-to-end | A few critical flows across pages, against a running app: sign in, checkout, the feature's main path |

Put most tests at the component level, where frontend bugs live. Keep end-to-end tests few, because they are slow and are the first to become flaky.

List the cases before writing them: the main path, each state (loading, empty, error), each validation rule, boundary values, and keyboard interaction for interactive components. Show the list in the reply for anything beyond a small file.

## 3. Write

- **Test behaviour through the interface a user has.** Find elements by role and accessible name, then label, then text; use a test id only when nothing else works. A test that queries by role also proves the element is accessible.
- **Interact like a user**: the library's user-event tools, real typing and clicking, not direct calls to handlers or state setters.
- **Assert what is visible**: text, presence, enabled or disabled, calls made to callbacks and to the network. Do not assert internal state, hook calls or CSS class names.
- **Mock at the network boundary**, not the module under test. Mocking a component's own hooks tests the mock.
- **One behaviour per test**, named as a sentence about behaviour: "shows an error when the email is missing".
- **Arrange, act, assert**, with shared setup in the project's existing helpers.
- **Wait properly.** Use the library's async queries and auto-waiting; never a fixed sleep, which is the main cause of flaky tests.
- **Keep tests independent**: no shared mutable state, no dependence on order, clocks and random values controlled.
- Avoid large snapshots. They get updated without being read, so they stop protecting anything.

For end-to-end tests, also: use the project's page objects or fixtures if it has them, create the data the test needs, and never depend on data left by another test.

## 4. Run and tighten

1. Run the new tests with the command from the conventions file. All must pass.
2. Check that each one can fail: break the behaviour for a moment, or reason through the assertion, and confirm the test would catch it. A test that cannot fail is worse than no test, because it gives false confidence.
3. Run them a few times if they involve timing or network, to catch flakiness now.
4. If a test reveals a real bug in the code, report the bug and leave the test failing or marked as expected-fail with a note; do not change the test to match wrong behaviour.

## 5. Report

Files added, the cases covered, the acceptance criteria covered and not covered, and anything left untested with the reason.
