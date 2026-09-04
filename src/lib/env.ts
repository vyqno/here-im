// ─────────────────────────────────────────────────────────────
// Centralized, validated configuration. Fail fast on missing vars.
// (04_SYSTEM_ARCHITECTURE · Environment Variables)
//
// This module only exposes PUBLIC (NEXT_PUBLIC_*) values, so it is
// safe to import from both Server and Client Components. Server-only
// secrets are read in the server modules that need them.
// ─────────────────────────────────────────────────────────────

function optionalPublic(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const env = {
  supabaseUrl: optionalPublic(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabasePublishableKey: optionalPublic(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
} as const;

/** False when running locally without a `.env.local` — UI still works. */
export const hasSupabase = Boolean(
  env.supabaseUrl && env.supabasePublishableKey,
);
