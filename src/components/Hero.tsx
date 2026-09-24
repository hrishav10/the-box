"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

const WORDS = ["timelines.", "staggers.", "scroll.", "springs.", "morphs.", "anything."];

const chars = (s: string) =>
  s.split("").map((c, i) => (
    <span key={i} className="hero-letter">
      {c === " " ? " " : c}
    </span>
  ));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wi = useRef(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // entrance: headline letters rise, then everything else
    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    tl.add(".hero-letter", {
      y: ["110%", "0%"],
      rotate: [8, 0],
      duration: 900,
      delay: stagger(32),
    })
      .add(".hero-fade", { opacity: [0, 1], y: [18, 0], duration: 700, delay: stagger(110) }, "-=550")
      .add(
        ".float-shape",
        { opacity: [0, 1], scale: [0.4, 1], duration: 900, delay: stagger(120) },
        "-=600"
      );

    if (reduced) return;

    // floating ambient shapes
    el.querySelectorAll(".float-shape").forEach((s, i) => {
      animate(s, {
        y: ["+=0", i % 2 ? -34 : 34],
        rotate: i % 2 ? -14 : 14,
        duration: 3200 + i * 500,
        ease: "inOutSine",
        loop: true,
        alternate: true,
        delay: i * 250,
      });
    });

    // bouncing scroll arrows
    animate(".scroll-arrow", {
      y: [0, 12],
      opacity: [1, 0.25],
      duration: 800,
      ease: "inOutSine",
      loop: true,
      alternate: true,
      delay: stagger(160),
    });

    // scramble word cycler — chars collapse out, new word pops in
    let alive = true;
    let timeout = 0;
    const swap = () => {
      if (!alive) return;
      const word = wordRef.current;
      if (!word) return;
      animate(word.querySelectorAll(".wchar"), {
        scaleX: 0,
        opacity: 0,
        x: -12,
        duration: 220,
        ease: "inExpo",
        delay: stagger(26, { from: "last" }),
        onComplete: () => {
          if (!alive || !wordRef.current) return;
          wi.current = (wi.current + 1) % WORDS.length;
          const w = WORDS[wi.current];
          wordRef.current.innerHTML = w
            .split("")
            .map((c) => `<span class="wchar">${c}</span>`)
            .join("");
          animate(wordRef.current.querySelectorAll(".wchar"), {
            scaleX: [0, 1],
            opacity: [0, 1],
            x: [16, 0],
            duration: 420,
            ease: "outExpo",
            delay: stagger(30),
          });
          timeout = window.setTimeout(swap, 2600);
        },
      });
    };
    timeout = window.setTimeout(swap, 2800);

    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="top" ref={root} className="relative z-10 overflow-hidden">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-6 pt-28 pb-16">
        <p className="hero-fade font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-muted">
          the_box · a motion lab · anime.js v4
        </p>

        <h1 className="font-display mt-6 text-[13.5vw] leading-[0.9] sm:text-[11vw] lg:text-[8.5rem]">
          <span className="hero-line block">
            <span className="block">{chars("Put motion")}</span>
          </span>
          <span className="hero-line block">
            <span className="block">
              {chars("in the box")}
              <span className="hero-letter text-red">.</span>
            </span>
          </span>
        </h1>

        <p className="hero-fade mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          One page, one library — animating{" "}
          <span ref={wordRef} className="font-bold text-cream">
            {WORDS[0].split("").map((c, i) => (
              <span key={i} className="wchar">
                {c}
              </span>
            ))}
          </span>
        </p>

        <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-white/15 bg-black/40 px-6 py-3 font-mono text-sm text-cream">
            <span className="text-red">$</span> npm i the-box
          </div>
          <a
            href="#api"
            className="rounded-full bg-cream px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-coal transition-transform hover:scale-105"
          >
            see it move ↓
          </a>
        </div>

        <div className="hero-fade mt-16 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span>scroll</span>
          <span className="scroll-arrow text-red">↓</span>
          <span className="scroll-arrow text-red">↓</span>
        </div>
      </div>

      {/* floating outlined shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="float-shape absolute right-[8%] top-[18%] size-24 rounded-full border-2 border-red sm:size-32" />
        <div className="float-shape absolute bottom-[24%] right-[22%] size-14 rotate-12 border-2 border-sky sm:size-20" />
        <div className="float-shape absolute right-[38%] top-[12%] size-10 rounded-full bg-yellow sm:size-14" />
        <div className="float-shape absolute bottom-[16%] right-[6%] size-16 rounded-full border-2 border-dashed border-purple sm:size-24" />
      </div>
    </section>
  );
}
