// Server Supabase client (Server Components, Server Actions, Route
// Handlers). Next 16: cookies() is async, so this factory is async.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, hasSupabase } from "@/lib/env";
import type { Database } from "@/types/database";

export async function createClient() {
  if (!hasSupabase || !env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error("Supabase is not configured.");
  }
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — safe to ignore;
            // the middleware refreshes the session cookies instead.
          }
        },
      },
    },
  );
}
