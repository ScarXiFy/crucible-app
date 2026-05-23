import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { QuizRunner } from "@/components/QuizRunner";
import { getCurrentUser } from "@/lib/supabase/server";
import type { QuizWithQuestions } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function QuizPage({ params }: PageProps<"/quiz/[id]">) {
  const { id } = await params;
  const { supabase, authUser } = await getCurrentUser();

  if (!supabase) {
    notFound();
  }

  if (!authUser) {
    redirect("/auth");
  }

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*,questions(*,options(*))")
    .eq("id", id)
    .eq("is_published", true)
    .order("position", { referencedTable: "questions", ascending: true })
    .order("position", { referencedTable: "questions.options", ascending: true })
    .maybeSingle();

  if (!quiz) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
      <Header email={authUser.email} />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <QuizRunner quiz={quiz as QuizWithQuestions} />
      </section>
    </main>
  );
}
