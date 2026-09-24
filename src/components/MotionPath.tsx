"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, createMotionPath } from "animejs";
import Section from "./Section";

export default function MotionPath() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const circuit = el.querySelector(".circuit");
    const traveler = el.querySelector(".traveler");
    if (!circuit || !traveler) return;

    // the circuit draws itself, endlessly
    const draw = animate(createDrawable(circuit), {
      draw: ["0 0", "0 1", "1 1"],
      duration: 5000,
      ease: "inOutSine",
      loop: true,
    });

    // the box rides the circuit
    const ride = animate(traveler, {
      ...createMotionPath(circuit as SVGPathElement),
      duration: 5000,
      ease: "linear",
      loop: true,
    });

    return () => {
      draw.pause();
      ride.pause();
    };
  }, []);

  return (
    <Section
      id="path"
      index="06"
      eyebrow="motion path"
      title={
        <>
          Ride <span className="text-sky">the circuit.</span>
        </>
      }
      blurb="createMotionPath() pins an element to any SVG path — position and rotation follow the curve. The circuit draws itself on the same 5-second loop the box rides."
      accent="#05dbe9"
    >
      <div ref={root} className="rounded-3xl border border-white/10 bg-panel p-6 sm:p-10">
        <svg viewBox="0 0 800 400" className="mx-auto w-full max-w-3xl">
          <path
            className="circuit"
            d="M60 200 C 60 80, 200 60, 300 140 S 480 320, 600 220 S 740 120, 740 200"
            fill="none"
            stroke="#05dbe9"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <g className="traveler">
            <rect x="-22" y="-22" width="44" height="44" rx="10" fill="#05dbe9" />
            <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#252423" />
          </g>
        </svg>
        <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
          duration 5000ms · linear · loop ∞
        </p>
      </div>
    </Section>
  );
}
