---
name: api-integration
description: Connects frontend UI to a backend endpoint with typed requests, and loading, error, empty and success states, using the project's existing data-fetching pattern. Use when the user asks to call an API, fetch or submit data, "hook this page up to the backend", add a query or mutation, integrate a REST or GraphQL endpoint, add pagination or infinite scroll, or handle loading and error states for a request.
---

# API integration

Wire a screen to an endpoint so that every outcome of the request has a designed result on screen. The request code is the easy part; the value is in the states around it and in matching the project's existing data layer.

## 1. Find the existing pattern

Read `.claude/frontend-conventions.md`, section Data and state. If it is missing, search the code for how requests are made now: a client wrapper, a query library (TanStack Query, SWR, RTK Query, Apollo, Angular `HttpClient` services, Pinia or NgRx effects), or plain `fetch`. Open one existing call that reads and one that writes, and copy their structure.

Do not add a data-fetching library that the project does not already use without asking. Two patterns in one codebase cost more than either pattern alone.

## 2. Pin down the contract

Before writing code, state the contract: URL, method, params, request body, response shape, error shape, auth, pagination style.

Get it from, in order of trust: an OpenAPI or GraphQL schema in the repo, generated types, the backend code, an example response from the user. If the shape is a guess, say so and mark the types as provisional. Generated types beat handwritten ones; use the project's generator if it has one.

## 3. Build in layers

1. **Types** for the request and response.
2. **Request function** in the API layer: it takes typed input, returns typed output, and throws or returns errors the way the other functions do. No UI code here.
3. **Hook, composable or service** that exposes data, loading and error to the UI, with a cache key that follows the project's naming.
4. **UI states** in the component.

## 4. Handle every state

| State | What the user sees |
|---|---|
| Loading, first time | Skeleton or spinner, with a layout that does not jump when data arrives |
| Loading, refresh | Old data stays visible, with a small indicator |
| Empty | A message that says what is empty and what to do next |
| Error | What went wrong in plain words, and a retry action; the raw error goes to the error reporter, not to the user |
| Success | The data |
| Unauthorised | The project's standard redirect or message |

For writes, also handle:

- disabling the trigger while the request is running, so a double click does not send twice
- cache update or invalidation after success, so lists show the change
- optimistic updates only when the project already uses them, with rollback on failure
- a success and a failure message in the project's notification style

## 5. Care for the edges

- Cancel or ignore out-of-date responses when inputs change fast (search boxes, filters), or the UI shows the wrong result.
- Debounce input-driven requests.
- Validate data from outside at the boundary if the project uses a schema library; a wrong assumption about the response is cheaper to find there than in a render error.
- Never put secrets in frontend code or in query strings.

## 6. Verify

Run the type check and lint. Add or update a test that mocks the network in the project's way and covers success, error and empty. If the dev server and backend are available, try the real call and report the result; otherwise say that it was not run against a real backend.

## 7. Report

Files changed, the contract that was used and which parts were assumed, and the states implemented.
