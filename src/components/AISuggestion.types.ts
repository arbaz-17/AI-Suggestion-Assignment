
export type AISuggestionStatus =
  | "idle"
  | "generating"
  | "regenerating"
  | "success"
  | "error";

export interface AISuggestionProps {
  suggestion: string | null;
  status: AISuggestionStatus;
  error: string | null;
  hasManualEdits: boolean;

  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  onRetry: () => void;
  onKeepPrevious: () => void;
  onSaveEdit: (value: string) => void;
}
