import { NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api";

type QuestionOptionInput = {
  label?: string;
  isCorrect?: boolean;
};

export async function POST(request: Request) {
  const { supabase, response } = await requireRouteUser();

  if (response) {
    return response;
  }

  const body = (await request.json()) as {
    quizId?: string;
    prompt?: string;
    options?: QuestionOptionInput[];
  };

  const cleanOptions =
    body.options
      ?.map((option, index) => ({
        label: option.label?.trim() || "",
        is_correct: Boolean(option.isCorrect),
        position: index + 1,
      }))
      .filter((option) => option.label.length > 0) || [];

  if (!body.quizId || !body.prompt?.trim()) {
    return NextResponse.json({ error: "Quiz ID and question are required." }, { status: 400 });
  }

  if (cleanOptions.length < 1 || !cleanOptions.some((option) => option.is_correct)) {
    return NextResponse.json(
      { error: "Add an answer and mark one correct answer." },
      { status: 400 },
    );
  }

  const { count } = await supabase!
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", body.quizId);

  const { data: question, error: questionError } = await supabase!
    .from("questions")
    .insert({
      quiz_id: body.quizId,
      prompt: body.prompt.trim(),
      position: (count || 0) + 1,
    })
    .select("id")
    .single();

  if (questionError) {
    return NextResponse.json({ error: questionError.message }, { status: 400 });
  }

  const { error: optionsError } = await supabase!.from("options").insert(
    cleanOptions.map((option) => ({
      ...option,
      question_id: question.id,
    })),
  );

  if (optionsError) {
    return NextResponse.json({ error: optionsError.message }, { status: 400 });
  }

  return NextResponse.json({ questionId: question.id });
}
