import React from "react";
import FlashcardSetCard from "./FlashcardSetCard";
import type { FlashcardSetListItemResponse } from "../../types";

interface Props {
  sets: FlashcardSetListItemResponse[];
}

const FlashcardSetList: React.FC<Props> = ({ sets }) => {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {sets.map((set) => (
        <FlashcardSetCard key={set.id} set={set} />
      ))}
    </section>
  );
};

// PRZENIESIONY: flashcard-sets-list/FlashcardSetList.tsx
export default FlashcardSetList;
