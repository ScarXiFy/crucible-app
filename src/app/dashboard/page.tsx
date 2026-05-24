import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/supabase/server";
import type { QuizSummary } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, authUser, profile } = await getCurrentUser();

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
  const canManageQuizzes = profile?.role === "admin";

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-stone-950">
      <Header
        email={authUser.email}
        actions={
          <Link
            href="/dashboard/create"
            className="rounded-lg bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Create New Quiz
          </Link>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-normal text-stone-950 sm:text-5xl">
            Quizzes
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Choose a quiz to start, or create a new one from the button above.
          </p>
        </div>

        {quizzes.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => {
              const canEditQuiz = canManageQuizzes || quiz.created_by === authUser.id;

              return (
                <article
                  key={quiz.id}
                  className="group relative rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md"
                >
                  <Link
                    href={`/quiz/${quiz.id}`}
                    aria-label={`Start ${quiz.title}`}
                    className="absolute inset-0 rounded-xl"
                  />
                  <p className="relative inline-flex rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700">
                    {quiz.subject || "General"}
                  </p>
                  <h2 className="relative mt-5 text-2xl font-bold leading-tight text-stone-950">
                    {quiz.title}
                  </h2>
                  <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
                    {quiz.subject || "Open this quiz to start answering."}
                  </p>
                  <div className="relative z-10 mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                    {canEditQuiz ? (
                      <Link
                        href={`/admin?quizId=${quiz.id}`}
                        className="text-sm font-semibold text-stone-700 transition hover:text-stone-950"
                      >
                        Edit quiz
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold text-stone-500">Start quiz</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No quizzes yet"
              body="There are no published quizzes available right now. Create one to start building your study set."
            />
          </div>
        )}
      </section>
    </main>
  );
}
