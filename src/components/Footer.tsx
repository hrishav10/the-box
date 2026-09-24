"use client";

import { useEffect } from "react";
import { animate } from "animejs";

export default function Footer() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 26;
      const y = (e.clientY / window.innerHeight - 0.5) * 26;
      animate(".footer-box", { x, y, rotate: x * 0.5, duration: 600, ease: "outExpo" });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <footer id="outro" className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="footer-box grid size-24 place-items-center rounded-3xl bg-red font-mono text-4xl font-bold text-cream">
          ▣
        </div>
        <h2 className="font-display mt-10 text-5xl leading-[0.95] sm:text-7xl">
          Start <span className="text-red">animating.</span>
        </h2>
        <p className="mt-6 max-w-md leading-relaxed text-muted">
          One page, one library, zero excuses. Everything you just saw is
          anime.js v4 running in a plain Next.js app.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#top"
            className="rounded-full bg-cream px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-coal transition-transform hover:scale-105"
          >
            back to top ↑
          </a>
          <a
            href="https://animejs.com/documentation"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.12em] text-cream transition-colors hover:border-red hover:text-red"
          >
            anime.js docs ↗
          </a>
        </div>
        <p className="mt-20 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          the_box · mmxxvi · animate everything
        </p>
      </div>
    </footer>
  );
}
