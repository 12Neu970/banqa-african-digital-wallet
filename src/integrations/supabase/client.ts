// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://opaofqqwvzxlzkmueqyv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYW9mcXF3dnp4bHprbXVlcXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTQxMjcsImV4cCI6MjA2NTgzMDEyN30.tLGIM0_Y-GNa4tumMr1HHx3qkMtRYYo2FrdquQ41arc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);