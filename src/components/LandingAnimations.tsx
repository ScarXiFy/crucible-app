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
        scale: { from: 0.96, to: 1 },
        y: { from: 18, to: 0 },
        duration: 1000,
        delay: 120,
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
        { to: -8, duration: 2200 },
        { to: 0, duration: 2200 },
      ],
      rotate: [
        { to: 1, duration: 2200 },
        { to: -1, duration: 2200 },
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

      sceneElement.style.setProperty("--tilt-x", `${62 + y * -8}deg`);
      sceneElement.style.setProperty("--tilt-y", `${x * 10}deg`);
      sceneElement.style.setProperty("--tilt-z", `${-24 + x * 8}deg`);
      sceneElement.style.setProperty("--node-shift", `${x * 18}px`);
    }

    function resetTilt() {
      sceneElement.style.setProperty("--tilt-x", "62deg");
      sceneElement.style.setProperty("--tilt-y", "0deg");
      sceneElement.style.setProperty("--tilt-z", "-24deg");
      sceneElement.style.setProperty("--node-shift", "0px");
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
      className="group relative mx-auto flex min-h-[280px] w-full max-w-2xl items-center justify-center [perspective:1200px] sm:min-h-[470px] lg:min-h-[540px]"
      style={
        {
          "--tilt-x": "62deg",
          "--tilt-y": "0deg",
          "--tilt-z": "-24deg",
          "--node-shift": "0px",
        } as React.CSSProperties
      }
      aria-label="Interactive abstract quiz review system"
    >
      <div className="absolute inset-x-12 bottom-10 h-10 bg-black/10 blur-2xl" />

      <div className="relative h-[280px] w-[280px] sm:h-[470px] sm:w-[470px]">
        <div
          data-float
          className="absolute inset-6 rounded-full border border-black/80 transition-transform duration-300 [transform:rotateX(var(--tilt-x))_rotateY(var(--tilt-y))_rotateZ(var(--tilt-z))] [transform-style:preserve-3d] sm:inset-10"
        />
        <div
          data-float
          className="absolute inset-16 rounded-full border border-black/35 transition-transform duration-300 [transform:rotateX(calc(var(--tilt-x)_+_4deg))_rotateY(var(--tilt-y))_rotateZ(calc(var(--tilt-z)_+_46deg))] [transform-style:preserve-3d] sm:inset-24"
        />

        <div className="absolute left-1/2 top-1/2 h-28 w-28 border-2 border-black bg-white shadow-[20px_20px_0_rgba(0,0,0,0.08)] transition-transform duration-300 [transform:translate(-50%,-50%)_rotateX(var(--tilt-x))_rotateY(var(--tilt-y))_rotateZ(45deg)] [transform-style:preserve-3d] group-hover:shadow-[28px_28px_0_rgba(0,0,0,0.1)] sm:h-40 sm:w-40">
          <div className="absolute left-4 top-5 h-2 w-16 bg-black sm:left-6 sm:top-8 sm:w-24" />
          <div className="absolute left-4 top-11 h-2 w-10 bg-black/55 sm:left-6 sm:top-16 sm:w-16" />
          <div className="absolute bottom-5 left-4 h-2 w-20 bg-black/20 sm:bottom-8 sm:left-6 sm:w-28" />
        </div>

        <div
          data-float
          className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-black transition-transform duration-300 [transform:translateX(calc(var(--node-shift)_*_-0.55))] sm:left-14 sm:h-5 sm:w-5"
        />
        <div
          data-float
          className="absolute right-8 top-24 h-4 w-4 rounded-full border border-black bg-white transition-transform duration-300 [transform:translateX(var(--node-shift))] sm:right-16 sm:top-28 sm:h-5 sm:w-5"
        />
        <div
          data-float
          className="absolute bottom-10 right-28 h-4 w-4 rounded-full bg-black/55 transition-transform duration-300 [transform:translateX(calc(var(--node-shift)_*_-0.3))] sm:bottom-16 sm:right-40 sm:h-5 sm:w-5"
        />

        <div className="absolute bottom-4 left-1/2 h-px w-52 -translate-x-1/2 bg-black/20 sm:w-80" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem] font-black uppercase tracking-[0.12em] text-neutral-500 sm:text-xs sm:tracking-[0.16em]">
          Topic / Attempt / Result
        </div>
      </div>
    </div>
  );
}
