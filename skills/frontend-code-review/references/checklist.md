# Frontend review checklist

Use the sections that apply to the change. Each item is a question; a "no" is a candidate finding.

## 1. Correctness

- Are loading, empty, error and success states all handled for every request?
- Does the UI behave with no data, one item, very many items, very long text, missing optional fields?
- Are list keys stable and unique (not the array index for lists that reorder or change)?
- Are conditional renders safe against `0`, empty string and `undefined` (for example `count && <X/>` rendering `0`)?
- Are dates, numbers and currencies formatted with the locale tools the project uses?
- Do event handlers prevent double submission?
- Is there dead code, a leftover `console.log`, a commented-out block or a TODO without an owner?

## 2. Accessibility

- Is each interactive element a real `button`, `a` or form control, and not a clickable `div`?
- Does every control have an accessible name (label, text, or `aria-label` for icon-only buttons)?
- Can everything be reached and operated with the keyboard, in a sensible order, with a visible focus style?
- Do dialogs and menus trap and restore focus, and close on Escape?
- Do images have meaningful `alt` text, or empty `alt` when decorative?
- Is information carried by more than colour?
- Are dynamic changes (errors, toasts, loading results) announced to screen readers?
- Is heading order logical?

## 3. State and data

- Is the state kept at the lowest level that needs it, and is anything stored that could be derived?
- Effects and watchers: are dependencies complete, is there cleanup for subscriptions, timers and listeners, and is the effect needed at all?
- Can a slow response overwrite a newer one (search, filters, route changes)?
- Is the cache updated or invalidated after a write?
- Are expensive computations or large lists causing visible slowness (missing memoisation where measurements or list size justify it, no virtualisation for very long lists)?
- Are new dependencies justified by their size, and imported in a way that allows tree shaking?
- Are large routes or heavy components loaded lazily where the project does that?

## 4. Security

- Is user or server content ever inserted as HTML (`dangerouslySetInnerHTML`, `v-html`, `innerHTML`, `bypassSecurityTrust…`) without sanitising?
- Are URLs from data checked before being used in `href` or `src` (no `javascript:`)?
- Are tokens or secrets kept out of the bundle, the URL and logs?
- Do links opened in a new tab to outside sites use `rel="noopener"`?

## 5. Conventions and styling

- Do file layout, naming, exports and props typing match the conventions file?
- Are existing components and utilities reused instead of duplicated?
- Do all visual values come from tokens?
- Does the layout hold at the project's breakpoints, and does long content wrap or truncate on purpose?
- Is TypeScript used honestly: no unexplained `any`, non-null `!` or type casts hiding a real mismatch?
- Are user-facing strings going through the project's translation system, if it has one?

## 6. Tests

- Is the new behaviour covered by a test at the level the project uses for it?
- Do tests query by role and label, and assert what the user sees, instead of implementation details?
- Are error and empty paths tested, not only the happy path?
- Would the test fail if the feature broke?
