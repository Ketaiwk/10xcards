import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  onDeleteAll: () => Promise<void>;
  onDeleteSet: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}

export function ActionButtons({ onSave, onDeleteAll, onDeleteSet, isSaving, isDeleting }: ActionButtonsProps) {
  const handleDeleteAll = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć wszystkie fiszki?")) {
      await onDeleteAll();
    }
  };

  const handleDeleteSet = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć cały zestaw?")) {
      await onDeleteSet();
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={onSave}
        disabled={isSaving || isDeleting}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSaving ? "Zapisywanie..." : "Zapisz zestaw"}
      </Button>
      <Button
        variant="outline"
        onClick={handleDeleteAll}
        disabled={isSaving || isDeleting}
        className="text-destructive hover:bg-destructive/10"
      >
        {isDeleting ? "Usuwanie..." : "Usuń wszystkie fiszki"}
      </Button>
      <Button variant="destructive" onClick={handleDeleteSet} disabled={isSaving || isDeleting}>
        {isDeleting ? "Usuwanie..." : "Usuń zestaw"}
      </Button>
    </div>
  );
}
