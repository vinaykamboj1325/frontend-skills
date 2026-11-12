# Feature: Wishlist

Status: draft · Owner: unassigned · Last updated: 2026-11-10

## Goal

Shoppers who find a product they like but are not ready to buy have no way to come back to it: the heart on the products page only fills in local state and is lost on reload. This feature lets a logged-in user save products from the products page to a wishlist stored on their account, see them on a separate wishlist page, and remove them there. It is successful when a saved product is still on the wishlist page after a reload and on another device, and when removing it there also clears the heart on the products page.

## User stories

1. As a logged-in shopper, I want to save a product from the products page so that I can find it again later.
2. As a logged-in shopper, I want to see on the products page which products I have already saved so that I do not have to remember.
3. As a logged-in shopper, I want a separate page listing everything I saved so that I can review it in one place.
4. As a logged-in shopper, I want to remove a product from my wishlist so that the list only holds what I still want.
5. As a logged-out visitor, I want to be told that I need to log in to use the wishlist so that I understand why I cannot save.

## Screens

### Products page

- Route or entry point: `/products` (today rendered directly by `src/App.tsx`; there is no router yet, see Unknowns)
- Regions, top to bottom:
  - App header: site name on the left, navigation on the right with "Products" and "Wishlist" links. The "Wishlist" link shows the saved count in brackets, for example "Wishlist (3)", and is shown only to logged-in users.
  - Page title: "Products" as the page's `h1`.
  - Filters: the existing search input and category select, unchanged.
  - Status message: a single line for wishlist feedback ("Could not save Catan. Try again."). Empty when there is nothing to report.
  - Product grid: one product card per product, with image, name, price and, for logged-in users, a wishlist toggle button in the top right corner of the card.
- Actions:
  - Press the wishlist toggle on an unsaved product → heart fills at once, product is saved to the account, header count goes up by one. Stays on the page.
  - Press the wishlist toggle on a saved product → heart empties at once, product is removed from the account, header count goes down by one. Stays on the page.
  - Follow "Wishlist" in the header → Wishlist page.
  - Search, change category, select a card → as today, no change.

### Wishlist page

- Route or entry point: `/wishlist`, reached from the "Wishlist" link in the app header or by direct URL
- Regions, top to bottom:
  - App header: same as on the Products page, with "Wishlist" marked as the current page.
  - Page title: "Wishlist" as the page's `h1`, followed by the item count in muted text ("3 items", "1 item").
  - Status message: a single line for feedback ("Removed Catan from your wishlist.", "Could not remove Catan. Try again.").
  - Wishlist grid: one product card per saved product, newest saved first, with image, name, price and a "Remove" button under the price. Same grid layout as the Products page.
  - Empty state: replaces the grid when nothing is saved. Text "Your wishlist is empty" with a "Browse products" link.
- Actions:
  - Press "Remove" on a card → the card leaves the grid, the count in the title and the header go down by one, the status message confirms. Stays on the page.
  - Follow "Browse products" (empty state) or "Products" (header) → Products page.
  - Press "Try again" (error state) → reloads the wishlist.
  - Follow "Log in" (logged-out state) → the login entry point (see Unknowns).

## States

| Screen | Loading | Empty | Error | Success | Other |
|---|---|---|---|---|---|
| Products page | Product list: "Loading…" as today. Wishlist: while it loads, toggles are shown unfilled and disabled; the header link reads "Wishlist" with no count. | Product list empty: "No products found" (not shown today; added here because the grid is otherwise blank). Wishlist empty: every toggle unfilled, header reads "Wishlist (0)". | Product list fails: "Could not load products" as today. Wishlist fails to load: products still show, toggles stay disabled, status message "Could not load your wishlist. Saving is unavailable." Save or unsave fails: the heart goes back to its previous state and the status message reads "Could not save <name>. Try again." or "Could not remove <name>. Try again." | Products show with toggles filled for saved products; header count matches. No message after a successful save, since the filled heart is the feedback. | Logged out: no toggles on cards and no "Wishlist" link in the header. Session expired during a save (401): heart goes back, status message "Log in to save products." Request in flight: that one toggle is disabled until the request finishes. Wishlist full (100 items): heart goes back, status message "Your wishlist is full. Remove a product to save another." |
| Wishlist page | "Loading…" in place of the grid; the title shows no count. | "Your wishlist is empty" with a "Browse products" link; title shows "0 items". | Load fails: "Could not load your wishlist" with a "Try again" button in place of the grid. Remove fails: the card comes back in its original position and the status message reads "Could not remove <name>. Try again." | Grid of saved products, newest first, count in the title. After a removal: status message "Removed <name> from your wishlist." | Logged out, or 401 on load: "Log in to see your wishlist" with a "Log in" link in place of the grid; no count. Request in flight: that card's "Remove" button is disabled. Saved product no longer in the catalogue: not applicable for now, the backend behaviour is unknown (see Unknowns). |

