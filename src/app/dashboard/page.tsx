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

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
      <Header email={authUser.email} role={profile?.role} />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-3 text-stone-600">Choose a quiz and keep building your attempt history.</p>
          </div>
          {profile?.role === "admin" ? (
            <Link
              href="/admin"
              className="rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Create quiz
            </Link>
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes?.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="group border border-stone-300 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#1c1917]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-700">
                {quiz.subject || "General"}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-950">{quiz.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                {quiz.description || "No description yet."}
              </p>
              <p className="mt-5 text-sm font-semibold text-stone-950">
                {quiz.questions.length} questions
              </p>
            </Link>
          ))}
        </div>

        {!quizzes?.length ? (
          <div className="mt-8">
            <EmptyState
              title="No quizzes yet"
              body="Ask an admin to create the first study quiz."
              href={profile?.role === "admin" ? "/admin" : undefined}
              action={profile?.role === "admin" ? "Create quiz" : undefined}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
