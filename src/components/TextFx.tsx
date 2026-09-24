"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger } from "animejs";
import Section from "./Section";

const LINES = [
  "Motion is meaning.",
  "Every millisecond",
  "is a decision.",
];

export default function TextFx() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.querySelectorAll(".reveal-line").forEach((line, li) => {
      animate(line.querySelectorAll(".ch"), {
        y: ["110%", "0%"],
        rotate: [6, 0],
        duration: 800,
        ease: "outExpo",
        delay: stagger(28),
        autoplay: onScroll({
          target: line,
          enter: "bottom 85%",
          leave: "top 15%",
        }),
      });
      void li;
    });
  }, []);

  return (
    <div ref={root}>
      <Section
        id="text"
        index="06 — scroll triggers"
        title="Words that arrive"
        blurb="Each line animates once as it enters the viewport — characters rise with a stagger, then settle. onScroll handles the triggering; no scroll listener written by hand."
      >
        <div className="space-y-6 rounded-3xl border border-white/10 bg-panel p-10 sm:p-14">
          {LINES.map((line, li) => (
            <div key={li} className="reveal-line overflow-hidden">
              <p
                className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${
                  li === 1 ? "text-stroke" : li === 2 ? "text-lime" : ""
                }`}
              >
                {line.split("").map((ch, i) => (
                  <span key={i} className="ch inline-block will-change-transform">
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
