import { z } from "zod";

export const openRouterConfigSchema = z.object({
  apiKey: z.string().min(1),
  defaultModel: z.string().min(1),
  maxRetries: z.number().int().min(0).max(10),
  timeout: z.number().int().min(1000).max(120000),
  baseURL: z.string().url(),
});

export const generateOptionsSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(4000).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
});

export const flashcardResponseSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
});

export const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

export const completionResponseSchema = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    })
  ),
});

export const modelInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  pricing: z.object({
    prompt: z.number(),
    completion: z.number(),
  }),
});
