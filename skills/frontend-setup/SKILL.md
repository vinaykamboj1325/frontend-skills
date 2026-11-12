---
name: frontend-setup
description: Detects a frontend project's stack and coding patterns and writes them to .claude/frontend-conventions.md, the file every other frontend skill reads. Use when the user asks to set up, configure or initialise the frontend skills, says "learn my project conventions", wants to update the conventions after changing a library, or when another frontend skill reports that the conventions file is missing.
---

# Frontend setup

Write one file, `.claude/frontend-conventions.md`, that records how this project builds its frontend. The other skills read it so that generated code looks like the code already in the repository. Detect as much as possible and ask as little as possible: a developer who has to answer twenty questions will not finish the setup.

## 1. Detect

Read these, in this order, and stop reading a source once it has answered its question:

| Source | What it tells you |
|---|---|
| `package.json` and the lock file | Framework, meta-framework, language, package manager, styling, state, data fetching, form, validation, test and story libraries, scripts |
| `tsconfig.json` / `jsconfig.json` | TypeScript strictness, path aliases |
| Bundler and framework config (`vite.config.*`, `next.config.*`, `angular.json`, `nuxt.config.*`, `svelte.config.*`) | Build tool, routing style |
| Styling config (`tailwind.config.*`, `postcss.config.*`, theme or token files, global CSS) | Token source, breakpoints |
| Lint and format config | Naming and import rules that are already enforced |
| `.storybook/`, test config files | Where stories and tests live and how they run |

In a monorepo, ask which app or package to set up and write one conventions file inside that package.

## 2. Read real code

Config files say which tools are installed; only the code says how they are used. Open three to five recently changed components of different sizes and note:

- folder layout (one folder per component or flat files) and file naming
- export style (named or default) and how props are typed
- how styles are attached
- where tests and stories sit and how they are named
- how data is fetched and how loading and error states are shown
- how forms are built

When the code is inconsistent, record the pattern used by the newest files and add a note that older files differ. New code should follow where the project is going.

## 3. Ask only what cannot be detected

Ask at most four questions, in one message. Typical gaps:

- the accessibility target (default: WCAG 2.2 AA)
- the Figma file or library that holds the design system, if any
- patterns that exist in the code but should not be copied
- the browsers or devices that must be supported

Skip any question the code already answered.

## 4. Write the file

Copy `assets/conventions-template.md` to `.claude/frontend-conventions.md` and fill every section. Rules for filling it:

- Write what was observed, with one example path per pattern, so a reader can open a real file.
- Write "not used" instead of deleting a section. An absent section looks like a forgotten one.
- Put exact commands in the Commands section, copied from `package.json` scripts.
- Keep it under about 120 lines. It is loaded by every skill, so each extra line costs every later task.

If the file already exists, update the sections that changed and keep the lines the user wrote by hand. Show what changed.

## 5. Report

Finish with a short summary: the detected stack in one line, anything that was a guess, and the file path. Suggest committing the file so the whole team shares it.