## Components

| Component | Existing or new | Path (if existing) | Variants and props |
|---|---|---|---|
| Button | Existing | `src/components/Button` | Used for "Remove" (`variant="secondary"`, `size="sm"`) and "Try again" (`variant="secondary"`, `size="md"`). `disabled` while a request is in flight. No change needed. |
| Card | Existing | `src/components/Card` | Not used. Its surface background, shadow and `h3` title do not match the product tiles; the product tile is extracted as ProductCard instead. |
| ProductCard | New (extracted from the inline markup in `src/pages/ProductsPage/ProductsPage.tsx`) | | Props: `product`, `selected?`, `onSelect?`, `action` (slot). Variants: with corner action (Products page, holds WishlistToggle) and with footer action (Wishlist page, holds the "Remove" Button). Image gets `alt=""` because the name is shown next to it. |
| WishlistToggle | New (replaces the inline `iconButton` heart in ProductsPage) | | Props: `saved`, `productName`, `disabled?`, `onToggle`. A real `<button>` with `aria-pressed` and the label "Save <name> to wishlist". States: unsaved (outline heart), saved (filled heart, `--color-danger`), disabled, focus-visible (`--focus-ring`). Hit area at least 24 by 24 px (today it is 20 by 20). |
| AppHeader | New | | Props: `wishlistCount?` (undefined while loading), `loggedIn`, `current` (`'products'` or `'wishlist'`). Variants: logged in (both links) and logged out ("Products" only). Current link carries `aria-current="page"`. |
| StatusMessage | New | | Props: `tone` (`'info'` or `'error'`), `children`. Renders a `role="status"` region for info and `role="alert"` for errors; always in the DOM so screen readers announce changes. Error tone uses `--color-danger`. |
| EmptyState | New | | Props: `title`, `action?` (link or button). Used on the Wishlist page for the empty, error and logged-out states. |
| WishlistPage | New | | Page component at `src/pages/WishlistPage/`, following the `ProductsPage` folder pattern. |
| `useWishlist` hook | New | | Lives in `src/hooks/` next to `useProducts`. Returns `items`, `savedIds`, `loading`, `error`, `add(product)`, `remove(productId)`, `pendingIds`, `reload()`. One shared instance (context or equivalent) so the header count and both pages stay in step. Replaces the local `saved` state in ProductsPage. |

## Data

None of the wishlist or session endpoints exist in this repository; `src/api/` only has `GET /products`. The shapes below are a proposal for the backend to confirm.

| Endpoint or query | Method | Fields used | Notes |
|---|---|---|---|
| `/api/products` | GET | `id`, `name`, `price`, `currency`, `imageUrl` | Exists (`src/api/products.ts`). Unchanged. |
| `/api/wishlist` | GET | Array of `{ product: Product, addedAt: string }` | Proposed. Returns the full product so the Wishlist page needs no second request. Sorted by `addedAt` descending on the client. 401 when logged out. |
| `/api/wishlist/{productId}` | PUT | No body; response not used | Proposed. Idempotent: saving an already saved product succeeds. 401 logged out, 404 unknown product, 409 or 422 when the list is full. |
| `/api/wishlist/{productId}` | DELETE | No body; response not used | Proposed. Idempotent: removing a product that is not saved succeeds. 401 logged out. |
| Session check | Unknown | Whether a user is logged in | No auth code exists in the project. Until confirmed, "logged in" is derived from `GET /api/wishlist` returning 200 rather than 401. |

