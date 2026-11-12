---
name: feature-doc
description: Turns a feature idea, ticket, user story or rough notes into a complete frontend feature document with screens, states, components, data and acceptance criteria. Use when the user asks for a feature doc, feature spec, frontend spec, PRD for a screen or flow, says "plan this feature", "write up this ticket", "document this feature before we design or build it", or wants a document that can be handed to Figma or to code.
---

# Feature document

Produce one Markdown file that a designer, a developer and a reviewer can all work from. The same file is later read by `doc-to-figma` (to build screens), `test-writer` (to write tests) and `frontend-code-review` (to check the result), so its headings are a contract: keep them exactly as in the template.

## 1. Gather

Read whatever the user gave: a ticket, a chat message, a screenshot, an API description. Then look at the project:

- `.claude/frontend-conventions.md`, if it exists, for the stack and where things live
- the existing screens and components near this feature, so the document reuses them instead of describing new ones
- the API layer or schema, to see which data already exists

## 2. Ask about real gaps only

Ask up to five questions in one message, and only about things that change the design or the code. Good questions are about who the user is, what happens on failure, limits (how many items, how long a name), permissions, and what is out of scope. Do not ask what can be decided sensibly; decide it and list it under "Assumptions" so the user can correct it in one pass.

If the user wants the document without questions, write it and mark every guess as an assumption.

## 3. Write

Copy `assets/feature-doc-template.md` and fill it. Save it as `docs/features/<feature-slug>.md` unless the project already keeps specs somewhere else.

What makes each section useful:

- **Goal** — the user problem and how success is seen, in two or three lines. A reader should be able to stop here and know why the feature exists.
- **User stories** — "As a … I want … so that …", one per real need. Three to six is normal.
- **Screens** — one sub-section per screen or modal, with the regions on it from top to bottom, the actions available and where each action leads. Write regions as a list, since `doc-to-figma` turns each list item into a frame section.
- **States** — for every screen: loading, empty, error, success, and any partial state such as "no permission" or "offline". Missing states are the most common reason a design or a build comes back for rework, so no cell stays blank; write "not applicable" with the reason.
- **Components** — a table of each component, whether it exists already (with its path) or is new, and its variants. Reuse is decided here, not during coding.
- **Data** — each endpoint or query, the fields used, validation rules, and what is still unknown about the backend.
- **Interactions** — keyboard behaviour, focus movement, animations, responsive behaviour at small and large widths.
- **Acceptance criteria** — a numbered checklist of testable statements. Each one names an action and an observable result ("Submitting with an empty title shows 'Title is required' under the field"). Avoid words like "works well" or "is intuitive", because nobody can check them.
- **Out of scope** and **Assumptions** — short lists. They prevent the two most common arguments later.

## 4. Check before finishing

- Every screen has every state filled.
- Every user story is covered by at least one acceptance criterion.
- Every new component in the table appears on at least one screen.
- Nothing in the document depends on a backend field that the Data section marks as unknown without saying so.

## 5. Hand over

Give the file path, the list of assumptions, and the next step: `doc-to-figma` to design it, or `figma-to-code` / direct implementation if the design exists.
