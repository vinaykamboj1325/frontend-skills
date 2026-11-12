---
name: figma-to-code
description: Implements a Figma frame, screen or component as production code that follows the project's own conventions, reusing existing components and design tokens instead of generating new ones. Use when the user shares a figma.com link and wants it built, says "implement this design", "convert this Figma to code", "build this screen from Figma", "Figma to React/Vue/Angular", or asks to update code to match a changed design. Requires the Figma MCP server.
---

# Figma to code

Build what the design shows, in the way this project writes code. The usual failure of design-to-code is output that looks right in a screenshot and is wrong for the codebase: new buttons next to an existing `Button`, hex colours next to a token file, absolute positions where the design used auto layout. This skill exists to prevent that.

## 0. Check the connection

This skill needs the Figma MCP server's read tools. If none are available, stop and tell the user to connect the official Figma MCP server. If the session has Figma's own design-to-code skill (for example `figma-design-to-code`), load it before the first Figma call and follow it for the tool mechanics.

## 1. Know the project

Read `.claude/frontend-conventions.md`. If it is missing, detect the framework, styling method and component folder from `package.json` and two or three existing components, and mention once that `frontend-setup` makes results more consistent.

## 2. Read the design

For the frame in the link:

1. Get the design context (structure, layout, styles) and a screenshot. The screenshot is the truth for how it looks; the structure is the truth for how it is built.
2. Get the variables and styles used, so colours, spacing and type can be matched to tokens.
3. For a large frame, get the outline first and then fetch sections one at a time. One huge response is truncated or loses detail.
4. Look for sibling frames named like `<Screen> / Loading`, `/ Empty`, `/ Error`. If they exist, they are part of the task.

## 3. Map before writing

Write a short mapping and show it to the user in the first reply; it is where mistakes are cheapest to fix.

| In Figma | Decide |
|---|---|
| Component instance | Which existing code component it is. Check Code Connect mappings first, then search the components folder by name. |
| Variable or style | Which token it is. Search the token file by value and by name. |
| Unmatched component | New component, built with `component-scaffold`'s pattern. |
| Unmatched value | Nearest token if the difference is a rounding error; otherwise ask whether to add a token. |

Read `references/mapping-guide.md` for how layout, variants and text translate to code.

## 4. Build

- Compose the screen from existing components first, then write the new ones.
- Follow the conventions file for file layout, naming, exports, styling method and props typing.
- Use tokens for every colour, spacing, radius, shadow and font value. A raw value is acceptable only when the design itself uses a one-off value and the user agrees.
- Use semantic HTML: the design shows what something looks like, and the element choice says what it is (`button`, `nav`, `h2`, `ul`). Add accessible names for icon-only controls.
- Make it responsive from the auto-layout rules (fill, hug, wrap, min and max width) and the project breakpoints, even when only one width was designed. Say which behaviour was inferred.
- Export icons and images from Figma as assets in the project's asset folder; do not hot-link Figma URLs, since they expire.
- Wire real props and state. Text from the design becomes default content or props, not hard-coded strings inside a reusable component.

## 5. Verify against the design

1. Run the type check and lint commands from the conventions file.
2. If a browser tool is available, open the page at the designed width, take a screenshot and compare it with the Figma screenshot region by region: spacing, alignment, font size and weight, colours, radius.
3. Fix differences and compare again. Stop when the remaining differences are ones the user would not see, and list any that are deliberate.

If no browser tool is available, say that the visual comparison was not done.

## 6. Report

- files created and changed
- the mapping that was used (existing components reused, new components, new tokens)
- states implemented, and states with no design
- inferred responsive behaviour and any deviation from the design
