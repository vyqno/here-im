// Refreshes the Supabase auth session on every matched request and
// keeps the auth cookies in sync between the browser and the server.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, hasSupabase } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  if (!hasSupabase || !env.supabaseUrl || !env.supabasePublishableKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient<Database>(
      env.supabaseUrl,
      env.supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
        global: {
          // Dead/slow Supabase must not hold the edge isolate until Vercel 504s.
          fetch: (input, init) =>
            fetch(input, { ...init, signal: AbortSignal.timeout(2000) }),
        },
      },
    );

    await supabase.auth.getUser();
  } catch {
    return NextResponse.next({ request });
  }

  return response;
}
