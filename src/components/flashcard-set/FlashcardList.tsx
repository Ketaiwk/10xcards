import React from "react";
import FlashcardCard from "./FlashcardCard";
import type { FlashcardResponse, UpdateFlashcardCommand } from "../../types";

interface FlashcardListProps {
  items: (FlashcardResponse & { isEditing?: boolean })[];
  onEdit: (id: string, payload: UpdateFlashcardCommand) => void;
  onDelete: (id: string) => void;
  onAccept: (id: string) => void;
  onEditStateChange: (id: string, isEditing: boolean) => void;
}

export default function FlashcardList({
  items = [],
  onEdit,
  onDelete,
  onAccept,
  onEditStateChange,
}: FlashcardListProps) {
  return (
    <div>
      <div className="grid gap-4">
        {items.length === 0 ? (
          <div className="text-gray-500">Brak fiszek w tym zestawie.</div>
        ) : (
          items.map((flashcard) => (
            <FlashcardCard
              key={flashcard.id}
              flashcard={flashcard}
              onEdit={onEdit}
              onDelete={onDelete}
              onAccept={onAccept}
              onEditStateChange={onEditStateChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
