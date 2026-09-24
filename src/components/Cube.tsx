"use client";

import { useEffect, useRef } from "react";
import { createDrawable, createTimeline, onScroll } from "animejs";

/* ============================================================
 * CUBE — exploded axonometric sketch of a 3x3 twisty cube.
 * Big isometric 3D line-art: 26 cubelets + core mechanism,
 * generated geometry, scroll-scrubbed radial explosion,
 * dark ink -> paper blueprint with elbow callouts -> rebuild.
 * ============================================================ */

const S = 112;                    // cubelet size, px
const CX = 500, CY = 440;         // cube center in viewBox
const DIST = 175;                 // explode travel, px
const C30 = Math.cos(Math.PI / 6);

const VX: [number, number] = [C30 * S, 0.5 * S];    // +x axis (right-down)
const VZ: [number, number] = [-C30 * S, 0.5 * S];   // +z axis (left-down)
const VY: [number, number] = [0, -S];               // +y axis (up)
const VD: [number, number] = [0, S];                // down

const add = (a: number[], b: number[]): [number, number] => [a[0] + b[0], a[1] + b[1]];
const mul = (a: number[], s: number): [number, number] => [a[0] * s, a[1] * s];

/** screen position of grid point (x,y,z), cube centered on (CX,CY) */
function P(x: number, y: number, z: number): [number, number] {
  return [
    CX + (x - 1) * VX[0] + (z - 1) * VZ[0] + (y - 1) * VY[0],
    CY + (x - 1) * VX[1] + (z - 1) * VZ[1] + (y - 1) * VY[1],
  ];
}

function inset(pts: number[][], f: number): number[][] {
  const c: [number, number] = [
    pts.reduce((a, p) => a + p[0], 0) / pts.length,
    pts.reduce((a, p) => a + p[1], 0) / pts.length,
  ];
  return pts.map((p) => [c[0] + (p[0] - c[0]) * f, c[1] + (p[1] - c[1]) * f]);
}

const pts = (p: number[][]) => p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");

/** explode translation for cubelet (x,y,z) */
function explodeVec(x: number, y: number, z: number): [number, number] {
  const dx = x - 1, dy = y - 1, dz = z - 1;
  const vx = dx * VX[0] + dz * VZ[0];
  const vy = dx * VX[1] + dz * VZ[1] + dy * VY[1];
  const len = Math.hypot(vx, vy) || 1;
  return [(vx / len) * DIST, (vy / len) * DIST];
}

function cubeletCenter(x: number, y: number, z: number): [number, number] {
  const o = P(x, y, z);
  return add(add(add(o, mul(VX, 0.5)), mul(VZ, 0.5)), mul(VY, 0.5));
}

const STICKER: Record<string, string> = { top: "#e9e6df", left: "#35c26e", right: "#ff5252" };

function Cubelet({ x, y, z }: { x: number; y: number; z: number }) {
  const O = P(x, y + 1, z);
  const oVx = add(O, VX), oVz = add(O, VZ), oVxVz = add(oVx, VZ);
  const top = [O, oVx, oVxVz, oVz];
  const left = [oVz, oVxVz, add(oVxVz, VD), add(oVz, VD)];
  const right = [oVx, oVxVz, add(oVxVz, VD), add(oVx, VD)];
  const [ex, ey] = explodeVec(x, y, z);
  const layer = Math.abs(x - 1) + Math.abs(y - 1) + Math.abs(z - 1);

  return (
    <g className="cubelet" data-k={`${x}${y}${z}`} data-ex={ex.toFixed(1)} data-ey={ey.toFixed(1)} data-layer={layer}
      stroke="currentColor" fill="none">
      {/* faint face fills for 3D read */}
      <polygon points={pts(top)} fill="currentColor" fillOpacity={0.05} stroke="none" />
      <polygon points={pts(left)} fill="currentColor" fillOpacity={0.02} stroke="none" />
      <polygon points={pts(right)} fill="currentColor" fillOpacity={0.07} stroke="none" />
      {/* edges */}
      <polygon points={pts(top)} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={pts(left)} strokeWidth={2} strokeLinejoin="round" />
      <polygon points={pts(right)} strokeWidth={2} strokeLinejoin="round" />
      {/* inner bevel lines */}
      <polygon points={pts(inset(top, 0.86))} strokeWidth={0.9} opacity={0.55} />
      <polygon points={pts(inset(left, 0.86))} strokeWidth={0.9} opacity={0.55} />
      <polygon points={pts(inset(right, 0.86))} strokeWidth={0.9} opacity={0.55} />
      {/* stickers on outer faces */}
      {y === 2 && <polygon points={pts(inset(top, 0.62))} fill={STICKER.top} stroke="currentColor" strokeWidth={1.4} />}
      {z === 2 && <polygon points={pts(inset(left, 0.62))} fill={STICKER.left} stroke="currentColor" strokeWidth={1.4} />}
      {x === 2 && <polygon points={pts(inset(right, 0.62))} fill={STICKER.right} stroke="currentColor" strokeWidth={1.4} />}
    </g>
  );
}

