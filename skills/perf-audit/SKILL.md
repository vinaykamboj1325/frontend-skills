---
name: perf-audit
description: Measures a frontend app's loading and runtime performance with Lighthouse, Core Web Vitals and bundle analysis, then finds and fixes the biggest causes. Use when the user says the site or a page is slow, asks to improve Lighthouse or PageSpeed scores, LCP, INP or CLS, reduce bundle size, speed up page load, find unnecessary re-renders, optimise images or fonts, or check performance before a release.
---

# Performance audit

Measure first, fix the largest cause, measure again. Performance work done from intuition often speeds up something that was not slow, so every change here is tied to a number.

## 1. Agree the target

Ask or infer in one line: which pages, and what "slow" means for the user (first load, navigation, typing or scrolling lag, bundle size). Use these thresholds for "good" at the 75th percentile unless the project has its own budget:

| Metric | Good | What it measures |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5 s | When the main content appears |
| INP (Interaction to Next Paint) | ≤ 200 ms | How fast the page answers input |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | How much the layout jumps |

## 2. Measure

Measure a **production build**. A dev server is unminified and adds its own overhead, so its numbers mislead.

1. Build and serve the app with the commands from `.claude/frontend-conventions.md` or `package.json` (for example `build` then `preview` or `start`).
2. Run Lighthouse on each target page, mobile profile, and save the JSON:

   ```bash
   npx lighthouse http://localhost:4173/ --output=json --output-path=./perf-before.json --only-categories=performance --chrome-flags="--headless"
   ```

   Run it three times and use the median; single runs vary.
3. Analyse the bundle with the tool that fits the bundler: `vite-bundle-visualizer` or `rollup-plugin-visualizer`, `webpack-bundle-analyzer`, `@next/bundle-analyzer`, `source-map-explorer`, or Angular's `--stats-json`. Record the size of each entry chunk and the ten largest modules.
4. If the complaint is about interaction lag, record a performance trace of the slow interaction with a browser tool if one is available, or use the framework's profiler.

Lab numbers are not field numbers. If the project has real-user monitoring, look at that too, and say which kind of data each conclusion rests on.

## 3. Find the causes

Read the Lighthouse JSON for the metric values, the LCP element, the opportunities and the diagnostics. Match what you see to the usual causes:

| Symptom | Usual causes |
|---|---|
| Slow LCP | Large or unoptimised hero image; LCP image lazy-loaded or found late; render-blocking CSS or scripts; slow server response; content rendered only after client-side data fetching; web font blocking text |
| Poor INP | Long JavaScript tasks on input; heavy re-renders; large lists without virtualisation; expensive work in handlers; too much third-party script |
| High CLS | Images, ads, embeds or iframes without dimensions; fonts swapping with different metrics; content inserted above existing content; animations of layout properties |
| Large bundle | A big library used for a small job; whole-library imports; duplicated dependencies; no route-level code splitting; development code in the production bundle; unused polyfills |

Rank the findings by expected gain, and by effort. Present the top three to five with the numbers behind them.

## 4. Fix

Apply fixes one at a time, largest expected gain first, so each result can be measured. Common fixes:

- **Images:** modern formats, correct size with `srcset` and `sizes`, explicit `width` and `height`, lazy-load below the fold, and for the LCP image no lazy-loading plus `fetchpriority="high"`. Use the framework's image component if it has one.
- **Fonts:** fewer families and weights, `font-display: swap` or `optional`, preload the main font, self-host, match fallback metrics.
- **JavaScript:** split by route, lazy-load heavy components that are not visible at first, replace or trim large dependencies, import only what is used, defer third-party scripts.
- **Rendering:** render the main content on the server or at build time when the framework supports it; avoid request waterfalls by fetching in parallel or earlier.
- **Interaction:** break up long tasks, debounce input work, virtualise long lists, memoise only where the profiler shows repeated expensive renders, move heavy work to a web worker.
- **Layout shift:** reserve space for media, embeds and late content; animate `transform` and `opacity` only.
- **Caching:** long-lived cache headers for hashed assets, compression on text assets.

Ask before changes with wider effects: replacing a dependency, changing the rendering strategy, changing server or CDN configuration.

## 5. Measure again

Rebuild, rerun the same Lighthouse command three times, and compare medians. Keep a fix only if the number moved; remove changes that made no difference, since they add complexity for nothing. Check that the fix did not break behaviour: run the tests and look at the page.

## 6. Report

```
| Metric | Before | After | Change |
```

Then: what was changed and the gain from each change, findings not fixed and why, and whether the numbers are lab or field data. Offer to add a performance budget to CI (Lighthouse CI or a bundle size check) so the gains stay.
