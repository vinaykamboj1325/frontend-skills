---
name: a11y-audit
description: Audits frontend pages and components for accessibility problems against WCAG 2.2 AA and fixes them, covering semantic HTML, ARIA, keyboard use, focus management, colour contrast, forms and screen reader announcements. Use when the user asks for an accessibility or a11y check, mentions WCAG, ADA, screen readers, keyboard navigation, contrast or axe/Lighthouse accessibility failures, or asks "is this accessible" about a component, page or pull request.
---

# Accessibility audit

Find what stops or slows a person using a keyboard, a screen reader, zoom or high contrast, then fix it. Automated tools catch roughly a third of real problems; the rest need the code to be read and the page to be operated, so this skill does both.

## 1. Scope and target

Agree the scope in one line: a component, a page, a flow, or the files in a diff. The target is WCAG 2.2 level AA unless `.claude/frontend-conventions.md` names another.

## 2. Automated pass

Run what the project already has, in this order of preference:

1. the project's own accessibility lint or test setup (`eslint-plugin-jsx-a11y`, `vue-axe`, `jest-axe`, `@axe-core/playwright`)
2. axe against the running page, through a browser tool or `npx @axe-core/cli <url>`
3. Lighthouse's accessibility category

If nothing can run, say so and continue; the manual pass does not depend on it.

## 3. Manual pass

Go through `references/wcag-checklist.md`. Read the code for each item, and if a browser tool is available, operate the page:

- **Keyboard:** Tab through the whole scope. Every control is reachable, the order follows the visual order, focus is always visible, nothing traps focus except open dialogs, and Escape closes overlays.
- **Screen reader view:** read the accessibility tree. Every control has a role and a name that makes sense out of context; headings form an outline; landmarks exist.
- **Zoom and reflow:** at 200% zoom and at 320px width, content is readable without scrolling in two directions.
- **Contrast:** compute ratios for text and for control boundaries from the actual colours in use, including hover, focus and disabled states.
- **Motion:** animation respects `prefers-reduced-motion`.

## 4. Fix

Fix in this order, since earlier fixes often remove later problems:

1. **Use the right element.** A `button` gives focus, keyboard activation and a role for free. Replacing a clickable `div` with a `button` beats adding `role`, `tabindex` and key handlers to it.
2. **Give things names.** Labels for inputs, text or `aria-label` for icon buttons, `alt` for images.
3. **Fix keyboard and focus.** Order, visible focus, focus moved into dialogs and returned on close.
4. **Add ARIA only where HTML has no element for the job.** Wrong ARIA is worse than none, because it tells assistive technology something false. For complex widgets (combobox, menu, tabs, dialog), reuse the project's accessible primitives; follow the WAI-ARIA Authoring Practices pattern only when none exists.
5. **Fix contrast** by choosing a different token. If the token itself fails, report it as a design-system issue instead of overriding one use.
6. **Announce changes.** Live regions for errors, toasts and async results.

Apply fixes that are clearly correct. Ask before changes that alter the look (colours, focus styles) or the content (alternative text for meaningful images is the author's call; propose wording).

## 5. Verify

Run the automated pass again and repeat the keyboard walk on what changed. Add a test for behaviour that was fixed (focus returns to the trigger, error is announced) so it does not regress.

## 6. Report

```
| # | Problem | Where | WCAG | Severity | Status |
```

- **Severity:** Critical (blocks a user), Serious (makes a task hard), Moderate, Minor.
- **Status:** fixed, needs a decision, or not fixed with the reason.

End with what was not tested. An audit by reading code and automation does not replace testing with real assistive technology; say so plainly instead of claiming the page is "fully accessible".
