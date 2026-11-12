---
name: form-builder
description: Builds accessible forms with validation, clear error messages and correct submit behaviour, using the project's form and schema libraries. Use when the user asks to create or fix a form, such as login, sign-up, checkout, settings, search filters or a multi-step wizard, or asks to add validation, field errors, a schema, file upload fields, or to wire a form to a submit endpoint.
---

# Form builder

Build a form that is easy to complete and hard to submit wrongly. Forms are where users are most often lost, and most of the causes are the same few mistakes: errors shown too early or too vaguely, labels missing, the submit button doing nothing visible.

## 1. Find the pattern

Read `.claude/frontend-conventions.md`, section Forms. If it is missing, check `package.json` for a form library (React Hook Form, Formik, TanStack Form, VeeValidate, Angular reactive forms, Superforms) and a schema library (Zod, Yup, Valibot), and open one existing form to copy its structure and its field components. If the project has neither, use the framework's built-in form handling and native validation attributes, and do not add a library without asking.

## 2. Define the fields first

Write a field table before any code and show it in the reply:

| Field | Type | Required | Rules | Error message |
|---|---|---|---|---|

Take the rules from the feature document's Data section if there is one. Rules must match what the backend enforces; a form that accepts what the server rejects wastes the user's time.

## 3. Build

**Schema.** One schema is the single source for validation rules and for the form's types. Put it where the project keeps schemas.

**Fields.**
- Every input has a visible `label` connected to it. Placeholder text is not a label, because it disappears when the user types.
- Use the right `type`, `inputmode` and `autocomplete` values. They give mobile users the right keyboard and let browsers and password managers fill the form.
- Group related fields with `fieldset` and `legend` (radio groups, address blocks).
- Mark required fields in the way the project does, and say so in text, not by colour alone.
- Reuse the project's field components instead of raw inputs.

**Validation timing.** Validate a field when the user leaves it, and re-validate on each change once it has an error, so the message goes away as soon as the value is fixed. Validating on every keystroke from the start shows errors before the user has finished typing.

**Errors.**
- Show the message next to its field and connect it with `aria-describedby`; set `aria-invalid` on the field.
- Say how to fix it: "Enter a date after today", not "Invalid date".
- On a failed submit, move focus to the first invalid field. For long forms, add a summary at the top that links to each field.
- Map server validation errors back to their fields; show other server errors at form level.

**Submit.**
- Submit with a real `form` element and a submit button, so Enter works.
- While sending: disable the button, show progress, block a second submit.
- On success: do what the feature document says (message, redirect, reset). On failure: keep everything the user typed.
- For long or valuable forms, warn before leaving with unsaved changes if the project has a pattern for it.

**Multi-step forms.** Validate each step before moving on, keep entered data when going back, show the step number and total, and submit once at the end.

## 4. Verify

- Type check and lint pass.
- Tests cover: submit with valid data, required-field errors, one rule per field, a server error, and the double-submit guard.
- Complete the form with the keyboard only, if a browser tool is available.

## 5. Report

Files changed, the field table, and anything assumed about backend rules.
