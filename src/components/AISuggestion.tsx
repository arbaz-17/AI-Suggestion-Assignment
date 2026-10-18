
import { useState } from "react";
import type {
  AISuggestionProps,
  AISuggestionStatus,
} from "./AISuggestion.types";

function getStatusLabel(status: AISuggestionStatus): string {
  switch (status) {
    case "idle":
      return "Idle";
    case "generating":
      return "Generating";
    case "regenerating":
      return "Regenerating";
    case "success":
      return "Ready for review";
    case "error":
      return "Error";
  }
}

export function AISuggestion({
  suggestion,
  status,
  error,
  onAccept,
  onReject,
  onRegenerate,
  onRetry,
  onSaveEdit,
}: AISuggestionProps) {
  // Local state is only used for temporary edits.
  // null means the component is not in editing mode.
  const [draft, setDraft] = useState<string | null>(null);

  // Derived state - no effects required.
  const isEditing = draft !== null;
  const isBusy =
    status === "generating" || status === "regenerating";

  const hasSuggestion = Boolean(suggestion);
  const statusLabel = getStatusLabel(status);

  // Editing handlers
  const handleStartEdit = () => {
    if (!suggestion || status !== "success") return;

    setDraft(suggestion);
  };

  const handleCancelEdit = () => {
    setDraft(null);
  };

  const handleSaveEdit = () => {
    if (draft === null) return;

    const trimmed = draft.trim();

    if (!trimmed) return;

    onSaveEdit(trimmed);
    setDraft(null);
  };

  return (
    <section
      aria-labelledby="ai-suggestion-heading"
      className="space-y-5 rounded-[28px] border border-white/10 bg-black p-6 text-white shadow-2xl md:p-7"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
            AI Review Panel
          </p>

          <h2
            id="ai-suggestion-heading"
            className="text-2xl font-bold tracking-tight"
          >
            AI Suggestion
          </h2>

          <p className="max-w-2xl text-sm leading-6 text-zinc-400">
            Review the AI-generated suggestion before applying it.
            You can edit, accept, reject, or regenerate it.
          </p>
        </div>

        {/* Status indicator */}
        <div
          role="status"
          aria-live="polite"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-200"
        >
          <span
            className="h-2.5 w-2.5 rounded-full bg-orange-400"
            aria-hidden="true"
          />

          <span>
            Status:{" "}
            <span className="font-semibold text-white">
              {statusLabel}
            </span>
          </span>
        </div>
      </div>

      {/* Suggestion content */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-white">
          Suggested Content
        </h3>

        <div className="min-h-[260px] rounded-2xl border border-white/10 bg-zinc-900/80 p-4">
          {/* Idle state */}
          {status === "idle" && (
            <div className="flex min-h-[228px] items-center justify-center text-center">
              <p className="max-w-sm text-sm italic leading-6 text-zinc-500">
                Your AI suggestion will appear here once you
                generate it.
              </p>
            </div>
          )}

          {/* Loading / Regenerating state */}
          {isBusy && (
            <div
              role="status"
              className="flex min-h-[228px] flex-col items-center justify-center gap-3 text-center"
            >
              <div
                className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-400"
                aria-hidden="true"
              />

              <div className="space-y-1">
                <p className="text-base font-semibold text-white">
                  {status === "generating"
                    ? "Generating suggestion..."
                    : "Generating a new variation..."}
                </p>

                <p className="text-sm text-zinc-400">
                  Please wait while the AI prepares a suggestion.
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div
              role="alert"
              className="flex min-h-[228px] flex-col items-center justify-center gap-3 text-center"
            >
              <div className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
                Generation Failed
              </div>

              <div className="space-y-1">
                <p className="text-base font-semibold text-white">
                  We couldn't generate a suggestion.
                </p>

                <p className="text-sm text-zinc-400">
                  {error ??
                    "Something went wrong. Please try again."}
                </p>
              </div>
            </div>
          )}

          {/* Successful suggestion preview */}
          {status === "success" &&
            hasSuggestion &&
            !isEditing && (
              <div className="space-y-3">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-xs font-medium text-orange-300">
                  Preview only — this suggestion has not been
                  applied yet.
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-100">
                    {suggestion}
                  </p>
                </div>
              </div>
            )}

          {/* Editing state */}
          {status === "success" &&
            hasSuggestion &&
            isEditing && (
              <div className="space-y-4">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-xs font-medium text-orange-300">
                  Editing suggestion — save changes to keep
                  this version.
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ai-suggestion-edit"
                    className="block text-sm font-medium text-white"
                  >
                    Edit Suggestion
                  </label>

                  <textarea
                    id="ai-suggestion-edit"
                    rows={8}
                    value={draft ?? ""}
                    onChange={(event) =>
                      setDraft(event.target.value)
                    }
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={!draft?.trim()}
                    className="rounded-xl border border-orange-500 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Edit
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {status === "success" &&
          hasSuggestion &&
          !isEditing && (
            <>
              <button
                type="button"
                onClick={handleStartEdit}
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-zinc-800"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={onAccept}
                className="rounded-xl border border-orange-500 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
              >
                Apply Suggestion
              </button>

              <button
                type="button"
                onClick={onReject}
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-zinc-800"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={onRegenerate}
                className="rounded-xl border border-orange-500/40 bg-transparent px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:border-orange-400 hover:bg-orange-500/10"
              >
                Regenerate
              </button>
            </>
          )}

        {/* Retry button appears only after failure */}
        {status === "error" && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl border border-orange-500 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
          >
            Retry
          </button>
        )}
      </div>
    </section>
  );
}
