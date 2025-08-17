import React from "react";

interface FlashcardCounterProps {
  count: number;
  max: number;
}

export default function FlashcardCounter({ count, max }: FlashcardCounterProps) {
  return (
    <div className="flex items-center gap-2 mt-2" aria-label="Licznik fiszek">
      <span className="font-semibold">Fiszki:</span>
      <span className={count >= max ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
        {count} / {max}
      </span>
      {count >= max && (
        <span className="ml-2 text-xs text-red-500" aria-live="polite">
          Osiągnięto limit fiszek!
        </span>
      )}
    </div>
  );
}
