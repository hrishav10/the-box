"use client";

import { useEffect } from "react";
import { createTimeline, stagger } from "animejs";

const LINKS = [
  { label: "stagger", href: "#stagger" },
  { label: "scroll", href: "#scroll" },
  { label: "morph", href: "#morph" },
  { label: "path", href: "#path" },
  { label: "drag", href: "#drag" },
];

export default function Nav() {
  useEffect(() => {
    createTimeline({ defaults: { ease: "outExpo" } })
      .add(".nav-shell", { y: [-64, 0], opacity: [0, 1], duration: 800 }, 200)
      .add(
        ".nav-link",
        { y: [14, 0], opacity: [0, 1], duration: 500, delay: stagger(70) },
        550
      );
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="nav-shell mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-void/70 px-5 py-3 opacity-0 backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-lime font-mono text-sm font-bold text-void">
            ▣
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.25em]">
            THE_BOX
          </span>
        </a>
        <div className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link font-mono text-xs uppercase tracking-[0.2em] text-dim opacity-0 transition-colors hover:text-lime"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#drag"
          className="nav-link rounded-full bg-bone px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-void opacity-0 transition-colors hover:bg-lime"
        >
          play
        </a>
      </nav>
    </header>
  );
}
