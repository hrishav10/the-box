"use client";

import { useEffect, useRef, useState } from "react";
import { animate, morphTo } from "animejs";
import Section from "./Section";

const SHAPES = [
  { d: "M100,100 L500,100 L500,500 L100,500 Z", color: "#05dbe9", name: "square" },
  { d: "M300,60 L540,300 L300,540 L60,300 Z", color: "#a369ff", name: "diamond" },
  { d: "M300,80 L520,480 L300,380 L80,480 Z", color: "#ff4b4b", name: "chevron" },
  { d: "M300,90 L490,210 L490,450 L110,450 L110,210 Z", color: "#f6f4f2", name: "house" },
];

export default function MorphLab() {
  const pathRef = useRef<SVGPathElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    animate(p, { scale: [0.6, 1], opacity: [0, 1], duration: 800, ease: "outExpo" });
  }, []);

  const next = () => {
    const n = (idx + 1) % SHAPES.length;
    const p = pathRef.current;
    if (!p) return;
    setIdx(n);
    animate(p, {
      d: morphTo(SHAPES[n].d),
      fill: SHAPES[n].color,
      duration: 900,
      ease: "inOutExpo",
    });
    animate(p, {
      rotate: "+=180",
      duration: 900,
      ease: "inOutExpo",
    });
  };

  return (
    <Section
      id="morph"
      index="05"
      eyebrow="svg morph"
      title={
        <>
          Shapes that <span className="text-sky">change their mind.</span>
        </>
      }
      blurb="morphTo() interpolates the d attribute between shapes. Click the shape to morph it into the next one — same path element, zero swaps."
      accent="#05dbe9"
    >
      <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-panel p-10">
        <button onClick={next} aria-label="morph shape" className="cursor-pointer outline-none">
          <svg viewBox="0 0 600 600" className="h-[46vmin] w-[46vmin] transition-transform hover:scale-105">
            <path
              ref={pathRef}
              d={SHAPES[0].d}
              fill={SHAPES[0].color}
              className="origin-center"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            now: <span className="text-cream">{SHAPES[idx].name}</span>
          </p>
          <button
            onClick={next}
            className="rounded-full bg-lime px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-coal transition-transform hover:scale-105"
          >
            morph →
          </button>
        </div>
      </div>
    </Section>
  );
}
