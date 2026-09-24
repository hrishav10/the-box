"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createDraggable, createSpring, stagger } from "animejs";
import Section from "./Section";

export default function DragBox() {
  const root = useRef<HTMLDivElement>(null);
  const [throws, setThrows] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const box = el.querySelector(".drag-box");
    const area = el.querySelector(".drag-area");
    const targets = el.querySelectorAll(".drag-target");
    if (!box || !area) return;

    animate(targets, {
      scale: [0, 1],
      duration: 600,
      ease: "outBack(2)",
      delay: stagger(120),
    });

    const spring = () =>
      createSpring({ stiffness: 140, damping: 7, mass: 0.9 });

    const d = createDraggable(box, {
      container: ".drag-area",
      releaseEase: spring(),
      onRelease: () => setThrows((t) => t + 1),
      onGrab: () => animate(box, { scale: 1.15, duration: 200 }),
      onSettle: () => animate(box, { scale: 1, duration: 300 }),
    });

    // snap targets pulse when the box lands near them
    const onMove = () => {
      const b = (box as HTMLElement).getBoundingClientRect();
      targets.forEach((t) => {
        const r = (t as HTMLElement).getBoundingClientRect();
        const near =
          Math.abs(b.left + b.width / 2 - (r.left + r.width / 2)) < 70 &&
          Math.abs(b.top + b.height / 2 - (r.top + r.height / 2)) < 70;
        (t as HTMLElement).style.opacity = near ? "1" : "0.35";
      });
    };
    const id = setInterval(onMove, 120);
    return () => {
      clearInterval(id);
      d.revert();
    };
  }, []);

  return (
    <Section
      id="springs"
      index="08"
      eyebrow="springs"
      title={
        <>
          Throw <span className="text-lime">the box.</span>
        </>
      }
      blurb="createDraggable() with a spring release ease — grab the box, fling it, and watch real spring physics settle it. Drag it over a target to light it up."
      accent="#b7ff54"
    >
      <div ref={root} className="rounded-3xl border border-white/10 bg-panel p-6 sm:p-10">
        <div className="drag-area relative h-[46vh] min-h-[320px] overflow-hidden rounded-2xl border border-dashed border-white/15 bg-coal">
          {[
            { l: "12%", t: "18%", c: "#a369ff" },
            { l: "78%", t: "14%", c: "#ff4b4b" },
            { l: "70%", t: "68%", c: "#b7ff54" },
            { l: "16%", t: "66%", c: "#f6f4f2" },
          ].map((p, i) => (
            <div
              key={i}
              className="drag-target absolute size-14 rounded-2xl opacity-35"
              style={{ left: p.l, top: p.t, background: p.c }}
            />
          ))}
          <div className="drag-box absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center rounded-2xl bg-lime font-mono text-2xl font-bold text-coal active:cursor-grabbing">
            ▣
          </div>
        </div>
        <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
          throws: <span className="text-lime">{throws}</span> · spring stiffness 140 · damping 7
        </p>
      </div>
    </Section>
  );
}
