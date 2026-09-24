import type { ReactNode } from "react";

export default function Section({
  id,
  index,
  title,
  blurb,
  children,
}: {
  id: string;
  index: string;
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-6 py-28">
      <div className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-lime">
          {index}
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-dim">{blurb}</p>
      </div>
      {children}
    </section>
  );
}
