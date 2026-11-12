# Frontend Skills

Twenty skills for Claude Code that take a frontend feature from an idea to reviewed, tested code. They work with React, Vue, Angular, Svelte and plain HTML/CSS projects: each skill reads your project's conventions instead of forcing its own.

## The pipeline

```
idea → feature-doc → doc-to-figma → figma-to-code → frontend-code-review
                                          ↓
              a11y-audit · responsive-check · test-writer · perf-audit
```

You can start at any step. If a designer already made the Figma file, start at `figma-to-code`. Every skill also works alone.

## Skills

The "Tested" column is explained in [Test status](#test-status).

### Setup and pipeline

| Skill | What it does | Needs | Tested |
|---|---|---|---|
| `frontend-setup` | Detects your stack and writes `.claude/frontend-conventions.md`, which the other skills read | — | Yes |
| `feature-doc` | Turns an idea or ticket into a feature document in a fixed template | — | Yes, clear gain |
| `doc-to-figma` | Builds the screens from a feature document in Figma | Figma MCP server | Not yet |
| `figma-to-code` | Turns a Figma frame into code in your conventions | Figma MCP server | Not yet |
| `screenshot-to-code` | Builds a UI from a screenshot, mockup or sketch when there is no Figma file | — | Not yet |

### Build

| Skill | What it does | Needs | Tested |
|---|---|---|---|
| `component-scaffold` | Creates a component with types, test and story in your project's pattern | — | Yes |
| `api-integration` | Adds a typed API call with loading, error and empty states | — | Yes, clear gain |
| `form-builder` | Builds a form with validation, error messages and submit states | — | Yes, small gain |
| `design-tokens` | Finds hard-coded colours, spacing and type values and replaces them with tokens | — | Yes |
| `i18n` | Extracts hard-coded text into translation files and handles plurals, formats and right-to-left layouts | — | Yes |
| `story-writer` | Writes Storybook stories for every variant and state of a component | Storybook | Not yet |

### Quality

| Skill | What it does | Needs | Tested |
|---|---|---|---|
| `test-writer` | Writes unit, component and end-to-end tests in your test setup | — | Yes, small gain |
| `frontend-code-review` | Reviews a diff against your conventions and the feature's acceptance criteria | — | Yes |
| `frontend-debug` | Reproduces a UI bug, finds the root cause and fixes it with a regression test | — | Yes |
| `a11y-audit` | Checks and fixes accessibility issues against WCAG 2.2 AA | — | Yes |
| `responsive-check` | Screenshots pages at four widths and reports layout breaks | A browser tool or Playwright | Not yet |
| `perf-audit` | Runs Lighthouse and bundle analysis, then fixes the worst items | Node.js, Chrome | Not yet |
| `seo-audit` | Checks and fixes meta tags, social cards, structured data, sitemap and crawler visibility | — | Not yet |

### Maintenance

| Skill | What it does | Needs | Tested |
|---|---|---|---|
| `dependency-upgrade` | Upgrades packages and major framework versions step by step | Network access | Not yet |
| `ts-migration` | Converts JavaScript to TypeScript with real types instead of `any` | — | Not yet |

## Install

In Claude Code:

```
/plugin marketplace add vinaykamboj1325/frontend-skills
/plugin install frontend-skills@frontend-skills
```

Then run the setup skill once in each project:

```
/frontend-skills:frontend-setup
```

## Use

Ask in plain words; the matching skill loads by itself.

- "Write a feature doc for a saved-searches page"
- "Build this in Figma from docs/features/saved-searches.md"
- "Implement this Figma frame: <link>"
- "Review my changes before I open the PR"
- "Check this page on mobile"

## Examples

- [examples/frontend-conventions.md](examples/frontend-conventions.md): a conventions file of the kind `frontend-setup` writes.
- [examples/feature-doc-wishlist.md](examples/feature-doc-wishlist.md): a feature document written by `feature-doc`.

## Requirements

- **Figma skills:** connect the official Figma MCP server first. Without it, `doc-to-figma` and `figma-to-code` explain what is missing and stop.
- **`responsive-check`:** uses a browser tool if your session has one, and falls back to the bundled Playwright script.
- **`perf-audit`:** runs Lighthouse through `npx`, so it needs Node.js and a local Chrome.

## Test status

Eleven skills have a saved test case in `skills/<skill>/evals/`. Each was run on a small React sample app once with the skill and once without, and the two results were compared against a list of checks. Four of them were run again on a second sample project with unusual conventions and a working test suite.

What the tests showed, with a top-tier Claude model:

- **Every tested skill worked.** None failed or produced wrong output.
- **Clear gain over no skill:** `feature-doc` (fixed template, all states covered, testable acceptance criteria) and `api-integration` (retry on error, more states handled, tests added).
- **Small gain:** `form-builder` and `test-writer`.
- **Same quality as no skill:** `frontend-setup`, `component-scaffold`, `design-tokens`, `i18n`, `frontend-code-review`, `frontend-debug` and `a11y-audit`. The model already did these well on its own; the skill mainly made the report format consistent.

Limits of these tests: one run per case, one model, and small sample projects. Smaller models may benefit more from the written steps; that has not been measured. The nine skills marked "Not yet" need Figma, a browser, network access or a different sample project, and have not been run at all.

To run the saved tests yourself, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
