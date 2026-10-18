# AI Suggestion — Week 12 Assignment

## Overview

A React + TypeScript exercise exploring **human-centered AI UX patterns**. The application demonstrates how users can review, edit, and control AI-generated suggestions before applying them to their content.

## What Was Created

- **Reusable `AISuggestion` component** with preview, editing, apply, reject, regenerate, loading, error, and recovery states.
- **`useAISuggestion` hook** to manage suggestion state and asynchronous request actions separately from the UI.
- **Mock AI service** with sample GTA VI descriptions, simulated latency, and predictable failures for testing.

## Project Structure

```text
src/
├── components/
│       ├── AISuggestion.tsx
│       ├── AISuggestion.types.ts
│       └── README.md
├── hooks/
│   ├── useAISuggestion.ts
│   └── README.md
├── lib/
│   ├── mockAI.ts
│   └── README.md
├── App.tsx
├── index.css
└── main.tsx
```

## Module Responsibility

| Module | Responsibility |
|---|---|
| `App.tsx` | Demo layout, original content, and acceptance of suggestions. |
| [`components/`](src/components/README.md) | Reusable suggestion UI, editing, actions, and accessible feedback. |
| [`hooks/`](src/hooks/README.md) | Generation lifecycle, proposal state, retries, and recovery. |
| [`lib/`](src/lib/README.md) | Predefined mock responses, request delay, and simulated errors. |

## Demo

[AI Suggestion Demo](https://arbaz-17.github.io/AI-Suggestion-Assignment/)