/** core mechanism revealed at full explosion */
function Core() {
  const c: [number, number] = [CX, CY];
  const dirs = [VX, mul(VX, -1), VZ, mul(VZ, -1), VY, mul(VY, -1)];
  return (
    <g className="core" opacity={0} stroke="currentColor" fill="none">
      {/* spindle axles */}
      {dirs.map((d, i) => {
        const e = add(c, mul(d, 0.52));
        return (
          <g key={i}>
            <line x1={c[0]} y1={c[1]} x2={e[0]} y2={e[1]} strokeWidth={2} />
            {/* spring zigzag */}
            <polyline
              points={Array.from({ length: 7 }, (_, k) => {
                const t = 0.18 + (k / 6) * 0.3;
                const px = c[0] + d[0] * t + (k % 2 === 0 ? 5 : -5) * (d[1] / S);
                const py = c[1] + d[1] * t + (k % 2 === 0 ? 5 : -5) * (d[0] / S);
                return `${px.toFixed(1)},${py.toFixed(1)}`;
              }).join(" ")}
              strokeWidth={1.1} opacity={0.8} />
            <circle cx={e[0]} cy={e[1]} r={5} strokeWidth={1.6} />
            <line x1={e[0] - 3} y1={e[1]} x2={e[0] + 3} y2={e[1]} strokeWidth={1.1} />
          </g>
        );
      })}
      {/* hub */}
      <circle cx={c[0]} cy={c[1]} r={10} strokeWidth={2.2} />
      <circle cx={c[0]} cy={c[1]} r={4} strokeWidth={1.2} opacity={0.7} />
    </g>
  );
}

function Axes() {
  const L = 3.4 * S;
  const lines: Array<[[number, number], [number, number]]> = [
    [[CX - VX[0] * 3.4, CY - VX[1] * 3.4], [CX + VX[0] * 3.4, CY + VX[1] * 3.4]],
    [[CX - VZ[0] * 3.4, CY - VZ[1] * 3.4], [CX + VZ[0] * 3.4, CY + VZ[1] * 3.4]],
    [[CX, CY + S * 3.4], [CX, CY - S * 3.4]],
  ];
  void L;
  return (
    <g className="axes" opacity={0} stroke="currentColor" strokeWidth={1.2}
      strokeDasharray="26 6 7 6">
      {lines.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      ))}
    </g>
  );
}

/* ---------- feature callouts with CAD elbow leaders ---------- */

type CalloutDef = {
  text: string; color: string;
  ax: number; ay: number; ty: number;
  side: "l" | "r"; tx: number; ex: number;
};

