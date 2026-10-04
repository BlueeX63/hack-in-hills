import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export const supabaseConfigured = isHttpUrl(rawUrl) && Boolean(rawKey);

if (!supabaseConfigured && typeof window !== "undefined") {
  console.warn(
    "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL (an https:// URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the dev server. Forms will not submit until then."
  );
}

// Never throw at import time: the homepage imports this via the contact form, so a missing or
// malformed value (empty string, a pasted placeholder, no scheme) would take the whole site
// down. Fall back to a placeholder host instead; the page renders and a form submit comes back
// as an ordinary `{ error }` for the existing handlers to show.
export const supabase = createClient(
  supabaseConfigured ? rawUrl! : "https://placeholder.invalid",
  supabaseConfigured ? rawKey! : "placeholder-anon-key"
);
