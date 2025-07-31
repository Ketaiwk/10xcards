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
      showInfo("Trwa tworzenie zestawu i generowanie fiszek...");
      const response = await fetch("/api/flashcard-sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          description: state.description,
          source_text: sourceText,
          generate_ai_cards: true,
        } as CreateFlashcardSetCommand),
      });

      if (!response.ok) {
        throw new Error("Nie udało się utworzyć zestawu fiszek");
      }

      const set = await response.json();
      const flashcardsResponse = await fetch(`/api/flashcard-sets/${set.id}/flashcards`);

      if (!flashcardsResponse.ok) {
        throw new Error("Nie udało się pobrać wygenerowanych fiszek");
      }

      const { items } = await flashcardsResponse.json();
      setState((prev) => ({
        ...prev,
        flashcards: items.map((f: FlashcardResponse) => ({ ...f, isEditing: false })),
      }));
      showSuccess("Pomyślnie wygenerowano fiszki!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wystąpił błąd podczas generowania fiszek";
      showError(message);
    } finally {
      setState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const editFlashcard = async (id: string, data: UpdateFlashcardCommand) => {
    try {
      const response = await fetch(`/api/flashcard-sets/${state.flashcards[0].set_id}/flashcards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować fiszki");
      }

      const updatedFlashcard = await response.json();
      setState((prev) => ({
        ...prev,
        flashcards: prev.flashcards.map((f) => (f.id === id ? { ...updatedFlashcard, isEditing: false } : f)),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Wystąpił błąd podczas aktualizacji fiszki",
      }));
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      const response = await fetch(`/api/flashcard-sets/${state.flashcards[0].set_id}/flashcards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć fiszki");
      }

      setState((prev) => ({
        ...prev,
        flashcards: prev.flashcards.filter((f) => f.id !== id),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Wystąpił błąd podczas usuwania fiszki",
      }));
    }
  };

  const saveSet = async () => {
    // Set is already saved when generating flashcards
    setState((prev) => ({ ...prev, isSaving: true }));
    try {
      const response = await fetch(`/api/flashcard-sets/${state.flashcards[0].set_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          description: state.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się zapisać zestawu");
      }
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
      await Promise.all(
        state.flashcards.map((f) =>
          fetch(`/api/flashcard-sets/${f.set_id}/flashcards/${f.id}`, {
            method: "DELETE",
          })
        )
      );
      setState((prev) => ({ ...prev, flashcards: [] }));
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
    setState((prev) => ({ ...prev, isDeleting: true }));
    try {
      const setId = state.flashcards[0]?.set_id;
      if (!setId) return;

      const response = await fetch(`/api/flashcard-sets/${setId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć zestawu");
      }

      setState((prev) => ({
        ...prev,
        flashcards: [],
        name: "",
        description: "",
        sourceText: "",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Wystąpił błąd podczas usuwania zestawu",
      }));
    } finally {
      setState((prev) => ({ ...prev, isDeleting: false }));
    }
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
  } = useFlashcardSetCreation();

  return (
    <div className="space-y-8">
      <SetDetailsForm
        name={state.name}
        description={state.description || ""}
        onNameChange={(name: string) => {
          updateState((prev) => ({ ...prev, name }));
          if (state.flashcards.length > 0) {
            saveSet();
          }
        }}
        onDescriptionChange={(description: string) => {
          updateState((prev) => ({ ...prev, description }));
          if (state.flashcards.length > 0) {
            saveSet();
          }
        }}
        disabled={state.isGenerating || state.isSaving}
      />

      <div className="border rounded-lg p-6 space-y-6 bg-card">
        <h2 className="text-2xl font-semibold">Tekst źródłowy</h2>
        <SourceTextForm onGenerate={generateFlashcards} isGenerating={state.isGenerating} />
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

          <FlashcardList flashcards={state.flashcards} onEdit={editFlashcard} onDelete={deleteFlashcard} />
        </div>
      )}
    </div>
  );
};

export default FlashcardSetCreationView;
