// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vvpdemhsuufwogokpkzx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cGRlbWhzdXVmd29nb2twa3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzYyMzIsImV4cCI6MjA2NTUxMjIzMn0.aIXBPnTF6u4J9zANFiqNZH2dn-wRvjiV08poSLkKDMw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);