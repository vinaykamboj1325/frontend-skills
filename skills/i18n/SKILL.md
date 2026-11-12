---
name: i18n
description: Makes a frontend app translatable and correct in other languages, by extracting hard-coded text into translation files, handling plurals, dates, numbers and currency, and supporting right-to-left layouts. Use when the user asks to add internationalisation, localisation, i18n, l10n, translations, multi-language support, a new language or locale, a language switcher, RTL or Arabic/Hebrew support, or asks to find untranslated or hard-coded strings and missing translation keys.
---

# Internationalisation

Make every piece of text and every formatted value depend on the user's locale. Translating words is the smaller part; the usual bugs are sentences glued together from pieces, plurals that are wrong outside English, and layouts that break when text gets longer or the direction flips.

## 1. Find the setup

Read `.claude/frontend-conventions.md` and `package.json` for an i18n library (i18next, react-intl / FormatJS, next-intl, vue-i18n, Angular i18n or Transloco, Paraglide, Lingui). Open the translation files and two components that use them, and note the key naming, the file layout per locale and namespace, and how plurals and variables are written.

If the project has none, propose the usual library for the stack with a short reason, and ask before installing. Also agree: the source language, the target locales, and how the locale is chosen (URL prefix, domain, user setting, browser language).

## 2. Find hard-coded text

Search the requested scope for text a user can see or hear:

- text between tags, and string props such as `label`, `title`, `placeholder`, `alt`, `aria-label`
- validation messages, toasts, error messages, empty states, confirm dialogs
- text built in code: template strings, concatenation, ternaries that pick a word
- dates, times, numbers, currency and units formatted by hand
- page titles and meta descriptions

Skip: log messages, test ids, CSS class names, keys and identifiers, and text that comes from the backend (report that separately, since it needs a backend answer).

## 3. Extract well

- **Keys** follow the project's scheme. With none, use `feature.section.meaning` (`checkout.payment.submitButton`), named for meaning and not for the English words, so the key stays right when the wording changes.
- **Whole sentences, never pieces.** `"You have " + n + " new messages"` cannot be translated, because word order differs between languages. Use one message with variables: `You have {count} new messages`.
- **Plurals** use the library's plural syntax (ICU `plural` or the library's own). English has two forms; Arabic has six and Polish has four, so `count === 1 ? … : …` is wrong for them.
- **Rich text** (a link or bold word inside a sentence) uses the library's component interpolation, so the translator sees the full sentence.
- **Same word, different meaning** gets different keys ("Close" the dialog, "Close" to the shop).
- Give translators context with the library's description or comment feature where a string is ambiguous.
- Do not reuse one key in unrelated places just because the English text matches.

## 4. Format values with the locale

Use `Intl` or the library's formatters, with the active locale:

- dates and times: `Intl.DateTimeFormat`; relative times: `Intl.RelativeTimeFormat`
- numbers, percent, currency, units: `Intl.NumberFormat`; the currency comes from the data, not from the locale
- lists: `Intl.ListFormat`
- sorting: `Intl.Collator` or `localeCompare` with the locale

Remove hand-built formats such as `` `${d}/${m}/${y}` ``.

## 5. Make the layout survive

- Text grows 30 to 40 percent in German or Finnish. Remove fixed widths on buttons, tabs and labels, and let text wrap or truncate on purpose.
- For right-to-left locales: set `dir` on `html`, and use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`) instead of left and right. Mirror directional icons such as arrows; do not mirror logos, media controls or numbers.
- Set `lang` on `html` to the active locale, for screen readers and hyphenation.
- Check that the fonts cover the scripts of the target locales.

## 6. Translation files

- Add every new key to the source-language file.
- For the other locales, follow the project's process. If translations are done by people or a service, add the keys in the way that process expects and list them for translation. Offer machine-translated drafts only if the user wants them, and mark them as unreviewed.
- Keep files sorted and structured the way they already are, to keep diffs small.
- Report keys that are missing in some locales and keys that are no longer used.

## 7. Verify

- Type check, lint and tests pass; update tests that looked for the old hard-coded text.
- If a browser tool is available, view the changed screens in the source locale, in the longest target locale and in one right-to-left locale if supported.
- A pseudo-locale (accented, lengthened text) is a quick way to see leftover hard-coded strings; offer it if the library supports one.

## 8. Report

Count of strings extracted, keys added per namespace, keys awaiting translation per locale, text left alone and why, and layout issues found.
