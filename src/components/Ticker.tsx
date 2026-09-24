"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const WORDS = ["timelines", "stagger", "springs", "morph", "motion path", "scroll sync", "draggable", "easings"];

export default function Ticker() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !track.current) return;
    const anim = animate(track.current, {
      x: ["0%", "-50%"],
      duration: 14000,
      ease: "linear",
      loop: true,
    });
    return () => {
      anim.pause();
    };
  }, []);

  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={key + w} className="flex items-center">
          <span className="px-6 font-mono text-sm uppercase tracking-[0.3em] text-dim">{w}</span>
          <span className="text-lime">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-white/10 bg-panel py-4">
      <div ref={track} className="flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
