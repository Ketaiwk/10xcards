import type { FlashcardViewModel } from "./FlashcardSetCreationView";
import type { UpdateFlashcardCommand } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface FlashcardEditorProps {
  flashcard: FlashcardViewModel;
  onSave: (data: UpdateFlashcardCommand) => Promise<void>;
  onCancel: () => void;
}

export function FlashcardEditor({ flashcard, onSave, onCancel }: FlashcardEditorProps) {
  const [question, setQuestion] = useState(flashcard.question);
  const [answer, setAnswer] = useState(flashcard.answer);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        question: question.trim(),
        answer: answer.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={`question-${flashcard.id}`} className="text-sm font-medium">
          Pytanie
        </label>
        <Textarea
          id={`question-${flashcard.id}`}
          value={question}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
          placeholder="Wprowadź pytanie..."
          maxLength={200}
          disabled={isSaving}
        />
        <p className="text-sm text-muted-foreground text-right">{question.length}/200</p>
      </div>

      <div className="space-y-2">
        <label htmlFor={`answer-${flashcard.id}`} className="text-sm font-medium">
          Odpowiedź
        </label>
        <Textarea
          id={`answer-${flashcard.id}`}
          value={answer}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
          placeholder="Wprowadź odpowiedź..."
          maxLength={500}
          disabled={isSaving}
        />
        <p className="text-sm text-muted-foreground text-right">{answer.length}/500</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Anuluj
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </div>
    </form>
  );
}
