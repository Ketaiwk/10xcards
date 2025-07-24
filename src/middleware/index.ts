import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client";
import { createClient } from "@supabase/supabase-js";

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  locals.supabase = supabaseClient;

  // Get JWT token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    
    // Get user data from token
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    
    if (!error && user) {
      locals.user = user;
      // Create a new client instance with the user token
      const supabaseUrl = import.meta.env.SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
      locals.supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }

  return next();
});
