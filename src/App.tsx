import { useState } from "react";
import { AISuggestion } from "./components/AISuggestion";
import type { AISuggestionStatus } from "./components/AISuggestion.types";

const initialDescription =
  "Nebula Drift is a sci-fi action adventure game where players explore distant planets, battle hostile enemies, and upgrade their ship.";

const demoSuggestion =
  "Nebula Drift is a fast-paced sci-fi action adventure that lets players explore mysterious planets, fight dangerous enemies, and customize their spaceship for an evolving journey across the galaxy.";

function App() {
  const [description, setDescription] = useState(initialDescription);
  const [status, setStatus] = useState<AISuggestionStatus>("success");
  const [suggestion, setSuggestion] = useState<string | null>(demoSuggestion);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#ff6a00] px-4 py-8 text-white md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-5xl rounded-[32px] bg-black px-6 py-7 shadow-2xl md:px-9 md:py-10">
        <header className="space-y-3 border-b border-white/10 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-400">
            AI UX Mini Exercise
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            AI Game Description Assistant
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
            Generate AI suggestions for your video game descriptions, review them
            safely, edit them if needed, and choose whether to apply them.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Enter your text</h2>
                <p className="text-sm text-zinc-400">
                  Provide a short game description to improve.
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl border border-orange-500 bg-transparent px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/10"
              >
                Load Sample
              </button>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="game-description"
                className="block text-sm font-medium text-white"
              >
                Game Description
              </label>

              <textarea
                id="game-description"
                rows={12}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full resize-y rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm leading-6 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
                placeholder="Describe your game..."
              />
            </div>

            <button
              type="button"
              className="rounded-xl border border-orange-500 bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
            >
              Generate AI Suggestion
            </button>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setSuggestion(null);
                  setError(null);
                }}
                className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-white"
              >
                Idle
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus("generating");
                  setSuggestion(null);
                  setError(null);
                }}
                className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-white"
              >
                Loading
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus("success");
                  setSuggestion(demoSuggestion);
                  setError(null);
                }}
                className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-white"
              >
                Success
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus("error");
                  setError("The request timed out. Please try again.");
                }}
                className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-white"
              >
                Error
              </button>
            </div>
          </section>

          <AISuggestion
            suggestion={suggestion}
            status={status}
            error={error}
            onAccept={() => {
              if (!suggestion) return;
              setDescription(suggestion);
            }}
            onReject={() => {
              setSuggestion(null);
              setStatus("idle");
              setError(null);
            }}
            onRegenerate={() => {
              setSuggestion(
                "Nebula Drift delivers an exciting interstellar adventure where players discover alien worlds, take on high-stakes combat encounters, and upgrade their ship to survive the unknown."
              );
              setStatus("success");
            }}
            onRetry={() => {
              setStatus("success");
              setSuggestion(demoSuggestion);
              setError(null);
            }}
            onSaveEdit={(value) => {
              setSuggestion(value);
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default App;