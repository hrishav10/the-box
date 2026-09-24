"use client";

import { useEffect } from "react";
import { animate } from "animejs";

export default function Footer() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      animate(".footer-box", { x, y, rotate: x * 0.4, duration: 600, ease: "outExpo" });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="footer-box grid size-24 place-items-center rounded-3xl bg-lime font-mono text-4xl font-bold text-void">
          ▣
        </div>
        <h2 className="mt-10 text-4xl font-extrabold tracking-tight sm:text-6xl">
          Put it in <span className="text-lime">the box.</span>
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-dim">
          A single-page motion lab built with Next.js and anime.js v4. Every
          pixel that moved here did so on purpose.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#top"
            className="rounded-full bg-bone px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-void transition-colors hover:bg-lime"
          >
            back to top ↑
          </a>
          <a
            href="https://animejs.com/documentation"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-bone transition-colors hover:border-lime hover:text-lime"
          >
            docs ↗
          </a>
        </div>
        <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.3em] text-dim">
          the_box · mmxxvi · animate everything
        </p>
      </div>
    </footer>
  );
}
