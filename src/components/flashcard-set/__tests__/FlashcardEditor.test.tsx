import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlashcardEditor } from "../FlashcardEditor";
import type { FlashcardViewModel } from "../FlashcardSetCreationView";

describe("FlashcardEditor", () => {
  // Arrange - konfiguracja wspólna dla wszystkich testów
  const mockFlashcard: FlashcardViewModel = {
    id: "1",
    set_id: "1",
    question: "Przykładowe pytanie",
    answer: "Przykładowa odpowiedź",
    creation_type: "ai_generated",
    created_at: new Date().toISOString(),
    isEditing: false,
  };

  const mockOnSave = vi.fn(() => Promise.resolve());
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Renderowanie komponentu z podstawowymi propsami
  const setupEditor = () => {
    return render(<FlashcardEditor flashcard={mockFlashcard} onSave={mockOnSave} onCancel={mockOnCancel} />);
  };

  describe("Renderowanie i inicjalizacja", () => {
    it("powinien wyrenderować formularz z początkowymi wartościami", () => {
      // Arrange & Act
      setupEditor();

      // Assert
      expect(screen.getByLabelText("Pytanie")).toHaveValue(mockFlashcard.question);
      expect(screen.getByLabelText("Odpowiedź")).toHaveValue(mockFlashcard.answer);
    });

    it("powinien wyświetlać liczniki znaków", () => {
      // Arrange & Act
      setupEditor();

      // Assert
      expect(screen.getByText(`${mockFlashcard.question.length}/200`)).toBeInTheDocument();
      expect(screen.getByText(`${mockFlashcard.answer.length}/500`)).toBeInTheDocument();
    });
  });

  describe("Walidacja długości", () => {
    it("nie powinien pozwolić na wprowadzenie więcej niż 200 znaków w pytaniu", async () => {
      // Arrange
      const user = userEvent.setup();
      setupEditor();
      const questionInput = screen.getByLabelText("Pytanie");
      const longText = "a".repeat(201);

      // Act
      await user.clear(questionInput); // Najpierw czyścimy pole
      await user.type(questionInput, longText);

      // Assert
      expect(questionInput).toHaveValue(longText.slice(0, 200));
    });

    it("nie powinien pozwolić na wprowadzenie więcej niż 500 znaków w odpowiedzi", async () => {
      // Arrange
      const user = userEvent.setup();
      setupEditor();
      const answerInput = screen.getByLabelText("Odpowiedź");
      const longText = "a".repeat(501);

      // Act
      await user.clear(answerInput); // Najpierw czyścimy pole
      await user.type(answerInput, longText);

      // Assert
      expect(answerInput).toHaveValue(longText.slice(0, 500));
    });
  });

  describe("Obsługa formularza", () => {
    it("powinien wywołać onSave z przycięciem białych znaków", async () => {
      // Arrange
      setupEditor();
      const questionInput = screen.getByLabelText("Pytanie");
      const answerInput = screen.getByLabelText("Odpowiedź");

      // Act
      await userEvent.clear(questionInput);
      await userEvent.type(questionInput, "  Nowe pytanie  ");
      await userEvent.clear(answerInput);
      await userEvent.type(answerInput, "  Nowa odpowiedź  ");
      await userEvent.click(screen.getByText("Zapisz"));

      // Assert
      expect(mockOnSave).toHaveBeenCalledWith({
        question: "Nowe pytanie",
        answer: "Nowa odpowiedź",
      });
    });

    it("powinien wyłączyć przyciski podczas zapisywania", async () => {
      // Arrange
      const savingPromise = new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
      mockOnSave.mockImplementationOnce(() => savingPromise);
      setupEditor();
      const saveButton = screen.getByText("Zapisz");

      // Act
      await userEvent.click(saveButton);

      // Assert
      expect(screen.getByText("Zapisywanie...")).toBeInTheDocument();
      expect(screen.getByText("Zapisywanie...")).toBeDisabled();
      expect(screen.getByText("Anuluj")).toBeDisabled();

      // Czekamy na zakończenie zapisywania
      await savingPromise;
    });

    it("powinien obsłużyć anulowanie edycji", async () => {
      // Arrange
      setupEditor();

      // Act
      await userEvent.click(screen.getByText("Anuluj"));

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("powinien ponownie włączyć przyciski po zapisaniu", async () => {
      // Arrange
      const savingPromise = new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
      mockOnSave.mockImplementationOnce(() => savingPromise);
      const user = userEvent.setup();
      setupEditor();
      const saveButton = screen.getByText("Zapisz");

      // Act
      await user.click(saveButton);

      // Czekamy na zakończenie zapisywania
      await savingPromise;

      // Assert - czekamy na powrót przycisków do pierwotnego stanu
      await waitFor(() => {
        const buttons = screen.getAllByRole("button");
        const [cancelButton, submitButton] = buttons;

        expect(submitButton).toHaveTextContent("Zapisz");
        expect(submitButton).not.toBeDisabled();
        expect(cancelButton).not.toBeDisabled();
      });
    });
  });

  describe("Aktualizacja liczników znaków", () => {
    it("powinien aktualizować licznik znaków dla pytania", async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = setupEditor();
      const questionInput = screen.getByLabelText("Pytanie");

      // Act
      await user.clear(questionInput);
      await user.type(questionInput, "Nowe pytanie");

      // Debugowanie
      const counters = container.querySelectorAll(".text-right");
      console.log("Counters found:", counters.length);
      console.log(
        "Counter contents:",
        Array.from(counters).map((el) => el.textContent)
      );

      // Assert
      const updatedCounter = Array.from(counters).find((el) => el.textContent?.includes("/200"));
      expect(updatedCounter).toBeDefined();
      expect(updatedCounter?.textContent).toBe("12/200"); // "Nowe pytanie" ma 12 znaków
    });

    it("powinien aktualizować licznik znaków dla odpowiedzi", async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = setupEditor();
      const answerInput = screen.getByLabelText("Odpowiedź");

      // Act
      await user.clear(answerInput);
      await user.type(answerInput, "Nowa odpowiedź");

      // Debugowanie
      const counters = container.querySelectorAll(".text-right");
      console.log("Counters found:", counters.length);
      console.log(
        "Counter contents:",
        Array.from(counters).map((el) => el.textContent)
      );

      // Assert
      const updatedCounter = Array.from(counters).find((el) => el.textContent?.includes("/500"));
      expect(updatedCounter).toBeDefined();
      expect(updatedCounter?.textContent).toBe("14/500"); // "Nowa odpowiedź" ma 14 znaków
    });
  });
});
