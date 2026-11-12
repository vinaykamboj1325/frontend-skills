---
name: dependency-upgrade
description: Upgrades frontend dependencies safely, including major versions of frameworks, build tools and UI libraries, by reading the migration guides, applying codemods and breaking changes step by step, and verifying after each step. Use when the user asks to upgrade or update packages, move to a new major version of React, Next.js, Vue, Nuxt, Angular, Svelte, Vite, webpack, Tailwind, TypeScript or ESLint, fix npm audit or Dependabot security alerts, clear deprecation warnings, or resolve peer dependency conflicts.
---

# Dependency upgrade

Move to newer versions without breaking the app, in steps small enough that a failure points at its cause. Upgrading everything at once and then debugging a red build is the slow way.

## 1. Look before changing

- Find the package manager from the lock file and use only that one. Mixing managers creates a second lock file and different installed versions.
- Check that the working tree is clean, and suggest a new branch if on the main branch, so the upgrade can be thrown away.
- List what is outdated (`npm outdated`, `pnpm outdated`, `yarn outdated`) and what has security advisories (`npm audit` or the equivalent).
- Record the baseline: run type check, lint, tests and build with the commands from `.claude/frontend-conventions.md` or `package.json`, and note what already fails. Failures that existed before the upgrade are not caused by it.

## 2. Plan

Group the updates and show the plan before starting:

| Group | Risk | How |
|---|---|---|
| Patch and minor updates | Low | Together, in one step |
| Security fixes | Varies | First, even when the rest waits |
| A major version of a tool (lint, test runner, bundler, TypeScript) | Medium | One at a time |
| A major version of the framework or the UI library | High | Alone, following the official guide |

Order: tooling before framework, and the framework before the libraries that depend on it. Check peer dependency ranges before choosing a version; a library that does not yet support the new framework version decides how far the upgrade can go.

For a framework that is several major versions behind, go one major at a time if the official guide says so (Angular does), instead of jumping to the latest.

## 3. Read the migration guide

For every major upgrade, read the official migration guide and changelog for each version being crossed, from the project's own documentation site or repository. Do not rely on memory for breaking changes: APIs and codemod names change between versions, and a remembered detail from another version is a common source of wrong edits. Fetch the current guide.

From the guide, list the breaking changes that apply to this codebase by searching the code for each removed or changed API. Most breaking changes in a release do not touch a given project; the list of those that do is the real work.

## 4. Upgrade in steps

For each group:

1. Change the versions and install.
2. Run the official codemod or migration command if one exists (`npx @next/codemod`, `ng update`, `npx @tailwindcss/upgrade`, `npx react-codemod`, and so on, as named in the guide). Review its diff; codemods handle the common cases and miss the unusual ones.
3. Fix the remaining breaking changes by hand.
4. Run type check, lint, tests and build. Fix what the upgrade broke.
5. Commit the step, if the user wants commits, with the package and version in the message.

Rules while doing this:

- Fix the code to match the new version. Do not silence errors with casts, `// @ts-ignore`, disabled lint rules or skipped tests to get a green build; that hides the breakage until runtime.
- Keep behaviour the same. An upgrade is not the moment to refactor; mixing the two makes failures hard to trace.
- For peer dependency conflicts, find the version of the dependent library that supports the new version. Use `--legacy-peer-deps`, `--force` or `overrides` only when the user agrees and with a note of why, since they hide a real incompatibility.
- For a security advisory in a nested dependency, first update the parent package; use `overrides` or `resolutions` when the parent has no fix yet, and report it so it can be removed later.
- Do not delete the lock file to "fix" an install. That silently upgrades everything else.

## 5. Verify beyond the build

A passing build does not prove a UI upgrade worked. Also:

- Start the app and open the main pages, with a browser tool if available; watch the console for new errors and deprecation warnings.
- Look at the parts most exposed to the upgraded package: styling after a CSS framework upgrade, forms after a form library upgrade, routing after a router upgrade.
- Compare the production bundle size before and after, when a build tool or large library changed.

## 6. Report

```
| Package | From | To | Notes |
```

Then: breaking changes that were handled and where, anything deferred and what blocks it, new deprecation warnings to deal with later, and what was not verified (for example, "pages behind login were not opened").
