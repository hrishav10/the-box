"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import Section from "./Section";

const TICKS = 60;

/**
 * Runs like clockwork — 60 ticks fly outward on a stagger when the
 * section enters, then the hands spin forever.
 */
export default function Clockwork() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ticks = el.querySelectorAll(".tick");
    if (!reduced) {
      animate(ticks, {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 600,
        ease: "outExpo",
        delay: stagger(14),
        autoplay: onScroll({ target: el, enter: "bottom 75%" }),
      });
    }

    const hs = el.querySelector(".hand-s");
    const hm = el.querySelector(".hand-m");
    const hh = el.querySelector(".hand-h");
    const hands: ReturnType<typeof animate>[] = [];
    if (!reduced && hs && hm && hh) {
      hands.push(
        animate(hs, { rotate: [0, 360], duration: 12000, ease: "linear", loop: true }),
        animate(hm, { rotate: [0, 360], duration: 60000, ease: "linear", loop: true }),
        animate(hh, { rotate: [0, 360], duration: 240000, ease: "linear", loop: true })
      );
    }
    return () => hands.forEach((h) => h.pause());
  }, []);

  return (
    <Section
      id="clock"
      index="08"
      eyebrow="clockwork"
      title={
        <>
          Sixty ticks, <span className="text-yellow">one timeline.</span>
        </>
      }
      blurb="Every tick flies out on a stagger. The hands spin on endless linear loops — the engine never sleeps."
      accent="#ffcc2a"
    >
      <div
        ref={root}
        className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-panel/70"
      >
        {Array.from({ length: TICKS }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-140px)` }}
          >
            <div
              className={`tick ${i % 5 === 0 ? "h-4 w-1 rounded bg-yellow" : "h-2 w-px bg-muted"}`}
            />
          </div>
        ))}
        <div className="hand-h absolute left-1/2 top-1/2 h-20 w-1.5 origin-bottom rounded bg-cream" style={{ transform: "translate(-50%, -100%)" }} />
        <div className="hand-m absolute left-1/2 top-1/2 h-28 w-1 origin-bottom rounded bg-cream/70" style={{ transform: "translate(-50%, -100%)" }} />
        <div className="hand-s absolute left-1/2 top-1/2 h-32 w-0.5 origin-bottom rounded bg-red" style={{ transform: "translate(-50%, -100%)" }} />
        <div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red" />
      </div>
    </Section>
  );
}
