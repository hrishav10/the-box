"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

const BASE = "#3b3835";

/**
 * Persistent fullscreen dot grid behind every section.
 * Re-tints to each section's accent color (rippling from the center)
 * as you scroll — the signature animejs.com background wash, in 2D.
 */
export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const grid = useRef({ cols: 0, rows: 0 });
  const current = useRef(BASE);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const build = () => {
      const gap = 54;
      const cols = Math.ceil(window.innerWidth / gap);
      const rows = Math.ceil(window.innerHeight / gap);
      grid.current = { cols, rows };
      el.innerHTML = "";
      el.style.gridTemplateColumns = `repeat(${cols}, ${gap}px)`;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < cols * rows; i++) {
        const d = document.createElement("div");
        d.className = "bdot";
        (d as HTMLElement).style.background = current.current;
        frag.appendChild(d);
      }
      el.appendChild(frag);
    };

    build();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 250);
    };
    window.addEventListener("resize", onResize);

    const onAccent = (e: Event) => {
      const color = (e as CustomEvent<string>).detail;
      if (!color || color === current.current) return;
      current.current = color;
      const dots = el.querySelectorAll(".bdot");
      if (reduced || dots.length === 0) {
        dots.forEach((d) => ((d as HTMLElement).style.background = color));
        return;
      }
      animate(dots, {
        backgroundColor: color,
        duration: 450,
        ease: "outQuad",
        delay: stagger(16, {
          grid: [grid.current.cols, grid.current.rows],
          from: "center",
        }),
      });
    };
    window.addEventListener("box:accent", onAccent);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("box:accent", onAccent);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 grid place-content-start opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#252423_100%)]"
      />
    </>
  );
}
