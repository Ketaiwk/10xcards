import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function KeyboardShortcutHint() {
  const shortcuts = [
    { key: "Ctrl+S", description: "Zapisz zestaw" },
    { key: "Esc", description: "Anuluj edycję" },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="text-muted-foreground" aria-label="Pokaż skróty klawiszowe">
              ⌨️ Skróty
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <div className="space-y-2">
              <p className="font-medium">Dostępne skróty:</p>
              <ul className="text-sm">
                {shortcuts.map(({ key, description }) => (
                  <li key={key} className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">{key}</kbd>
                    <span>{description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
