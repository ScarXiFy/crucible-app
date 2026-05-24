import { NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api";
import { createRouteSupabase } from "@/lib/supabase/route";

export async function GET(_request: Request, context: RouteContext<"/api/quizzes/[id]">) {
  const { id } = await context.params;
  const supabase = await createRouteSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase environment variables are missing." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("quizzes")
    .select("*,questions(*,options(*))")
    .eq("id", id)
    .eq("is_published", true)
    .order("position", { referencedTable: "questions", ascending: true })
    .order("position", { referencedTable: "questions.options", ascending: true })
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  return NextResponse.json({ quiz: data });
}

export async function PUT(request: Request, context: RouteContext<"/api/quizzes/[id]">) {
  const { id } = await context.params;
  const { supabase, profile, user, response } = await requireRouteUser();

  if (response) {
    return response;
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
    .update({
      title: body.title.trim(),
      description: body.description?.trim() || null,
      subject: body.subject?.trim() || null,
    })
    .eq("id", id)
    .or(`created_by.eq.${user!.id}${profile?.role === "admin" ? ",id.eq." + id : ""}`)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
