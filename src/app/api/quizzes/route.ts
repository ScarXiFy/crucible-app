import { NextResponse } from "next/server";
import { createRouteSupabase } from "@/lib/supabase/route";
import { requireRouteUser } from "@/lib/api";

export async function GET() {
  const supabase = await createRouteSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase environment variables are missing." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("quizzes")
    .select("id,title,description,subject,created_at,is_published,created_by,questions(id)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ quizzes: data });
}

export async function POST(request: Request) {
  const { supabase, user, profile, response } = await requireRouteUser();

  if (response) {
    return response;
  }

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    subject?: string;
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Quiz title is required." }, { status: 400 });
  }

  const { data, error } = await supabase!
    .from("quizzes")
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      subject: body.subject?.trim() || null,
      created_by: user!.id,
      is_published: true,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
