import { z } from 'zod';

export interface OpenRouterConfig {
  apiKey: string;
  defaultModel: string;
  maxRetries: number;
  timeout: number;
  baseURL: string;
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  responseFormat?: ResponseFormat;
}

export interface ResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: {
      type: 'object';
      properties: Record<string, unknown>;
      required: string[];
    };
  };
}

export interface FlashcardResponse {
  front: string;
  back: string;
  tags?: string[];
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: number;
    completion: number;
  };
}

export enum OpenRouterErrorType {
  AUTH_ERROR = 'auth_error',
  RATE_LIMIT = 'rate_limit',
  VALIDATION_ERROR = 'validation_error',
  NETWORK_ERROR = 'network_error',
  API_ERROR = 'api_error',
  MODEL_ERROR = 'model_error',
}

export class OpenRouterError extends Error {
  constructor(
    public type: OpenRouterErrorType,
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}
