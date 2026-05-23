"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function LandingAnimations() {
  useEffect(() => {
    const animations = [
      animate("[data-hero-copy]", {
        opacity: { from: 0, to: 1 },
        y: { from: 24, to: 0 },
        duration: 800,
        ease: "outCubic",
      }),
      animate("[data-hero-art]", {
        opacity: { from: 0, to: 1 },
        scale: { from: 0.94, to: 1 },
        rotate: { from: -2, to: 0 },
        duration: 900,
        delay: 120,
        ease: "outBack",
      }),
      animate("[data-subject-chip]", {
        opacity: { from: 0, to: 1 },
        y: { from: 10, to: 0 },
        delay: stagger(70, { start: 420 }),
        duration: 500,
        ease: "outCubic",
      }),
    ];

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    const revealed = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (!entry.isIntersecting || revealed.has(target)) {
            return;
          }

          revealed.add(target);
          animate(target, {
            opacity: { from: 0, to: 1 },
            y: { from: 28, to: 0 },
            duration: 650,
            ease: "outCubic",
          });
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      animations.forEach((animation) => animation.revert());
      observer.disconnect();
    };
  }, []);

  return null;
}

export function AcademicHeroVisual() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const sceneElement = scene;

    const floatAnimation = animate(sceneElement.querySelectorAll("[data-float]"), {
      y: [
        { to: -10, duration: 1600 },
        { to: 0, duration: 1600 },
      ],
      rotate: [
        { to: 1.5, duration: 1600 },
        { to: -1.5, duration: 1600 },
      ],
      loop: true,
      alternate: true,
      ease: "inOutSine",
      delay: stagger(160),
    });

    function handlePointerMove(event: PointerEvent) {
      const rect = sceneElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      sceneElement.style.setProperty("--tilt-x", `${y * -10}deg`);
      sceneElement.style.setProperty("--tilt-y", `${x * 14}deg`);
      sceneElement.style.setProperty("--pen-shift", `${x * 14}px`);
    }

    function resetTilt() {
      sceneElement.style.setProperty("--tilt-x", "-4deg");
      sceneElement.style.setProperty("--tilt-y", "8deg");
      sceneElement.style.setProperty("--pen-shift", "0px");
    }

    sceneElement.addEventListener("pointermove", handlePointerMove);
    sceneElement.addEventListener("pointerleave", resetTilt);

    return () => {
      floatAnimation.revert();
      sceneElement.removeEventListener("pointermove", handlePointerMove);
      sceneElement.removeEventListener("pointerleave", resetTilt);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      data-hero-art
      className="group relative mx-auto flex min-h-[210px] w-full max-w-2xl items-center justify-center [perspective:1200px] sm:min-h-[420px] lg:min-h-[500px]"
      style={
        {
          "--tilt-x": "-4deg",
          "--tilt-y": "8deg",
          "--pen-shift": "0px",
        } as React.CSSProperties
      }
      aria-label="Interactive 3D notebook and pen study scene"
    >
      <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-sky-200/80 blur-3xl" />
      <div className="absolute bottom-10 right-6 h-32 w-32 rounded-full bg-amber-200/80 blur-3xl" />
      <div className="absolute inset-x-10 bottom-2 h-12 rounded-full bg-stone-900/10 blur-2xl" />

      <div
        data-float
        className="absolute right-2 top-0 z-30 rounded-2xl border border-stone-200 bg-white px-3 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-200 group-hover:-translate-y-2 sm:right-8 sm:top-8 sm:px-4 sm:py-3"
      >
        <p className="text-xs font-bold text-stone-500">Today</p>
        <p className="mt-1 text-2xl font-bold text-emerald-600">8/10</p>
      </div>

      <div
        data-float
        className="absolute bottom-0 left-2 z-30 rounded-2xl border border-stone-200 bg-white px-3 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-200 group-hover:-translate-x-2 group-hover:-translate-y-1 sm:bottom-16 sm:left-0 sm:px-4 sm:py-3"
      >
        <p className="text-xs font-bold text-stone-500">Next topic</p>
        <p className="mt-1 text-sm font-bold text-stone-900">Calculus limits</p>
      </div>

      <div
        data-float
        className="absolute right-8 top-12 z-0 h-[150px] w-[170px] rounded-[1.4rem] border border-amber-200 bg-amber-100/90 shadow-[16px_18px_0_rgba(15,23,42,0.08)] [transform:translateZ(-12px)_rotate(7deg)] sm:right-20 sm:top-12 sm:h-[260px] sm:w-[300px]"
      >
        <div className="absolute left-6 top-6 h-3 w-20 rounded-full bg-amber-300/80 sm:w-32" />
        <div className="absolute left-6 top-12 h-2 w-28 rounded-full bg-amber-200 sm:top-16 sm:w-44" />
        <div className="absolute left-6 top-20 h-2 w-20 rounded-full bg-amber-200 sm:top-24 sm:w-36" />
      </div>

      <div
        className="relative h-[205px] w-[250px] rounded-[1.7rem] bg-sky-400 shadow-[20px_24px_0_rgba(15,23,42,0.12)] transition-transform duration-300 ease-out [transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))_rotateZ(-5deg)] [transform-style:preserve-3d] group-hover:scale-[1.03] sm:h-[430px] sm:w-[500px] sm:rounded-[2.4rem] sm:shadow-[34px_36px_0_rgba(15,23,42,0.12)]"
      >
        <div className="absolute inset-y-5 left-3 z-20 flex flex-col justify-between sm:inset-y-10 sm:left-5">
          {[1, 2, 3, 4, 5].map((ring) => (
            <span
              key={ring}
              className="h-4 w-4 rounded-full border-2 border-sky-700 bg-white shadow-sm sm:h-5 sm:w-5"
            />
          ))}
        </div>

        <div className="absolute inset-3 rounded-[1.35rem] border border-stone-200 bg-[#fffdf8] p-4 pl-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)] [transform:translateZ(42px)] sm:inset-5 sm:rounded-[2rem] sm:p-8 sm:pl-12">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 sm:pb-5">
            <div>
              <p className="text-xs font-bold uppercase text-sky-700">Quick quiz</p>
              <h2 className="mt-1 text-xl font-bold text-stone-950 sm:text-3xl">Study desk</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Ready
            </span>
          </div>

          <div className="mt-3 space-y-2 sm:mt-6 sm:space-y-4">
            {["Read the prompt", "Choose an answer", "Review your score"].map(
              (question, index) => (
                <div
                  key={question}
                  className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm transition duration-200 group-hover:translate-x-1 sm:gap-3 sm:p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-stone-700 sm:text-sm">{question}</span>
                </div>
              ),
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6">
            {["A", "B", "C"].map((answer) => (
              <div
                key={answer}
                className="rounded-xl bg-stone-100 py-2 text-center text-sm font-bold text-stone-600 shadow-sm transition duration-200 group-hover:-translate-y-1 sm:py-3"
              >
                {answer}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -right-5 bottom-1 h-32 w-5 rounded-full bg-amber-400 shadow-[8px_10px_0_rgba(15,23,42,0.12)] transition-transform duration-300 [transform:translateZ(82px)_rotate(25deg)_translateX(var(--pen-shift))] group-hover:rotate-[30deg] sm:-right-10 sm:bottom-4 sm:h-64 sm:w-6">
          <div className="absolute -top-5 left-0 h-8 w-5 rounded-t-full bg-stone-900 sm:w-6" />
          <div className="absolute -bottom-5 left-0 h-8 w-5 rounded-b-full bg-sky-500 sm:w-6" />
        </div>
      </div>

      <div
        data-float
        className="absolute bottom-8 right-12 z-20 hidden rounded-2xl bg-stone-950 px-5 py-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] [transform:translateZ(86px)_rotate(-4deg)] sm:block"
      >
        <p className="text-xs font-bold text-sky-200">Progress</p>
        <div className="mt-2 h-2 w-28 rounded-full bg-white/20">
          <div className="h-full w-4/5 rounded-full bg-amber-300" />
        </div>
      </div>
    </div>
  );
}
