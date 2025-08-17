import React, { useState, useEffect } from "react";

import FlashcardCounter from "./FlashcardCounter";
import AddFlashcardButton from "./AddFlashcardButton";
import FlashcardList from "./FlashcardList";
import type { FlashcardSetResponse, FlashcardResponse } from "../../types";

const MAX_FLASHCARDS = 30;

export default function FlashcardSetView({ setId }: { setId: string }) {
  const [set, setSet] = useState<FlashcardSetResponse | null>(null);
  const [loadingSet, setLoadingSet] = useState(true);
  const [errorSet, setErrorSet] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<(FlashcardResponse & { isEditing?: boolean })[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [errorCards, setErrorCards] = useState<string | null>(null);

  // Toggle dla tekstu źródłowego
  const [showFullSource, setShowFullSource] = useState(false);

  // Stan widoczności formularza dodawania fiszki
  const [showAddForm, setShowAddForm] = useState(false);
  // Stan tymczasowej fiszki do dodania
  const [newFlashcard, setNewFlashcard] = useState<{ question: string; answer: string }>({ question: "", answer: "" });

  const handleAddFlashcard = async (data: { question: string; answer: string }) => {
    try {
      const res = await fetch(`/api/flashcard-sets/${setId}/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, creation_type: "manual" }),
      });
      if (!res.ok) throw new Error("Błąd podczas dodawania fiszki");
      const newCard = await res.json();
      setFlashcards((prev) => [...prev, { ...newCard, isEditing: false }]);
      setShowAddForm(false);
      setNewFlashcard({ question: "", answer: "" });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorCards(e.message);
      } else {
        setErrorCards("Wystąpił nieznany błąd podczas dodawania fiszki");
      }
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(true);
    setNewFlashcard({ question: "", answer: "" });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewFlashcard({ question: "", answer: "" });
  };
  useEffect(() => {
    setLoadingSet(true);
    setErrorSet(null);
    fetch(`/api/flashcard-sets/${setId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Zestaw nie znaleziony");
          if (res.status === 401) throw new Error("Brak autoryzacji");
          throw new Error("Błąd serwera");
        }
        return res.json();
      })
      .then((data) => setSet(data))
      .catch((e) => setErrorSet(e.message))
      .finally(() => setLoadingSet(false));
  }, [setId]);

  // Pobieranie fiszek
  useEffect(() => {
    setLoadingCards(true);
    setErrorCards(null);
    fetch(`/api/flashcard-sets/${setId}/flashcards`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Fiszki nie znalezione");
          if (res.status === 401) throw new Error("Brak autoryzacji");
          throw new Error("Błąd serwera");
        }
        return res.json();
      })
      .then((data: { items: FlashcardResponse[]; total: number }) => {
        setFlashcards(data.items.map((f) => ({ ...f, isEditing: false })));
      })
      .catch((e) => setErrorCards(e.message))
      .finally(() => setLoadingCards(false));
  }, [setId]);

  if (loadingSet) return <div>Ładowanie zestawu...</div>;
  if (errorSet) return <div className="text-red-500">Błąd: {errorSet}</div>;
  if (!set) return <div>Zestaw nie znaleziony.</div>;

  // Bezpieczne sumowanie liczników (nullish coalescing)
  const manualCount = set.manual_count ?? 0;
  const aiGeneratedCount = set.ai_generated_count ?? 0;
  const aiEditedCount = set.ai_edited_count ?? 0;
  const totalCount = manualCount + aiGeneratedCount + aiEditedCount;

  // Obsługa edycji inline
  const handleEditStateChange = (id: string, isEditing: boolean) => {
    setFlashcards((prev) => prev.map((f) => (f.id === id ? { ...f, isEditing } : f)));
  };

  const handleEdit = (id: string, payload: import("../../types").UpdateFlashcardCommand) => {
    setFlashcards((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              ...payload,
              isEditing: false,
              creation_type: f.creation_type === "ai_generated" ? "ai_edited" : f.creation_type,
            }
          : f
      )
    );
    // Wywołanie API do aktualizacji fiszki, z uwzględnieniem creation_type
    // Jeśli fiszka była AI, zmień status na ai_edited także w bazie
    const original = flashcards.find((f) => f.id === id);
    const patchPayload: import("../../types").UpdateFlashcardCommand & { creation_type?: string } = { ...payload };
    // Jeśli zmieniamy status AI -> AI_edited, zawsze wyślij creation_type
    if (original?.creation_type === "ai_generated") {
      patchPayload.creation_type = "ai_edited";
    }
    fetch(`/api/flashcard-sets/${setId}/flashcards/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchPayload),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Błąd podczas zapisu fiszki");
        }
        return res.json();
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          setErrorCards(e.message);
        } else {
          setErrorCards("Wystąpił nieznany błąd podczas zapisu fiszki");
        }
      });
  };

  const handleDelete = (id: string) => {
    const deleteFlashcard = async () => {
      try {
        const res = await fetch(`/api/flashcard-sets/${setId}/flashcards/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Błąd podczas usuwania fiszki");
        setFlashcards((prev) => prev.filter((f) => f.id !== id));
      } catch (e: unknown) {
        if (e instanceof Error) {
          setErrorCards(e.message);
        } else {
          setErrorCards("Wystąpił nieznany błąd podczas usuwania fiszki");
        }
      }
    };
    deleteFlashcard();
  };

  const handleAccept = (id: string) => {
    setFlashcards((prev) =>
      prev.map((f) => (f.id === id ? { ...f, creation_type: "ai_edited", isEditing: false } : f))
    );
    // Tu można dodać wywołanie API do akceptacji AI
  };

  return (
    <main aria-label="Widok zestawu fiszek" className="p-4 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{set.name}</h1>
        {set.description && <p className="text-gray-500 dark:text-gray-400">{set.description}</p>}
      </header>
      <section className="mt-6">
        {set.source_text && (
          <div className="mb-6 p-4 bg-gray-50 border rounded">
            <div className="whitespace-pre-line text-gray-800">
              {showFullSource
                ? set.source_text
                : set.source_text.length > 300
                  ? set.source_text.slice(0, 300) + "..."
                  : set.source_text}
            </div>
            {set.source_text.length > 300 && (
              <button
                className="mt-2 text-blue-600 hover:underline text-sm flex items-center gap-1 uppercase"
                type="button"
                aria-expanded={showFullSource}
                onClick={() => setShowFullSource((v) => !v)}
              >
                {showFullSource ? "Zwiń tekst" : "Czytaj więcej"}
                <span
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${showFullSource ? "rotate-90" : ""}`}
                >
                  ▶
                </span>
              </button>
            )}
          </div>
        )}

        <div className="mb-4">
          <FlashcardCounter count={flashcards.length} max={MAX_FLASHCARDS} />
        </div>

        {loadingCards ? (
          <div>Ładowanie fiszek...</div>
        ) : (
          <FlashcardList
            items={flashcards ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAccept={handleAccept}
            onEditStateChange={handleEditStateChange}
          />
        )}
        {errorCards && <div className="text-red-500">Błąd: {errorCards}</div>}

        {showAddForm && (
          <div className="mt-4 mb-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleAddFlashcard(newFlashcard);
              }}
              className="border rounded p-4 bg-white dark:bg-gray-800 shadow flex flex-col gap-2"
              aria-label="Nowa fiszka"
            >
              <input
                type="text"
                value={newFlashcard.question}
                onChange={(e) => setNewFlashcard((f) => ({ ...f, question: e.target.value }))}
                maxLength={200}
                className="w-full border rounded px-2 py-1 mb-1"
                placeholder="Pytanie"
                required
              />
              <textarea
                value={newFlashcard.answer}
                onChange={(e) => setNewFlashcard((f) => ({ ...f, answer: e.target.value }))}
                maxLength={500}
                className="w-full border rounded px-2 py-1 mb-1"
                placeholder="Odpowiedź"
                required
              />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-2 py-1 bg-blue-600 text-white rounded">
                  Dodaj
                </button>
                <button type="button" className="px-2 py-1 bg-gray-300 rounded" onClick={handleCancelAdd}>
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        )}
        <AddFlashcardButton disabled={totalCount >= MAX_FLASHCARDS} onClick={handleShowAddForm} />
      </section>
      {/* Modale dodawania/edycji/usuwania będą tu */}
    </main>
  );
}
