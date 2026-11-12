---
name: seo-audit
description: Checks and fixes the technical SEO of frontend pages, covering titles and meta descriptions, Open Graph and social cards, canonical URLs, structured data (JSON-LD), headings, sitemap, robots rules, and whether content is visible to crawlers without JavaScript. Use when the user asks about SEO, search ranking, Google indexing, meta tags, link previews on social media or chat apps, rich results, sitemap.xml or robots.txt, or says "my page does not show up on Google" or "the shared link has no image".
---

# SEO audit

Make sure search engines and link previews can find each page, read its content and describe it correctly. This skill covers the technical side that lives in frontend code. It does not write marketing copy or promise rankings, and the report should not claim it does.

## 1. Understand how pages are rendered

This decides everything else. From the framework and its config, find out for the pages in scope whether the HTML sent by the server already contains the content:

| Rendering | Meaning for SEO |
|---|---|
| Static generation or server rendering | Content and meta tags are in the HTML. Good. |
| Client-side rendering only | The HTML is an empty shell. Google may render it later; many other crawlers and all link-preview bots will see nothing. |

Check by fetching the page without running JavaScript (for example `curl <url>`) and looking for the title, the description and the main text in the response.

If public pages that need to rank are client-rendered only, report this first, as the main finding. Fixing meta tags on an empty shell changes little. Propose the framework's own answer (pre-rendering, static generation, server rendering) and ask before making that change, since it affects the architecture.

Also note which pages should not be indexed at all: dashboards, account pages, internal search results.

## 2. Check each page type

Go through one page of each type (home, listing, detail, article), using the framework's metadata mechanism (Next.js `metadata`, Nuxt `useSeoMeta`, Angular `Title` and `Meta`, a head manager library, or plain HTML).

**Head**
- `title`: unique per page, says what the page is, most specific part first, about 50 to 60 characters.
- `meta name="description"`: unique, a real summary, about 120 to 160 characters.
- `link rel="canonical"`: an absolute URL, pointing to the preferred version; one per page.
- `html lang`, and `hreflang` links when the site has several languages.
- `meta name="viewport"` for mobile.
- `meta name="robots" content="noindex"` on pages that must stay out of search, and absent everywhere else. A leftover `noindex` from staging is a common reason a site vanishes from search.

**Social cards**
- `og:title`, `og:description`, `og:url`, `og:type`, `og:image` with an absolute URL; image about 1200 × 630 and reachable without login.
- `twitter:card` set to `summary_large_image` when there is a large image.

**Content**
- One `h1` that matches the page topic, and a logical heading order.
- Real links: `a` elements with `href`. Navigation done only with click handlers cannot be followed by crawlers.
- Descriptive link text, not "click here".
- Images with `alt` text, sizes set, and lazy loading below the fold.
- Readable URLs: lower case, words separated by hyphens, stable.
- Correct status codes: a missing page returns 404, not a 200 page that says "not found"; moved pages redirect with 301.

**Structured data**
- JSON-LD for the page type where one applies: `Organization`, `WebSite`, `BreadcrumbList`, `Article`, `Product`, `FAQPage`, `Event`, `LocalBusiness`.
- Only mark up what is visible on the page, with real values. Invented ratings or prices break search engine policies.
- Generate it from the same data that renders the page, so the two cannot drift.

**Site level**
- `robots.txt` exists, does not block pages or assets that should be crawled, and points to the sitemap.
- `sitemap.xml` exists, lists canonical, indexable URLs only, and is generated from the routes or data, not maintained by hand.
- One consistent host and protocol (HTTPS, with or without `www`), with redirects from the others.
- A favicon and a web manifest.

**Speed and mobile**
Core Web Vitals are a ranking signal. If the pages are slow, point to the `perf-audit` skill instead of repeating that work here.

## 3. Fix

- Put defaults in one shared place (the root layout or a single SEO component) and let each page override title, description, canonical and image. Scattered, copy-pasted tags are how duplicates happen.
- For pages built from data, generate the title, description and structured data from that data.
- Apply fixes that are clearly right. Ask before writing or rewriting titles and descriptions for important pages, since wording is a business decision; propose text instead.

## 4. Verify

- Fetch the changed pages without JavaScript and confirm the tags and content are in the HTML.
- Check there is exactly one title, one description and one canonical per page.
- Validate JSON-LD syntax by parsing it, and name the Rich Results Test and the Schema.org validator as the checks to run on the deployed URL.
- Run Lighthouse's SEO category if available.

## 5. Report

```
| Page type | Problem | Impact | Status |
```

Then the rendering finding, pages intentionally set to `noindex`, and the checks that need the deployed site (Search Console coverage, the Rich Results Test, real link previews). State plainly that these changes make pages eligible and readable; they do not guarantee a ranking.
