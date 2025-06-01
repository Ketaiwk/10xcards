# REST API Plan

## 1. Resources

### 1.1. FlashcardSet

- Maps to `flashcard_sets` table
- Represents a collection of flashcards
- Contains metadata about AI generation

### 1.2. Flashcard

- Maps to `flashcards` table
- Represents individual flashcards within a set
- Supports different creation types (AI-generated, AI-edited, manual)

### 1.3. User

- Managed by Supabase Auth
- Extended with custom profile data in `users` table

## 2. Endpoints

### 2.1. Flashcard Sets

#### 2.1.1. Create Flashcard Set

- **Method**: POST
- **Path**: `/api/flashcard-sets`
- **Description**: Creates a new flashcard set, optionally generating AI flashcards if source text is provided
- **Request Body**:
  ```json
  {
    "name": "string (required, max 255 chars)",
    "description": "string (optional)",
    "source_text": "string (optional, min 1000 chars, max 10000 chars)",
    "generate_ai_cards": "boolean (default: false)"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "sourceText": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "aiGeneratedCount": "number",
    "aiAcceptedCount": "number",
    "aiEditedCount": "number",
    "manualCount": "number",
    "generationDuration": "number"
  }
  ```
- **Errors**:
  - 400: Invalid input data
  - 429: Too many AI generation requests

#### 2.1.2. List Flashcard Sets

- **Method**: GET
- **Path**: `/api/flashcard-sets`
- **Description**: Retrieves user's flashcard sets with pagination
- **Query Parameters**:
  - page: number (default: 1)
  - limit: number (default: 10, max: 50)
  - sortBy: string (created_at, updated_at, name)
  - sortOrder: string (asc, desc)
- **Response**: 200 OK
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "aiGeneratedCount": "number",
        "aiAcceptedCount": "number",
        "aiEditedCount": "number",
        "manualCount": "number"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
  ```

#### 2.1.3. Get Flashcard Set

- **Method**: GET
- **Path**: `/api/flashcard-sets/{id}`
- **Description**: Retrieves a specific flashcard set with its metadata
- **Response**: 200 OK
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "sourceText": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "aiGeneratedCount": "number",
    "aiAcceptedCount": "number",
    "aiEditedCount": "number",
    "manualCount": "number",
    "generationDuration": "number"
  }
  ```
- **Errors**:
  - 404: Set not found

#### 2.1.4. Update Flashcard Set

- **Method**: PATCH
- **Path**: `/api/flashcard-sets/{id}`
- **Description**: Updates flashcard set metadata
- **Request Body**:
  ```json
  {
    "name": "string (optional)",
    "description": "string (optional)",
    "isDeleted": "boolean (optional)"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "updatedAt": "timestamp"
  }
  ```
- **Errors**:
  - 404: Set not found
  - 400: Invalid input data

### 2.2. Flashcards

#### 2.2.1. Create Flashcard

- **Method**: POST
- **Path**: `/api/flashcard-sets/{setId}/flashcards`
- **Description**: Creates a new flashcard in a set
- **Request Body**:
  ```json
  {
    "question": "string (required, max 200 chars)",
    "answer": "string (required, max 500 chars)",
    "creationType": "enum (manual)"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "id": "uuid",
    "setId": "uuid",
    "question": "string",
    "answer": "string",
    "creationType": "string",
    "createdAt": "timestamp"
  }
  ```
- **Errors**:
  - 400: Invalid input data
  - 404: Set not found
  - 409: Flashcard limit exceeded (30 per set)

#### 2.2.2. List Set Flashcards

- **Method**: GET
- **Path**: `/api/flashcard-sets/{setId}/flashcards`
- **Description**: Retrieves flashcards from a set
- **Query Parameters**:
  - page: number (default: 1)
  - limit: number (default: 30)
  - creationType: string (ai_generated, ai_edited, manual)
- **Response**: 200 OK
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "setId": "uuid",
        "question": "string",
        "answer": "string",
        "creationType": "string",
        "createdAt": "timestamp"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
  ```
- **Errors**:
  - 404: Set not found

#### 2.2.3. Update Flashcard

- **Method**: PATCH
- **Path**: `/api/flashcard-sets/{setId}/flashcards/{id}`
- **Description**: Updates a flashcard's content
- **Request Body**:
  ```json
  {
    "question": "string (optional)",
    "answer": "string (optional)",
    "isDeleted": "boolean (optional)"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "id": "uuid",
    "setId": "uuid",
    "question": "string",
    "answer": "string",
    "creationType": "string",
    "createdAt": "timestamp"
  }
  ```
- **Errors**:
  - 400: Invalid input data
  - 404: Flashcard or set not found

## 3. Authentication & Authorization

### 3.1. Authentication

- Uses Supabase Auth for JWT-based authentication
- JWT token must be included in Authorization header
- Format: `Authorization: Bearer <token>`

### 3.2. Authorization

- Row Level Security (RLS) enforced at database level
- API endpoints verify user ownership of resources
- Users can only access their own flashcard sets and cards

## 4. Validation & Business Logic

### 4.1. Validation Rules

- Flashcard Set:

  - Name: Required, max 255 characters
  - Description: Optional
  - Source Text: Optional min 100 chars, max 10000 chars
  - Maximum 30 flashcards per set

- Flashcard:
  - Question: Required, max 200 characters
  - Answer: Required, max 500 characters
  - Creation Type: Required, must be one of: ai_generated, ai_edited, manual

### 4.2. Business Logic Implementation

#### 4.2.1. AI Generation

- Triggered during flashcard set creation if sourceText is provided
- Rate limited to prevent abuse
- Updates AI-related counters automatically
- Records generation duration

#### 4.2.2. Soft Delete

- Implemented via isDeleted flag
- Affects visibility in list endpoints
- Maintains data for analytics

#### 4.2.3. Statistics Tracking

- Automatic counter updates via database triggers
- Tracks AI-generated, AI-edited, and manual flashcards
- Updates counters on creation and soft delete
