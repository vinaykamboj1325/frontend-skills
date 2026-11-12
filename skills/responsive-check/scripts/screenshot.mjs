#!/usr/bin/env node
// Screenshots a page at several widths and reports layout problems.
//
// Usage (run from the project folder, so the project's Playwright is found):
//   node screenshot.mjs <url> [outDir] [--widths 375,768,1280,1920]
//
// Output: <outDir>/<width>.png for each width, <outDir>/report.json,
// and the same report printed to stdout.

import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const HEIGHTS = { 320: 568, 375: 812, 768: 1024, 1280: 800, 1920: 1080 };
const MIN_TAP = 24;

function parseArgs(argv) {
  const args = { url: null, outDir: 'responsive-check', widths: [375, 768, 1280, 1920] };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--widths') {
      args.widths = String(argv[++i] || '')
        .split(',')
        .map((w) => parseInt(w, 10))
        .filter((w) => Number.isFinite(w) && w > 0);
    } else {
      rest.push(argv[i]);
    }
  }
  args.url = rest[0] || null;
  if (rest[1]) args.outDir = rest[1];
  return args;
}

function loadPlaywright() {
  // Resolve from the current working directory (the user's project),
  // because this script lives outside the project.
  const require = createRequire(path.join(process.cwd(), 'package.json'));
  for (const name of ['playwright', '@playwright/test', 'playwright-core']) {
    try {
      const mod = require(name);
      if (mod.chromium) return mod.chromium;
    } catch {
      // try the next package name
    }
  }
  return null;
}

// Runs in the page.
function inspect(minTap, checkTaps) {
  const viewport = document.documentElement.clientWidth;
  const pageWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body ? document.body.scrollWidth : 0
  );

  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = typeof el.className === 'string' ? el.className.trim() : '';
    if (cls) s += '.' + cls.split(/\s+/).slice(0, 3).join('.');
    return s;
  };

  const visible = (el, rect) => {
    if (rect.width === 0 || rect.height === 0) return false;
    const style = getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none';
  };

  const overflowing = [];
  if (pageWidth > viewport + 1) {
    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect();
      if (!visible(el, rect)) continue;
      if (rect.right > viewport + 1 || rect.left < -1) {
        // Keep only the outermost offenders: skip if a parent is already listed.
        if (overflowing.some((o) => o.el.contains(el))) continue;
        overflowing.push({ el, selector: describe(el), width: Math.round(rect.width), right: Math.round(rect.right) });
      }
      if (overflowing.length >= 10) break;
    }
  }

  const smallTargets = [];
  if (checkTaps) {
    const controls = document.querySelectorAll(
      'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"]'
    );
    for (const el of controls) {
      const rect = el.getBoundingClientRect();
      if (!visible(el, rect)) continue;
      if (rect.width < minTap || rect.height < minTap) {
        smallTargets.push({
          selector: describe(el),
          text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
      if (smallTargets.length >= 20) break;
    }
  }

  return {
    viewportWidth: viewport,
    pageWidth,
    horizontalOverflow: pageWidth > viewport + 1,
    overflowingElements: overflowing.map(({ el, ...o }) => o),
    smallTapTargets: smallTargets,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url || args.widths.length === 0) {
    console.error('Usage: node screenshot.mjs <url> [outDir] [--widths 375,768,1280,1920]');
    process.exit(1);
  }

  const chromium = loadPlaywright();
  if (!chromium) {
    console.error(
      'Playwright was not found in this project.\n' +
        'Install it with:  npm i -D playwright\n' +
        'Then the browser: npx playwright install chromium'
    );
    process.exit(2);
  }

  await mkdir(args.outDir, { recursive: true });
  const browser = await chromium.launch();
  const report = { url: args.url, results: [] };

  try {
    for (const width of args.widths) {
      const height = HEIGHTS[width] || 900;
      const context = await browser.newContext({
        viewport: { width, height },
        isMobile: width < 768,
        hasTouch: width < 768,
      });
      const page = await context.newPage();
      const result = { width, height };
      try {
        await page.goto(args.url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        const file = path.join(args.outDir, `${width}.png`);
        await page.screenshot({ path: file, fullPage: true });
        Object.assign(result, { screenshot: file }, await page.evaluate(inspect, MIN_TAP, width <= 768));
      } catch (err) {
        result.error = String(err && err.message ? err.message : err);
      }
      report.results.push(result);
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const json = JSON.stringify(report, null, 2);
  await writeFile(path.join(args.outDir, 'report.json'), json);
  console.log(json);
  process.exit(report.results.some((r) => r.error) ? 3 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
