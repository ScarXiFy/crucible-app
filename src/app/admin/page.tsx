import { redirect } from "next/navigation";
import { AdminQuizForm } from "@/components/AdminQuizForm";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase, authUser, profile } = await getCurrentUser();

  if (!supabase) {
    return <EmptyState title="Supabase is not configured" body="Add your project URL and anon key to .env.local." />;
  }

  if (!authUser) {
    redirect("/auth?redirectTo=/admin");
  }

  if (profile?.role !== "admin") {
    return (
      <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
        <Header email={authUser.email} role={profile?.role} />
        <section className="mx-auto max-w-3xl px-6 py-10">
          <EmptyState
            title="Admin access required"
            body="Your account must have role admin in public.users before you can create quiz content."
            href="/dashboard"
            action="Back to dashboard"
          />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
      <Header email={authUser.email} role={profile.role} />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-3 text-stone-600">Create quizzes and add multiple-choice questions.</p>
        </div>
        <AdminQuizForm />
      </section>
    </main>
  );
}
