import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/types";

type Profile = Database["public"]["Tables"]["users"]["Row"];

type CurrentUserResult = {
  supabase: SupabaseClient<Database> | null;
  authUser: User | null;
  profile: Profile | null;
};

export async function createServerSupabase() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Server Components cannot set response cookies. The proxy handles refreshes.
      },
    },
  });
}

export async function getCurrentUser(): Promise<CurrentUserResult> {
  const supabase = await createServerSupabase();

  if (!supabase) {
    return { supabase: null, authUser: null, profile: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, authUser: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id,email,role,created_at")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, authUser: user, profile };
}
