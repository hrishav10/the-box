"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createTimer, stagger } from "animejs";
import Section from "./Section";

const N = 13;
const COUNT = N * N;

export default function DotGrid() {
  const root = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(true);
  const autoRef = useRef(auto);
  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);

  const ripple = (from: number) => {
    const dots = root.current?.querySelectorAll(".dot");
    if (!dots) return;
    animate(dots, {
      scale: [
        { to: 1.9, duration: 220, ease: "outQuad" },
        { to: 1, duration: 700, ease: "outElastic(1, .45)" },
      ],
      backgroundColor: [
        { to: "#d7ff3e", duration: 200 },
        { to: "#3a3a3e", duration: 900 },
      ],
      delay: (_el: unknown, i: number = 0) => {
        const ax = from % N, ay = Math.floor(from / N);
        const bx = i % N, by = Math.floor(i / N);
        return Math.hypot(ax - bx, ay - by) * 55;
      },
    });
  };

  useEffect(() => {
    // entrance
    animate(root.current?.querySelectorAll(".dot") ?? [], {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 500,
      ease: "outExpo",
      delay: stagger(12, { grid: [N, N], from: "center" }),
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // idle auto-wave from the center
    const timer = createTimer({
      duration: 2600,
      loop: true,
      onLoop: () => {
        if (autoRef.current) ripple(Math.floor(COUNT / 2));
      },
    });
    return () => {
      timer.pause();
    };
  }, []);

  return (
    <Section
      id="stagger"
      index="01 — stagger"
      title="The ripple grid"
      blurb="169 dots, one stagger() call. Move your cursor across the grid — each ripple radiates from the dot under your pointer, delayed by distance. The idle wave fires from the center every few seconds."
    >
      <div className="rounded-3xl border border-white/10 bg-panel p-6 sm:p-10">
        <div
          ref={root}
          className="mx-auto grid w-fit grid-cols-[repeat(13,minmax(0,1fr))] gap-2 sm:gap-3"
          onPointerMove={(e) => {
            const t = (e.target as HTMLElement).closest(".dot") as HTMLElement | null;
            if (!t || t.dataset.rippled === "1") return;
            t.dataset.rippled = "1";
            ripple(Number(t.dataset.i));
            setTimeout(() => (t.dataset.rippled = ""), 900);
          }}
        >
          {Array.from({ length: COUNT }, (_, i) => (
            <button
              key={i}
              data-i={i}
              aria-label={`dot ${i}`}
              className="dot size-3 rounded-full bg-[#3a3a3e] opacity-0 sm:size-4"
            />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
            delay: distance × 55ms
          </p>
          <button
            onClick={() => setAuto((v) => !v)}
            className={`rounded-full px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
              auto ? "bg-lime text-void" : "border border-white/20 text-dim hover:text-bone"
            }`}
          >
            auto-wave {auto ? "on" : "off"}
          </button>
        </div>
      </div>
    </Section>
  );
}
