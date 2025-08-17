import React from "react";
import type { FlashcardSetListItemResponse } from "../../types";

interface Props {
  set: FlashcardSetListItemResponse;
}

const FlashcardSetCard: React.FC<Props> = ({ set }) => {
  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <a
        href={`/sets/${set.id}`}
        aria-label={`Zestaw: ${set.name}`}
        className="block w-full no-underline text-inherit cursor-pointer hover:ring-2 hover:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
      >
        <h2 className="text-lg font-semibold mb-1">{set.name}</h2>
        {set.description && <p className="text-gray-500 mb-2">{set.description}</p>}
        <div className="flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span>AI: {set.ai_generated_count}</span>
          <span>Zaakceptowane: {set.ai_accepted_count}</span>
          <span>Edytowane: {set.ai_edited_count}</span>
          <span>Ręczne: {set.manual_count}</span>
        </div>
        <div className="text-xs text-gray-400">
          Utworzono: {new Date(set.created_at).toLocaleDateString()}
          <br />
          Zaktualizowano: {new Date(set.updated_at).toLocaleDateString()}
        </div>
      </a>
    </article>
  );
};

export default FlashcardSetCard;
