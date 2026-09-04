import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

// OAuth (Google / Apple) redirect target. Exchanges the auth code for a
// session and sets the auth cookies, then returns the user to the app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code && hasSupabase) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
