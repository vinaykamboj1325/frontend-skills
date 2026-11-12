---
name: doc-to-figma
description: Builds Figma screens from a feature document, using the team's existing Figma design system components and variables. Use when the user asks to design a feature in Figma from a spec, says "turn this doc into Figma", "create the screens in Figma", "mock up this feature document", "document to Figma", or points at a file in docs/features and asks for designs or wireframes. Requires the Figma MCP server.
---

# Document to Figma

Turn a feature document (written by `feature-doc`, or any spec with screens and states) into Figma frames that a designer can refine. The aim is a correct, complete first draft built from the real design system, so the designer spends time on quality instead of on drawing boxes.

## 0. Check the connection

This skill needs the Figma MCP server's write tools. If no Figma tools are available in the session, stop and tell the user to connect the official Figma MCP server; do not describe the design in text as a substitute, since the user asked for a Figma file.

If the session has Figma's own skills for writing to a file (for example `figma-use` or `figma-generate-design`), load them and follow them for how to call the tools. This skill decides **what** to build and in which order; those skills cover **how** to call the API.

## 1. Read the inputs

- The feature document. Find these headings: Screens, States, Components, Interactions. If Screens or States is missing, ask the user to run `feature-doc` first or to supply the missing part, because building without states produces a design that has to be redone.
- `.claude/frontend-conventions.md`, section Figma, for the design system file and the breakpoints.
- The target: an existing Figma file link from the user, or a new file. Ask which if it was not said.

## 2. Find the design system

Search the team's libraries for the components named in the document's Components table, plus the basics every screen needs (button, input, typography styles, colour and spacing variables).

- Use library components and variables whenever one exists. An instance stays linked to the system; a redrawn copy silently drifts.
- For a component marked "new" in the document, build it as a local component with variants, from the same variables.
- If there is no design system at all, say so, create a minimal set of variables (colour, spacing, radius, type) first, and build from those so the file is still consistent.

## 3. Plan the file before drawing

Tell the user the plan in a few lines and then proceed:

- one page per feature, named after the feature
- one row per screen from the Screens section
- in each row, one frame per state from the States table, in this order: default (success), loading, empty, error, other
- frame names: `<Screen> / <State>`, which makes them easy to find from code later
- the main breakpoint first (desktop or mobile, from the conventions file), then the second one for the default state only

## 4. Build

Work screen by screen, and finish one screen's default state before starting its other states, so a mistake in structure is caught once and not copied five times.

- Use auto layout for every frame and region. It is what makes the design behave like the code that will be written from it.
- Map each list item under "Regions" in the document to one named auto-layout section.
- Use real content from the document (labels, messages, validation text), not placeholder text. Copy that appears in the design gets reviewed; lorem ipsum does not.
- Bind colours, spacing and type to variables and styles. No raw hex values.
- After each screen, take a screenshot and compare it with the document: every region present, every action visible, text not clipped.

## 5. Cover every state

Go through the States table cell by cell. Each filled cell becomes a frame. For "not applicable" cells, skip the frame. Loading states use the system's skeleton or spinner component; error states show the exact message from the document.

## 6. Hand over

Report:

- the file link and the list of frames created
- components reused from the library, and components created new
- anything in the document that could not be designed and why
- open design questions found while building

Then suggest the next step: review by a designer, then `figma-to-code` on the approved frames.
