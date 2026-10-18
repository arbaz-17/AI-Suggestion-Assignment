import { useEffect, useId, useRef, useState } from "react";
import type {
  AISuggestionProps,
  AISuggestionStatus,
} from "./AISuggestion.types";

type EditSession = {
  original: string;
  text: string;
};

const primaryButton =
  "rounded-xl border border-orange-500 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "rounded-xl border border-white/20 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

const accentButton =
  "rounded-xl border border-orange-500/50 bg-transparent px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:border-orange-400 hover:bg-orange-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

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
  hasManualEdits,
  onAccept,
  onReject,
  onRegenerate,
  onRetry,
  onKeepPrevious,
  onSaveEdit,
}: AISuggestionProps) {
  const id = useId();
  const headingId = `${id}-heading`;
  const editId = `${id}-edit`;
  const editHelpId = `${id}-edit-help`;

  const [editSession, setEditSession] = useState<EditSession | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const statusFocusRef = useRef<HTMLDivElement>(null);
  const restoreEditFocusRef = useRef(false);

  const isBusy = status === "generating" || status === "regenerating";

  const isEditing =
    status === "success" &&
    suggestion !== null &&
    editSession !== null &&
    editSession.original === suggestion;

  const draft = isEditing ? editSession.text : "";

  const showPreview =
    suggestion !== null &&
    (status === "success" || status === "regenerating" || status === "error") &&
    !isEditing;

  // Focus management is an appropriate use of an effect:
  // it synchronizes React UI state with the DOM.
  useEffect(() => {
    if (isEditing) {
      editorRef.current?.focus();
      return;
    }

    if (restoreEditFocusRef.current && status === "success") {
      editButtonRef.current?.focus();
      restoreEditFocusRef.current = false;
    }
  }, [isEditing, status, suggestion]);

  const announcement =
    status === "generating"
      ? "Generating an AI suggestion."
      : status === "regenerating"
        ? "Generating another variation. Your previous suggestion is preserved."
        : status === "success"
          ? hasManualEdits
            ? "Edited suggestion saved and ready for review."
            : "AI suggestion ready for review."
          : "";

  const handleStartEdit = () => {
    if (status !== "success" || !suggestion) return;

    setEditSession({
      original: suggestion,
      text: suggestion,
    });
  };

  const handleCancelEdit = () => {
    restoreEditFocusRef.current = true;
    setEditSession(null);
  };

  const handleSaveEdit = () => {
    if (!isEditing || !draft.trim()) return;

    restoreEditFocusRef.current = true;
    onSaveEdit(draft);
    setEditSession(null);
  };

  const handleAccept = () => {
    setEditSession(null);
    onAccept();
  };

  const handleReject = () => {
    setEditSession(null);
    onReject();
  };

  const handleRegenerate = () => {
    if (isEditing || status !== "success") return;

    // The clicked action will disappear during loading.
    // Move focus to an element that remains mounted.
    statusFocusRef.current?.focus();

    setEditSession(null);
    onRegenerate();
  };

  const handleRetry = () => {
    statusFocusRef.current?.focus();
    onRetry();
  };

  const handleKeepPrevious = () => {
    restoreEditFocusRef.current = true;
    setEditSession(null);
    onKeepPrevious();
  };

  return (
    <section
      aria-labelledby={headingId}
      className="min-w-0 space-y-5 rounded-2xl border border-white/10 bg-black p-5 text-white shadow-xl md:p-6"
    >
      {/* Header */}
      <header className="space-y-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            AI Review Panel
          </p>

          <h2 id={headingId} className="text-xl font-bold tracking-tight">
            AI Suggestion
          </h2>

          <p className="text-sm leading-6 text-zinc-400">
            Review the suggestion before applying it. Your original content
            remains protected.
          </p>
        </div>

        {/* Stable focus destination for async actions */}
        <div
          ref={statusFocusRef}
          tabIndex={-1}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-orange-400"
          />

          <span>
            Status:{" "}
            <strong className="text-white">{getStatusLabel(status)}</strong>
          </span>
        </div>
      </header>

      {/* Single live region for generation updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Suggestion content */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Suggested Content</h3>

        <div
          aria-busy={isBusy}
          className="min-h-[260px] space-y-4 rounded-2xl border border-white/10 bg-zinc-900 p-4"
        >
          {/* Idle */}
          {status === "idle" && (
            <div className="flex min-h-[228px] items-center justify-center text-center">
              <p className="max-w-xs text-sm italic leading-6 text-zinc-400">
                Your AI suggestion will appear here after generation.
              </p>
            </div>
          )}

          {/* Loading */}
          {isBusy && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div
                aria-hidden="true"
                className="size-9 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-400 motion-reduce:animate-none"
              />

              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {status === "generating"
                    ? "Generating suggestion..."
                    : "Generating a new variation..."}
                </p>

                <p className="text-xs leading-5 text-zinc-400">
                  {status === "regenerating"
                    ? "Your previous suggestion is preserved."
                    : "Please wait while the mock AI responds."}
                </p>
              </div>
            </div>
          )}

          {/* Error: role alert announces the failure */}
          {status === "error" && (
            <div
              role="alert"
              className="space-y-2 rounded-xl border border-red-500/40 bg-red-500/10 p-4"
            >
              <p className="text-sm font-semibold text-red-300">
                {suggestion
                  ? "Couldn't regenerate the suggestion."
                  : "Couldn't generate a suggestion."}
              </p>

              <p className="text-sm leading-6 text-zinc-200">
                {error ?? "Something went wrong. Please try again."}
              </p>
            </div>
          )}

          {/* Editing */}
          {isEditing && (
            <div className="space-y-4">
              <p
                id={editHelpId}
                className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-3 py-2 text-xs leading-5 text-orange-300"
              >
                You are editing the proposed suggestion, not your original
                description.
              </p>

              <div className="space-y-2">
                <label htmlFor={editId} className="block text-sm font-medium">
                  Edit Suggestion
                </label>

                <textarea
                  ref={editorRef}
                  id={editId}
                  aria-describedby={editHelpId}
                  rows={8}
                  value={draft}
                  onChange={(event) => {
                    const value = event.target.value;

                    setEditSession((current) =>
                      current ? { ...current, text: value } : null,
                    );
                  }}
                  className="w-full resize-y rounded-xl border border-white/20 bg-black/40 p-4 text-sm leading-6 text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!draft.trim()}
                  className={primaryButton}
                >
                  Save Edit
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {showPreview && (
            <div className="space-y-3">
              <p className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-3 py-2 text-xs leading-5 text-orange-300">
                {status === "regenerating"
                  ? "Previous suggestion — waiting for a new variation."
                  : status === "error"
                    ? "Your previous suggestion is still available."
                    : "Preview only — this suggestion has not been applied."}
              </p>

              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-100">
                  {suggestion}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success actions */}
      {status === "success" && suggestion !== null && !isEditing && (
        <div className="space-y-3">
          {hasManualEdits && (
            <p className="text-xs leading-5 text-orange-300">
              This suggestion contains saved edits. Regenerating will replace
              them.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              ref={editButtonRef}
              type="button"
              onClick={handleStartEdit}
              className={secondaryButton}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleAccept}
              className={primaryButton}
            >
              Apply Suggestion
            </button>

            <button
              type="button"
              onClick={handleReject}
              className={secondaryButton}
            >
              Reject
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              className={accentButton}
            >
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Error recovery */}
      {status === "error" && (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleRetry} className={primaryButton}>
            Retry
          </button>

          {suggestion !== null && (
            <button
              type="button"
              onClick={handleKeepPrevious}
              className={accentButton}
            >
              Keep Previous
            </button>
          )}

          <button
            type="button"
            onClick={handleReject}
            className={secondaryButton}
          >
            {suggestion !== null ? "Reject Previous" : "Dismiss"}
          </button>
        </div>
      )}
    </section>
  );
}
