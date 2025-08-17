import React from "react";
import type { FlashcardCreationType } from "../../types";

interface FlashcardTypeBadgeProps {
  creationType: FlashcardCreationType;
}

const typeMap: Record<FlashcardCreationType, { label: string; color: string }> = {
  manual: { label: "Manualna", color: "text-blue-600" },
  ai_generated: { label: "AI", color: "text-purple-600" },
  ai_edited: { label: "AI edytowana", color: "text-pink-600" },
};

export default function FlashcardTypeBadge({ creationType }: FlashcardTypeBadgeProps) {
  const type = typeMap[creationType] || { label: "?", color: "bg-gray-400" };
  return (
    <span
      className={`inline-block text-sm font-bold uppercase tracking-wide ${type.color}`}
      aria-label={`Typ fiszki: ${type.label}`}
    >
      {type.label}
    </span>
  );
}
