import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(125,211,252,0.36),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(252,211,77,0.44),transparent_30%),linear-gradient(180deg,#fffdf8_0%,#f4efe4_100%)] px-6 py-6 text-stone-950">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        <nav className="flex items-center justify-between border-b border-stone-200 pb-5">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-base font-black text-white shadow-[4px_4px_0_#fbbf24]">
              C
            </span>
            Crucible
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-stone-700 transition duration-200 hover:-translate-y-1 hover:border-stone-950 hover:bg-white"
          >
            Back home
          </Link>
        </nav>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
          <div className="relative w-full max-w-xl">
            <Suspense>
              <AuthForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
