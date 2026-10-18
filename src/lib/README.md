# Mock AI Service

## Overview

`mockAI.ts` simulates asynchronous AI text generation for the Game Description Assistant. It provides predictable responses for demonstrating the UI.

## File

- `mockAI.ts` — predefined suggestions, simulated latency, and controlled failures.

## API

```ts
// Returns a mock suggestion or rejects with an error.
generateMockSuggestion(
  input: string,
  variationIndex: number,
  shouldFail?: boolean,
): Promise<string>
```

| Parameter | Purpose |
|---|---|
| `input` | Source game description; must not be blank. |
| `variationIndex` | Selects the response variation (cycles through three). |
| `shouldFail` | When `true`, simulates a failed request; defaults to `false`. |

## Mock Behavior

1. Rejects blank input with a validation error.
2. Waits **1,200 ms** using `setTimeout` to simulate network latency.
3. Throws a controlled error if `shouldFail` is `true`.
4. Returns one of **three predefined GTA VI descriptions** when the input mentions `Grand Theft Auto VI`, `GTA VI`, or `GTA 6` (case-insensitive).
5. For other games, appends one of three generic promotional endings to the supplied text.

## Error Simulation

The **Fail Request Demo** checkbox lives in `App.tsx`. The page passes its current value to `generateMockSuggestion` through a wrapper and resets the checkbox after consuming it. This makes loading, error, and Retry flows reproducible without random failures.

## Integration

`App.tsx` wraps the mock function and passes the wrapper into `useAISuggestion(generator)`. The hook manages request state, Retry, Regenerate, and variation indexes; this file only produces responses or errors.