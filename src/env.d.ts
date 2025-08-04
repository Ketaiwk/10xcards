/// <reference types="astro/client" />

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./db/database.types.ts";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user?: User;
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly SUPABASE_SERVICE_KEY: string;
  readonly VITE_OPENROUTER_API_KEY: string;  // zmieniono na VITE_
  readonly TEST_USER_EMAIL: string;
  readonly TEST_USER_TOKEN: string;
  readonly TEST_USER_PASSWORD: string;
  readonly TEST_USER_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
