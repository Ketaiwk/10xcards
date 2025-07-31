import type { FlashcardViewModel } from "./FlashcardSetCreationView";
import type { UpdateFlashcardCommand } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashcardEditor } from "./FlashcardEditor";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardListProps {
  flashcards: FlashcardViewModel[];
  onEdit: (id: string, data: UpdateFlashcardCommand) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function FlashcardList({ flashcards, onEdit, onDelete }: FlashcardListProps) {
  const handleEdit = async (flashcard: FlashcardViewModel, data: UpdateFlashcardCommand) => {
    await onEdit(flashcard.id, data);
  };

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id}>
          {flashcard.isEditing ? (
            <CardContent className="p-6">
              <FlashcardEditor
                flashcard={flashcard}
                onSave={(data) => handleEdit(flashcard, data)}
                onCancel={() => onEdit(flashcard.id, { answer: flashcard.answer, question: flashcard.question })}
              />
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 space-x-4">
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium leading-none">{flashcard.question}</h3>
                  <p className="text-sm text-muted-foreground">{flashcard.answer}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(flashcard.id, { answer: flashcard.answer, question: flashcard.question })}
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => onDelete(flashcard.id)}
                  >
                    Usuń
                  </Button>
                </div>
              </CardHeader>
            </>
          )}
        </Card>
      ))}
      {flashcards.length === 0 && <p className="text-center text-muted-foreground">Brak fiszek do wyświetlenia</p>}
    </div>
  );
}