Client work this implies: `src/api/client.ts` only exports `get`; it needs `put` and `del` helpers that throw the same `ApiError`, and a new `src/api/wishlist.ts`.

Validation rules:

- Product id: must be the `id` of a product returned by the API; there is no user-typed input in this feature.
- Wishlist size: at most 100 products. Saving the 101st fails with "Your wishlist is full. Remove a product to save another."
- Duplicate save: not an error; the product stays saved once.

Unknowns:

- Whether the wishlist endpoints exist, and their paths, verbs and response shapes.
- How the frontend learns that a user is logged in, and where "Log in" should link to. There is no login page or session code in the project.
- Whether requests need credentials or a CSRF token; `client.ts` sends neither today.
- The real size limit, if any, and the status code returned when it is reached.
- What the API returns for a saved product that was later deleted or made unavailable.
- Routing: the project has no router and `App.tsx` renders ProductsPage directly. Adding `/wishlist` needs either a router dependency or a small path switch; this is a team decision.

## Interactions

- Keyboard and focus:
  - WishlistToggle and "Remove" are native buttons: reachable with Tab, activated with Enter and Space, with the `--focus-ring` token visible on focus.
  - Pressing the toggle does not select the card (the click does not bubble to the card, as today).
  - The toggle keeps focus after saving or unsaving; its `aria-pressed` value changes and the label stays the same.
  - After "Remove" on the Wishlist page, focus moves to the "Remove" button of the next card, or the previous card when the last one was removed, or the "Your wishlist is empty" heading (focusable with `tabindex="-1"`) when none are left. If the removal fails and the card comes back, focus returns to its "Remove" button.
  - Status messages are announced through the live region without moving focus.
  - A disabled toggle or button during a request must not drop focus to the top of the page: use `aria-disabled` and ignore the press, rather than the `disabled` attribute, on the control that has focus.
- Responsive behaviour:
  - Both grids keep the existing rule, `repeat(auto-fill, minmax(200px, 1fr))` inside a 960 px page: one column at 320 px wide, about four at 960 px and above.
  - The header stays on one row down to 320 px; the count stays attached to the "Wishlist" link.
  - "Remove" spans the card width in a one-column layout so it is easy to hit on touch screens.
- Motion:
  - The heart fill changes with no animation beyond a colour transition of at most 150 ms.
  - A removed card disappears at once and the grid reflows; no exit animation.
  - With `prefers-reduced-motion: reduce`, the colour transition is dropped as well.

## Acceptance criteria

