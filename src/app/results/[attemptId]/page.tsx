import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

export const dynamic = "force-dynamic";

type AttemptResult = Database["public"]["Tables"]["attempts"]["Row"] & {
  quizzes: { title: string; subject: string | null } | null;
};

export default async function ResultsPage({
  params,
}: PageProps<"/results/[attemptId]">) {
  const { attemptId } = await params;
  const { supabase, authUser } = await getCurrentUser();

  if (!supabase) {
    notFound();
  }

  if (!authUser) {
    redirect("/auth");
  }

  const { data: attemptRow } = await supabase
    .from("attempts")
    .select("*,quizzes(title,subject)")
    .eq("id", attemptId)
    .maybeSingle();
  const attempt = attemptRow as unknown as AttemptResult | null;

  if (!attempt) {
    notFound();
  }

  const percent =
    attempt.total_questions > 0
      ? Math.round((attempt.score / attempt.total_questions) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
      <Header email={authUser.email} />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="border border-stone-300 bg-white p-8 shadow-[6px_6px_0_#1c1917]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">
            Results
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            {attempt.quizzes?.title || "Quiz attempt"}
          </h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="border border-stone-200 bg-[#fbfaf5] p-5">
              <p className="text-4xl font-semibold">{attempt.score}</p>
              <p className="text-sm text-stone-500">Correct</p>
            </div>
            <div className="border border-stone-200 bg-[#fbfaf5] p-5">
              <p className="text-4xl font-semibold">{attempt.total_questions}</p>
              <p className="text-sm text-stone-500">Questions</p>
            </div>
            <div className="border border-stone-200 bg-[#fbfaf5] p-5">
              <p className="text-4xl font-semibold">{percent}%</p>
              <p className="text-sm text-stone-500">Score</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/quiz/${attempt.quiz_id}`}
              className="rounded-md bg-amber-500 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              Retake quiz
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-stone-300 px-5 py-3 font-semibold text-stone-800 transition hover:border-stone-950"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
