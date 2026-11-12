# WCAG 2.2 AA checklist for frontend code

Numbers are WCAG success criteria. This covers what can be checked from code and a browser; it is not the full standard.

## Structure and semantics

- Page has one `h1`, and heading levels do not skip (1.3.1)
- Landmarks are present: `header`, `nav`, `main`, `footer` (1.3.1)
- Lists, tables and quotes use their own elements; data tables have `th` with `scope` (1.3.1)
- Reading order in the DOM matches the visual order (1.3.2)
- `html` has a `lang` attribute; parts in another language are marked (3.1.1, 3.1.2)
- Each page has a unique, descriptive `title` (2.4.2)

## Text alternatives

- Meaningful images have `alt` that says what the image means here (1.1.1)
- Decorative images have `alt=""` or are CSS backgrounds (1.1.1)
- Icon-only buttons and links have an accessible name (4.1.2)
- SVG icons are hidden with `aria-hidden="true"` when next to text, or named when alone (1.1.1)
- Video has captions; audio has a transcript (1.2.x)

## Keyboard

- Every action works with the keyboard alone (2.1.1)
- No keyboard trap outside modal dialogs (2.1.2)
- Focus order is logical (2.4.3)
- Focus is visible, with at least 3:1 contrast against its surroundings (2.4.7, 1.4.11)
- A focused element is not fully hidden by sticky headers or overlays (2.4.11)
- A "skip to content" link exists on pages with repeated navigation (2.4.1)
- No positive `tabindex` values (2.4.3)

## Pointer and touch

- Targets are at least 24 by 24 CSS pixels, or have that much spacing (2.5.8)
- Dragging actions have a single-pointer alternative (2.5.7)
- Actions fire on pointer up, so they can be cancelled (2.5.2)
- Visible label text is part of the accessible name (2.5.3)

## Colour and contrast

- Normal text: at least 4.5:1; large text (24px, or 18.66px bold): at least 3:1 (1.4.3)
- Control boundaries, icons and state indicators: at least 3:1 (1.4.11)
- Colour is not the only way information is shown: errors, required fields, links in text, chart series (1.4.1)

## Resize and reflow

- Text can be zoomed to 200% without loss (1.4.4)
- At 320px width there is no two-direction scrolling, except for tables, maps and similar (1.4.10)
- Text spacing can be increased without clipping; avoid fixed heights on text containers (1.4.12)
- Content shown on hover or focus can be dismissed, hovered and stays visible (1.4.13)

## Forms

- Every input has a programmatic label (1.3.1, 3.3.2)
- Related inputs are grouped with `fieldset` and `legend` (1.3.1)
- Common fields have `autocomplete` values (1.3.5)
- Errors are described in text, connected to the field, and say how to fix them (3.3.1, 3.3.3)
- Required fields are indicated in text or with `aria-required` (3.3.2)
- Users are not asked to re-enter information already given in the same flow (3.3.7)
- Login does not depend on a memory or puzzle test without an alternative; pasting passwords works (3.3.8)

## Dynamic content and widgets

- Custom widgets expose the right role, name, state and value (4.1.2)
- State changes are exposed: `aria-expanded`, `aria-selected`, `aria-checked`, `aria-current`, `aria-pressed` (4.1.2)
- Dialogs: `role="dialog"` or `dialog` element, a name, focus moves in, focus is trapped, Escape closes, focus returns to the trigger (2.4.3, 4.1.2)
- Status messages are announced with `role="status"` or `aria-live` without moving focus (4.1.3)
- Route changes in single-page apps move focus or announce the new page (2.4.3)
- No `aria-hidden="true"` on focusable elements (4.1.2)

## Motion and time

- Animation triggered by interaction can be turned off; honour `prefers-reduced-motion` (2.3.3 is AAA; treat as expected practice)
- Moving or auto-updating content lasting over five seconds can be paused (2.2.2)
- Nothing flashes more than three times per second (2.3.1)
- Time limits can be extended (2.2.1)
