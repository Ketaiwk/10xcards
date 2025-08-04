import axios from 'axios';
import type { Axios } from 'axios';
import type { 
  OpenRouterConfig, 
  GenerateOptions, 
  FlashcardResponse, 
  ModelInfo
} from './openrouter.types';
import { OpenRouterError, OpenRouterErrorType } from './openrouter.types';
import { validateConfig } from './openrouter.config';
import { generateOptionsSchema, flashcardResponseSchema, modelInfoSchema } from './openrouter.schema';

export class OpenRouterService {
  private readonly config: OpenRouterConfig;
  private readonly client: Axios;
  private currentModel: string;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
      defaultModel: "openai/gpt-4o-mini",
      maxRetries: 3,
      timeout: 30000,
      baseURL: "https://openrouter.ai/api/v1",
    };

    validateConfig(this.config);
    this.currentModel = this.config.defaultModel;
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://10xcards.com',
        'X-Title': '10xCards'
      }
    });

    // Log config status
    console.log('OpenRouter service initialized with API key:', !!this.config.apiKey);
  }

  public async generateFlashcards(
    sourceText: string,
    maxCards: number = 30,
    options: GenerateOptions = {},
    onProgress?: (progress: number, card: FlashcardResponse) => void
  ): Promise<FlashcardResponse[]> {
    const results: FlashcardResponse[] = [];
    const maxAttempts = maxCards + 5; // Zabezpieczenie przed nieskończoną pętlą
    let attempts = 0;

    try {
      generateOptionsSchema.parse(options);

      while (results.length < maxCards && attempts < maxAttempts) {
        const existingCards = results.map(card => ({front: card.front, back: card.back}));
        
        const systemPrompt = `Jesteś ekspertem w tworzeniu fiszek edukacyjnych.

WAŻNE: Odpowiedz dokładnie w podanym formacie JSON. Zawsze zaczynaj od { i kończ na }.

Twoja odpowiedź MUSI być w tym formacie (nic więcej):
{
  "front": "Pytanie do 200 znaków",
  "back": "Zwięzła odpowiedź do 500 znaków"
}

Zasady dla pytań (front):
1. Używaj różnorodnych form pytań:
   - "Co to jest...?"
   - "Jak...?"
   - "Dlaczego...?"
   - "Kiedy...?"
   - "Gdzie...?"
   - "Który/Która/Które...?"
   - "Ile...?"
   - "W jaki sposób...?"
   - "Jakie są...?"
   - "Z czego...?"
   - "Po co...?"
2. Pytanie musi być konkretne i jednoznaczne
3. Nie powtarzaj tych samych form pytań

Zasady dla odpowiedzi (back):
1. Zwięzła, konkretna odpowiedź
2. Maksymalnie 2 zdania
3. Używaj tylko języka polskiego
4. Unikaj powtórzeń z pytania

Ogólne zasady:
1. Generuj TYLKO JEDNĄ fiszkę
2. Fiszka musi być UNIKALNA - nie może się powtarzać z już wygenerowanymi
3. Zachowaj DOKŁADNY format JSON
4. Każda fiszka powinna dotyczyć innego aspektu tekstu

Już wygenerowane fiszki (NIE POWTARZAJ ICH):
${JSON.stringify(existingCards, null, 2)}`;

        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: sourceText }
        ];

        console.log('Sending request to OpenRouter (' + (results.length + 1) + '/' + maxCards + ')...');
        
        try {
          const response = await this.client.post('/chat/completions', {
            model: this.currentModel,
            messages,
            temperature: 0.7,     // Zwiększamy temperaturę dla większej różnorodności
            max_tokens: 300,      // Wystarczy na jedną fiszkę
            frequency_penalty: 0.3,// Lekko zwiększamy dla różnorodności
            presence_penalty: 0.3, // Lekko zwiększamy dla różnorodności
            stream: false,
            stop: null
          });

          if (!response.data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from OpenRouter');
          }

          const newCard = flashcardResponseSchema.parse(
            JSON.parse(response.data.choices[0].message.content)
          );

          // Sprawdź czy nie ma duplikatu
          const isDuplicate = results.some(
            card => card.front === newCard.front || card.back === newCard.back
          );

          if (!isDuplicate) {
            results.push(newCard);
            console.log('Generated flashcard ' + results.length + '/' + maxCards);
            // Aktualizuj postęp i przekaż nową fiszkę
            if (onProgress) {
              const progress = Math.round((results.length / maxCards) * 100);
              onProgress(progress, newCard);
            }
          } else {
            console.log('Duplicate card detected, retrying...');
          }
        } catch (error) {
          console.error('Error generating flashcard ' + (results.length + 1) + ':', error);
        }

        attempts++;
        
        // Dodaj małe opóźnienie między requestami
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error('OpenRouter error:', error);
      if (error instanceof Error) {
        throw new OpenRouterError(
          OpenRouterErrorType.API_ERROR,
          `Failed to generate flashcard: ${error.message}`,
          error
        );
      }
      throw error;
    } finally {
      console.log('Generation completed, results:', results.length);
    }

    return results;
  }

  public async getAvailableModels(): Promise<ModelInfo[]> {
    try {
      const response = await this.client.get('/models');
      return response.data.data.map((model: unknown) => modelInfoSchema.parse(model));
    } catch (error) {
      if (error instanceof Error) {
        throw new OpenRouterError(
          OpenRouterErrorType.API_ERROR,
          `Failed to fetch models: ${error.message}`,
          error
        );
      }
      throw error;
    }
  }

  public setModel(modelName: string): void {
    if (!modelName || typeof modelName !== 'string') {
      throw new Error('Invalid model name');
    }
    this.currentModel = modelName;
  }
}
