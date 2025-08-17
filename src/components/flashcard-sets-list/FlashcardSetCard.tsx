import React from "react";

const MAX_FLASHCARDS = 30;
import type { FlashcardSetListItemResponse } from "../../types";

interface Props {
  set: FlashcardSetListItemResponse;
}

const FlashcardSetCard: React.FC<Props> = ({ set }) => {
  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <a
        href={`/sets/${set.id}`}
        aria-label={`Zestaw: ${set.name}`}
        className="block w-full no-underline text-inherit cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
      >
        <h2 className="text-lg font-semibold mb-1">{set.name}</h2>
        {set.description && <p className="text-gray-500 mb-2">{set.description}</p>}
        {(() => {
          const count = (set.ai_generated_count ?? 0) + (set.ai_edited_count ?? 0) + (set.manual_count ?? 0);
          const max = MAX_FLASHCARDS;
          return (
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <span className="font-semibold">Fiszki:</span>{" "}
              <span className={count >= max ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                {count} / {max}
              </span>
            </div>
          );
        })()}
        <div className="flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span>
            <span className="text-purple-600 font-semibold uppercase">AI</span>:{" "}
            <span className="text-black dark:text-black">{set.ai_generated_count}</span>
          </span>
          <span>
            <span className="text-pink-600 font-semibold uppercase">EDITED</span>:{" "}
            <span className="text-black dark:text-black">{set.ai_edited_count}</span>
          </span>
          <span>
            <span className="text-blue-600 font-semibold uppercase">MANUAL</span>:{" "}
            <span className="text-black dark:text-black">{set.manual_count}</span>
          </span>
        </div>

        <div className="text-xs text-gray-400">{new Date(set.created_at).toLocaleDateString()}</div>
      </a>
    </article>
  );
};

export default FlashcardSetCard;
