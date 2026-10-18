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
  "rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40";

const secondaryButton =
  "rounded-lg border border-white/15 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

const accentButton =
  "rounded-lg border border-orange-500/40 px-4 py-2.5 text-sm font-medium text-orange-300 transition hover:bg-orange-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

function getStatusLabel(status: AISuggestionStatus): string {
  switch (status) {
    case "idle":
      return "Idle";
    case "generating":
      return "Generating";
    case "regenerating":
      return "Regenerating";
    case "success":
      return "Ready";
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

  const draft = editSession?.text ?? "";

  const showPreview =
    suggestion !== null &&
    (status === "success" || status === "regenerating" || status === "error") &&
    !isEditing;

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
      ? "Generating suggestion."
      : status === "regenerating"
        ? "Regenerating. Previous suggestion preserved."
        : status === "success"
          ? hasManualEdits
            ? "Edited suggestion saved."
            : "Suggestion ready for review."
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
      className="min-w-0 space-y-4 rounded-xl border border-white/10 bg-black p-4"
    >

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={headingId} className="text-base font-semibold text-white">
          AI Suggestion
        </h2>

        <div
          ref={statusFocusRef}
          tabIndex={-1}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-[10px] text-zinc-300 outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-orange-400"
          />

          {getStatusLabel(status)}
        </div>
      </div>


      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>


      <div
        aria-busy={isBusy}
        className="min-h-[160px] rounded-xl border border-white/10 bg-zinc-900/80 p-3.5"
      >
        {/* Idle */}
        {status === "idle" && (
          <div className="flex min-h-[130px] items-center justify-center text-center">
            <p className="text-xs text-zinc-400">
              Generate to see a suggestion.
            </p>
          </div>
        )}


        {isBusy && (
          <div className="flex flex-col items-center justify-center gap-3 py-5 text-center">
            <div
              aria-hidden="true"
              className="size-7 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-400 motion-reduce:animate-none"
            />

            <p className="text-xs text-zinc-300">
              {status === "generating"
                ? "Generating suggestion..."
                : "Generating another variation..."}
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div
            role="alert"
            className="space-y-1.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3"
          >
            <p className="text-xs font-semibold text-red-300">
              {suggestion ? "Regeneration failed" : "Generation failed"}
            </p>

            <p className="text-[11px] leading-5 text-zinc-300">
              {error ?? "Please try again."}
            </p>
          </div>
        )}

        {/* Editing */}
        {isEditing && (
          <div className="space-y-3">
            <label
              htmlFor={editId}
              className="block text-xs font-medium text-zinc-200"
            >
              Edit suggestion
            </label>

            <textarea
              ref={editorRef}
              id={editId}
              rows={6}
              value={draft}
              onChange={(event) => {
                const value = event.target.value;

                setEditSession((current) =>
                  current ? { ...current, text: value } : null,
                );
              }}
              className="w-full resize-y rounded-lg border border-white/15 bg-black/50 p-3 text-xs leading-6 text-zinc-100 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 sm:text-[13px]"
            />

            <div className="flex flex-wrap gap-2">
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


        {showPreview && (
          <div className="space-y-3">
            {status !== "success" && (
              <p className="text-[11px] text-zinc-400">Previous suggestion</p>
            )}

            <p className="whitespace-pre-wrap break-words text-xs leading-6 text-zinc-200 sm:text-[13px]">
              {suggestion}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {status === "success" && suggestion !== null && !isEditing && (
        <div className="space-y-2.5">
          {hasManualEdits && (
            <p className="text-[11px] text-zinc-400">
              Regenerating replaces saved edits.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
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
              Apply
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
        <div className="flex flex-wrap gap-2">
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
            {suggestion ? "Reject" : "Dismiss"}
          </button>
        </div>
      )}
    </section>
  );
}
