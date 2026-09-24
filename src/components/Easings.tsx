"use client";

import { useRef } from "react";
import { animate, stagger } from "animejs";
import Section from "./Section";

const EASINGS = [
  { name: "outExpo", ease: "outExpo", color: "#e962bf" },
  { name: "outElastic", ease: "outElastic(1, .5)", color: "#a369ff" },
  { name: "outBounce", ease: "outBounce", color: "#ff4b4b" },
  { name: "inOutSine", ease: "inOutSine", color: "#f6f4f2" },
  { name: "spring", ease: "outSpring(1, 80, 12, 0)", color: "#e962bf" },
];

export default function Easings() {
  const root = useRef<HTMLDivElement>(null);

  const race = () => {
    const rows = root.current?.querySelectorAll(".ease-row");
    if (!rows) return;
    rows.forEach((row, i) => {
      const dot = row.querySelector(".ease-dot");
      if (!dot) return;
      animate(dot, {
        x: [0, row.clientWidth - 72],
        duration: 1600,
        ease: EASINGS[i].ease as never,
        delay: stagger(0),
      });
    });
  };

  return (
    <Section
      id="easings"
      index="09"
      eyebrow="easings"
      title={
        <>
          Same track, <span className="text-magenta">different souls.</span>
        </>
      }
      blurb="Five easings, one track. Hit race and watch identical durations feel completely different — that's the whole game."
      accent="#e962bf"
    >
      <div ref={root} className="rounded-3xl border border-white/10 bg-panel p-6 sm:p-10">
        <div className="space-y-5">
          {EASINGS.map((e) => (
            <div key={e.name} className="ease-row relative h-12 rounded-xl bg-coal">
              <div
                className="ease-dot absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg font-mono text-xs font-bold text-cream"
                style={{ background: e.color }}
              >
                →
              </div>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {e.name}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={race}
          className="mt-8 w-full rounded-full bg-magenta py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-coal transition-transform hover:scale-[1.01]"
        >
          race →
        </button>
      </div>
    </Section>
  );
}
