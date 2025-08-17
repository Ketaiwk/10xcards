import React from "react";

interface AddFlashcardButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export default function AddFlashcardButton({ disabled, onClick }: AddFlashcardButtonProps) {
  return (
    <button
      type="button"
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      onClick={onClick}
      disabled={disabled}
      aria-label="Dodaj nową fiszkę"
    >
      + Dodaj fiszkę
    </button>
  );
}
