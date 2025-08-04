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
      defaultModel: "openai/gpt-4",
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

  public async generateFlashcard(
    sourceText: string,
    options: GenerateOptions = {}
  ): Promise<FlashcardResponse> {
    let result = null;

    try {
      generateOptionsSchema.parse(options);

      const systemPrompt = `Jesteś ekspertem w tworzeniu fiszek. Używaj tylko języka polskiego.

Format odpowiedzi (JSON):
{
  "front": "Pytanie lub pojęcie",
  "back": "Krótka, zwięzła odpowiedź (max 2-3 zdania)",
  "tags": ["2-4 tagi tematyczne"]
}

Zasady:
1. Przednia strona: jedno precyzyjne pytanie
2. Tylna strona: zwięzła odpowiedź
3. Tagi: 2-4 słowa kluczowe

Przykład:
{
  "front": "Jakie jest główne zastosowanie metody spaced repetition?",
  "back": "Efektywne zapamiętywanie poprzez powtarzanie w optymalnych odstępach czasu.",
  "tags": ["nauka", "pamięć", "metodologia"]
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: sourceText }
      ];

      console.log('Sending request to OpenRouter...');
      
      const response = await this.client.post('/chat/completions', {
        model: this.currentModel,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        frequency_penalty: 0,
        presence_penalty: 0
      });

      console.log('OpenRouter response:', response.data);

      if (!response.data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenRouter');
      }

      result = flashcardResponseSchema.parse(
        JSON.parse(response.data.choices[0].message.content)
      );
      
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
      console.log('Generation attempt completed, result:', !!result);
    }

    return result!;
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
