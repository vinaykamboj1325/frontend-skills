---
name: story-writer
description: Writes Storybook stories and component documentation that show every variant and state of a component, with controls, interaction tests and realistic data. Use when the user asks to add or update stories, document a component, set up Storybook for a component library, write a play function or interaction test, show all states of a component, or prepare components for visual regression testing with Chromatic or similar tools.
---

# Story writer

Write stories that let anyone see every state of a component without running the app. Good stories are the component's documentation, its visual test cases and its design review surface at once, so each one should show a state somebody needs to look at.

## 1. Find the setup

Check `.storybook/` and `package.json` for the Storybook version, the framework package, and the addons (a11y, interactions, docs, themes, viewport, visual testing). Open two existing story files and copy their format: Component Story Format version, TypeScript typing (`Meta`, `StoryObj`, `satisfies`), title or auto-title scheme, file location and naming, decorators in use.

Read `.claude/frontend-conventions.md` if it exists. If the project has no Storybook, propose installing it with the official init command and ask first; if the project uses another tool (Histoire, Ladle), write in that tool's format.

## 2. Read the component

List from the code:

- props, their types, defaults and which are required
- variants and sizes
- states: default, hover, focus, active, disabled, loading, error, empty, selected, open
- content extremes: very long text, no text, many items, no items, missing image
- dependencies it needs to render: router, theme, store, translations, data fetching

## 3. Write the stories

**Meta**
- `component`, the title in the project's scheme, and `tags: ['autodocs']` if the project uses generated docs.
- `args` with sensible defaults, so each story overrides only what it is about.
- `argTypes` only where the automatic controls are wrong or unhelpful: a select for union types, an action for callbacks, hidden controls for props that make no sense to edit.
- `parameters` for layout (`centered`, `padded`, `fullscreen`) in the way the neighbours do.

**Stories**
- `Default` first: the most common use.
- One story per variant and per state, named for what it shows (`Disabled`, `WithIcon`, `Loading`, `LongLabel`). Names appear in the sidebar, so they should read as a list of what the component can do.
- One overview story that renders all variants side by side, when the component has several. It makes visual review and visual regression fast.
- Edge-content stories: the longest realistic text, an empty list, a missing optional prop.
- Use realistic content, in the project's domain. `"Button"` and `"Lorem ipsum"` hide wrapping and truncation problems that real labels reveal.
- Prefer `args` over custom `render` functions; use `render` only when the story needs composition or local state.

**Dependencies**
- Provide what the component needs through decorators, reusing the project's existing ones (theme, router, store, i18n).
- Mock network data at the network level with the project's mocking tool (for example the MSW addon), or pass data as props. A story must not call a real backend, or it breaks whenever the backend is unavailable.
- Mock time and randomness so the story renders the same every time; visual tests fail on any difference.

**Interaction tests**
- Add a `play` function for behaviour worth checking: opening a menu, typing in a field and seeing the error, submitting a form.
- Query by role and label, as in other tests, and assert the visible result.
- Keep them short; deep flows belong in component or end-to-end tests.

**Docs**
- A one-line description of the component and of non-obvious props, through JSDoc on the component, so it shows in the generated docs and in the editor.
- Usage notes (when to use, when not to) only if the project writes them.

## 4. Verify

1. Run the type check and lint on the story files.
2. Run Storybook's test runner or the Vitest addon if the project has it; otherwise build Storybook or start it and open each new story.
3. If the a11y addon is installed, check its panel for the new stories and fix what the component gets wrong.
4. Look at each story if a browser tool is available. A story that throws shows as an error page, which a type check will not reveal.

## 5. Report

The story file path, the list of stories, any state that could not be shown and why, and problems found in the component while writing them (for example, text that overflows with a long label).
