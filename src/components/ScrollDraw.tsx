"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createDrawable, onScroll } from "animejs";
import { useAccent } from "@/hooks/useAccent";

export default function ScrollDraw() {
  const wrap = useRef<HTMLDivElement>(null);
  const accentRef = useAccent<HTMLDivElement>("#00ffaa");
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
        enter: "top top",
        leave: "bottom bottom",
        onUpdate: (obs: { progress: number }) => setPct(Math.round(obs.progress * 100)),
      }),
    });
    return () => {
      anim.pause();
    };
  }, []);

  return (
    <div id="scroll" ref={accentRef} className="relative z-10 scroll-mt-24">
      <div className="mx-auto w-full max-w-7xl px-6 pt-28">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-turquoise">
          03 — scroll observer
        </p>
        <h2 className="font-display mt-4 text-4xl leading-[0.95] sm:text-5xl">
          Drawn by <span className="text-turquoise">your scroll.</span>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">
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
              stroke="#00ffaa"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="scroll-path"
              d="M150 120 h300 M150 480 h300 M120 150 v300 M480 150 v300"
              fill="none"
              stroke="#05dbe9"
              strokeWidth="3"
              strokeDasharray="1 14"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute bottom-10 font-mono text-sm tracking-[0.3em] text-turquoise">
            {String(pct).padStart(3, "0")}%
          </div>
        </div>
      </div>
    </div>
  );
}
