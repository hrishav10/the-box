"use client";

import { useEffect, useRef } from "react";
import { animate, createDrawable, createTimeline, onScroll } from "animejs";
import { useAccent } from "@/hooks/useAccent";

const LEADERS = [
  { text: "TIMELINE", color: "#e08d57", ax: 215, ay: 225, tx: 140, ty: 150 },
  { text: "STAGGER", color: "#4d9cff", ax: 215, ay: 430, tx: 140, ty: 330 },
  { text: "SCROLL", color: "#00ffaa", ax: 232, ay: 700, tx: 140, ty: 540 },
  { text: "SPRING", color: "#b7ff54", ax: 352, ay: 330, tx: 460, ty: 210, right: true },
  { text: "SVG", color: "#05dbe9", ax: 400, ay: 620, tx: 460, ty: 390, right: true },
  { text: "DRAGGABLE", color: "#e962bf", ax: 360, ay: 896, tx: 460, ty: 590, right: true },
];

/**
 * The Camera — an original exploded-view mirrorless camera.
 * A pinned full-viewport stage scrubbed by scroll: shells detach, the lens
 * stack (front group, aperture, focus group, rear group) separates upward
 * off the mount, body internals (sensor, PCB, battery, screen) drop below,
 * the render cross-fades to wireframe, leader lines annotate the exploded
 * build, parts reassemble, and the stage powers back to dark.
 */
