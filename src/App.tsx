import { useRef, useState } from "react";

import { AISuggestion } from "./components/AISuggestion";
import { useAISuggestion } from "./hooks/useAISuggestion";
import { generateMockSuggestion } from "./lib/mockAI";

const initialDescription =
  "Grand Theft Auto VI is an open-world action-adventure game set in Vice City and the state of Leonida. Players explore a vast world and experience a crime-driven story.";

function App() {
  const [description, setDescription] = useState(initialDescription);

  const [failNextRequest, setFailNextRequest] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const generateWithMock = (
    input: string,
    variationIndex: number,
  ): Promise<string> => {
    const shouldFail = failNextRequest;

    if (shouldFail) {
      setFailNextRequest(false);
    }

    return generateMockSuggestion(input, variationIndex, shouldFail);
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
    setFeedback("Suggestion applied successfully.");

    descriptionRef.current?.focus();
  };

  const handleReject = () => {
    clearSuggestion();
    setFeedback("Suggestion discarded.");

    descriptionRef.current?.focus();
  };

  const handleLoadSample = () => {
    if (isReviewActive) return;

    setDescription(initialDescription);
    setFeedback(null);
  };

  return (
    <main className="min-h-screen bg-[#ff6a00] px-3 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0b0b0d] p-5 shadow-2xl sm:p-7">

        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400">
              AI Suggestion Assignment - Optimus Fox
            </p>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Game Description Assistant
            </h1>
          </div>

          <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-medium text-orange-300">
            Mock AI
          </span>
        </header>


        <div className="grid items-start gap-5 md:grid-cols-2">

          <section
            aria-labelledby="description-heading"
            className="min-w-0 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 id="description-heading" className="text-base font-semibold">
                Your Description
              </h2>

              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isReviewActive}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-medium text-zinc-300 transition hover:border-orange-500/50 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Load Sample
              </button>
            </div>

            <textarea
              ref={descriptionRef}
              id="game-description"
              aria-labelledby="description-heading"
              rows={8}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setFeedback(null);
              }}
              readOnly={isReviewActive}
              placeholder="Describe your game..."
              className="w-full resize-y rounded-xl border border-white/15 bg-zinc-900 p-3.5 text-xs leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 read-only:opacity-75 text-base"
            />

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!description.trim()}
              aria-disabled={isReviewActive}
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            >
              Generate Suggestion
            </button>

            <label className="flex w-fit cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={failNextRequest}
                onChange={(event) => setFailNextRequest(event.target.checked)}
                disabled={isBusy}
                className="size-3.5 accent-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              />

              <span className="text-[11px] text-zinc-400">
                Fail Request Demo
              </span>
            </label>

            {feedback && (
              <p
                role="status"
                className="rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-2 text-xs text-orange-200"
              >
                {feedback}
              </p>
            )}
          </section>

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
      </div>
    </main>
  );
}

export default App;
