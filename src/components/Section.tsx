import type { ReactNode } from "react";
import { useAccent } from "@/hooks/useAccent";

type Props = {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  blurb: string;
  accent: string;
  children: ReactNode;
};

/**
 * Full-height stage: text column on the left, demo on the right.
 * Entering the stage washes the backdrop dots in the accent color.
 */
export default function Section({ id, index, eyebrow, title, blurb, accent, children }: Props) {
  const ref = useAccent(accent);

  return (
    <section
      id={id}
      ref={ref}
      className="relative z-10 mx-auto grid w-full max-w-7xl scroll-mt-24 gap-10 px-6 py-24 md:grid-cols-[22rem_1fr] md:py-32 lg:grid-cols-[26rem_1fr] lg:gap-16"
    >
      <div className="md:sticky md:top-28 md:self-start">
        <p
          className="font-mono text-[11px] font-bold uppercase tracking-[0.35em]"
          style={{ color: accent }}
        >
          {index} — {eyebrow}
        </p>
        <h2 className="font-display mt-4 text-4xl leading-[0.95] sm:text-5xl">{title}</h2>
        <p className="mt-5 max-w-md leading-relaxed text-muted">{blurb}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
