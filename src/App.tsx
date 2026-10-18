
import { useRef, useState } from "react";

import { AISuggestion } from "./components/AISuggestion";
import { useAISuggestion } from "./hooks/useAISuggestion";
import { generateMockSuggestion } from "./lib/mockAI";

const initialDescription =
  "Nebula Drift is a sci-fi action adventure game where players explore distant planets, battle hostile enemies, and upgrade their ship.";

function App() {
  const [description, setDescription] =
    useState(initialDescription);

  const [failNextRequest, setFailNextRequest] =
    useState(false);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const generateWithMock = (
    input: string,
    variationIndex: number,
  ): Promise<string> => {
    const shouldFail = failNextRequest;

    if (shouldFail) {
      setFailNextRequest(false);
    }

    return generateMockSuggestion(
      input,
      variationIndex,
      shouldFail,
    );
  };

  const {
    suggestion,
    status,
    error,
    isBusy,
    hasManualEdits,
    generate,
    regenerate,
    retry,
    keepPrevious,
    updateSuggestion,
    clearSuggestion,
  } = useAISuggestion(generateWithMock);

  const isReviewActive = status !== "idle";

  const handleGenerate = () => {
    if (isReviewActive || !description.trim()) return;

    setFeedback(null);
    generate(description);
  };

  const handleAccept = () => {
    if (status !== "success" || !suggestion) return;

    setDescription(suggestion);
    clearSuggestion();

    setFeedback(
      "Suggestion applied to your game description.",
    );

    // Return focus to the updated original content.
    descriptionRef.current?.focus();
  };

  const handleReject = () => {
    clearSuggestion();

    setFeedback(
      "Suggestion discarded. Your original description was preserved.",
    );

    // The action button disappears; restore useful focus.
    descriptionRef.current?.focus();
  };

  const handleLoadSample = () => {
    if (isReviewActive) return;

    setDescription(initialDescription);
    setFeedback(null);
  };

  return (
    <main className="min-h-screen bg-[#ff6a00] px-4 py-8 text-white md:px-6 md:py-12">
      <div className="mx-auto w-full max-w-6xl rounded-[28px] border border-white/10 bg-[#09090b] px-5 py-7 shadow-2xl sm:px-7 md:px-9 md:py-10">
        {/* Header */}
        <header className="space-y-3 border-b border-white/10 pb-7">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            OptimusFox · AI UX Exercise
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            AI Game Description Assistant
          </h1>

          <p className="max-w-3xl text-sm leading-6 text-zinc-300 md:text-base">
            Improve video game descriptions using AI-generated
            suggestions. Preview, edit, and decide what
            gets applied.
          </p>
        </header>

        {/* Responsive two-column layout */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          {/* Original content */}
          <section
            aria-labelledby="description-heading"
            className="min-w-0 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2
                  id="description-heading"
                  className="text-xl font-semibold"
                >
                  Your Game Description
                </h2>

                <p className="text-sm text-zinc-400">
                  Enter a description or load our sample.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isReviewActive}
                className="rounded-xl border border-orange-500/70 bg-transparent px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Load Sample
              </button>
            </div>

            {/* Original description */}
            <div className="space-y-2">
              <label
                htmlFor="game-description"
                className="block text-sm font-medium"
              >
                Game Description
              </label>

              <textarea
                ref={descriptionRef}
                id="game-description"
                rows={12}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setFeedback(null);
                }}
                readOnly={isReviewActive}
                aria-describedby="description-help"
                placeholder="Describe your video game..."
                className="w-full resize-y rounded-2xl border border-white/20 bg-zinc-900 p-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 read-only:opacity-75"
              />

              <p
                id="description-help"
                className="text-xs leading-5 text-zinc-400"
              >
                {isReviewActive
                  ? "Finish reviewing or dismiss the suggestion before editing your original description."
                  : "Your content only changes when you explicitly apply a suggestion."}
              </p>
            </div>

            {/* Generate action */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!description.trim()}
              aria-disabled={isReviewActive}
              className="rounded-xl border border-orange-500 bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              Generate AI Suggestion
            </button>

            {/* Deterministic error testing */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/70 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={failNextRequest}
                  onChange={(event) =>
                    setFailNextRequest(event.target.checked)
                  }
                  disabled={isBusy}
                  className="mt-1 size-4 accent-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                />

                <span className="space-y-1">
                  <span className="block text-sm font-medium text-white">
                    Fail next AI request
                  </span>

                  <span className="block text-xs leading-5 text-zinc-300">
                    Simulate an error to demonstrate Retry
                    and regeneration recovery.
                  </span>
                </span>
              </label>
            </div>

            {/* Feedback after accepting or rejecting */}
            {feedback && (
              <p
                role="status"
                className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm leading-6 text-orange-200"
              >
                {feedback}
              </p>
            )}
          </section>

          {/* Reusable AI Suggestion component */}
          <AISuggestion
            suggestion={suggestion}
            status={status}
            error={error}
            hasManualEdits={hasManualEdits}
            onAccept={handleAccept}
            onReject={handleReject}
            onRegenerate={regenerate}
            onRetry={retry}
            onKeepPrevious={keepPrevious}
            onSaveEdit={updateSuggestion}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-zinc-400">
          Mock AI Demo · Human-Controlled Suggestions ·
          React + TypeScript
        </footer>
      </div>
    </main>
  );
}

export default App;
