import { createClient } from "@supabase/supabase-js";

// Use environment variables or default local values
const supabaseUrl = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.SUPABASE_KEY || '';
const testUserToken = process.env.TEST_USER_TOKEN;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addUser() {
  if (!testUserToken) {
    console.error("TEST_USER_TOKEN environment variable is required");
    return;
  }

  // First get the user from auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(testUserToken);

  if (error) {
    console.error("Error getting user:", error);
    return;
  }

  if (!user) {
    console.error("User not found");
    return;
  }

  console.log("User ID:", user.id);
  console.log("User email:", user.email);

  // Now add user to public.users table using service role
  const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY || '';
  const supabaseService = createClient(supabaseUrl, serviceRoleKey);

  const { data, error: insertError } = await supabaseService.from("users").insert({
    id: user.id,
    email: user.email,
    confirmed_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Error inserting user:", insertError);
  } else {
    console.log("User inserted successfully!");
  }
}

addUser();
