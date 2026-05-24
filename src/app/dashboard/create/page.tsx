import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardQuizBuilder } from "@/components/DashboardQuizBuilder";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CreateDashboardQuizPage() {
  const { supabase, authUser } = await getCurrentUser();

  if (!supabase) {
    return <EmptyState title="Supabase is not configured" body="Add your project URL and anon key to .env.local." />;
  }

  if (!authUser) {
    redirect("/auth?redirectTo=/dashboard/create");
  }

  return (
    <main className="min-h-screen bg-[#f7f6f1] text-stone-950">
      <Header
        email={authUser.email}
        actions={
          <Link
            href="/dashboard"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition hover:border-stone-950 hover:bg-stone-50"
          >
            Dashboard
          </Link>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-normal text-stone-950 sm:text-5xl">
            Create a new quiz
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-600">
            Add the details and questions first. Create the quiz when everything is ready.
          </p>
        </div>

        <DashboardQuizBuilder />
      </section>
    </main>
  );
}
