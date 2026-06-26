// ─────────────────────────────────────────────────────────────
// Centralized, validated configuration. Fail fast on missing vars.
// (04_SYSTEM_ARCHITECTURE · Environment Variables)
//
// This module only exposes PUBLIC (NEXT_PUBLIC_*) values, so it is
// safe to import from both Server and Client Components. Server-only
// secrets are read in the server modules that need them.
// ─────────────────────────────────────────────────────────────

function requiredPublic(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local.`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: requiredPublic(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  supabasePublishableKey: requiredPublic(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
} as const;
