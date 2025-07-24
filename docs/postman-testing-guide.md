# Instrukcje testowania API Flashcards w Postmanie

Ten dokument zawiera szczegółowe instrukcje dotyczące testowania nowych endpointów API do zarządzania fiszkami w aplikacji 10xCards.

## 🚀 Przygotowanie do testowania

### 1. Uruchom aplikację lokalnie

```bash
cd /Users/dorota.krzos@schibsted.pl/10xDevs/10xCards
pnpm dev
```

### 2. Przygotuj token autoryzacji

Użyj skryptu do wygenerowania tokenu testowego:

```bash
pnpm tsx scripts/get-test-token.ts
```

**Skopiuj token z outputu** - będzie potrzebny w każdym żądaniu.

### 3. Utwórz zestaw fiszek (jeśli nie masz)

Przed testowaniem fiszek musisz mieć istniejący zestaw. Użyj endpointu:
- **POST** `http://localhost:4321/api/flashcard-sets`

## 📋 Kolekcja testów w Postmanie

### Ustawienia globalne

1. **Utwórz Environment w Postmanie:**
   - Name: `10xCards Local`
   - Variables:
     - `base_url`: `http://localhost:4321`
     - `auth_token`: `[TWÓJ_TOKEN_Z_SKRYPTU]`
     - `set_id`: `[ID_ZESTAWU_FISZEK]` (będzie ustawiony dynamicznie)

2. **Headers do wszystkich żądań:**
   - `Authorization`: `Bearer {{auth_token}}`
   - `Content-Type`: `application/json`

---

## 🧪 Test 1: Tworzenie fiszki (POST)

### Request Setup:
- **Method**: POST
- **URL**: `{{base_url}}/api/flashcard-sets/{{set_id}}/flashcards`
- **Headers**: 
  ```
  Authorization: Bearer {{auth_token}}
  Content-Type: application/json
  ```

### Body (JSON):
```json
{
  "question": "Co to jest TypeScript?",
  "answer": "TypeScript to statycznie typowany nadzbiór JavaScript który kompiluje się do czystego JavaScript.",
  "creation_type": "manual"
}
```

