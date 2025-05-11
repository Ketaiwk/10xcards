Polecenie dla generatora Proof of Concept (PoC):

Cel: Zweryfikować podstawową funkcjonalność aplikacji – generowanie fiszek edukacyjnych za pomocą AI, bez nadmiarowych funkcji.

Wymagania funkcjonalne:
1. Użytkownik wprowadza tekst wejściowy w dedykowanym polu max 1000 znaków.
2. System wysyła tekst do API Openrouter.ai w celu wygenerowania 10-20 fiszek na podstawie wprowadzonego tekstu.
3. Fiszki zawierają:
   - Pytanie – max 200 znaków,
   - Odpowiedź – max 500 znaków.
4. Minimalny interfejs użytkownika, umożliwiający tylko wprowadzenie tekstu oraz prezentację wygenerowanych fiszek.
5. Użytkownik ma możliwość zaakceptowania zaproponowanej fiszki, edycji lub odrzucenia fiszki. 
6. Użytkownik moe dodać własną fiszkę.
7. Użytkownik może zapisać zestaw fiszek aby do niego wrócić.

Stack technologiczny:
- Frontend: Astro 5, React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui.
- Backend i baza danych: Supabase.
- Komunikacja z AI: Openrouter.ai.
- CI/CD i Hosting: Github Actions, DigitalOcean (opcjonalnie, jeśli dotyczy automatyzacji wdrożeń).

Plan pracy:
1. Opracowanie szczegółowego planu implementacji z podziałem na frontend oraz backend.
    - Frontend: Implementacja UI do pobierania tekstu i wyświetlania fiszek.
    - Backend: Konfiguracja połączenia z Supabase oraz integracja z Openrouter.ai do generowania fiszek.
2. Opis sposobu komunikacji między frontend a backend, wraz z logiką walidacji znaków.
3. Przed przystąpieniem do właściwego tworzenia PoC, przedstaw szczegółowy plan implementacji i uzyskaj akceptację przed kontynuowaniem.
4. Po otrzymaniu akceptacji, rozpocznij implementację PoC.

Proszę o potwierdzenie, czy powyższy plan działania jest akceptowalny, zanim rozpocznie się tworzenie Proof of Concept.