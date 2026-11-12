---
name: screenshot-to-code
description: Builds a UI from an image, such as a screenshot, a mockup export, a wireframe photo or a hand-drawn sketch, using the project's existing components and design tokens. Use when the user attaches or points to an image and says "build this", "make it look like this", "recreate this screen", "implement this mockup", or wants a page or component matched to a picture and there is no Figma file. For a Figma link, use figma-to-code instead.
---

# Screenshot to code

Build the interface shown in an image, as code that belongs in this project. An image gives the look and nothing else: no tokens, no component names, no behaviour. The work is to read the intent and express it with what the project already has, instead of copying pixels into one-off styles.

## 1. Understand the request

- Look at the image and name what it is: a full page, one section, one component, or a rough sketch.
- If the user owns the design, match it closely. If the image shows someone else's product, build the same kind of layout with the project's own tokens, copy and assets; do not reproduce another product's logo, brand, images or text.
- A sketch or wireframe shows structure only. Apply the project's visual style and say so.

## 2. Know the project

Read `.claude/frontend-conventions.md`. If it is missing, detect the framework, styling method, token source and components folder from the code.

## 3. Read the image carefully

Write a short breakdown and show it in the reply, since a wrong reading is cheapest to fix here:

- **Regions**, top to bottom: header, sidebar, content sections, footer.
- **Layout** of each region: rows or columns, how many, alignment, what stretches and what stays fixed.
- **Components**: each button, input, card, table, tab, badge, avatar, icon.
- **Text**: read all visible text exactly.
- **Visual values**: colours, font sizes and weights, spacing rhythm, radii, shadows. These are estimates from an image.

## 4. Map to the project

| In the image | Decide |
|---|---|
| A component | The existing code component it matches; a new one only if none fits |
| A colour, spacing or type value | The nearest token. Snap estimates to the project's scale; a measured 15px next to a 16px token means 16px |
| An icon | The closest icon in the project's icon set |
| A photo or illustration | A placeholder with the right size and aspect ratio, unless the user supplied the asset |

List anything with no match and how it was handled.

## 5. Build

- Compose from existing components first, then write new ones in the project's pattern.
- Use flex and grid to express the layout. Do not position elements with coordinates measured from the image, because that breaks at any other size.
- Use semantic elements: the picture shows a blue rectangle; the code needs a `button`, a `nav`, a heading at the right level.
- Tokens for every visual value.
- The image shows one width and one state. Add the rest and report what was inferred:
  - responsive behaviour at the project's breakpoints
  - hover, focus, active and disabled states from the project's existing patterns
  - loading, empty and error states if the screen shows data
- Use the text from the image as content or default props, and realistic sample data where the image shows data.

## 6. Compare and refine

If a browser tool is available:

1. Run the page at the same width as the image and take a screenshot.
2. Compare side by side, region by region: structure, alignment, spacing, sizes, colours, text.
3. Fix the differences and compare again. Two or three rounds are normal.

Stop when the remaining differences come from deliberate snapping to tokens. Without a browser tool, say that the visual comparison was not done.

Run the type check and lint.

## 7. Report

Files created, components reused and new, values that were estimated, behaviour and states that were inferred, and placeholders that need real assets.
