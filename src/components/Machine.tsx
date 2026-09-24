"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, createTimeline, onScroll } from "animejs";
import { useAccent } from "@/hooks/useAccent";

const LEADERS = [
  { text: "TIMELINE", color: "#e08d57", ax: 300, ay: 124, tx: 140, ty: 96 },
  { text: "STAGGER", color: "#4d9cff", ax: 300, ay: 345, tx: 140, ty: 352 },
  { text: "SCROLL", color: "#00ffaa", ax: 300, ay: 651, tx: 140, ty: 648 },
  { text: "SPRING", color: "#b7ff54", ax: 300, ay: 248, tx: 460, ty: 220, right: true },
  { text: "SVG", color: "#05dbe9", ax: 300, ay: 451, tx: 460, ty: 452, right: true },
  { text: "DRAGGABLE", color: "#e962bf", ax: 300, ay: 744, tx: 460, ty: 700, right: true },
];

/**
 * The Machine — an original exploded-view mechatronic actuator.
 * A pinned full-viewport stage scrubbed by scroll: shell panels detach,
 * seven part groups separate along the axis, the render cross-fades to
 * wireframe, parts reassemble, and leader lines annotate the modules.
 */
export default function Machine() {
  const pin = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const accentRef = useAccent<HTMLDivElement>("#e08d57");

  useEffect(() => {
    const pinEl = pin.current;
    const svg = svgRef.current;
    if (!pinEl || !svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hintRef.current && reduced) hintRef.current.style.display = "none";
    if (reduced) return;

    // Build the wireframe copy: clone the device, strip fills to line art.
    const device = svg.querySelector("#device");
    if (device) {
      const wire = device.cloneNode(true) as SVGGElement;
      wire.id = "device-wire";
      wire.setAttribute("opacity", "0");
      wire.querySelectorAll("*").forEach((n) => {
        const el = n as SVGElement;
        el.classList.forEach((c) => {
          if (c.startsWith("p-")) {
            el.classList.remove(c);
            el.classList.add(`w-${c.slice(2)}`);
          }
        });
        if (el.classList.contains("glow")) (el as unknown as HTMLElement).style.display = "none";
        const tag = el.tagName.toLowerCase();
        if (["path", "rect", "circle", "ellipse", "line", "polyline", "polygon"].includes(tag)) {
          el.setAttribute("fill", "none");
          el.setAttribute("stroke", "#7d7975");
          el.setAttribute("stroke-width", "1.5");
        }
        el.removeAttribute("filter");
      });
      device.after(wire);
    }

    // Leader lines start fully undrawn.
    const drawables = createDrawable(svg.querySelectorAll(".leader"));
    animate(drawables, { draw: "0 0", duration: 1, ease: "linear" });

    const tl = createTimeline({
      defaults: { ease: "inOutQuad" },
      autoplay: onScroll({
        target: pinEl,
        enter: "top top",
        leave: "bottom bottom",
        sync: true,
      }),
    });

    // 1 — shell panels detach first, radially.
    tl.add(".p-shell-l, .w-shell-l", { x: -200, y: -150, rotate: -16, duration: 1500 }, 600)
      .add(".p-shell-r, .w-shell-r", { x: 200, y: 160, rotate: 16, duration: 1500 }, 600)
      .add("#device-tilt", { rotate: -7, transformOrigin: "300px 450px", duration: 1600 }, 800)
      .add(".m-hint", { opacity: 0, duration: 400 }, 700)
      // 2 — axial separation, staggered.
      .add(".p-cap, .w-cap", { y: -170, duration: 1400 }, 2200)
      .add(".p-lens, .w-lens", { y: -110, x: -18, duration: 1400 }, 2350)
      .add(".p-coil, .w-coil", { y: -45, x: 14, duration: 1400 }, 2500)
      .add(".p-pcb, .w-pcb", { y: 25, x: -14, duration: 1400 }, 2650)
      .add(".p-core, .w-core", { y: 95, x: 12, duration: 1400 }, 2800)
      .add(".p-grille, .w-grille", { y: 165, x: -10, duration: 1400 }, 2950)
      .add(".p-base, .w-base", { y: 235, duration: 1400 }, 3100)
      .add(".axis", { opacity: [0, 0.55], duration: 800 }, 2400)
      // 3 — cross-fade to wireframe on cream.
      .add(".stage-bg", { backgroundColor: ["#252423", "#f6f4f2"], duration: 1200 }, 5000)
      .add("#device", { opacity: [1, 0], duration: 900 }, 5100)
      .add("#device-wire", { opacity: [0, 1], duration: 900 }, 5100)
      .add(".axis", { opacity: 0, duration: 600 }, 5200)
      .add(".m-head", { opacity: [0, 1], y: [24, 0], duration: 900 }, 5600)
      // 4 — reassemble in wireframe.
      .add(".p-shell-l, .w-shell-l", { x: 0, y: 0, rotate: 0, duration: 1500 }, 6200)
      .add(".p-shell-r, .w-shell-r", { x: 0, y: 0, rotate: 0, duration: 1500 }, 6200)
      .add(".p-cap, .w-cap", { y: 0, duration: 1400 }, 6400)
      .add(".p-lens, .w-lens", { y: 0, x: 0, duration: 1400 }, 6500)
      .add(".p-coil, .w-coil", { y: 0, x: 0, duration: 1400 }, 6600)
      .add(".p-pcb, .w-pcb", { y: 0, x: 0, duration: 1400 }, 6700)
      .add(".p-core, .w-core", { y: 0, x: 0, duration: 1400 }, 6800)
      .add(".p-grille, .w-grille", { y: 0, x: 0, duration: 1400 }, 6900)
      .add(".p-base, .w-base", { y: 0, duration: 1400 }, 7000)
      .add("#device-tilt", { rotate: 0, duration: 1500 }, 6400)
      // 5 — leader lines + module labels draw in.
      .add(drawables, { draw: ["0 0", "0 1"], duration: 900, ease: "linear" }, 8000)
      .add(".anno-labels", { opacity: [0, 1], duration: 600 }, 8300)
      // 6 — power down: fade back to dark for the next chapter.
      .add(".anno-labels", { opacity: [1, 0], duration: 700 }, 9200)
      .add(".m-head", { opacity: 0, duration: 700 }, 9200)
      .add("#device-wire", { opacity: [1, 0], duration: 800 }, 9300)
      .add(".stage-bg", { backgroundColor: ["#f6f4f2", "#252423"], duration: 900 }, 9300);

    return () => {
      tl.pause();
    };
  }, []);

  return (
    <div id="machine" ref={accentRef} className="relative z-10">
      <div ref={pin} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
          <div className="stage-bg absolute inset-0" style={{ backgroundColor: "#252423" }} />

          <div className="m-head pointer-events-none absolute left-6 top-24 z-20 opacity-0 sm:left-12 sm:top-28">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-copper">
              the machine
            </p>
            <h2 className="font-display mt-3 text-4xl leading-[0.95] text-coal sm:text-6xl">
              Anatomy of
              <br />a machine.
            </h2>
          </div>

          <svg ref={svgRef} viewBox="0 0 600 900" className="relative z-10 h-[80svh] w-auto max-w-[94vw]" role="img" aria-label="Exploded view of a mechatronic actuator">
            <defs>
              <linearGradient id="m-gun" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#4d4844" />
                <stop offset="0.5" stopColor="#2b2927" />
                <stop offset="1" stopColor="#1c1b1a" />
              </linearGradient>
              <linearGradient id="m-gun-dark" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3a3633" />
                <stop offset="0.5" stopColor="#211f1e" />
                <stop offset="1" stopColor="#161514" />
              </linearGradient>
              <linearGradient id="m-copper" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f2b183" />
                <stop offset="0.5" stopColor="#cf7f47" />
                <stop offset="1" stopColor="#7e401f" />
              </linearGradient>
              <radialGradient id="m-glass" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#45413d" />
                <stop offset="0.7" stopColor="#1a1918" />
              </radialGradient>
            </defs>

            <line className="axis" x1="300" y1="70" x2="300" y2="840" stroke="#8a8783" strokeWidth="1.5" strokeDasharray="6 8" opacity="0" />

            <g id="device-tilt">
              <g id="device">
                {/* inner chassis, revealed when shells detach */}
                <g className="part p-chassis">
                  <rect x="262" y="170" width="76" height="440" fill="#191817" />
                  <line x1="280" y1="190" x2="280" y2="590" stroke="#2e2c2b" strokeWidth="3" />
                  <line x1="300" y1="190" x2="300" y2="590" stroke="#2e2c2b" strokeWidth="3" />
                  <line x1="320" y1="190" x2="320" y2="590" stroke="#2e2c2b" strokeWidth="3" />
                  <circle className="glow" cx="300" cy="240" r="4" fill="#e08d57" />
                  <circle className="glow" cx="300" cy="420" r="4" fill="#e08d57" />
                  <circle className="glow" cx="300" cy="540" r="4" fill="#e08d57" />
                </g>

                {/* top cap */}
                <g className="part p-cap">
                  <rect x="232" y="120" width="136" height="58" rx="14" fill="url(#m-gun)" />
                  <rect x="232" y="120" width="136" height="16" rx="8" fill="#5a5550" />
                  <line x1="244" y1="124" x2="356" y2="124" stroke="url(#m-copper)" strokeWidth="4" strokeLinecap="round" />
                  <rect x="232" y="138" width="10" height="40" fill="#1d1c1b" opacity="0.6" />
                  <circle cx="252" cy="162" r="5" fill="#171616" stroke="#4a4643" />
                  <circle cx="348" cy="162" r="5" fill="#171616" stroke="#4a4643" />
                </g>

                {/* sensor lens */}
                <g className="part p-lens">
                  <circle cx="300" cy="248" r="46" fill="url(#m-gun-dark)" stroke="#e8a06a" strokeWidth="3" />
                  <circle cx="300" cy="248" r="33" fill="url(#m-glass)" />
                  {[0, 1, 2].map((r) =>
                    [0, 1, 2].map((c) => (
                      <circle key={`${r}-${c}`} className="glow" cx={286 + c * 14} cy={234 + r * 14} r="3" fill="#ff4b4b" opacity="0.85" />
                    ))
                  )}
                  <circle className="glow" cx="288" cy="236" r="5" fill="#f6f4f2" opacity="0.85" />
                </g>

                {/* copper coil winding */}
                <g className="part p-coil">
                  <rect x="268" y="296" width="64" height="104" fill="#1d1c1b" />
                  {[310, 328, 346, 364, 382].map((cy) => (
                    <ellipse key={cy} cx="300" cy={cy} rx="74" ry="13" fill="none" stroke="url(#m-copper)" strokeWidth="10" />
                  ))}
                  <rect x="222" y="300" width="14" height="88" rx="4" fill="url(#m-gun-dark)" />
                  <rect x="364" y="300" width="14" height="88" rx="4" fill="url(#m-gun-dark)" />
                </g>

                {/* pcb ring */}
                <g className="part p-pcb">
                  <rect x="228" y="416" width="144" height="70" rx="8" fill="#222019" stroke="#3d3835" strokeWidth="2" />
                  <line x1="240" y1="430" x2="360" y2="430" stroke="#c47a45" strokeWidth="2" opacity="0.8" />
                  <line x1="240" y1="470" x2="360" y2="470" stroke="#c47a45" strokeWidth="2" opacity="0.8" />
                  <line x1="252" y1="430" x2="252" y2="470" stroke="#c47a45" strokeWidth="2" opacity="0.5" />
                  <rect x="266" y="438" width="36" height="26" rx="3" fill="#141312" stroke="#4a4643" />
                  <rect x="312" y="442" width="40" height="20" rx="3" fill="#141312" stroke="#4a4643" />
                </g>

                {/* magnet core */}
                <g className="part p-core">
                  <rect x="252" y="506" width="96" height="80" fill="url(#m-gun)" />
                  <ellipse cx="300" cy="506" rx="48" ry="12" fill="#5f5a55" />
                  <rect x="268" y="516" width="12" height="60" fill="#8a8783" opacity="0.35" />
                  <rect x="252" y="540" width="96" height="12" fill="url(#m-copper)" />
                </g>

                {/* vented housing */}
                <g className="part p-grille">
                  <rect x="222" y="606" width="156" height="90" rx="10" fill="url(#m-gun-dark)" />
                  {[628, 646, 664, 682].map((y) => (
                    <line key={y} x1="242" y1={y} x2="358" y2={y} stroke="#121111" strokeWidth="6" strokeLinecap="round" />
                  ))}
                  <line x1="230" y1="690" x2="370" y2="690" stroke="url(#m-copper)" strokeWidth="3" opacity="0.8" />
                </g>

                {/* mounting flange */}
                <g className="part p-base">
                  <rect x="198" y="716" width="204" height="56" rx="8" fill="url(#m-gun)" />
                  <line x1="206" y1="722" x2="394" y2="722" stroke="url(#m-copper)" strokeWidth="3" />
                  {[222, 274, 326, 378].map((cx) => (
                    <circle key={cx} cx={cx} cy="748" r="6" fill="#141312" stroke="#4a4643" strokeWidth="2" />
                  ))}
                </g>

                {/* outer shell panels — detach first */}
                <g className="part p-shell-l">
                  <path d="M 208,182 C 192,320 192,480 212,618 L 262,618 C 248,480 248,320 260,182 Z" fill="url(#m-gun-dark)" stroke="#3d3835" />
                  <path d="M 208,182 C 192,320 192,480 212,618" fill="none" stroke="#e8a06a" strokeWidth="3" />
                  {[280, 400, 520].map((y) => (
                    <line key={y} x1="202" y1={y} x2="256" y2={y} stroke="#171616" strokeWidth="4" />
                  ))}
                </g>
                <g className="part p-shell-r">
                  <path d="M 392,182 C 408,320 408,480 388,618 L 338,618 C 352,480 352,320 340,182 Z" fill="url(#m-gun-dark)" stroke="#3d3835" />
                  <path d="M 392,182 C 408,320 408,480 388,618" fill="none" stroke="#e8a06a" strokeWidth="3" />
                  {[280, 400, 520].map((y) => (
                    <line key={y} x1="344" y1={y} x2="398" y2={y} stroke="#171616" strokeWidth="4" />
                  ))}
                </g>
              </g>
            </g>

            {/* leader-line annotations (wireframe phase) */}
            <g id="leaders">
              {LEADERS.map((l) => (
                <path key={l.text} className="leader" d={`M ${l.ax},${l.ay} L ${l.tx},${l.ty}`} fill="none" stroke="#57534e" strokeWidth="1.5" />
              ))}
            </g>
            <g className="anno-labels" opacity="0">
              {LEADERS.map((l) => (
                <g key={l.text}>
                  <circle cx={l.ax} cy={l.ay} r="4.5" fill={l.color} />
                  <text
                    x={l.right ? 564 : 36}
                    y={(l.right ? l.ty : l.ty) + 5}
                    textAnchor={l.right ? "end" : "start"}
                    fill="#3f3b37"
                    fontSize="15"
                    letterSpacing="3"
                    fontFamily="var(--font-mono), monospace"
                  >
                    {l.text}
                  </text>
                </g>
              ))}
            </g>
          </svg>

          <div ref={hintRef} className="m-hint absolute bottom-10 z-20 flex flex-col items-center gap-3 text-muted">
            <span className="font-mono text-[11px] uppercase tracking-[0.35em]">scroll to disassemble</span>
            <span className="chev-bounce block h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