function buildCallouts(): CalloutDef[] {
  const defs: Array<{ text: string; color: string; c: [number, number] }> = [
    { text: "scroll", color: "#00ffaa", c: add(cubeletCenter(1, 2, 1), explodeVec(1, 2, 1)) },
    { text: "timeline", color: "#ff4b4b", c: [CX, CY - 30] },
    { text: "stagger", color: "#8b7bff", c: add(cubeletCenter(2, 2, 2), explodeVec(2, 2, 2)) },
    { text: "spring", color: "#b7ff54", c: add(cubeletCenter(0, 1, 2), explodeVec(0, 1, 2)) },
    { text: "svg", color: "#05dbe9", c: add(cubeletCenter(2, 1, 1), explodeVec(2, 1, 1)) },
    { text: "draggable", color: "#e962bf", c: add(cubeletCenter(1, 0, 0), explodeVec(1, 0, 0)) },
  ];
  const rows = defs.map((d) => ({
    text: d.text,
    color: d.color,
    ax: d.c[0],
    ay: d.c[1],
    ty: d.c[1],
    side: (d.c[0] < CX ? "l" : "r") as "l" | "r",
  }));
  // de-collide label rows per side (anchors keep their ay)
  (["l", "r"] as const).forEach((side) => {
    const rs = rows.filter((r) => r.side === side).sort((a, b) => a.ay - b.ay);
    rs.forEach((r, i) => {
      if (i > 0) r.ty = Math.max(r.ty, rs[i - 1].ty + 52);
    });
  });
  return rows.map((r) => ({
    ...r,
    tx: r.side === "l" ? 46 : 954,
    ex: r.ax + (r.side === "l" ? -64 : 64),
  }));
}

const CALLOUTS = buildCallouts();

