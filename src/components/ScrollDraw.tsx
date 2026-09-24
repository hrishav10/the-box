"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createDrawable, onScroll } from "animejs";

export default function ScrollDraw() {
  const wrap = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const svg = wrap.current;
    if (!svg) return;
    const drawables = createDrawable(svg.querySelectorAll(".scroll-path"));
    const anim = animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "linear",
      autoplay: onScroll({
        target: svg,
        sync: true,
        enter: "bottom bottom",
        leave: "top top",
      }),
      onUpdate: (self: { progress: number }) => setPct(Math.round(self.progress)),
    });
    return () => {
      anim.pause();
    };
  }, []);

  return (
    <div id="scroll" className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-lime">02 — scroll observer</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Drawn by your scroll</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-dim">
          This line is synced 1:1 to scroll position with onScroll — scroll down
          and the circuit draws itself. Scroll back up and it undraws.
        </p>
      </div>
      <div ref={wrap} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center">
          <svg viewBox="0 0 600 600" className="h-[70vmin] w-[70vmin]">
            <path
              className="scroll-path"
              d="M300 40 L520 170 L520 430 L300 560 L80 430 L80 170 Z M300 40 L300 300 M520 170 L300 300 M80 170 L300 300 M300 300 L300 560 M180 235 L420 235 M180 365 L420 365"
              fill="none"
              stroke="#d7ff3e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="scroll-path"
              d="M150 120 h300 M150 480 h300 M120 150 v300 M480 150 v300"
              fill="none"
              stroke="#8b7bff"
              strokeWidth="3"
              strokeDasharray="1 14"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute bottom-10 font-mono text-sm tracking-[0.3em] text-lime">
            {String(pct).padStart(3, "0")}%
          </div>
        </div>
      </div>
    </div>
  );
}
