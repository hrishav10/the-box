"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

function Letters({ text, className }: { text: string; className?: string }) {
  return (
    <span className="inline-flex overflow-hidden pb-2">
      {text.split("").map((ch, i) => (
        <span key={i} className={`hero-letter ${className ?? ""}`}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (s: string) => root.current?.querySelectorAll(s);

    // intro timeline: letters, box draw, sub copy, ctas, hint
    createTimeline({ defaults: { ease: "outExpo" } })
      .add(".hero-letter", { y: ["115%", "0%"], rotate: [10, 0], duration: 1000, delay: stagger(55) }, 150)
      .add(".hero-rule", { scaleX: [0, 1], duration: 900, ease: "inOutExpo" }, "-=700")
      .add(".hero-sub", { y: [24, 0], opacity: [0, 1], duration: 700 }, "-=600")
      .add(".hero-cta", { y: [18, 0], opacity: [0, 1], duration: 600, delay: stagger(90) }, "-=500")
      .add(".hero-hint", { opacity: [0, 1], duration: 600 }, "-=300");

    // ambient float on the cube glyphs
    if (!reduced) {
      animate(".float-glyph", {
        y: [-14, 14],
        rotate: [-6, 6],
        duration: 2600,
        ease: "inOutSine",
        alternate: true,
        loop: true,
        delay: stagger(400),
      });
    } else {
      q(".hero-letter, .hero-sub, .hero-cta, .hero-hint")?.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    }
  }, []);

  return (
    <section ref={root} id="top" className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-28">
      {/* backdrop grid dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: "radial-gradient(circle, #f5f4ef 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      {/* floating glyphs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="float-glyph absolute left-[8%] top-[22%] font-mono text-5xl text-lime/70">◧</span>
        <span className="float-glyph absolute right-[10%] top-[30%] font-mono text-6xl text-violet/70">⬢</span>
        <span className="float-glyph absolute bottom-[24%] left-[14%] font-mono text-4xl text-crimson/70">⬣</span>
        <span className="float-glyph absolute bottom-[30%] right-[16%] font-mono text-5xl text-bone/40">◈</span>
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <p className="hero-sub mb-6 font-mono text-xs uppercase tracking-[0.35em] text-lime opacity-0">
          a motion lab · powered by anime.js v4
        </p>
        <h1 className="font-sans text-[clamp(3.5rem,13vw,11rem)] font-extrabold leading-[0.95] tracking-tight">
          <Letters text="THE" />
          <br />
          <Letters text="BOX" className="text-lime" />
        </h1>
        <div className="hero-rule mt-8 h-px w-full origin-left bg-white/15" />
        <p className="hero-sub mt-8 max-w-xl text-lg leading-relaxed text-dim opacity-0">
          Every effect on this page is alive — timelines, staggers, scroll-synced
          line drawing, SVG morphing, motion paths, springs and draggable
          physics. Scroll, hover, throw things. It&apos;s all anime.js.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#stagger"
            className="hero-cta rounded-full bg-lime px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-void opacity-0 transition-transform hover:scale-105"
          >
            enter the lab
          </a>
          <a
            href="https://animejs.com/"
            target="_blank"
            rel="noreferrer"
            className="hero-cta rounded-full border border-white/20 px-7 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-bone opacity-0 transition-colors hover:border-lime hover:text-lime"
          >
            animejs.com ↗
          </a>
        </div>
      </div>

      <div className="hero-hint absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-dim opacity-0">
        scroll ↓
      </div>
    </section>
  );
}
