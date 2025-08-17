import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FlashcardList from "../FlashcardList";
import type { FlashcardViewModel } from "../FlashcardSetCreationView";

describe("FlashcardList", () => {
  // Arrange - konfiguracja wspólna dla wszystkich testów
  const mockFlashcards: FlashcardViewModel[] = [
    {
      id: "1",
      set_id: "1",
      question: "Pytanie 1",
      answer: "Odpowiedź 1",
      creation_type: "ai_generated",
      created_at: new Date().toISOString(),
      isEditing: false,
    },
    {
      id: "2",
      set_id: "1",
      question: "Pytanie 2",
      answer: "Odpowiedź 2",
      creation_type: "manual",
      created_at: new Date().toISOString(),
      isEditing: true,
    },
  ];

  const mockOnEdit = vi.fn(() => Promise.resolve());
  const mockOnDelete = vi.fn(() => Promise.resolve());
  const mockOnEditStateChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Renderowanie komponentu z podstawowymi propsami
  const mockOnAccept = vi.fn();
  const setupList = (flashcards = mockFlashcards) => {
    return render(
      <FlashcardList
        items={flashcards}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onEditStateChange={mockOnEditStateChange}
        onAccept={mockOnAccept}
      />
    );
  };

  describe("Renderowanie i stan początkowy", () => {
    it("powinien wyrenderować wszystkie fiszki", () => {
      // Arrange & Act
      setupList();

      // Assert
      expect(screen.getByText("Pytanie 1")).toBeInTheDocument();
      expect(screen.getByText("Odpowiedź 1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Pytanie 2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Odpowiedź 2")).toBeInTheDocument();
    });

    it("powinien wyświetlić komunikat gdy nie ma fiszek", () => {
      // Arrange & Act
      setupList([]);

      // Assert
      expect(screen.getByText("Brak fiszek w tym zestawie.")).toBeInTheDocument();
    });

    it("powinien wyświetlić edytor dla fiszki w trybie edycji", () => {
      // Arrange & Act
      setupList();

      // Assert - druga fiszka jest w trybie edycji
      const textareas = screen.getAllByRole("textbox");
      expect(textareas).toHaveLength(2); // dla pytania i odpowiedzi
      expect(textareas[0]).toHaveValue("Pytanie 2");
      expect(textareas[1]).toHaveValue("Odpowiedź 2");
    });
  });

  describe("Interakcje z fiszkami", () => {
    it("powinien wywołać onEditStateChange po kliknięciu przycisku Edytuj", async () => {
      // Arrange
      const user = userEvent.setup();
      setupList();
      const editButton = screen.getAllByText("Edytuj")[0];

      // Act
      await user.click(editButton);

      // Assert
      expect(mockOnEditStateChange).toHaveBeenCalledWith("1", true);
    });

    it("powinien wywołać onDelete po kliknięciu przycisku Usuń", async () => {
      // Arrange
      const user = userEvent.setup();
      setupList();
      const deleteButton = screen.getAllByText("Usuń")[0];

      // Act
      await user.click(deleteButton);

      // Assert
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("powinien wywołać onEdit z oryginalnymi danymi po anulowaniu edycji", async () => {
      // Arrange
      const user = userEvent.setup();
      setupList();
      const cancelButton = screen.getByText("Anuluj");

      // Act
      await user.click(cancelButton);

      // Assert
      expect(mockOnEdit).toHaveBeenCalledWith("2", {
        question: "Pytanie 2",
        answer: "Odpowiedź 2",
      });
    });
  });

  describe("Edycja fiszki", () => {
    it("powinien zapisać zmiany w fiszce po zatwierdzeniu edycji", async () => {
      // Arrange
      const user = userEvent.setup();
      setupList();
      const saveButton = screen.getByText("Zapisz");
      const textareas = screen.getAllByRole("textbox");

      // Act
      await user.clear(textareas[0]);
      await user.type(textareas[0], "Nowe pytanie");
      await user.clear(textareas[1]);
      await user.type(textareas[1], "Nowa odpowiedź");
      await user.click(saveButton);

      // Assert
      expect(mockOnEdit).toHaveBeenCalledWith("2", {
        question: "Nowe pytanie",
        answer: "Nowa odpowiedź",
      });
    });

    it("powinien zablokować przyciski podczas zapisywania", async () => {
      // Arrange
      const savingPromise = new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
      mockOnEdit.mockImplementationOnce(() => savingPromise);
      const user = userEvent.setup();
      setupList();
      const saveButton = screen.getByText("Zapisz");

      // Act
      await user.click(saveButton);

      // Assert
      expect(screen.getByText("Zapisywanie...")).toBeInTheDocument();
      expect(screen.getByText("Zapisywanie...")).toBeDisabled();
      expect(screen.getByText("Anuluj")).toBeDisabled();

      // Czekamy na zakończenie zapisywania
      await savingPromise;
    });

    it("powinien ponownie włączyć przyciski po zapisaniu", async () => {
      // Arrange
      const savingPromise = new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
      mockOnEdit.mockImplementationOnce(() => savingPromise);
      const user = userEvent.setup();
      setupList();
      const saveButton = screen.getByText("Zapisz");

      // Act
      await user.click(saveButton);

      // Czekamy na zakończenie zapisywania
      await savingPromise;

      // Assert - czekamy na powrót przycisków do pierwotnego stanu
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Zapisz" })).not.toBeDisabled();
        expect(screen.getByRole("button", { name: "Anuluj" })).not.toBeDisabled();
      });
    });
  });
});
