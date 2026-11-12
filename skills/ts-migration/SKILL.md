---
name: ts-migration
description: Converts JavaScript frontend code to TypeScript and strengthens weak typing, file by file, with real types for props, state, events and API data instead of `any`. Use when the user asks to migrate to TypeScript, convert .js or .jsx files to .ts or .tsx, add types to a component, hook, store or API layer, turn on strict mode, remove `any` or `@ts-ignore`, replace PropTypes with types, or fix a large number of type errors.
---

# TypeScript migration

Add types that describe what the code really does. The aim is for the compiler to catch real mistakes; a migration that reaches zero errors by writing `any` and casts everywhere has the cost of TypeScript without the benefit.

## 1. Look at the starting point

- Is TypeScript already installed and configured (`tsconfig.json`, `allowJs`, `strict` and its sub-flags)? Is the build tool set up for `.ts` and `.tsx`?
- How much is JavaScript, and where? Count files by folder.
- Read `.claude/frontend-conventions.md` and two existing typed files, if any, to copy the style: `type` or `interface`, where shared types live, how props are named.
- Record the baseline: run the type check, lint, tests and build, and note current failures.

If TypeScript is not set up, add it in the way the framework documents, with `allowJs: true` so JavaScript and TypeScript files work side by side during the migration. Ask before changing the build configuration.

## 2. Plan the order

Agree the scope: one file, one folder, or the whole project. For more than a few files, migrate in this order, because types flow from the bottom up:

1. shared types and constants
2. utilities and pure functions
3. the API layer and data models
4. stores, hooks and composables
5. leaf components, then the components that use them
6. pages and the app entry

Converting a page before the things it imports leaves it full of implicit `any`.

Do it in small batches that each end with a passing type check, and keep the app working at every step. Do not rename every file in one go.

## 3. Convert a file

1. Rename it (`.js` to `.ts`, `.jsx` to `.tsx`), using `git mv` so history follows.
2. Fix the errors by adding types, in this priority:

**Infer where possible.** Do not annotate what the compiler already knows, such as a variable assigned a string. Annotate function parameters, exported function return types and public APIs.

**Props and component APIs.** Write a props type from how the component is used. Replace `PropTypes` with it and remove the `prop-types` usage. Mark optional props with `?` and keep the defaults. Extend the native element's props when the component wraps one.

**Events and refs.** Use the framework's event and ref types (for example `React.ChangeEvent<HTMLInputElement>`, a typed `ref` or `defineEmits`), not `any`.

**State.** Give state a type when the initial value does not show it: `useState<User | null>(null)`, an empty array, a ref that starts empty.

**API data.** This is where types matter most. Take them from the best source available: generated types from an OpenAPI or GraphQL schema, then the backend code, then real responses. Do not invent a shape from how the frontend happens to use it; mark any guessed type with a comment and report it. Data from outside is `unknown` until checked; if the project uses a schema library, validate at the boundary and derive the type from the schema.

**Model the real states.** Use union types for values with a fixed set (`'idle' | 'loading' | 'error'`), and discriminated unions where fields depend on a status, so impossible combinations cannot be written.

**Nulls.** Handle `null` and `undefined` where they can occur, with a check or a default. Each strict-null error is a possible runtime crash; some will be real bugs. Report those.

## 4. What not to do

- No `any` to make an error go away. Use `unknown` and narrow it, or write the real type.
- No `as` cast to force a type the value might not have, and no non-null `!` without a reason the code makes obvious. Both tell the compiler to stop checking.
- No `@ts-ignore`. If one error truly must wait, use `@ts-expect-error` with a comment that says why, so it reports itself when the problem is fixed.
- No behaviour changes. If typing reveals a bug, report it and fix it as a separate, named change.
- No rewrite of working logic to make it easier to type, unless the user agrees.

When a third-party package has no types, install its `@types` package; if none exists, write a small declaration file for the parts in use.

## 5. Tighten

After the files are converted, move toward `strict: true`:

- Turn on one flag at a time (`noImplicitAny`, then `strictNullChecks`, then the rest), fixing the errors of each before the next.
- Remove `allowJs` when no JavaScript is left.
- Offer lint rules that keep it clean, such as banning explicit `any`.
- For a large codebase, report the count of remaining `any`, casts and suppressions, so progress is visible.

## 6. Verify

Run the type check, lint, tests and build after each batch, and compare with the baseline. Start the app and open the changed screens if a browser tool is available, since a rename can break an import path that only fails at runtime.

## 7. Report

Files converted, types added for API data and where they came from, real bugs found through typing, remaining `any` and suppressions with reasons, and the next batch to do.
