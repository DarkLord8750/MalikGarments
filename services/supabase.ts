import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION: Replace these with your actual Supabase Project details
// You can find these in your Supabase Dashboard -> Project Settings -> API
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://wfmiabfrbcixgqfvzvpa.supabase.co';
// WARNING: The key below is a placeholder. You MUST replace it with your actual 'anon' public key.
// It usually starts with "ey..."
const SUPABASE_ANON_KEY = 'sb_publishable__n3E5aeXRSdGfPZfY6rxtA_ZyDempJv';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
