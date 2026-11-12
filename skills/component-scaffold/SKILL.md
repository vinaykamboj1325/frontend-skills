---
name: component-scaffold
description: Creates a new UI component with all the files the project expects (component, types, styles, test, story, index) by copying the pattern of existing components. Use when the user asks to create, add, scaffold or generate a component, says "new Button/Card/Modal component", "set up the files for a component", or needs a component that matches the rest of the codebase, in React, Vue, Angular, Svelte or web components.
---

# Component scaffold

Create a component that a reviewer cannot tell apart from the ones already in the repository. Consistency is the whole value here: the same folder layout, naming, typing and test style as the neighbours.

## 1. Find the pattern

Read `.claude/frontend-conventions.md`, section Components. If it is missing, find the pattern directly:

1. Locate the components folder.
2. Open two recent components of similar size to the one requested: one simple, one with state.
3. Note the files in each folder, naming, export style, props typing, styling method, and test and story style.

If the project is empty, use the defaults below and say so.

| Framework | Default files |
|---|---|
| React | `Name/Name.tsx`, `Name.test.tsx`, `Name.stories.tsx` (if Storybook is installed), `index.ts` |
| Vue | `Name.vue` with `<script setup lang="ts">`, `Name.spec.ts` |
| Angular | `name.component.ts` (standalone), `.html`, `.scss`, `.spec.ts` |
| Svelte | `Name.svelte`, `Name.test.ts` |

## 2. Agree the API before writing

From the request, work out and state in one short block:

- the component name and where it goes
- props, with types and defaults; which are required
- variants and sizes
- events or callbacks
- slots or children

Ask only if something would change the API, such as whether the component is controlled or uncontrolled. Otherwise decide, and proceed.

Design the API the way the project's existing components do: if the others use `variant` and `size`, do not introduce `type` and `scale`. Extend native element props where the component wraps a native element, and pass `className` or the equivalent through, so the component is not a dead end for its users.

## 3. Write the files

- **Component** — semantic element first (`button` for actions, `a` for navigation). Tokens for every visual value. Forward refs where the project's other components do. No data fetching inside a presentational component.
- **Accessibility** — keyboard support and an accessible name are part of the first version, since adding them later changes the API. For dialogs, menus, tabs, comboboxes and tooltips, reuse the project's accessible primitive from the conventions file instead of writing the behaviour by hand.
- **Test** — render it, check each variant shows, check each callback fires, check the disabled state. Query by role and name.
- **Story** — one story per variant and state, if the project has stories.
- **Index or barrel** — only if the neighbours have one. Add the export to the parent barrel if the project uses one.

## 4. Verify

Run the type check, lint and the new test with the commands from the conventions file. Fix failures before reporting.

## 5. Report

List the files created, the props table, and one usage example.
