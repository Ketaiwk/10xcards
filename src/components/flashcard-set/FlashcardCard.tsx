import React, { useState } from "react";
import FlashcardTypeBadge from "./FlashcardTypeBadge";
import type { FlashcardResponse } from "../../types";

interface FlashcardCardProps {
  flashcard: FlashcardResponse & { isEditing?: boolean; validationErrors?: { question?: string; answer?: string } };
  onEdit: (id: string, payload: { question: string; answer: string; creation_type?: string }) => void;
  onDelete: (id: string) => void;
  onEditStateChange: (id: string, isEditing: boolean) => void;
}

export default function FlashcardCard({ flashcard, onEdit, onDelete, onEditStateChange }: FlashcardCardProps) {
  const [question, setQuestion] = useState(flashcard.question);
  const [answer, setAnswer] = useState(flashcard.answer);
  const [error, setError] = useState<{ question?: string; answer?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    onEditStateChange(flashcard.id, true);
  };

  const handleCancel = () => {
    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);
    setError({});
    onEdit(flashcard.id, { question: flashcard.question, answer: flashcard.answer });
    onEditStateChange(flashcard.id, false);
  };

  const handleSave = async () => {
    const errors: { question?: string; answer?: string } = {};
    if (question.length > 200) errors.question = "Pytanie nie może mieć więcej niż 200 znaków.";
    if (answer.length > 500) errors.answer = "Odpowiedź nie może mieć więcej niż 500 znaków.";
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    setError({});
    setIsSaving(true);
    const payload: { question: string; answer: string; creation_type?: string } = { question, answer };
    if (flashcard.creation_type === "ai_generated") {
      payload.creation_type = "ai_edited";
    }
    await Promise.resolve(onEdit(flashcard.id, payload));
    setIsSaving(false);
    onEditStateChange(flashcard.id, false);
  };

  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-800 shadow flex flex-col gap-2" aria-label="Fiszka">
      <div className="flex items-center justify-between">
        <FlashcardTypeBadge creationType={flashcard.creation_type} />
        <span className="text-xs text-gray-400">
          <span className="flex gap-2">
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={handleEditClick}
              aria-label="Edytuj fiszkę"
            >
              Edytuj
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => onDelete(flashcard.id)}
              aria-label="Usuń fiszkę"
            >
              Usuń
            </button>
          </span>
        </span>
      </div>
      {flashcard.isEditing ? (
        <>
          <div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
              className="w-full border rounded px-2 py-1 mb-1"
            />
            {error.question && <div className="text-red-500 text-xs mb-1">{error.question}</div>}
          </div>
          <div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={500}
              className="w-full border rounded px-2 py-1 mb-1"
            />
            {error.answer && <div className="text-red-500 text-xs mb-1">{error.answer}</div>}
          </div>
          <div className="flex gap-2 mt-2">
            <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Zapisywanie..." : "Zapisz"}
            </button>
            <button className="px-2 py-1 bg-gray-300 rounded" onClick={handleCancel} disabled={isSaving}>
              Anuluj
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="text-gray-900 dark:text-gray-100 break-words font-semibold">{flashcard.question}</div>
          </div>
          <div>
            <div className="text-gray-900 dark:text-gray-100 break-words">{flashcard.answer}</div>
          </div>
        </>
      )}
    </div>
  );
}
