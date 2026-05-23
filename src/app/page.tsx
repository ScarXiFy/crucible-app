import Link from "next/link";
import { AcademicHeroVisual, LandingAnimations } from "@/components/LandingAnimations";

const subjects = ["Science", "Math", "Programming", "General review"];

const reviewSteps = [
  {
    title: "Choose a topic",
    body: "Open a quiz from your dashboard and start with one small study goal.",
  },
  {
    title: "Answer calmly",
    body: "Work through one question at a time with clear progress and friendly feedback.",
  },
  {
    title: "Review the result",
    body: "Keep every attempt so your next session starts from what you actually missed.",
  },
];

const features = [
  ["For students", "Simple quizzes, visible progress, and saved attempts."],
  ["For creators", "Create subjects, questions, options, and correct answers."],
  ["For review", "Use scores as a study map instead of guessing what to revisit."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ef] text-stone-950">
      <LandingAnimations />

      <section className="relative flex min-h-screen flex-col bg-[radial-gradient(circle_at_12%_18%,rgba(125,211,252,0.36),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(252,211,77,0.44),transparent_30%),linear-gradient(180deg,#fffdf8_0%,#f4efe4_100%)] px-6">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-stone-200 py-4 sm:py-5">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-base font-black text-white shadow-[4px_4px_0_#fbbf24]">
              C
            </span>
            Crucible
          </Link>
          <div className="flex items-center gap-3 text-sm font-bold">
            <Link href="/auth" className="text-stone-600 transition hover:text-stone-950">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-stone-950 px-4 py-2.5 text-white transition hover:bg-sky-700"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 py-6 sm:gap-10 sm:py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-hero-copy className="max-w-3xl">
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-normal text-stone-950 sm:text-6xl lg:text-[4.7rem]">
              Quizzes that make studying feel lighter.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:mt-6 sm:text-xl sm:leading-8">
              Crucible helps you practice one topic at a time, save your attempts, and
              understand what to review next without making study time feel complicated.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="/auth"
                className="rounded-xl bg-sky-500 px-6 py-3 text-center text-base font-bold text-white shadow-[6px_6px_0_#fbbf24] transition duration-200 hover:-translate-y-1 hover:bg-sky-600 hover:shadow-[9px_9px_0_#fbbf24] active:translate-y-0"
              >
                Start a quiz
              </Link>
              <Link
                href="#study-loop"
                className="rounded-xl border border-stone-300 bg-white/80 px-6 py-3 text-center text-base font-bold text-stone-800 transition duration-200 hover:-translate-y-1 hover:border-stone-950 hover:bg-white hover:shadow-[0_14px_35px_rgba(15,23,42,0.1)]"
              >
                See how it works
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
              {subjects.map((subject) => (
                <span
                  key={subject}
                  data-subject-chip
                  className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-bold text-stone-600 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <AcademicHeroVisual />
        </div>
      </section>

      <section id="study-loop" data-scroll-section className="bg-[#fbf7ef] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-scroll-reveal>
            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
              Built for the ordinary study loop.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-stone-700">
              No intimidating dashboards on the landing page. Just a clear path from topic,
              to quiz, to result.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reviewSteps.map((step, index) => (
              <article
                key={step.title}
                data-scroll-reveal
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-2 hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(14,165,233,0.14)]"
              >
                <p className="text-sm font-bold text-sky-600">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-bold tracking-normal">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div data-scroll-reveal className="rounded-3xl bg-stone-950 p-8 text-white">
            <h2 className="text-4xl font-bold leading-tight tracking-normal">
              Friendly for learners. Practical for quiz creators.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-300">
              Students get a calm practice flow. Creators get the tools to publish quizzes
              without turning the app into a maze.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-stone-950 transition duration-200 hover:-translate-y-1 hover:bg-amber-200"
              >
                Open dashboard
              </Link>
              <Link
                href="/admin"
                className="rounded-xl border border-white/25 px-5 py-3 text-center font-bold text-white transition duration-200 hover:-translate-y-1 hover:border-white hover:bg-white/10"
              >
                Create quiz
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {features.map(([title, body]) => (
              <article
                key={title}
                data-scroll-reveal
                className="rounded-2xl border border-stone-200 bg-[#fbf7ef] p-6 transition duration-200 hover:-translate-y-1 hover:border-amber-200 hover:bg-white hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <h3 className="text-2xl font-bold tracking-normal">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-section className="bg-[#fbf7ef] px-6 py-16">
        <div
          data-scroll-reveal
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-normal">Ready for the next question?</h2>
            <p className="mt-2 text-stone-600">Sign in, pick a quiz, and keep studying at your pace.</p>
          </div>
          <Link
            href="/auth"
            className="rounded-xl bg-sky-500 px-6 py-3 text-center font-bold text-white transition duration-200 hover:-translate-y-1 hover:bg-sky-600 hover:shadow-[0_16px_35px_rgba(14,165,233,0.25)]"
          >
            Start now
          </Link>
        </div>
      </section>
    </main>
  );
}
