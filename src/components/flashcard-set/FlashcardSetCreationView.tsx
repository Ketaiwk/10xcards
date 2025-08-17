import { useState } from "react";
import { useNavigate } from "@/components/hooks/useNavigate";
import { useNotifications } from "@/components/hooks/useNotifications";
import type { FlashcardResponse, UpdateFlashcardCommand } from "@/types";
import { OpenRouterService } from "@/lib/services/openrouter/openrouter.service";
import { SourceTextForm } from "./SourceTextForm";
import { ProgressIndicator } from "./ProgressIndicator";
import FlashcardList from "./FlashcardList";
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
  // Można dodać obsługę powiadomienia lub logowania błędu, jeśli token nie istnieje
  return token;
};

const getAuthHeader = () => {
  const token = getAuthToken();
  const header = token ? `Bearer ${token}` : "";
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
  const { showError, showSuccess } = useNotifications();

  const generateFlashcards = async (sourceText: string) => {
    if (!state.name.trim()) {
      showError("Nazwa zestawu jest wymagana przed wygenerowaniem fiszek");
      return;
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      sourceText,
      generationProgress: 0,
    }));

    const openRouter = new OpenRouterService();
    const maxCards = 5;

    try {
      await openRouter.generateFlashcards(sourceText, maxCards, {}, (progress, newCard) => {
        setState((prev) => {
          const flashcard: FlashcardViewModel = {
            id: crypto.randomUUID(),
            set_id: "",
            question: newCard.front,
            answer: newCard.back,
            isEditing: false,
            creation_type: "ai_generated" as const,
            created_at: new Date().toISOString(),
          };

          return {
            ...prev,
            generationProgress: progress,
            flashcards: [...prev.flashcards, flashcard],
          };
        });
      });

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generationProgress: 100,
      }));

      showSuccess("Pomyślnie wygenerowano fiszki!");
    } catch (error) {
      let message = "Wystąpił błąd podczas generowania fiszek";
      if (error instanceof Error) {
        message = error.message;
        // Dodatkowa obsługa błędów specyficznych dla OpenRouter
        if ("type" in error) {
          switch (error.type) {
            case "auth_error":
              message = "Błąd autoryzacji - sprawdź klucz API";
              break;
            case "rate_limit":
              message = "Przekroczono limit zapytań - spróbuj ponownie za chwilę";
              break;
            case "validation_error":
              message = "Nieprawidłowe dane wejściowe - sprawdź tekst źródłowy";
              break;
          }
        }
      }
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
        error:
          "Wystąpił błąd podczas aktualizacji fiszki: " + (error instanceof Error ? error.message : "Nieznany błąd"),
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
        error:
          "Wystąpił błąd podczas zapisywania zestawu: " + (error instanceof Error ? error.message : "Nieznany błąd"),
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
        error: "Wystąpił błąd podczas usuwania fiszek: " + (error instanceof Error ? error.message : "Nieznany błąd"),
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
          onChange={(text) => {
            updateState((prev) => ({ ...prev, sourceText: text }));
          }}
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
            items={state.flashcards}
            onEdit={editFlashcard}
            onDelete={deleteFlashcard}
            onAccept={(id: string) => {
              // Akceptacja fiszki AI: zmiana creation_type na 'ai_edited'
              const flashcard = state.flashcards.find((f: FlashcardViewModel) => f.id === id);
              if (!flashcard) return;
              const updated: FlashcardViewModel = {
                ...flashcard,
                creation_type: "ai_edited",
                isEditing: false,
              };
              updateState((prev: FlashcardSetCreationState) => ({
                ...prev,
                flashcards: prev.flashcards.map((f: FlashcardViewModel) => (f.id === id ? updated : f)),
              }));
            }}
            onEditStateChange={setFlashcardEditingState}
          />
        </div>
      )}
    </div>
  );
};

export default FlashcardSetCreationView;
