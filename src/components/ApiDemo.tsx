"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Section from "./Section";

/**
 * Intuitive API — three shapes, one animate() call each,
 * every property doing its own thing.
 */
export default function ApiDemo() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const qa = el.querySelector(".api-a");
    const qb = el.querySelector(".api-b");
    const qc = el.querySelector(".api-c");
    if (!qa || !qb || !qc) return;

    const a = animate(qa, {
      x: [0, 90, 0],
      rotate: [0, 180, 360],
      borderRadius: ["12px", "50%", "12px"],
      duration: 3600,
      ease: "inOutExpo",
      loop: true,
    });
    const b = animate(qb, {
      y: [0, -70, 0],
      scale: [1, 1.35, 1],
      duration: 2400,
      ease: "outElastic(1, .45)",
      loop: true,
    });
    const c = animate(qc, {
      rotate: [0, 360],
      scale: [1, 0.6, 1],
      opacity: [1, 0.35, 1],
      duration: 4200,
      ease: "inOutSine",
      loop: true,
    });

    return () => {
      a.pause();
      b.pause();
      c.pause();
    };
  }, []);

  return (
    <Section
      id="api"
      index="01"
      eyebrow="intuitive api"
      title={
        <>
          Say it, <span className="text-red">it moves.</span>
        </>
      }
      blurb="Targets, properties, values. One animate() call per shape — each with its own duration, its own ease, its own personality."
      accent="#ff4b4b"
    >
      <div ref={root} className="rounded-3xl border border-white/10 bg-panel/70 p-8 sm:p-12">
        <div className="flex h-56 items-center justify-around">
          <div className="api-a size-20 rounded-xl bg-red" />
          <div className="api-b size-20 rounded-full border-4 border-red" />
          <div className="api-c size-20 rotate-45 bg-red" />
        </div>
        <pre className="mt-6 overflow-x-auto rounded-2xl bg-coal p-5 font-mono text-xs leading-relaxed text-muted">
{`animate('.box-a', {
  x: [0, 90, 0],
  rotate: [0, 180, 360],
  borderRadius: ['12px', '50%', '12px'],
  ease: 'inOutExpo',
});`}
        </pre>
      </div>
    </Section>
  );
}
