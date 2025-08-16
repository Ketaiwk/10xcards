import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface NavigationBarProps {
  user:
    | {
        email: string | null;
      }
    | null
    | undefined;
}

export function NavigationBar({ user }: NavigationBarProps) {

  useEffect(() => {
    let authListener: { unsubscribe: () => void } | null = null;
    let mounted = true;

    const setupAuthListener = async () => {
      const supabaseClient = getSupabaseClient();
      
      // Ustawiamy event listener na zmiany w sesji
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
        (event, session) => {
          if (!mounted) return;
          
          // Aktualizujemy atrybuty nawigacji
          const nav = document.querySelector('[data-testid="navigation-bar"]');
          if (nav) {
            nav.setAttribute('data-hydrated', 'true');
            nav.setAttribute('data-user-loaded', session?.user ? 'true' : 'false');
            nav.setAttribute('data-auth-state', event);
          }
        }
      );
      authListener = subscription;
      
      // Sprawdzamy początkowy stan sesji
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!mounted) return;
        
        const nav = document.querySelector('[data-testid="navigation-bar"]');
        if (nav) {
          nav.setAttribute('data-hydrated', 'true');
          nav.setAttribute('data-user-loaded', session?.user ? 'true' : 'false');
          nav.setAttribute('data-initial-check', 'true');
          nav.setAttribute('data-auth-state', session ? 'SIGNED_IN' : 'SIGNED_OUT');
        }
      } catch (error) {
        console.error("NavigationBar session check error:", error);
      }
    };

    setupAuthListener();

    // Cleanup
    return () => {
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);
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

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/auth/login";
  };

  return (
    <nav className="w-full border-b" role="banner" data-testid="navigation-bar">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">
          10xCards
        </a>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                  data-testid="user-menu-trigger"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Menu użytkownika</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56"
                data-test-id="user-menu-content"
                data-testid="user-menu-content"
              >
                <div
                  className="px-2 py-1.5 text-sm text-muted-foreground"
                  data-test-id="user-email"
                  data-testid="user-email"
                >
                  {user.email}
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                  data-test-id="logout-button"
                  data-testid="logout-button"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleLogin}
              data-test-id="nav-login-button"
              data-testid="nav-login-button" // dodajemy też standardowy atrybut
              className="nav-login-button" // dodajemy klasę dla łatwiejszej lokalizacji
            >
              Zaloguj się
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
