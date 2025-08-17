import React, { useState } from "react";
import type { FlashcardResponse } from "../../types";

interface EditFlashcardModalProps {
  flashcard: FlashcardResponse | null;
  open: boolean;
  onSave: (payload: { question: string; answer: string }) => void;
  onClose: () => void;
}

export default function EditFlashcardModal({ flashcard, open, onSave, onClose }: EditFlashcardModalProps) {
  const [question, setQuestion] = useState(flashcard?.question ?? "");
  const [answer, setAnswer] = useState(flashcard?.answer ?? "");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = () => {
    if (question.length > 200) {
      setError("Pytanie nie może mieć więcej niż 200 znaków.");
      return;
    }
    if (answer.length > 500) {
      setError("Odpowiedź nie może mieć więcej niż 500 znaków.");
      return;
    }
    setError(null);
    onSave({ question, answer });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edytuj fiszkę</h2>
        <label htmlFor="edit-question" className="block mb-2">
          Pytanie:
        </label>
        <input
          id="edit-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={200}
          className="w-full border rounded px-2 py-1 mb-2"
        />
        <label htmlFor="edit-answer" className="block mb-2">
          Odpowiedź:
        </label>
        <textarea
          id="edit-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          maxLength={500}
          className="w-full border rounded px-2 py-1 mb-2"
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Anuluj
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
}
