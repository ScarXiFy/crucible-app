import Link from "next/link";
import { CrucibleBrand } from "@/components/CrucibleBrand";
import { AcademicHeroVisual, LandingAnimations } from "@/components/LandingAnimations";
import { audienceSections, finalCta, heroCopy, navItems, studyLoopSteps } from "@/lib/landing-content";

function TextArrow() {
  return <span aria-hidden="true">-&gt;</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-black">
      <LandingAnimations />

      <section
        id="start"
        className="relative flex min-h-[92svh] flex-col border-b border-neutral-200 px-5 sm:px-8"
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between py-5 sm:py-7">
          <CrucibleBrand />

          <div className="hidden items-center gap-8 text-sm font-bold text-neutral-700 sm:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href={heroCopy.primaryCta.href}
            className="hidden border border-black bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-black sm:inline-flex"
          >
            Start
          </Link>
        </nav>

        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
          <div data-hero-copy className="max-w-3xl">
            <h1 className="text-[clamp(3.4rem,10vw,8.8rem)] font-black leading-[0.86] tracking-normal text-black">
              {heroCopy.heading}
            </h1>
            <p className="mt-6 max-w-[21rem] text-base leading-7 text-neutral-700 sm:max-w-xl sm:text-lg sm:leading-8">
              {heroCopy.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href={heroCopy.primaryCta.href}
                className="border border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
              >
                {heroCopy.primaryCta.label}
              </Link>
              <Link
                href={heroCopy.secondaryCta.href}
                className="inline-flex items-center gap-2 border-b border-black pb-1 text-sm font-black uppercase tracking-[0.08em] text-black transition hover:gap-3"
              >
                {heroCopy.secondaryCta.label} <TextArrow />
              </Link>
            </div>
          </div>

          <AcademicHeroVisual />
        </div>
      </section>

      <section id="study-loop" data-scroll-section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div data-scroll-reveal className="max-w-3xl">
            <h2 className="text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl">
              The loop is small on purpose.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              Crucible keeps review focused enough to repeat: choose a topic, make an attempt,
              and let the result tell you what deserves another pass.
            </p>
          </div>

          <div className="mt-16 grid gap-10 border-y border-neutral-200 py-10 md:grid-cols-3">
            {studyLoopSteps.map((step, index) => (
              <article key={step.title} data-scroll-reveal className="group">
                <div className="mb-8 flex h-14 w-14 items-center justify-center border border-black text-sm font-black transition group-hover:bg-black group-hover:text-white">
                  0{index + 1}
                </div>
                <h3 className="text-3xl font-black tracking-normal">{step.title}</h3>
                <p className="mt-4 max-w-sm text-base leading-7 text-neutral-700">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-section className="bg-neutral-100 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div data-scroll-reveal>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">Use it two ways</p>
            <h2 className="mt-4 text-5xl font-black leading-none tracking-normal sm:text-6xl">
              Practice and publish without the clutter.
            </h2>
          </div>

          <div className="grid gap-0 border-t border-neutral-300">
            {audienceSections.map((section) => (
              <article
                key={section.title}
                data-scroll-reveal
                className="grid gap-5 border-b border-neutral-300 py-8 sm:grid-cols-[0.42fr_0.58fr]"
              >
                <h3 className="text-2xl font-black tracking-normal">{section.title}</h3>
                <p className="text-base leading-7 text-neutral-700">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-section className="bg-white px-5 py-16 sm:px-8">
        <div
          data-scroll-reveal
          className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-y border-black py-10 md:flex-row md:items-center"
        >
          <div>
            <h2 className="text-4xl font-black leading-none tracking-normal">{finalCta.heading}</h2>
            <p className="mt-3 max-w-lg text-base leading-7 text-neutral-700">{finalCta.body}</p>
          </div>
          <Link
            href={finalCta.href}
            className="inline-flex w-fit items-center gap-3 border border-black bg-black px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
          >
            {finalCta.label} <TextArrow />
          </Link>
        </div>
      </section>

      <footer className="bg-white px-5 pb-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs font-black uppercase tracking-[0.12em] text-neutral-500 sm:flex-row">
          <span>Crucible</span>
          <span>Academic review, made quiet.</span>
        </div>
      </footer>
    </main>
  );
}
