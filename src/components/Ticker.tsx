"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const ITEMS = [
  "timelines",
  "stagger",
  "scroll sync",
  "svg morph",
  "motion path",
  "springs",
  "draggable",
  "easings",
];

export default function Ticker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = animate(el, {
      x: ["0%", "-50%"],
      duration: 22000,
      ease: "linear",
      loop: true,
    });
    return () => {
      anim.pause();
    };
  }, []);

  const row = [...ITEMS, ...ITEMS];

  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-panel/60 py-4">
      <div ref={ref} className="flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-cream">
              {t}
            </span>
            <span className="text-red">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
