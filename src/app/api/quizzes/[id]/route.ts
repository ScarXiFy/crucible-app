import { NextResponse } from "next/server";
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
