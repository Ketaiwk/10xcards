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
  onEditStateChange: (id: string, isEditing: boolean) => void;
}

export function FlashcardList({ flashcards, onEdit, onDelete, onEditStateChange }: FlashcardListProps) {
  const handleEdit = async (flashcard: FlashcardViewModel, data: UpdateFlashcardCommand) => {
    await onEdit(flashcard.id, data);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {flashcards.map((flashcard) => (
          <motion.div
            key={flashcard.id}
            initial={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card>
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
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEditStateChange(flashcard.id, true)}
                      >
                        Edytuj
                      </Button>
                      <Button
                        type="button"
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
          </motion.div>
        ))}
      </AnimatePresence>
      {flashcards.length === 0 && <p className="text-center text-muted-foreground">Brak fiszek do wyświetlenia</p>}
    </div>
  );
}