1. Logged in, pressing the toggle on an unsaved product → the heart is filled, `aria-pressed` is `true`, a `PUT /api/wishlist/{id}` request is sent, and the header reads one more than before.
2. Logged in, pressing the toggle on a saved product → the heart is unfilled, `aria-pressed` is `false`, a `DELETE /api/wishlist/{id}` request is sent, and the header reads one fewer than before.
3. Reloading the Products page after saving a product → that product's heart is still filled.
4. Opening the Products page with products already saved → exactly those products have a filled heart and the header count equals the number saved.
5. Following "Wishlist" in the header → the URL is `/wishlist` and the page shows an `h1` "Wishlist".
6. Opening the Wishlist page with three saved products → three cards show, each with image, name, formatted price and a "Remove" button, ordered newest saved first, and the title reads "3 items".
7. Opening the Wishlist page with one saved product → the title reads "1 item".
8. Pressing "Remove" on a card → the card is no longer in the grid, the title and header counts go down by one, and the status message reads "Removed <name> from your wishlist."
9. Removing a product on the Wishlist page, then opening the Products page → that product's heart is unfilled.
10. Removing the last product → the grid is replaced by "Your wishlist is empty" and a "Browse products" link, and focus is on that heading.
11. Following "Browse products" → the Products page shows.
12. Opening the Wishlist page with nothing saved → "Your wishlist is empty" shows and no grid is rendered.
13. While the wishlist request is pending on the Wishlist page → "Loading…" shows and no empty-state text shows.
14. The wishlist request fails on the Wishlist page → "Could not load your wishlist" and a "Try again" button show; pressing "Try again" sends the request again.
15. A save request fails on the Products page → the heart returns to unfilled, the header count returns to its previous value, and "Could not save <name>. Try again." is announced in the alert region.
16. A remove request fails on the Wishlist page → the card is back in its original position and "Could not remove <name>. Try again." is announced in the alert region.
17. While a save or remove request for a product is in flight, pressing that product's control again → no second request is sent.
18. Logged out on the Products page → no card has a wishlist toggle and the header has no "Wishlist" link.
19. Logged out, opening `/wishlist` directly → "Log in to see your wishlist" and a "Log in" link show, and no product cards show.
20. A save request answered with 401 → the heart returns to unfilled and "Log in to save products." shows.
21. Saving a product when 100 are already saved → the heart returns to unfilled and "Your wishlist is full. Remove a product to save another." shows.
22. Using only the keyboard: Tab reaches every toggle and every "Remove" button, Enter and Space activate them, and each shows a visible focus ring.
23. Pressing the toggle on a card → the card's selected state does not change.
24. Each toggle's accessible name contains the product name ("Save Catan to wishlist"), and each remove button's accessible name is "Remove <name> from wishlist".
25. After "Remove" with other cards left → focus is on the "Remove" button of the next card, or of the previous card when the removed one was last.
26. At 320 px viewport width, on both pages → the grid is one column and the page does not scroll sideways.

Story coverage: story 1 by criteria 1, 3, 15, 17; story 2 by 3, 4, 9; story 3 by 5, 6, 7, 12, 13, 14; story 4 by 2, 8, 10, 16, 25; story 5 by 18, 19, 20.

## Out of scope

- Login, registration and session handling themselves; this feature only reacts to being logged in or not.
- A wishlist for logged-out visitors (local storage) and merging it into the account after login.
- Saving from anywhere other than the products page (there is no product detail page).
- Undo after removal, "remove all", and a confirmation dialog before removing.
- Sharing a wishlist, multiple named lists, notes, or priorities.
- "Add to cart" or "move to cart" from the wishlist; the project has no cart.
- Price-drop or back-in-stock notifications.
- Sorting, filtering, searching or paginating the wishlist.
- Fixing existing Products page issues not needed for this feature: the page title is a `div` rather than a heading, the search and select have no label and remove their focus outline, `.muted` uses a hard-coded `#aaaaaa`, cards are clickable `div`s that the keyboard cannot reach, and `useProducts` does not refetch when the category changes. They are listed so nobody assumes this feature fixes them, except where a criterion above says so (toggle name, toggle size, image `alt`).

## Assumptions

- No questions were asked; every item here is a default chosen without confirmation.
- "Logged in" exists or will exist as a backend session, and the frontend can tell by a 401 from the wishlist endpoint.
- Logged-out visitors do not see the heart or the "Wishlist" link at all, rather than seeing a heart that sends them to log in.
- The wishlist is stored on the server per account, not in the browser.
- The API shape is `GET /api/wishlist`, `PUT /api/wishlist/{productId}`, `DELETE /api/wishlist/{productId}`, and the list response includes full product objects.
- The limit is 100 products, small enough to load in one request without pagination.
- Saving and removing update the screen at once and roll back on failure (optimistic update).
- Removal is immediate, with no confirmation and no undo, because saving again takes one press.
- The heart on the Products page toggles both ways, as the current local version already does; the request's "remove" wording about the wishlist page is read as "at least there", not "only there".
- The wishlist is ordered newest saved first.
- Routes are `/products` and `/wishlist`, with `/` continuing to show the products page.
- All copy in this document is draft English wording, open to change.
- A product tile on the Wishlist page is not selectable, since selection has no use there.
- The spec is saved in `docs/features/` because the project has no existing place for specs and no `.claude/frontend-conventions.md`.
