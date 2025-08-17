<conversation_summary> <decisions> 1. Generowanie fiszek przez AI będzie pokazywane poprzez ikonę postępu/ładowania 2. Limit fiszek (30) będzie kontrolowany przez licznik lub blokadę tworzenia 3. Edycja fiszek będzie odbywać się w modalach 4. Rozróżnienie typów fiszek poprzez ikony (AI, edytowane, manualne) 5. Brak widoku podglądu pojedynczej fiszki w trybie nauki 6. Brak wyświetlania statystyk zestawu na tym etapie 7. Podczas generowania przez AI: - Animowana ikona loading - Placeholdery dla generowanych fiszek - Wyświetlanie każdej wygenerowanej fiszki na bieżąco 8. Implementacja paginacji zamiast infinite scroll 9. Walidacja limitów znaków poprzez blokadę wprowadzania i tooltips/komunikaty inline 10. Explicit save zamiast autosave 11. Brak mechanizmu drag & drop 12. Pojedyncze usuwanie fiszek (bez masowego zaznaczania) 13. Brak historii zmian fiszek 14. Brak skrótów klawiaturowych </decisions> <matched_recommendations> 1. Struktura komponentów UI: - Card jako bazowy komponent dla fiszek - Dialog do edycji fiszek - Toast do notyfikacji - Pagination do nawigacji między stronami - Progress indicators dla operacji AI
Architektura widoków:

/auth/\* dla logowania/rejestracji
/sets dla dashboardu z zestawami
/sets/new dla tworzenia zestawu
/sets/[id] dla widoku zestawu
/sets/[id]/edit dla edycji zestawu
Mechanizmy UI:

Explicit save buttons
Inline validation
Loading states
Error handling na poziomie UI
Responsywny design
Integracja z API:

Obsługa paginacji
Zarządzanie stanem ładowania
Handling błędów
Optymistyczne aktualizacje UI</matched_recommendations>
<ui_architecture_planning_summary> MVP koncentruje się na podstawowej funkcjonalności zarządzania fiszkami z naciskiem na prostotę i użyteczność. Architektura UI jest zorganizowana wokół głównych widoków (dashboard, tworzenie/edycja zestawów) z wykorzystaniem komponentów Shadcn/ui. Interakcje z AI są uproszczone do niezbędnego minimum, z jasnym feedbackiem dla użytkownika. System wykorzystuje modalne formularze do edycji, klasyczną paginację i proste mechanizmy walidacji. Bezpieczeństwo opiera się na podstawowej autoryzacji Supabase, a responsywność jest zapewniona przez Tailwind CSS. </ui_architecture_planning_summary> <unresolved_issues> 1. Szczegółowa strategia obsługi błędów API na poziomie UI 2. Konkretne breakpointy dla responsywnego designu 3. Dokładne metryki wydajności dla operacji AI 4. Szczegółowe wymagania dotyczące dostępności (ARIA, keyboard navigation) 5. Strategia cachowania danych na froncie </unresolved_issues> </conversation_summary>
