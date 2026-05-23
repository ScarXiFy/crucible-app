"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/types";

let client: SupabaseClient<Database> | null = null;

export function createBrowserSupabase() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  if (!client) {
    client = createBrowserClient<Database>(env.url, env.anonKey);
  }

  return client;
}
