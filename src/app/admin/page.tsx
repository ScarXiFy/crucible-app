import { redirect } from "next/navigation";
import { AdminQuizForm } from "@/components/AdminQuizForm";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase, authUser } = await getCurrentUser();

  if (!supabase) {
    return <EmptyState title="Supabase is not configured" body="Add your project URL and anon key to .env.local." />;
  }

  if (!authUser) {
    redirect("/auth?redirectTo=/admin");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(125,211,252,0.28),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(252,211,77,0.34),transparent_28%),linear-gradient(180deg,#fffdf8_0%,#f4efe4_100%)] text-stone-950">
      <Header email={authUser.email} />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-stone-200 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                Create quiz
              </div>
              <h1 className="text-5xl font-bold leading-[1.04] tracking-normal text-stone-950 sm:text-6xl">
                Build a clean quiz in two steps.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
                Start with the quiz details, then add multiple-choice questions with one correct answer.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-[#fbf7ef] p-5">
              <p className="text-sm font-bold text-stone-500">Workflow</p>
              <div className="mt-4 space-y-3">
                {["Create quiz details", "Copy the generated quiz ID", "Add questions and answers"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-stone-700">{step}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AdminQuizForm />
        </div>
      </section>
    </main>
  );
}
