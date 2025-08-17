import { useEffect, useState } from "react";
import type { FlashcardSetListResponse } from "../../types";

interface UseDashboardSetsResult {
  sets: FlashcardSetListResponse["items"];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardSets(): UseDashboardSetsResult {
  const [sets, setSets] = useState<FlashcardSetListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("elo elo w useDashboardSets.ts 1");

  const fetchSets = async () => {
    setLoading(true);
    setError(null);
    console.log("elo elo w useDashboardSets.ts");
    try {
      const res = await fetch("/api/flashcard-sets");
      console.log("Fetching flashcard sets from API-----------------------------------------");
      console.log(res);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data: FlashcardSetListResponse = await res.json();
      setSets(data.items);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Nie udało się pobrać zestawów.");
      } else {
        setError("Nie udało się pobrać zestawów.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  return {
    sets,
    loading,
    error,
    refetch: fetchSets,
  };
}
