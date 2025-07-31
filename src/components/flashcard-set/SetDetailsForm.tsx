import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SetDetailsFormProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  disabled?: boolean;
  error?: {
    name?: string;
    description?: string;
  };
}

export function SetDetailsForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  disabled,
  error,
}: SetDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nazwa zestawu
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Wprowadź nazwę zestawu..."
          maxLength={100}
          disabled={disabled}
          aria-describedby={error?.name ? "name-error" : undefined}
          className={error?.name ? "border-red-500" : ""}
        />
        {error?.name && (
          <p id="name-error" className="text-sm text-red-500">
            {error.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Opis zestawu (opcjonalny)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Wprowadź opis zestawu..."
          maxLength={500}
          disabled={disabled}
          aria-describedby={error?.description ? "description-error" : undefined}
          className={error?.description ? "border-red-500" : ""}
        />
        {error?.description && (
          <p id="description-error" className="text-sm text-red-500">
            {error.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground text-right">{description.length}/500</p>
      </div>
    </div>
  );
}
