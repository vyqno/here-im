// Browser Supabase client (Client Components).
// Typed with the generated Database schema.
import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabase } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient() {
  if (!hasSupabase || !env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
  );
}
