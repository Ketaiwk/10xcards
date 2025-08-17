import React from "react";

interface Props {
  onCreateSet: () => void;
}

import { useNavigate } from "@/components/hooks/useNavigate";

const EmptyState: React.FC<Props> = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold mb-2">Nie masz jeszcze żadnych zestawów fiszek</h2>
      <p className="mb-4 text-gray-500">Rozpocznij naukę, tworząc swój pierwszy zestaw!</p>
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={() => navigate("/sets/new")}
        aria-label="Utwórz pierwszy zestaw"
      >
        + Utwórz zestaw
      </button>
    </div>
  );
};

export default EmptyState;
