import { NextResponse } from "next/server";
import { requireRouteUser } from "@/lib/api";
import { scoreQuiz, toJson, type SubmittedAnswers } from "@/lib/quiz";
import type { QuizWithQuestions } from "@/lib/types";

export async function POST(
  request: Request,
  context: RouteContext<"/api/quizzes/[id]/submit">,
) {
  const { id } = await context.params;
  const { supabase, user, response } = await requireRouteUser();

  if (response) {
    return response;
  }

  const body = (await request.json()) as { answers?: SubmittedAnswers };

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "Answers are required." }, { status: 400 });
  }

  const { data: quiz, error: quizError } = await supabase!
    .from("quizzes")
    .select("*,questions(*,options(*))")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (quizError) {
    return NextResponse.json({ error: quizError.message }, { status: 400 });
  }

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  }

  const quizWithQuestions = quiz as QuizWithQuestions;
  const result = scoreQuiz(quizWithQuestions.questions, body.answers);

  const answeredCount = Object.values(body.answers).filter((answer) => answer.trim().length > 0).length;

  if (answeredCount !== result.total) {
    return NextResponse.json(
      { error: "Every question must be answered before submission." },
      { status: 400 },
    );
  }

  const { data: attempt, error: attemptError } = await supabase!
    .from("attempts")
    .insert({
      user_id: user!.id,
      quiz_id: id,
      answers: toJson(result.answerKey),
      score: result.score,
      total_questions: result.total,
    })
    .select("id")
    .single();

  if (attemptError) {
    return NextResponse.json({ error: attemptError.message }, { status: 400 });
  }

  const { error: scoreError } = await supabase!.from("scores").insert({
    attempt_id: attempt.id,
    user_id: user!.id,
    quiz_id: id,
    value: result.score,
    total: result.total,
  });

  if (scoreError) {
    return NextResponse.json({ error: scoreError.message }, { status: 400 });
  }

  return NextResponse.json({
    attemptId: attempt.id,
    score: result.score,
    total: result.total,
  });
}
