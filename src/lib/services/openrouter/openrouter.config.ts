import type { OpenRouterConfig } from "./openrouter.types";
import { openRouterConfigSchema } from "./openrouter.schema";

// Sprawdź czy klucz API jest dostępny
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("VITE_OPENROUTER_API_KEY is not defined in environment variables");
}

const defaultConfig: OpenRouterConfig = {
  apiKey: apiKey || "", // Dodaj wartość domyślną aby uniknąć undefined
  defaultModel: "openai/gpt-4o-mini",
  maxRetries: 3,
  timeout: 30000,
  baseURL: "https://openrouter.ai/api/v1",
};

export const validateConfig = (config: OpenRouterConfig): void => {
  const result = openRouterConfigSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      "OpenRouter configuration error: Missing or invalid API key. " +
        "Please make sure VITE_OPENROUTER_API_KEY is set in your .env file and the server has been restarted."
    );
  }
};

export const mergeConfig = (userConfig: Partial<OpenRouterConfig>): OpenRouterConfig => {
  return { ...defaultConfig, ...userConfig };
};
