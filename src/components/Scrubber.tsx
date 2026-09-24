"use client";

import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { id: "top", label: "intro" },
  { id: "cube", label: "cube" },
  { id: "api", label: "api" },
  { id: "transforms", label: "transforms" },
  { id: "scroll", label: "scroll" },
  { id: "stagger", label: "stagger" },
  { id: "morph", label: "morph" },
  { id: "path", label: "path" },
  { id: "springs", label: "springs" },
  { id: "clock", label: "clock" },
  { id: "easings", label: "easings" },
  { id: "outro", label: "outro" },
];

/**
 * Global page scrubber — fixed bottom-right progress bar with chapter
 * ticks. The cursor reflects scroll fraction; dragging it seeks the page
 * (which in turn scrubs every scroll-driven timeline).
 */
export default function Scrubber() {
  const track = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState("intro");
  const dragging = useRef(false);

  useEffect(() => {
    let raf = 0;
    const max = () => document.documentElement.scrollHeight - window.innerHeight;

    const update = () => {
      raf = 0;
      const m = max();
      const f = m > 0 ? Math.min(1, Math.max(0, window.scrollY / m)) : 0;
      if (cursor.current) cursor.current.style.left = `calc(${(f * 100).toFixed(2)}% - 5px)`;
      if (track.current) track.current.setAttribute("aria-valuenow", String(Math.round(f * 100)));
      if (wrap.current) {
        wrap.current.style.opacity = window.scrollY > window.innerHeight * 0.4 ? "1" : "0";
        wrap.current.style.pointerEvents = window.scrollY > window.innerHeight * 0.4 ? "auto" : "none";
      }
      const probe = window.scrollY + window.innerHeight * 0.4;
      let current = CHAPTERS[0].label;
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.offsetTop <= probe) current = c.label;
      }
      setChapter((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const seek = (clientX: number) => {
    const t = track.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const m = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: f * m, behavior: "auto" });
  };

  return (
    <div
      ref={wrap}
      className="fixed bottom-5 right-5 z-40 w-44 opacity-0 transition-opacity duration-500 sm:w-52"
      aria-hidden={false}
    >
      <div className="mb-1.5 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {chapter}
      </div>
      <div
        ref={track}
        role="slider"
        aria-label="page progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-valuetext={chapter}
        tabIndex={0}
        className="relative h-6 cursor-ew-resize touch-none outline-none"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          seek(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) seek(e.clientX);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={(e) => {
          const m = document.documentElement.scrollHeight - window.innerHeight;
          if (e.key === "ArrowRight") window.scrollTo({ top: Math.min(m, window.scrollY + window.innerHeight * 0.5) });
          if (e.key === "ArrowLeft") window.scrollTo({ top: Math.max(0, window.scrollY - window.innerHeight * 0.5) });
        }}
      >
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/15" />
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            tabIndex={-1}
            aria-label={`go to ${c.label}`}
            className="absolute top-1/2 h-2 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 transition-colors hover:bg-cream"
            style={{ left: `${(i / (CHAPTERS.length - 1)) * 100}%` }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ))}
        <div ref={cursor} className="absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-red shadow-[0_0_12px_rgba(255,75,75,0.9)]" />
      </div>
    </div>
  );
}