export default function Camera() {
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
    tl.add(".p-shell-l, .w-shell-l", { x: -130, y: -40, rotate: -10, duration: 1500 }, 600)
      .add(".p-shell-r, .w-shell-r", { x: 130, y: -40, rotate: 10, duration: 1500 }, 600)
      .add("#device-tilt", { rotate: -6, transformOrigin: "300px 500px", duration: 1600 }, 800)
      .add(".m-hint", { opacity: 0, duration: 400 }, 700)
      // 2 — axial separation, staggered: optics rise, internals drop.
      .add(".p-top, .w-top", { y: -152, duration: 1400 }, 2200)
      .add(".p-front, .w-front", { y: -247, duration: 1400 }, 2350)
      .add(".p-aperture, .w-aperture", { y: -142, duration: 1400 }, 2500)
      .add(".p-focus, .w-focus", { y: -42, duration: 1400 }, 2650)
      .add(".p-rear, .w-rear", { y: 53, duration: 1400 }, 2800)
      .add(".p-mount, .w-mount", { y: 148, duration: 1400 }, 2950)
      .add(".p-sensor, .w-sensor", { y: 240, duration: 1400 }, 3100)
      .add(".p-pcb, .w-pcb", { y: 250, duration: 1400 }, 3250)
      .add(".p-battery, .w-battery", { y: 295, duration: 1400 }, 3400)
      .add(".p-screen, .w-screen", { x: -200, y: 230, duration: 1400 }, 3550)
      .add(".p-base, .w-base", { y: 300, duration: 1400 }, 3700)
      .add(".axis", { opacity: [0, 0.55], duration: 800 }, 2400)
      // 3 — cross-fade to wireframe on cream.
      .add(".stage-bg", { backgroundColor: ["#252423", "#f6f4f2"], duration: 1200 }, 5600)
      .add("#device", { opacity: [1, 0], duration: 900 }, 5700)
      .add("#device-wire", { opacity: [0, 1], duration: 900 }, 5700)
      .add(".axis", { opacity: 0, duration: 600 }, 5800)
      .add(".m-head", { opacity: [0, 1], y: [24, 0], duration: 900 }, 6200)
      // 4 — leader lines + module labels draw in over the exploded wireframe.
      .add(drawables, { draw: ["0 0", "0 1"], duration: 900, ease: "linear" }, 6800)
      .add(".anno-labels", { opacity: [0, 1], duration: 600 }, 7100)
      // 5 — reassemble in wireframe.
      .add(".anno-labels", { opacity: [1, 0], duration: 700 }, 8100)
      .add("#leaders", { opacity: [1, 0], duration: 700 }, 8100)
      .add(".m-head", { opacity: 0, duration: 700 }, 8100)
      .add(".p-shell-l, .w-shell-l", { x: 0, y: 0, rotate: 0, duration: 1500 }, 8300)
      .add(".p-shell-r, .w-shell-r", { x: 0, y: 0, rotate: 0, duration: 1500 }, 8300)
      .add(".p-top, .w-top", { y: 0, duration: 1400 }, 8500)
      .add(".p-front, .w-front", { y: 0, duration: 1400 }, 8600)
      .add(".p-aperture, .w-aperture", { y: 0, duration: 1400 }, 8700)
      .add(".p-focus, .w-focus", { y: 0, duration: 1400 }, 8800)
      .add(".p-rear, .w-rear", { y: 0, duration: 1400 }, 8900)
      .add(".p-mount, .w-mount", { y: 0, duration: 1400 }, 9000)
      .add(".p-sensor, .w-sensor", { y: 0, duration: 1400 }, 9100)
      .add(".p-pcb, .w-pcb", { y: 0, duration: 1400 }, 9200)
      .add(".p-battery, .w-battery", { y: 0, duration: 1400 }, 9300)
      .add(".p-screen, .w-screen", { x: 0, y: 0, duration: 1400 }, 9400)
      .add(".p-base, .w-base", { y: 0, duration: 1400 }, 9500)
      .add("#device-tilt", { rotate: 0, duration: 1500 }, 8500)
      // 6 — power down: fade back to dark for the next chapter.
      .add("#device-wire", { opacity: [1, 0], duration: 800 }, 10100)
      .add(".stage-bg", { backgroundColor: ["#f6f4f2", "#252423"], duration: 900 }, 10100);

    return () => {
      tl.pause();
    };
  }, []);

  return (
    <div id="camera" ref={accentRef} className="relative z-10">
      <div ref={pin} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
          <div className="stage-bg absolute inset-0" style={{ backgroundColor: "#252423" }} />

          <div className="m-head pointer-events-none absolute left-6 top-24 z-20 opacity-0 sm:left-12 sm:top-28">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-copper">
              the camera
            </p>
            <h2 className="font-display mt-3 text-4xl leading-[0.95] text-coal sm:text-6xl">
              Anatomy of
              <br />a camera.
            </h2>
          </div>

          <svg ref={svgRef} viewBox="0 0 600 1010" className="relative z-10 h-[82svh] w-auto max-w-[94vw]" role="img" aria-label="Exploded view of a mirrorless camera">
            <defs>
              <linearGradient id="c-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3b3734" />
                <stop offset="0.5" stopColor="#232120" />
                <stop offset="1" stopColor="#141313" />
              </linearGradient>
              <linearGradient id="c-metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7b766f" />
                <stop offset="0.5" stopColor="#453f3a" />
                <stop offset="1" stopColor="#211e1c" />
              </linearGradient>
              <radialGradient id="c-glass" cx="0.38" cy="0.32" r="0.85">
                <stop offset="0" stopColor="#5f7183" />
                <stop offset="0.45" stopColor="#232c36" />
                <stop offset="1" stopColor="#0b0e12" />
              </radialGradient>
              <radialGradient id="c-coat" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#8a3b6e" stopOpacity="0.32" />
                <stop offset="0.7" stopColor="#2d6e5f" stopOpacity="0.12" />
                <stop offset="1" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="c-copper" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f2b183" />
                <stop offset="0.5" stopColor="#cf7f47" />
                <stop offset="1" stopColor="#7e401f" />
              </linearGradient>
              <linearGradient id="c-pcb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#20301f" />
                <stop offset="1" stopColor="#111a10" />
              </linearGradient>
              <linearGradient id="c-sensor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1d6a55" />
                <stop offset="0.5" stopColor="#0f3b2e" />
                <stop offset="1" stopColor="#0a2620" />
              </linearGradient>
              <linearGradient id="c-screen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2b333b" />
                <stop offset="1" stopColor="#0b0e11" />
              </linearGradient>
            </defs>

            <line className="axis" x1="300" y1="40" x2="300" y2="990" stroke="#8a8783" strokeWidth="1.5" strokeDasharray="6 8" opacity="0" />

            <g id="device-tilt">
              <g id="device">
                {/* rear LCD — hidden behind the body until it drops out */}
                <g className="part p-screen">
                  <rect x="210" y="380" width="180" height="150" rx="10" fill="url(#c-screen)" stroke="#2e2c2b" strokeWidth="2" />
                  <path d="M 232,528 L 332,382" stroke="#f6f4f2" strokeWidth="16" opacity="0.14" strokeLinecap="round" />
                  <rect x="210" y="380" width="180" height="150" rx="10" fill="none" stroke="#0a0a0a" strokeWidth="4" opacity="0.5" />
                </g>

                {/* battery */}
                <g className="part p-battery">
                  <rect x="244" y="566" width="112" height="70" rx="10" fill="#262422" stroke="#3d3835" strokeWidth="2" />
                  <rect x="244" y="592" width="112" height="14" fill="url(#c-copper)" opacity="0.85" />
                  <rect x="330" y="572" width="14" height="10" fill="#d9a441" />
                  <line x1="258" y1="618" x2="316" y2="618" stroke="#57534e" strokeWidth="3" strokeLinecap="round" />
                  <text x="287" y="634" textAnchor="middle" fill="#8a8783" fontSize="11" fontFamily="var(--font-mono), monospace" letterSpacing="2">7.2V</text>
                </g>

                {/* main PCB */}
                <g className="part p-pcb">
                  <rect x="205" y="528" width="190" height="66" rx="6" fill="url(#c-pcb)" stroke="#2e3a2e" strokeWidth="2" />
                  <line x1="220" y1="545" x2="380" y2="545" stroke="#c47a45" strokeWidth="2" opacity="0.7" />
                  <line x1="220" y1="575" x2="340" y2="575" stroke="#c47a45" strokeWidth="2" opacity="0.7" />
                  <line x1="250" y1="545" x2="250" y2="575" stroke="#c47a45" strokeWidth="2" opacity="0.4" />
                  <line x1="320" y1="545" x2="320" y2="575" stroke="#c47a45" strokeWidth="2" opacity="0.4" />
                  <rect x="238" y="540" width="44" height="30" rx="2" fill="#101010" stroke="#3d3835" />
                  <rect x="298" y="544" width="56" height="24" rx="2" fill="#101010" stroke="#3d3835" />
                  {[228, 244, 260, 276, 292, 308].map((x) => (
                    <rect key={x} x={x} y="586" width="10" height="8" fill="#d9a441" />
                  ))}
                </g>

                {/* sensor on IBIS stabilizer */}
                <g className="part p-sensor">
                  <path d="M 352,470 C 384,478 384,516 362,538" fill="none" stroke="#c47a45" strokeWidth="4" />
                  <rect x="252" y="424" width="96" height="62" rx="3" fill="url(#c-sensor)" stroke="#0f0e0d" strokeWidth="2" />
                  <line x1="258" y1="440" x2="342" y2="440" stroke="#5eead4" strokeWidth="1.5" opacity="0.35" />
                  <line x1="258" y1="455" x2="342" y2="455" stroke="#5eead4" strokeWidth="1.5" opacity="0.35" />
                  <line x1="258" y1="470" x2="342" y2="470" stroke="#5eead4" strokeWidth="1.5" opacity="0.35" />
                  <rect x="252" y="424" width="96" height="62" rx="3" fill="#ffffff" opacity="0.06" />
                  {[250, 290, 330].map((x) => (
                    <rect key={x} x={x} y="486" width="10" height="22" fill="url(#c-copper)" />
                  ))}
                  <rect x="236" y="506" width="128" height="18" rx="4" fill="#2b2927" stroke="#3d3835" />
                </g>

                {/* inner chassis / front face */}
                <g className="part p-chassis">
                  <rect x="150" y="300" width="300" height="345" rx="24" fill="url(#c-body)" stroke="#0f0e0d" strokeWidth="2" />
                  <circle cx="300" cy="472" r="88" fill="#0a0a0b" />
                  <circle cx="300" cy="472" r="88" fill="none" stroke="#2a2725" strokeWidth="3" />
                  <text x="300" y="352" textAnchor="middle" fill="#6b6660" fontSize="16" letterSpacing="6" fontFamily="var(--font-mono), monospace">THE BOX</text>
                  <circle className="glow" cx="186" cy="392" r="4" fill="#e08d57" />
                  <circle cx="176" cy="336" r="2.5" fill="#0c0b0b" />
                  <circle cx="186" cy="336" r="2.5" fill="#0c0b0b" />
                  <circle cx="196" cy="336" r="2.5" fill="#0c0b0b" />
                  <rect x="138" y="318" width="16" height="26" rx="4" fill="#1d1c1b" stroke="#3d3835" />
                  <rect x="446" y="318" width="16" height="26" rx="4" fill="#1d1c1b" stroke="#3d3835" />
                </g>

                {/* lens mount flange */}
                <g className="part p-mount">
                  <circle cx="300" cy="472" r="100" fill="none" stroke="url(#c-metal)" strokeWidth="12" />
                  <circle cx="300" cy="472" r="107" fill="none" stroke="#2e2c2b" strokeWidth="2" />
                  {[[229, 401], [371, 401], [229, 543], [371, 543]].map(([cx, cy]) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="#141312" stroke="#4a4643" strokeWidth="2" />
                  ))}
                  <circle cx="300" cy="372" r="5" fill="#ff4b4b" />
                </g>

                {/* rear lens group + mount contacts */}
                <g className="part p-rear">
                  <circle cx="300" cy="472" r="52" fill="#1d1c1b" stroke="#2b2927" strokeWidth="8" />
                  <circle cx="300" cy="472" r="38" fill="url(#c-glass)" />
                  <circle cx="300" cy="472" r="38" fill="url(#c-coat)" />
                  {[272, 282, 292, 302, 312, 322].map((x) => (
                    <rect key={x} x={x} y="516" width="6" height="12" rx="2" fill="#d9a441" />
                  ))}
                </g>

                {/* focus group + AF motor */}
                <g className="part p-focus">
                  <rect x="226" y="440" width="20" height="64" rx="4" fill="#2b2927" stroke="#3d3835" />
                  <rect x="354" y="440" width="20" height="64" rx="4" fill="#2b2927" stroke="#3d3835" />
                  {[448, 472, 496].map((cy) => (
                    <ellipse key={cy} cx="300" cy={cy} rx="66" ry="11" fill="none" stroke="url(#c-copper)" strokeWidth="8" />
                  ))}
                  <circle cx="300" cy="472" r="52" fill="#1d1c1b" />
                  <circle cx="300" cy="472" r="38" fill="url(#c-glass)" />
                  <path d="M 276,448 A 34 34 0 0 1 310,440" stroke="#ffffff" strokeWidth="5" opacity="0.5" fill="none" strokeLinecap="round" />
                </g>

                {/* aperture diaphragm */}
                <g className="part p-aperture">
                  <circle cx="300" cy="472" r="48" fill="#141312" stroke="#3d3835" strokeWidth="3" />
                  <polygon points="330,472 315,498 285,498 270,472 285,446 315,446" fill="#050505" />
                  {[
                    [330, 472, 348, 472], [315, 498, 324, 513.6], [285, 498, 276, 513.6],
                    [270, 472, 252, 472], [285, 446, 276, 430.4], [315, 446, 324, 430.4],
                  ].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a4643" strokeWidth="3" />
                  ))}
                  <path d="M 268,448 A 40 40 0 0 1 300,434" stroke="#8a8783" strokeWidth="2.5" fill="none" opacity="0.8" />
                </g>

                {/* front lens group */}
                <g className="part p-front">
                  <circle cx="300" cy="472" r="80" fill="url(#c-body)" stroke="#0f0e0d" strokeWidth="2" />
                  <circle cx="300" cy="472" r="80" fill="none" stroke="url(#c-copper)" strokeWidth="2" opacity="0.55" />
                  <circle cx="300" cy="472" r="71" fill="none" stroke="#0d0c0b" strokeWidth="15" strokeDasharray="4 6" />
                  <circle cx="300" cy="472" r="60" fill="#171616" stroke="#2e2c2b" strokeWidth="2" />
                  <circle cx="300" cy="472" r="55" fill="url(#c-glass)" />
                  <circle cx="300" cy="472" r="55" fill="url(#c-coat)" />
                  <path d="M 264,444 A 44 44 0 0 1 308,420" stroke="#ffffff" strokeWidth="7" opacity="0.5" fill="none" strokeLinecap="round" />
                  <path d="M 278,488 A 44 44 0 0 0 252,454" stroke="#ffffff" strokeWidth="4" opacity="0.28" fill="none" strokeLinecap="round" />
                  <circle cx="300" cy="472" r="34" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.18" />
                </g>

                {/* left shell: grip */}
                <g className="part p-shell-l">
                  <path d="M 150,352 C 118,352 104,384 104,436 L 104,576 C 104,618 128,640 168,640 L 196,640 L 196,352 Z" fill="url(#c-body)" stroke="#0f0e0d" strokeWidth="2" />
                  <path d="M 196,362 L 196,630" stroke="url(#c-copper)" strokeWidth="3" />
                  {[462, 502, 542].map((y) => (
                    <line key={y} x1="118" y1={y} x2="152" y2={y} stroke="#121111" strokeWidth="5" strokeLinecap="round" />
                  ))}
                  <circle cx="166" cy="394" r="14" fill="#141312" stroke="#3d3835" strokeWidth="2" />
                  <circle cx="166" cy="394" r="6" fill="#0c0b0b" />
                </g>

                {/* right shell: port cover */}
                <g className="part p-shell-r">
                  <path d="M 404,352 L 450,352 C 462,352 466,360 466,372 L 466,620 C 466,634 458,640 446,640 L 404,640 Z" fill="url(#c-body)" stroke="#0f0e0d" strokeWidth="2" />
                  <path d="M 404,362 L 404,630" stroke="url(#c-copper)" strokeWidth="3" />
                  <rect x="420" y="440" width="30" height="52" rx="4" fill="#1c1b1a" stroke="#3d3835" strokeWidth="2" />
                  <rect x="426" y="448" width="18" height="10" rx="2" fill="#0c0b0b" />
                  <rect x="426" y="464" width="18" height="14" rx="2" fill="#0c0b0b" />
                </g>

                {/* top plate: prism, hot shoe, dials, shutter */}
                <g className="part p-top">
                  <path d="M 238,308 L 238,250 L 300,214 L 362,250 L 362,308 Z" fill="url(#c-body)" stroke="#0f0e0d" strokeWidth="2" />
                  <rect x="276" y="252" width="48" height="30" rx="4" fill="#141312" stroke="#2e2c2b" />
                  <text x="300" y="272" textAnchor="middle" fill="#8a8783" fontSize="14" letterSpacing="4" fontFamily="var(--font-mono), monospace">BOX</text>
                  <rect x="272" y="198" width="56" height="18" rx="2" fill="#2b2927" stroke="#4a4643" strokeWidth="2" />
                  <rect x="282" y="203" width="36" height="6" fill="#141312" />
                  <circle cx="196" cy="296" r="26" fill="#211f1e" stroke="#3d3835" strokeWidth="2" />
                  <circle cx="196" cy="296" r="26" fill="none" stroke="#0f0e0d" strokeWidth="4" strokeDasharray="3 5" />
                  <line x1="196" y1="274" x2="196" y2="282" stroke="url(#c-copper)" strokeWidth="3" />
                  <circle cx="404" cy="298" r="19" fill="#211f1e" stroke="#3d3835" strokeWidth="2" />
                  <circle cx="404" cy="298" r="19" fill="none" stroke="#0f0e0d" strokeWidth="3" strokeDasharray="3 4" />
                  <rect x="428" y="296" width="36" height="9" rx="2" fill="#1d1c1b" />
                  <rect x="432" y="282" width="28" height="16" rx="8" fill="#8a8783" stroke="#4a4643" strokeWidth="2" />
                </g>

                {/* bottom plate */}
                <g className="part p-base">
                  <rect x="150" y="636" width="300" height="36" rx="10" fill="url(#c-body)" stroke="#0f0e0d" strokeWidth="2" />
                  <line x1="162" y1="644" x2="438" y2="644" stroke="url(#c-copper)" strokeWidth="2" opacity="0.7" />
                  <circle cx="300" cy="656" r="11" fill="#101010" stroke="#4a4643" strokeWidth="2" />
                  <circle cx="300" cy="656" r="5.5" fill="none" stroke="#6b6660" strokeWidth="2" />
                  <line x1="196" y1="648" x2="196" y2="664" stroke="#0f0e0d" strokeWidth="3" />
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
                    y={l.ty + 5}
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
