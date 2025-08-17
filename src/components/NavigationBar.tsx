import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";

interface NavigationBarProps {
  user:
    | {
        email: string | null;
      }
    | null
    | undefined;
}

export function NavigationBar({ user }: NavigationBarProps) {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <nav className="w-full border-b" role="banner">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">
          <span className="text-3xl font-bold">10xCards</span>
        </a>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <a
                href="/sets/new"
                className="text-lg px-3 py-2 hover:underline hover:text-primary transition-colors"
                style={{ border: "none", boxShadow: "none", fontWeight: "normal" }}
              >
                Nowe fiszki
              </a>
              <a
                href="/sets"
                className="text-lg px-3 py-2 hover:underline hover:text-primary transition-colors"
                style={{ border: "none", boxShadow: "none", fontWeight: "normal" }}
              >
                Moje zestawy fiszek
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Menu użytkownika</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">{user.email}</div>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default">
              <a href="/auth/login">Zaloguj się</a>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
