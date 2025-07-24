import { createClient } from '@supabase/supabase-js';

// Use environment variables or default local values
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9zZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const testUserEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
const testUserPassword = process.env.TEST_USER_PASSWORD || 'test123456';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getToken() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: testUserEmail,
    password: testUserPassword
  });

  if (error) {
    console.error('Error getting token:', error.message);
    process.exit(1);
  }

  console.log('Access Token:', data.session?.access_token);
}

getToken();
