import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onCancel,
  onDelete,
}: ShortcutHandlers) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // Sprawdź, czy nie jesteśmy w polu tekstowym
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + S = Zapisz
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "s" &&
        onSave
      ) {
        event.preventDefault();
        onSave();
      }

      // Escape = Anuluj
      if (event.key === "Escape" && onCancel) {
        event.preventDefault();
        onCancel();
      }

      // Ctrl/Cmd + Delete = Usuń
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "Delete" &&
        onDelete
      ) {
        event.preventDefault();
        onDelete();
      }
    },
    [onSave, onCancel, onDelete]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
}
