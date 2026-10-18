# useAISuggestion Hook

## Overview

`useAISuggestion` is a reusable React hook that manages the lifecycle of AI text proposal.

## File

- `useAISuggestion.ts` — request handling, proposal state, editing updates, and recovery actions.

## Responsibilities

- Generate suggestions asynchronously through an injected generator function.
- Track loading, success, and error states.
- Preserve the existing proposal while regenerating.
- Prevent duplicate requests and retain the original request context.
- Support saving edits, rejecting a proposal, and recovering from failures.

## Hook API

```ts
useAISuggestion(generator)
```

| Returned value | Purpose |
|---|---|
| `suggestion`, `status`, `error` | Current proposal and request state |
| `isBusy`, `hasManualEdits` | Derived loading flag and saved-edit indicator |
| `generate(source)` | Start an initial request from idle |
| `regenerate()` | Request another variation after success |
| `retry()` | Repeat the failed operation |
| `keepPrevious()` | Restore a proposal after failed regeneration |
| `updateSuggestion(value)` | Save edits to the pending proposal |
| `clearSuggestion()` | Discard the proposal and reset the lifecycle |

## State Ownership

- **React state:** suggestion, status, error, and saved-edit flag.
- **Refs:** request-in-progress guard, original request input, last operation, and variation index.
- **Parent (`App.tsx`):** the actual committed description; the hook never applies proposals to it.
- **Component:** temporary, unsaved text edits and focus handling.

## Basic Flow

1. `generate(source)` sets loading and requests the first proposal.
2. Success stores the proposal; the user can review or edit it.
3. `regenerate()` requests another variation without immediately deleting the previous proposal.
4. Failure exposes an error and enables `retry()`; failed regeneration also allows `keepPrevious()`.
5. The parent applies the proposal only after the user explicitly chooses **Apply**.

## Retry vs Regenerate

- **Retry:** repeats the failed request with the same source and variation index.
- **Regenerate:** starts a new variation after a successful request.

