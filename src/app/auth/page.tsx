import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main className="grid min-h-screen bg-[#f7f7f2] px-6 py-10 text-stone-950 lg:grid-cols-[1fr_440px]">
      <section className="mx-auto flex w-full max-w-4xl flex-col justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Crucible
        </Link>
        <div className="my-16 max-w-xl">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight">
            Sign in and sharpen the next topic.
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-700">
            Your dashboard, attempts, and results are protected by Supabase Auth.
          </p>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-md items-center">
        <Suspense>
          <AuthForm />
        </Suspense>
      </section>
    </main>
  );
}
