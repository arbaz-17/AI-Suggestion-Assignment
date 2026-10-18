
import { useState } from "react";

const initialDescription =
  "Nebula Drift is a space adventure game where players explore planets, fight enemies, and upgrade their ships.";

function App() {
  const [description, setDescription] =
    useState(initialDescription);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <header className="space-y-3">
          <span className="text-sm font-medium text-violet-400">
            AI UX Mini Exercise
          </span>

          <h1 className="text-3xl font-bold tracking-tight">
            AI Game Description Assistant
          </h1>

          <p className="text-sm leading-6 text-slate-400">
            Improve your game descriptions with AI suggestions.
            Preview, edit, and decide what gets applied.
          </p>
        </header>

        <section
          aria-labelledby="description-heading"
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="space-y-1">
            <h2
              id="description-heading"
              className="text-lg font-semibold"
            >
              Your Game Description
            </h2>

            <p className="text-sm text-slate-400">
              Describe your game before requesting an improvement.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="game-description"
              className="block text-sm font-medium"
            >
              Game Description
            </label>

            <textarea
              id="game-description"
              rows={5}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm leading-6 text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-400/30"
              placeholder="Describe your video game..."
            />
          </div>

          <button
            type="button"
            disabled
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate AI Suggestion
          </button>
        </section>

        <section
          aria-labelledby="suggestion-heading"
          className="space-y-4 rounded-xl border border-dashed border-slate-700 p-6"
        >
          <h2
            id="suggestion-heading"
            className="text-lg font-semibold"
          >
            AI Suggestion
          </h2>

          <p className="text-sm text-slate-400">
            Your AI-generated suggestion will appear here.
          </p>
        </section>

        <p className="text-center text-xs text-slate-500">
          Mock AI demo · All changes require your approval
        </p>
      </div>
    </main>
  );
}

export default App;
