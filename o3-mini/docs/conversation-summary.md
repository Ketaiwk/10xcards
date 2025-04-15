<conversation_summary>
    <decisions>
        1. Produkt ma automatycznie generować fiszki przez AI na podstawie wklejonego tekstu, z możliwością manualnej edycji (inline).
        2. Fiszki muszą składać się z dwóch stron: pytania (maks. 200 znaków) oraz odpowiedzi (maks. 500 znaków) z wbudowaną walidacją ograniczeń.
        3. Formularze używane do tworzenia i edytowania fiszek muszą zawierać walidację liczby znaków, wyświetlając komunikaty o przekroczeniu limitów.
        4. Proces generowania fiszek ma być uproszczony i automatyczny, bez dodatkowych opcji manualnych modyfikacji algorytmu.
        5. Na etapie MVP nie przewiduje się dodatkowych wskazówek dla użytkownika dotyczących wyboru istotnych informacji ani historii zmian.
        6. System autoryzacji użytkowników będzie oparty na standardowych metodach.
        7. MVP nie obejmuje zaawansowanych funkcji (np. zaawansowany algorytm powtórek, import wielu formatów, współdzielenie fiszek, integracje z innymi platformami czy aplikacje mobilne).
    </decisions>
    <matched_recommendations>
        1. Skoncentrować interfejs na prostocie generowania fiszek przez AI oraz umożliwić edycję inline.
        2. Zastosować walidację znaków w formularzu z wyraźnymi komunikatami o przekroczeniu limitów.
        3. Zaprojektować formularz z czytelnym podziałem na dwie sekcje: pytanie i odpowiedź.
        4. Przeprowadzić testy z użytkownikami, aby potwierdzić intuicyjność interfejsu i skuteczność automatycznego generowania fiszek.
    </matched_recommendations>
    <prd_planning_summary> 
        **Główne wymagania funkcjonalne:**
            • Generowanie fiszek przez AI
            • Możliwość edycji fiszek inline
            • Przeglądanie, usuwanie oraz tworzenie fiszek przez użytkownika
            • Prosty system kont użytkowników
        **Kluczowe historie użytkownika:** 
            • Użytkownik wkleja tekst, na podstawie którego AI generuje fiszki. 
            • Użytkownik przegląda wygenerowane fiszki, edytuje treść fiszek inline lub tworzy własne. 
        **Ważne kryteria sukcesu:** 
            • 75% fiszek wygenerowanych przez AI musi być akceptowanych przez użytkownika. 
        **Interfejs:** 
            • Walidacja wprowadzanych danych ograniczająca liczbę znaków (200 znaków dla pytania, 500 znaków dla odpowiedzi). 
    </prd_planning_summary> 
    <unresolved_issues> 
        1. Wybór konkretnego rozwiązania open source do integracji algorytmu powtórek pozostaje otwarty.
    </unresolved_issues>
</conversation_summary>