import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f2] text-stone-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <nav className="flex items-center justify-between border-b border-stone-300/80 pb-5">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Crucible
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="/auth" className="text-stone-600 transition hover:text-stone-950">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md bg-stone-950 px-4 py-2 text-white transition hover:bg-stone-800"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-stone-950 sm:text-7xl">
              Study until the weak spots glow.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-700">
              Crucible turns academic review into focused quiz sessions: pick a
              subject, answer one question at a time, submit, and keep a record
              of every attempt.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth"
                className="rounded-md bg-amber-500 px-5 py-3 text-center font-semibold text-stone-950 transition hover:bg-amber-400"
              >
                Start studying
              </Link>
              <Link
                href="/admin"
                className="rounded-md border border-stone-300 px-5 py-3 text-center font-semibold text-stone-800 transition hover:border-stone-950"
              >
                Admin tools
              </Link>
            </div>
          </div>

          <div className="border border-stone-300 bg-white p-5 shadow-[8px_8px_0_#1c1917]">
            <div className="border-b border-stone-200 pb-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">
                Review queue
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Thermodynamics drill</h2>
            </div>
            <div className="space-y-4 py-5">
              {["Define entropy in a closed system.", "Choose the correct unit for heat capacity.", "Identify an isothermal process."].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 border border-stone-200 bg-[#fbfaf5] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-950 font-mono text-sm text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-stone-700">{item}</p>
                  </div>
                ),
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-stone-200 pt-4 text-center">
              <div>
                <p className="text-2xl font-semibold">12</p>
                <p className="text-xs text-stone-500">Questions</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">1</p>
                <p className="text-xs text-stone-500">Attempt</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">83%</p>
                <p className="text-xs text-stone-500">Target</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
