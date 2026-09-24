"use client";

import { useEffect } from "react";
import { animate } from "animejs";

const LINKS = [
  { label: "machine", href: "#machine" },
  { label: "api", href: "#api" },
  { label: "scroll", href: "#scroll" },
  { label: "stagger", href: "#stagger" },
  { label: "springs", href: "#springs" },
  { label: "clock", href: "#clock" },
];

export default function Nav() {
  useEffect(() => {
    animate(".nav-item", {
      y: [-24, 0],
      opacity: [0, 1],
      duration: 700,
      ease: "outExpo",
      delay: (_: unknown, i: number = 0) => i * 70,
    });
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-coal/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <a href="#top" className="nav-item flex items-center gap-2.5" aria-label="the box home">
          <span className="grid size-6 place-items-center rounded-[6px] bg-red font-mono text-sm font-bold text-cream">
            ▣
          </span>
          <span className="font-mono text-sm font-bold tracking-tight">the_box</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-item font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-cream"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/hrishav10/the-box"
          target="_blank"
          rel="noreferrer"
          className="nav-item rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-cream transition-colors hover:border-red hover:text-red"
        >
          github ↗
        </a>
      </nav>
    </header>
  );
}
