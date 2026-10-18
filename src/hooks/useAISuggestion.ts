import { useRef, useState } from "react";
import type { AISuggestionStatus } from "../components/AISuggestion.types";

export type AISuggestionGenerator = (
  input: string,
  variationIndex: number,
) => Promise<string>;

type RequestOperation = "generate" | "regenerate";

export function useAISuggestion(generator: AISuggestionGenerator) {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const [status, setStatus] = useState<AISuggestionStatus>("idle");

  const [error, setError] = useState<string | null>(null);

  const [hasManualEdits, setHasManualEdits] = useState(false);

  // Internal request metadata does not need re-renders.
  const isRequestActiveRef = useRef(false);
  const sourceRef = useRef("");
  const lastOperationRef = useRef<RequestOperation>("generate");
  const variationRef = useRef(0);

  const isBusy = status === "generating" || status === "regenerating";

  async function runRequest(
    source: string,
    operation: RequestOperation,
  ): Promise<void> {
    if (isRequestActiveRef.current || !source.trim()) {
      return;
    }

    isRequestActiveRef.current = true;

    sourceRef.current = source;
    lastOperationRef.current = operation;

    if (operation === "generate") {
      variationRef.current = 0;
      setSuggestion(null);
      setHasManualEdits(false);
    }

    setError(null);
    setStatus(operation === "generate" ? "generating" : "regenerating");

    try {
      const result = await generator(source, variationRef.current);

      if (!result.trim()) {
        throw new Error("The AI returned an empty suggestion.");
      }

      setSuggestion(result);
      setHasManualEdits(false);
      variationRef.current += 1;

      setStatus("success");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.";
      setError(message);
      setStatus("error");
    } finally {
      isRequestActiveRef.current = false;
    }
  }

  function generate(source: string): void {
    if (status !== "idle") return;

    void runRequest(source, "generate");
  }

  function regenerate(): void {
    if (status !== "success" || !suggestion) return;

    void runRequest(sourceRef.current, "regenerate");
  }

  function retry(): void {
    if (status !== "error") return;

    void runRequest(sourceRef.current, lastOperationRef.current);
  }

  function keepPrevious(): void {
    if (status !== "error" || !suggestion || isRequestActiveRef.current) {
      return;
    }
    setError(null);
    setStatus("success");
  }

  function updateSuggestion(value: string): void {
    if (status !== "success" || isRequestActiveRef.current) {
      return;
    }
    if (!value.trim() || value === suggestion) return;

    setSuggestion(value);
    setHasManualEdits(true);
  }

  function clearSuggestion(): void {
    if (isRequestActiveRef.current) return;

    setSuggestion(null);
    setStatus("idle");
    setError(null);
    setHasManualEdits(false);

    sourceRef.current = "";
    variationRef.current = 0;
    lastOperationRef.current = "generate";
  }

  return {
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
  };
}
