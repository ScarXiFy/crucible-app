import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createRouteSupabase } from "@/lib/supabase/route";
import type { Database } from "@/lib/types";

type Profile = Database["public"]["Tables"]["users"]["Row"];

type RouteUserResult = {
  supabase: SupabaseClient<Database> | null;
  user: User | null;
  profile: Profile | null;
  response: NextResponse | null;
};

export async function requireRouteUser(): Promise<RouteUserResult> {
  const supabase = await createRouteSupabase();

  if (!supabase) {
    return {
      supabase: null,
      user: null,
      profile: null,
      response: NextResponse.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 },
      ),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      profile: null,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id,email,role,created_at")
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, profile, response: null };
}
