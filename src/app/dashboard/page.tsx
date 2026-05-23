import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/supabase/server";
import type { QuizSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, authUser } = await getCurrentUser();

  if (!supabase) {
    return <EmptyState title="Supabase is not configured" body="Add your project URL and anon key to .env.local." />;
  }

  if (!authUser) {
    redirect("/auth");
  }

  const { data: quizRows } = await supabase
    .from("quizzes")
    .select("id,title,description,subject,created_at,is_published,created_by,questions(id)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  const quizzes = (quizRows ?? []) as unknown as QuizSummary[];
  const totalQuestions = quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(125,211,252,0.28),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(252,211,77,0.34),transparent_28%),linear-gradient(180deg,#fffdf8_0%,#f4efe4_100%)] text-stone-950">
      <Header email={authUser.email} />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-stone-200 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                Your study dashboard
              </div>
              <h1 className="text-5xl font-bold leading-[1.04] tracking-normal text-stone-950 sm:text-6xl">
                Pick a quiz and keep your rhythm.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
                Choose a published quiz, answer at your pace, and keep building an attempt
                history you can actually review.
              </p>
              <Link
                href="/admin"
                className="mt-7 inline-flex rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-[6px_6px_0_#fbbf24] transition duration-200 hover:-translate-y-1 hover:bg-sky-600 hover:shadow-[9px_9px_0_#fbbf24]"
              >
                Create New Quiz
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-stone-200 bg-[#fbf7ef] p-5">
                <p className="text-3xl font-bold text-stone-950">{quizzes.length}</p>
                <p className="mt-1 text-sm font-bold text-stone-500">Available quizzes</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-[#fbf7ef] p-5">
                <p className="text-3xl font-bold text-stone-950">{totalQuestions}</p>
                <p className="mt-1 text-sm font-bold text-stone-500">Practice questions</p>
              </div>
            </div>
          </div>
        </div>

        {quizzes.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="group rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition duration-200 hover:-translate-y-2 hover:border-sky-200 hover:bg-white hover:shadow-[0_24px_60px_rgba(14,165,233,0.14)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700">
                    {quiz.subject || "General"}
                  </p>
                  <span className="text-xl font-bold text-stone-300 transition group-hover:translate-x-1 group-hover:text-sky-500">
                    →
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-bold leading-tight text-stone-950">{quiz.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                  {quiz.description || "No description yet."}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                  <p className="text-sm font-bold text-stone-500">{quiz.questions.length} questions</p>
                  <p className="text-sm font-bold text-sky-700">Start quiz</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No quizzes yet"
              body="There are no published quizzes available right now. Check back once an admin publishes one."
            />
          </div>
        )}
      </section>
    </main>
  );
}