### Oczekiwana odpowiedź (201):
```json
{
  "id": "uuid",
  "set_id": "uuid", 
  "question": "Co to jest TypeScript?",
  "answer": "TypeScript to statycznie typowany nadzbiór JavaScript który kompiluje się do czystego JavaScript.",
  "creation_type": "manual",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Testy scenariuszy błędów:

#### ❌ Błąd walidacji (400)
```json
{
  "question": "",
  "answer": "Odpowiedź bez pytania",
  "creation_type": "manual"
}
```

#### ❌ Nieprawidłowy creation_type (400)
```json
{
  "question": "Pytanie testowe?",
  "answer": "Odpowiedź testowa",
  "creation_type": "invalid_type"
}
```

#### ❌ Za długie pytanie (400)
```json
{
  "question": "[STRING DŁUŻSZY NIŻ 200 ZNAKÓW]",
  "answer": "Odpowiedź",
  "creation_type": "manual"
}
```

---

## 🧪 Test 2: Listowanie fiszek (GET)

### Request Setup:
- **Method**: GET
- **URL**: `{{base_url}}/api/flashcard-sets/{{set_id}}/flashcards`

### Parametry query (opcjonalne):
- `page=1`
- `limit=10`
- `creation_type=manual`
- `sortBy=created_at`
- `sortOrder=desc`

### Przykładowe URL:
```
{{base_url}}/api/flashcard-sets/{{set_id}}/flashcards?page=1&limit=5&creation_type=manual
```

### Oczekiwana odpowiedź (200):
```json
{
  "items": [
    {
      "id": "uuid",
      "set_id": "uuid",
      "question": "Co to jest TypeScript?",
      "answer": "TypeScript to statycznie typowany nadzbiór JavaScript...",
      "creation_type": "manual",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5
}
```

### Testy scenariuszy:

#### ✅ Filtrowanie po creation_type:
- `?creation_type=ai_generated`
- `?creation_type=ai_edited`
- `?creation_type=manual`

#### ✅ Paginacja:
- `?page=1&limit=10`
- `?page=2&limit=5`

#### ✅ Sortowanie:
- `?sortBy=created_at&sortOrder=asc`
- `?sortBy=created_at&sortOrder=desc`

---

## 🧪 Test 3: Aktualizacja fiszki (PATCH)

### Request Setup:
- **Method**: PATCH
- **URL**: `{{base_url}}/api/flashcard-sets/{{set_id}}/flashcards/{{flashcard_id}}`

**Uwaga**: `{{flashcard_id}}` uzyskasz z odpowiedzi Test 1 (tworzenie) lub Test 2 (listowanie).

### Body (JSON) - tylko pytanie:
```json
{
  "question": "Co to jest TypeScript? (zaktualizowane)"
}
```

### Body (JSON) - tylko odpowiedź:
```json
{
  "answer": "TypeScript to statycznie typowany język programowania będący nadzbiorem JavaScript, który dodaje opcjonalne typowanie statyczne."
}
```

### Body (JSON) - soft delete:
```json
{
  "is_deleted": true
}
```

### Body (JSON) - pełna aktualizacja:
```json
{
  "question": "Jakie są główne korzyści TypeScript?",
  "answer": "TypeScript oferuje: 1) Statyczne typowanie, 2) Lepsze IDE support, 3) Wczesne wykrywanie błędów, 4) Lepszą refaktoryzację",
  "is_deleted": false
}
```

### Oczekiwana odpowiedź (200):
```json
{
  "id": "uuid",
  "set_id": "uuid",
  "question": "Jakie są główne korzyści TypeScript?",
  "answer": "TypeScript oferuje: 1) Statyczne typowanie...",
  "creation_type": "manual",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Testy scenariuszy błędów:

#### ❌ Pusty body (400)
```json
{}
```

#### ❌ Nieistniejąca fiszka (404)
URL: `{{base_url}}/api/flashcard-sets/{{set_id}}/flashcards/non-existent-uuid`

---

## 🚨 Testy scenariuszy błędów

### 1. Brak autoryzacji (401)
Usuń header `Authorization` z żądania.

**Oczekiwana odpowiedź:**
```json
{
  "error": "Unauthorized"
}
```

### 2. Nieprawidłowy token (401)
Ustaw `Authorization: Bearer invalid_token`

### 3. Nieistniejący zestaw (404)
Użyj nieprawidłowego `set_id` w URL:
```
{{base_url}}/api/flashcard-sets/non-existent-uuid/flashcards
```

**Oczekiwana odpowiedź:**
```json
{
  "error": "Flashcard set not found"
}
```

### 4. Przekroczenie limitu fiszek (409)
Utwórz 30 fiszek w zestawie, a następnie spróbuj utworzyć 31.

**Oczekiwana odpowiedź:**
```json
{
  "error": "Flashcard limit exceeded (30 per set)"
}
```

---

## 📁 Kolekcja Postman

### Import kolekcji
Utwórz nową kolekcję w Postmanie o nazwie "10xCards - Flashcards API" z następującymi żądaniami:

1. **Create Flashcard**
2. **List Flashcards** 
3. **List Flashcards with Filters**
4. **Update Flashcard - Question Only**
5. **Update Flashcard - Full Update**
6. **Soft Delete Flashcard**
7. **Test Invalid Set ID**
8. **Test Unauthorized**
9. **Test Validation Errors**

### Skrypty testowe w Postmanie

#### Pre-request Script (dla wszystkich żądań):
```javascript
// Auto-set environment variables if not present
if (!pm.environment.get("base_url")) {
    pm.environment.set("base_url", "http://localhost:4321");
}

// Check if auth_token is set
if (!pm.environment.get("auth_token")) {
    console.log("⚠️ Warning: auth_token not set in environment!");
}
```

#### Test Script (dla Create Flashcard):
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('set_id');
    pm.expect(jsonData).to.have.property('question');
    pm.expect(jsonData).to.have.property('answer');
    pm.expect(jsonData).to.have.property('creation_type');
    pm.expect(jsonData).to.have.property('created_at');
});

pm.test("Save flashcard ID to environment", function () {
    const jsonData = pm.response.json();
    pm.environment.set("flashcard_id", jsonData.id);
});
```

#### Test Script (dla List Flashcards):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has pagination structure", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('items');
    pm.expect(jsonData).to.have.property('total');
    pm.expect(jsonData).to.have.property('page');
    pm.expect(jsonData).to.have.property('limit');
});

pm.test("Items are arrays with flashcard structure", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.items).to.be.an('array');
    
    if (jsonData.items.length > 0) {
        const flashcard = jsonData.items[0];
        pm.expect(flashcard).to.have.property('id');
        pm.expect(flashcard).to.have.property('question');
        pm.expect(flashcard).to.have.property('answer');
        pm.expect(flashcard).to.have.property('creation_type');
    }
});
```

---

## 🔍 Debugowanie

### Sprawdzenie logów aplikacji
W terminalu gdzie uruchomione jest `pnpm dev`, sprawdzaj logi błędów.

### Typowe problemy:

1. **"Unauthorized"** - Sprawdź czy token jest aktualny
2. **"Flashcard set not found"** - Sprawdź czy `set_id` istnieje
3. **"Validation error"** - Sprawdź format danych w body
4. **500 Internal Server Error** - Sprawdź logi aplikacji

### Przydatne komendy debugowania:
```bash
# Sprawdź czy aplikacja działa
curl http://localhost:4321/

# Test połączenia z bazą danych przez API
pnpm tsx scripts/get-test-token.ts
```

---

## ✅ Checklist testowania

- [ ] Wszystkie endpointy zwracają prawidłowe statusy HTTP
- [ ] Walidacja danych wejściowych działa poprawnie
- [ ] Autoryzacja jest wymagana i weryfikowana
- [ ] Paginacja i filtrowanie działają
- [ ] Błędy są obsługiwane gracefully
- [ ] Response format jest zgodny z dokumentacją
- [ ] Limit fiszek (30 per set) jest egzekwowany
- [ ] Soft delete działa poprawnie

**Status**: ✅ Gotowe do testowania!
