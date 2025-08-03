import { useState } from "react";
import { useNavigate } from "@/components/hooks/useNavigate";
import { useNotifications } from "@/components/hooks/useNotifications";
import type { CreateFlashcardSetCommand, FlashcardResponse, UpdateFlashcardCommand } from "@/types";
import { SourceTextForm } from "./SourceTextForm";
import { ProgressIndicator } from "./ProgressIndicator";
import { FlashcardList } from "./FlashcardList";
import { SetDetailsForm } from "./SetDetailsForm";
import { ActionButtons } from "./ActionButtons";

export interface FlashcardViewModel extends FlashcardResponse {
  isEditing: boolean;
  validationErrors?: {
    question?: string;
    answer?: string;
  };
}

interface FlashcardSetCreationState {
  name: string;
  description?: string;
  sourceText?: string;
  isGenerating: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  flashcards: FlashcardViewModel[];
  generationProgress: number;
  error?: string;
}

const getAuthToken = () => {
  const token = localStorage.getItem("supabase.auth.token");
  if (!token) {
    console.warn("No auth token available!");
  }
  return token;
};

const getAuthHeader = () => {
  const token = getAuthToken();
  const header = token ? `Bearer ${token}` : "";
  console.log("Auth header:", header);
  return header;
};

const useFlashcardSetCreation = () => {
  const [state, setState] = useState<FlashcardSetCreationState>({
    name: "",
    isGenerating: false,
    flashcards: [],
    generationProgress: 0,
    isSaving: false,
    isDeleting: false,
  });
  const navigate = useNavigate();
  const { showError, showSuccess, showInfo } = useNotifications();

  const generateFlashcards = async (sourceText: string) => {
    if (!state.name.trim()) {
      showError("Nazwa zestawu jest wymagana przed wygenerowaniem fiszek");
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true, sourceText }));
    try {
      // Tymczasowo używamy mocków - docelowo będzie to generowanie przez AI
      const mockFlashcards: FlashcardViewModel[] = [
        {
          id: crypto.randomUUID(),
          set_id: "", // będzie ustawione po zapisaniu zestawu
          question: "Co to jest spaced repetition?",
          answer: "Technika nauki polegająca na powtarzaniu materiału w optymalnych odstępach czasu.",
          isEditing: false,
          creation_type: "ai_generated" as const,
          created_at: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          set_id: "", // będzie ustawione po zapisaniu zestawu
          question: "Jakies randomowe pytanie?",
          answer: "Jakas losowa odpowiedz.",
          isEditing: false,
          creation_type: "ai_generated" as const,
          created_at: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          set_id: "", // będzie ustawione po zapisaniu zestawu
          question: "Jakie są zalety korzystania z fiszek?",
          answer: "1. Aktywne uczenie się\n2. Łatwe powtarzanie\n3. Możliwość nauki w dowolnym miejscu",
          isEditing: false,
          creation_type: "ai_generated" as const,
          created_at: new Date().toISOString(),
        },
      ];

      setState((prev) => ({
        ...prev,
        flashcards: mockFlashcards,
        isGenerating: false,
        generationProgress: 100,
      }));

      showSuccess("Pomyślnie wygenerowano fiszki!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wystąpił błąd podczas generowania fiszek";
      showError(message);
    } finally {
      setState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const setFlashcardEditingState = (id: string, isEditing: boolean) => {
    setState((prev) => ({
      ...prev,
      flashcards: prev.flashcards.map((f) => (f.id === id ? { ...f, isEditing } : f)),
    }));
  };

  const editFlashcard = async (id: string, data: UpdateFlashcardCommand) => {
    try {
      // Tylko aktualizacja stanu lokalnego
      const flashcard = state.flashcards.find((f) => f.id === id);
      if (!flashcard) return;

      const updatedData = {
        ...data,
        creation_type: flashcard.creation_type === "ai_generated" ? "ai_edited" : flashcard.creation_type,
      };

      setState((prev) => ({
        ...prev,
        flashcards: prev.flashcards.map((f) => (f.id === id ? { ...f, ...updatedData, isEditing: false } : f)),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Wystąpił błąd podczas aktualizacji fiszki",
      }));
    }
  };

  const deleteFlashcard = async (id: string) => {
    // Tylko aktualizacja stanu lokalnego
    setState((prev) => ({
      ...prev,
      flashcards: prev.flashcards.filter((f) => f.id !== id),
    }));
  };

  const saveSet = async () => {
    if (!state.name.trim()) {
      showError("Nazwa zestawu jest wymagana przed zapisaniem");
      return;
    }

    setState((prev) => ({ ...prev, isSaving: true }));
    try {
      // 1. Najpierw zapisujemy zestaw
      const setResponse = await fetch("/api/flashcard-sets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          name: state.name,
          description: state.description,
          source_text: state.sourceText,
          generate_ai_cards: false, // nie generujemy ponownie, bo już mamy wygenerowane
        }),
      });

      if (!setResponse.ok) {
        throw new Error("Nie udało się zapisać zestawu");
      }

      const setData = await setResponse.json();

      // 2. Następnie zapisujemy wszystkie fiszki
      const flashcardsPromises = state.flashcards.map((flashcard) =>
        fetch(`/api/flashcard-sets/${setData.id}/flashcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify({
            question: flashcard.question,
            answer: flashcard.answer,
            creation_type: flashcard.creation_type,
          }),
        })
      );

      await Promise.all(flashcardsPromises);

      showSuccess("Zestaw został pomyślnie zapisany");
      navigate("/sets");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Wystąpił błąd podczas zapisywania zestawu",
      }));
    } finally {
      setState((prev) => ({ ...prev, isSaving: false }));
    }
  };

  const deleteAllFlashcards = async () => {
    setState((prev) => ({ ...prev, isDeleting: true }));
    try {
      // Czyścimy tylko stan lokalny
      setState((prev) => ({
        ...prev,
        flashcards: [],
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Wystąpił błąd podczas usuwania fiszek",
      }));
    } finally {
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const deleteSet = async () => {
    // Przed zapisaniem zestawu wystarczy wyczyścić stan lokalny
    setState((prev) => ({
      ...prev,
      flashcards: [],
      name: "",
      description: "",
      sourceText: "",
    }));
  };

  const updateState = (updater: (prev: FlashcardSetCreationState) => FlashcardSetCreationState) => {
    setState(updater);
  };

  return {
    state,
    updateState,
    generateFlashcards,
    editFlashcard,
    deleteFlashcard,
    saveSet,
    deleteAllFlashcards,
    deleteSet,
    setFlashcardEditingState,
  };
};

const FlashcardSetCreationView = () => {
  const {
    state,
    updateState,
    generateFlashcards,
    editFlashcard,
    deleteFlashcard,
    saveSet,
    deleteAllFlashcards,
    deleteSet,
    setFlashcardEditingState,
  } = useFlashcardSetCreation();

  return (
    <div className="space-y-8">
      <SetDetailsForm
        name={state.name}
        description={state.description || ""}
        onNameChange={(name: string) => {
          updateState((prev) => ({ ...prev, name }));
        }}
        onDescriptionChange={(description: string) => {
          updateState((prev) => ({ ...prev, description }));
        }}
        disabled={state.isGenerating || state.isSaving}
      />

      <div className="border rounded-lg p-6 space-y-6 bg-card">
        <h2 className="text-2xl font-semibold">Tekst źródłowy</h2>
        <SourceTextForm
          onGenerate={generateFlashcards}
          isGenerating={state.isGenerating}
          value={state.sourceText}
          onChange={(text) => updateState((prev) => ({ ...prev, sourceText: text }))}
        />
      </div>

      {state.isGenerating && (
        <div className="border rounded-lg p-6 bg-card">
          <ProgressIndicator progress={state.generationProgress} status="Trwa generowanie fiszek..." />
        </div>
      )}

      {state.flashcards.length > 0 && (
        <div className="border rounded-lg p-6 space-y-6 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Wygenerowane fiszki</h2>
            <ActionButtons
              onSave={saveSet}
              onDeleteAll={deleteAllFlashcards}
              onDeleteSet={deleteSet}
              isDeleting={state.isDeleting}
              isSaving={state.isSaving}
            />
          </div>

          <FlashcardList
            flashcards={state.flashcards}
            onEdit={editFlashcard}
            onDelete={deleteFlashcard}
            onEditStateChange={setFlashcardEditingState}
          />
        </div>
      )}
    </div>
  );
};

export default FlashcardSetCreationView;
