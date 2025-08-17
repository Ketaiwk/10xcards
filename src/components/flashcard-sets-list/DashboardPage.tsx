import React from "react";
import { useDashboardSets } from "./useDashboardSets";
import FlashcardSetList from "./FlashcardSetList";
import CreateSetButton from "./CreateSetButton";
import EmptyState from "./EmptyState";

const DashboardPage: React.FC = () => {
  const { sets, loading, error, refetch } = useDashboardSets();

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Moje zestawy fiszek</h1>
        <CreateSetButton onCreate={refetch} />
      </header>

      {loading && <div className="text-center py-8">Ładowanie...</div>}
      {error && (
        <div className="text-center py-8 text-red-500">
          {error}{" "}
          <button onClick={refetch} className="ml-2 underline">
            Spróbuj ponownie
          </button>
        </div>
      )}
      {!loading && !error && sets.length === 0 && <EmptyState onCreateSet={refetch} />}
      {!loading && !error && sets.length > 0 && <FlashcardSetList sets={sets} />}
    </main>
  );
};

export default DashboardPage;
