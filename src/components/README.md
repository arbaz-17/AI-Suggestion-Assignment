# AISuggestion Component

## Overview

`AISuggestion` is a reusable React + TypeScript component for reviewing AI-generated text **before** it changes application content.

## Files

- `AISuggestion.tsx` — UI, temporary edit draft, actions, and focus handling.
- `AISuggestion.types.ts` — component props and generation status type.

## Responsibilities

- Show idle, generating, regenerating, success, and error states.
- Preview a proposal without applying it automatically.
- Let users edit and save or cancel a temporary draft.
- Offer Apply, Reject, Regenerate, Retry, and Keep Previous actions when relevant.
- Preserve access to an earlier proposal when regeneration fails.
- Communicate status changes and manage keyboard focus.

## Component API

| Prop | Type | Purpose |
|---|---|---|
| `suggestion` | `string \| null` | Current proposed text |
| `status` | `AISuggestionStatus` | Current request/UI status |
| `error` | `string \| null` | Error message, if any |
| `hasManualEdits` | `boolean` | Indicates saved edits |
| `onAccept` | `() => void` | Apply the proposal in the parent |
| `onReject` | `() => void` | Discard the proposal |
| `onRegenerate` | `() => void` | Request a new variation |
| `onRetry` | `() => void` | Repeat a failed request |
| `onKeepPrevious` | `() => void` | Restore the previous proposal after a failed regeneration |
| `onSaveEdit` | `(value: string) => void` | Save edited proposal text |

## Basic Flow

1. The parent requests generation; the component shows loading feedback.
2. On success, the component previews the proposed text.
3. The user can edit, apply, reject, or regenerate the proposal.
4. On failure, the user can retry; after a failed regeneration, they can also keep the previous proposal.
5. **Only the parent** updates committed content when `onAccept` is called.

## State Ownership

- **Parent / `useAISuggestion`:** proposal, generation status, error, saved-edit flag, and request actions.
- **Component:** temporary edit text and editing/focus UI state.
