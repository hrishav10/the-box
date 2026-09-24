"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Section from "./Section";

/**
 * Enhanced transforms — layered shapes drifting with blend modes,
 * each transform animated individually.
 */
export default function Transforms() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ta = el.querySelector(".tf-a");
    const tb = el.querySelector(".tf-b");
    const tc = el.querySelector(".tf-c");
    if (!ta || !tb || !tc) return;

    const anims = [
      animate(ta, {
        x: [-40, 40],
        y: [-24, 24],
        rotate: [0, 120],
        duration: 5200,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      animate(tb, {
        x: [50, -50],
        y: [30, -30],
        scale: [1, 1.25],
        duration: 6400,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      animate(tc, {
        rotate: [0, -360],
        x: [0, 60, 0, -60, 0],
        duration: 9000,
        ease: "linear",
        loop: true,
      }),
    ];
    return () => anims.forEach((a) => a.pause());
  }, []);

  return (
    <Section
      id="transforms"
      index="02"
      eyebrow="transforms"
      title={
        <>
          Layers that <span className="text-orange">drift.</span>
        </>
      }
      blurb="Every transform — x, y, rotation, scale — animated on its own clock, composited with blend modes. Nothing here ever sits still."
      accent="#ffa828"
    >
      <div
        ref={root}
        className="relative flex h-72 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-panel/70"
      >
        <div className="tf-a absolute size-44 rounded-full bg-orange opacity-70 mix-blend-screen" />
        <div className="tf-b absolute size-44 rotate-12 bg-purple opacity-70 mix-blend-screen" />
        <div className="tf-c absolute size-44 rounded-full border-4 border-dashed border-cream opacity-60" />
        <p className="absolute bottom-5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          mix-blend-screen · individual transforms
        </p>
      </div>
    </Section>
  );
}
