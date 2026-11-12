# Frontend conventions

Written by the `frontend-setup` skill and corrected by the team. This file is the source of truth; where old code disagrees, the file wins.

## Stack

- Framework: React 18, no router
- Language: TypeScript, strict
- Build tool: Vite 6
- Package manager: npm
- Styling: CSS Modules, one `styles.module.css` per folder, with `--sx-*` custom properties
- State management: React state only
- Data fetching: `request()` in `src/api/http.ts` plus the `useAsync` hook in `src/lib/use-async.ts`
- Forms and validation: not used yet
- Unit / component tests: Vitest with Testing Library, through our own helpers in `src/test/`
- End-to-end tests: not used
- Component stories: not used

## Project structure

- Shared components live in: `src/ui/<kebab-name>/`
- Feature screens live in: `src/features/<feature>/`
- Shared helpers live in: `src/lib/`
- API layer lives in: `src/api/`
- Path aliases: `@/` is `src/`

## Components

- Folder and file layout (example `src/ui/button/`): `button.tsx`, `styles.module.css`, `__tests__/button.spec.tsx`. All file and folder names are kebab-case.
- No `index.ts` barrel files. Import from the file: `@/ui/button/button`.
- Export style: named export, written as an arrow function assigned to a `const`, followed by `Name.displayName = 'Name'`.
- Props typing: a `type NameProps = NativeAttributes & { ... }` alias. We do not use `interface` for props.
- The visual variant prop is always called `tone`. Never `variant`, `kind`, `type` or `color`.
- Variants and boolean states are written to the DOM as `data-*` attributes (`data-tone`, `data-compact`) and styled with attribute selectors on the single `.root` class. We do not create one CSS class per variant.
- Class names are joined with `cx()` from `@/lib/cx`. No template strings or array joins.
- `className` is merged and the remaining props are spread on the root element.

## Styling

- Token source: `src/styles/tokens.css`
- Two levels of tokens. Palette tokens (`--sx-slate-600`, `--sx-red-700`) are raw colours. Semantic tokens (`--sx-fg-muted`, `--sx-critical`) say what a colour is for.
- Components and features use semantic tokens only. Palette tokens are used only inside `tokens.css`.
- No raw colour, spacing, font-size or radius values. If no semantic token fits, propose a new one; do not use a palette token as a shortcut.
- Focus styles use `--sx-focus-ring`.

## Data and state

- API functions never throw. They return `Result<T>` from `@/lib/result`: `{ ok: true, data }` or `{ ok: false, error }`.
- All requests go through `request()` in `src/api/http.ts`. No direct `fetch` anywhere else.
- Components load data with `useAsync(run, deps)`, which returns `{ status: 'loading' | 'ready' | 'failed' }`. Render each status explicitly, including the empty case.
- Errors carry a `messageKey`, shown with `t()`.

## Text

- Every string a user can see or hear goes through `t('key')` from `@/lib/i18n`, with the text added to `src/lib/messages.ts`. This includes `aria-label` values.
- Keys are `feature.meaning`, for example `products.empty`.
- Numbers, prices and dates are formatted with `Intl` and the locale from `useLocale()`.

## Testing

- Test files: `__tests__/<kebab-name>.spec.tsx` next to the code.
- Render with `renderUi()` from `@/test/render`, never with Testing Library's `render` directly. `renderUi` adds the providers and returns `user` for interactions.
- Import `screen`, `within` and `waitFor` from `@/test/render` too.
- Mock the network with `mockApi()` from `@/test/mock-api`. Do not mock our own modules or hooks.
- Test names start with "should": `it('should disable the button while saving')`.
- Select by role and accessible name.

## Accessibility

- Target: WCAG 2.2 AA
- Status messages use the `Notice` component (`src/ui/notice/notice.tsx`), which sets `role="status"` or `role="alert"`.

## Commands

- Dev server: `npm run dev`
- Type check: `npm run typecheck`
- Unit tests: `npm test`
- Build: `npm run build`
- Lint: not set up

## Figma

- Not used

## Do not copy

- `src/ui/Panel/` is legacy code from before these conventions: PascalCase files, an `index.ts`, a default export, an `interface`, a `variant` prop, one class per variant, palette tokens, and a test that calls `render` directly. It will be rewritten. Do not use it as a model.
- `src/features/products/styles.module.css` still has palette tokens and raw values. They are being cleaned up.
