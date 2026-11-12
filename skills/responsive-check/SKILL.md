---
name: responsive-check
description: Opens a running page at mobile, tablet, laptop and desktop widths, takes screenshots, finds layout breaks such as horizontal scroll, overflowing or clipped content, overlapping elements and too-small tap targets, and fixes them. Use when the user asks to check a page on mobile, test responsiveness or breakpoints, says "it breaks on small screens", "check this at 375px", "there is a horizontal scrollbar", or wants screenshots of a page at several screen sizes.
---

# Responsive check

Look at the real page at real widths. Responsive bugs cannot be found reliably by reading CSS, because they come from the combination of content, container and viewport; the page has to be rendered.

## 1. Get the page running

Find the dev server command in `.claude/frontend-conventions.md` (Commands) or in `package.json` scripts. If a server is already running, use it. Otherwise start it in the background and wait until it answers.

Agree which pages or routes to check. For a page behind a login, ask the user how to reach it; do not guess credentials.

## 2. Choose the widths

Use the project's breakpoints from the conventions file or the styling config, and test at each breakpoint and one pixel below it, since that is where layouts switch. If none are defined, use:

| Name | Viewport |
|---|---|
| Mobile | 375 × 812 |
| Tablet | 768 × 1024 |
| Laptop | 1280 × 800 |
| Desktop | 1920 × 1080 |

Add 320 wide when the user cares about small phones or accessibility reflow.

## 3. Capture

**With a browser tool in the session:** for each width, resize, reload, wait for the page to settle, and take a full-page screenshot.

**Without one:** run the bundled script from the project folder, so it can find the project's Playwright:

```bash
node <skill-folder>/scripts/screenshot.mjs http://localhost:3000/path ./responsive-check --widths 375,768,1280,1920
```

It saves one screenshot per width and prints a JSON report with horizontal overflow, the elements that cause it, and small tap targets. If Playwright is not installed, the script says how to install it; ask before adding a dev dependency.

## 4. Inspect

Look at every screenshot, and at the report where there is one. Check:

- **Horizontal scroll** — the page is wider than the viewport. Find the widest element; usual causes are a fixed width, a long unbroken string, a wide table or code block, `100vw` next to a scrollbar, or negative margins.
- **Clipped or overflowing content** — text cut off, content leaving its card.
- **Overlap** — elements on top of each other, sticky headers covering content.
- **Squeezed layout** — columns too narrow to read, one word per line, multi-column layout that should have stacked.
- **Stretched layout** — very long text lines or huge gaps on wide screens; missing `max-width`.
- **Tap targets** — on touch widths, controls smaller than 24 × 24 CSS pixels, or packed together.
- **Images and media** — distorted, overflowing, or far larger than needed.
- **Navigation** — the menu is usable at every width.
- **Text size** — body text under 16px on mobile, and inputs under 16px (which makes iOS zoom the page on focus).

Also open any menu, dialog or dropdown at the smallest width; overlays break more often than the page under them.

## 5. Fix

Fix the cause in the layout, not the symptom:

- Prefer fluid rules (`flex-wrap`, `minmax()`, `min()`, `clamp()`, `max-width`) over more breakpoints. Each added breakpoint is one more thing to keep working.
- Never hide the problem with `overflow-x: hidden` on the page; the content is still cut off, only now the user cannot reach it.
- Give flex and grid children `min-width: 0` when long content pushes them wider than their track.
- Wrap wide tables and code blocks in their own scroll container.
- Use the project's breakpoint tokens or utilities, in the direction the project uses (mobile-first or desktop-first).

## 6. Verify and report

Capture again at every width, including the ones that were fine before, since a fix at one width can break another. Then report:

```
| Width | Problem | Cause | Status |
```

Give the paths of the before and after screenshots. Delete the screenshot folder when the user does not need it, or add it to `.gitignore`.
