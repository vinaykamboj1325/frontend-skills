---
name: design-tokens
description: Finds hard-coded colours, spacing, font sizes, radii, shadows and z-index values in frontend code and replaces them with the project's design tokens, or sets up a token system when none exists. Use when the user asks to clean up hard-coded styles, "use our tokens", enforce the design system, add or rename tokens, set up theming or dark mode, sync tokens from Figma variables, or asks why the UI looks inconsistent.
---

# Design tokens

Make every visual value in the code come from one named source. Tokens are what let a team change a brand colour or add dark mode in one place; each raw `#3b82f6` or `13px` in a component is a place that change will miss.

## 1. Find the token source

Read `.claude/frontend-conventions.md`, section Styling. If it is missing, look for the source: CSS custom properties in a global stylesheet, a Tailwind theme, a theme object for a CSS-in-JS library, Sass variables, or a tokens JSON file. Note the naming scheme and whether there are two levels (raw values such as `blue-500`, and semantic names such as `color-text-primary`).

If the project has no tokens, go to section 5.

## 2. Scan

Search the requested scope (a file, a folder, or the whole app) for raw values:

- colours: hex, `rgb()`, `hsl()`, named colours
- spacing and sizes in `px`, `rem`, `em` in margin, padding, gap, width, height
- `font-size`, `font-weight`, `line-height`, `font-family`
- `border-radius`, `box-shadow`, `z-index`, transition durations
- arbitrary values in utility classes, such as `p-[13px]` or `text-[#333]`

Skip the token source files themselves, generated files, third-party code and SVG path data.

## 3. Classify each finding

| Case | Action |
|---|---|
| Value equals a token | Replace |
| Value is within a rounding step of a token (13px next to a 12px token) | Replace, and list it as a visual change to check |
| Value has no near token and appears several times | Propose a new token; do not invent one silently |
| Value is a real one-off (a 1px hairline, a layout-specific width) | Leave, and note it |

Prefer semantic tokens over raw ones when both exist: `color-text-muted`, not `gray-500`. The semantic name is what makes theming work, because it changes with the theme and the raw one does not.

Pick the token by role as well as by value. Two tokens can hold the same value today for different reasons (a border colour and a disabled-text colour), and choosing by value alone links things that should change separately.

## 4. Apply and check

1. Show the summary table first for anything larger than one file: count per category, replacements that change the look, proposed new tokens. Apply exact matches right away; wait for agreement on new tokens and on visual changes.
2. Make the replacements.
3. Run lint and the build. If a browser tool is available, screenshot the affected pages before and after and compare.
4. If the project has a linter that can forbid raw values (Stylelint, an ESLint plugin, Tailwind's arbitrary-value rule), offer to turn the rule on so the problem does not return.

## 5. When there is no token system

Propose a small one and get agreement before creating it:

- collect the values in use and group near-duplicates, so the scale comes from the real UI
- two levels: raw scale (colour ramps, a spacing scale, type sizes, radii) and semantic names (text, background, border, each with states)
- implement with the mechanism that fits the stack: CSS custom properties work everywhere and support theming at runtime
- if Figma variables exist and the Figma MCP server is connected, read them and use the same names, so design and code speak the same language

Stay inside the requested scope. Change the style values that were asked about and nothing else: do not edit documentation, the conventions file or other components along the way. If the cleanup makes a note elsewhere out of date, say so in the report and let the user decide.

## 6. Report

Counts replaced per category, files changed, values left alone and why, and new tokens added or proposed.
