import { NextResponse, type NextRequest } from "next/server";
import { createRouteSupabase } from "@/lib/supabase/route";

function getSafeRedirectPath(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectPath = getSafeRedirectPath(request);

  if (!code) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const supabase = await createRouteSupabase();

  if (!supabase) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(authUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email ?? "",
        role: "student",
      });
    }
  }

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