function Callouts() {
  return (
    <g fontFamily="ui-monospace, monospace">
      <g id="callout-leaders">
        {CALLOUTS.map((f) => (
          <g key={f.text}>
            <path className="callout-leader"
              d={`M ${f.ax.toFixed(1)} ${f.ay.toFixed(1)} L ${f.ex.toFixed(1)} ${f.ay.toFixed(1)} L ${f.ex.toFixed(1)} ${f.ty.toFixed(1)} L ${f.tx} ${f.ty.toFixed(1)}`}
              stroke={f.color} strokeWidth={1.6} fill="none" />
            <circle cx={f.ax} cy={f.ay} r={3.6} fill={f.color} stroke="none" className="callout-dot" opacity={0} />
          </g>
        ))}
      </g>
      <g className="callout-labels" opacity={0}>
        {CALLOUTS.map((f) => {
          const left = f.side === "l";
          return (
            <g key={f.text}>
              <rect x={left ? f.tx : f.tx - 132} y={f.ty - 14} width={132} height={28}
                fill="#f4f1ea" stroke="currentColor" strokeWidth={1.1} opacity={0.95} />
              <rect x={left ? f.tx : f.tx - 132} y={f.ty - 14} width={5} height={28}
                fill={f.color} stroke="none" />
              <text x={left ? f.tx + 14 : f.tx - 118} y={f.ty + 5} fontSize={13}
                fill="#2e2b28" stroke="none" letterSpacing={1.5}>{f.text}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function PaperNotes() {
  return (
    <g className="paper-notes" opacity={0} fontFamily="ui-monospace, monospace">
      <text x={500} y={72} textAnchor="middle" fontSize={11} fill="currentColor"
        stroke="none" letterSpacing={3} opacity={0.7}>FIG. 1 — EXPLODED AXONOMETRIC</text>
      <g>
        <rect x={36} y={880} width={330} height={62} fill="#f4f1ea"
          stroke="currentColor" strokeWidth={1.4} />
        <line x1={36} y1={910} x2={366} y2={910} stroke="currentColor" strokeWidth={1} />
        <text x={48} y={902} fontSize={13} fill="currentColor" stroke="none" letterSpacing={1.5}>
          THE BOX · 3×3×3 TWISTY CUBE</text>
        <text x={48} y={930} fontSize={9.5} fill="currentColor" stroke="none"
          letterSpacing={1} opacity={0.8}>EXPLODED VIEW — SCALE 1:1 — SHEET 01/01</text>
      </g>
    </g>
  );
}

/* ---------- component ---------- */

const CUBELETS: Array<[number, number, number]> = [];
for (let x = 0; x < 3; x++)
  for (let y = 0; y < 3; y++)
    for (let z = 0; z < 3; z++)
      if (!(x === 1 && y === 1 && z === 1)) CUBELETS.push([x, y, z]);
// painter's order: back-to-front
CUBELETS.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[1] - b[1]);

export default function Cube() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const drawables = Array.from(root.querySelectorAll(".callout-leader")).map(
      (el) => createDrawable(el as SVGPathElement)
    );

    const tl = createTimeline({ autoplay: false });
    tl.add(".cube-hint", { opacity: [1, 0], duration: 500 }, 700);

    // explode, corners first (per-cubelet targets keep types simple)
    CUBELETS.forEach(([x, y, z]) => {
      const [ex, ey] = explodeVec(x, y, z);
      const layer = Math.abs(x - 1) + Math.abs(y - 1) + Math.abs(z - 1);
      tl.add(`.cubelet[data-k="${x}${y}${z}"]`,
        { x: ex, y: ey, duration: 1500, ease: "inOutSine" },
        1600 + (3 - layer) * 130);
    });
    tl.add(".core", { opacity: [0, 1], duration: 800 }, 2300);
    tl.add(".axes", { opacity: [0, 1], duration: 800 }, 1900);

    // paper phase
    tl.add(".stage-bg", { backgroundColor: ["#252423", "#f4f1ea"], duration: 900 }, 5200)
      .add("#cube-ink", { opacity: [1, 0], duration: 800 }, 5300)
      .add("#cube-paper", { opacity: [0, 1], duration: 800 }, 5300)
      .add(".paper-notes", { opacity: [0, 1], duration: 800 }, 5900)
      .add(drawables, { draw: ["0 0", "0 1"], duration: 900, ease: "linear" }, 6500)
      .add(".callout-dot", { opacity: [0, 1], duration: 300 }, 6500)
      .add(".callout-labels", { opacity: [0, 1], duration: 600 }, 6800)
      .add(".callout-labels", { opacity: [1, 0], duration: 600 }, 7800)
      .add(".callout-dot", { opacity: [1, 0], duration: 300 }, 7800)
      .add("#callout-leaders", { opacity: [1, 0], duration: 600 }, 7800)
      .add(".paper-notes", { opacity: [1, 0], duration: 700 }, 7900);

    // reassemble, reverse stagger
    CUBELETS.forEach(([x, y, z]) => {
      const layer = Math.abs(x - 1) + Math.abs(y - 1) + Math.abs(z - 1);
      tl.add(`.cubelet[data-k="${x}${y}${z}"]`,
        { x: 0, y: 0, duration: 1400, ease: "inOutSine" },
        8100 + layer * 110);
    });
    tl.add(".core", { opacity: [1, 0], duration: 600 }, 8300);
    tl.add(".axes", { opacity: [1, 0], duration: 600 }, 8300);

    // power down
    tl.add("#cube-paper", { opacity: [1, 0], duration: 900 }, 10500)
      .add("#cube-ink", { opacity: [0, 1], duration: 900 }, 10500)
      .add(".stage-bg", { backgroundColor: ["#f4f1ea", "#252423"], duration: 900 }, 10500);

    const scroll = onScroll({
      target: root.querySelector(".cube-pin")!,
      enter: "bottom-=10% top",
      leave: "top+=50% bottom",
      sync: 0.6,
    }).link(tl);

    return () => {
      scroll.revert();
      tl.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="cube" className="cube-root relative">
      <style>{`
        #cube-ink { color: #d3cfc7; }
        #cube-paper { color: #38352f; }
        .paper-notes, #callout-leaders, .callout-labels { color: #38352f; }
      `}</style>
      <div className="cube-pin h-[420vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="stage-bg absolute inset-0 bg-[#252423]" />

          <div className="absolute top-20 md:top-24 left-0 right-0 text-center px-6 pointer-events-none z-10">
            <p className="m-eyebrow mb-4">fig. 1 — exploded axonometric</p>
            <h2 className="m-head font-display font-medium text-[#f4f1ea] text-4xl md:text-6xl tracking-tight">
              Anatomy of a cube.
            </h2>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 1000 1000" className="h-[86vh] w-auto max-w-[96vw]" role="img"
              aria-label="Exploded axonometric drawing of a 3x3 twisty cube">
              <g id="cube-ink">
                <g id="cubeArt">
                  <Axes />
                  {CUBELETS.map(([x, y, z]) => (
                    <Cubelet key={`${x}${y}${z}`} x={x} y={y} z={z} />
                  ))}
                  <Core />
                </g>
              </g>
              <use id="cube-paper" href="#cubeArt" opacity={0} />
              <PaperNotes />
              <Callouts />
            </svg>
          </div>

          <p className="cube-hint absolute bottom-10 left-0 right-0 text-center m-eyebrow">
            scroll to blow it apart
          </p>
        </div>
      </div>
    </section>
  );
}
