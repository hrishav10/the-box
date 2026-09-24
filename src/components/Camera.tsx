"use client";

import { useEffect, useRef } from "react";
import { createDrawable, createTimeline, onScroll } from "animejs";

/* ============================================================
 * CAMERA — exploded engineering sketch of a mirrorless camera.
 * Fine 2D line-art: every part is drawn from sub-parts (screws,
 * threads, knurling, coil windings, traces, glass elements).
 * Vertical exploded stack on a chain-thin center axis, anime.js
 * style: dark ink drawing -> paper blueprint with part tags,
 * dimensions and a title block -> reassemble -> back to dark.
 * ============================================================ */

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos(rad(deg)),
  cy + r * Math.sin(rad(deg)),
];

/* ---------- detail generators ---------- */

function Ticks({
  cx, cy, r, n, len, w = 1.5, offset = 0, opacity = 1,
}: {
  cx: number; cy: number; r: number; n: number; len: number;
  w?: number; offset?: number; opacity?: number;
}) {
  return (
    <g opacity={opacity} stroke="currentColor" strokeWidth={w}>
      {Array.from({ length: n }, (_, i) => {
        const a = offset + (i / n) * 360;
        const [x1, y1] = pt(cx, cy, r, a);
        const [x2, y2] = pt(cx, cy, r + len, a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  );
}

function Screw({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return (
    <g stroke="currentColor" fill="none">
      <circle cx={x} cy={y} r={r} strokeWidth={1.6} />
      <circle cx={x} cy={y} r={r * 0.45} strokeWidth={1} opacity={0.55} />
      <line x1={x - r + 1.4} y1={y} x2={x + r - 1.4} y2={y} strokeWidth={1.2} />
      <line x1={x} y1={y - r + 1.4} x2={x} y2={y + r - 1.4} strokeWidth={1.2} />
    </g>
  );
}

function ScrewsOnCircle({ cx, cy, r, n, sr = 5, offset = 0 }: {
  cx: number; cy: number; r: number; n: number; sr?: number; offset?: number;
}) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(cx, cy, r, offset + (i / n) * 360);
        return <Screw key={i} x={x} y={y} r={sr} />;
      })}
    </g>
  );
}

/** crosshair center mark, standard on engineering drawings */
function CenterMark({ cx, cy, r = 8 }: { cx: number; cy: number; r?: number }) {
  return (
    <g stroke="currentColor" strokeWidth={1} opacity={0.6}>
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} />
    </g>
  );
}

function Glass({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const [hx1, hy1] = pt(cx, cy, r * 0.62, 205);
  const [hx2, hy2] = pt(cx, cy, r * 0.62, 250);
  const [ex1, ey1] = pt(cx, cy, r * 0.92, 100);
  const [ex2, ey2] = pt(cx, cy, r * 0.92, 160);
  return (
    <g stroke="currentColor" fill="none">
      <circle cx={cx} cy={cy} r={r} strokeWidth={2.2} fill="currentColor" fillOpacity={0.05} />
      <circle cx={cx} cy={cy} r={r * 0.78} strokeWidth={1} opacity={0.55} />
      <circle cx={cx} cy={cy} r={r * 0.3} strokeWidth={1} opacity={0.4} />
      <path d={`M ${hx1} ${hy1} A ${r * 0.62} ${r * 0.62} 0 0 1 ${hx2} ${hy2}`} strokeWidth={2.4} opacity={0.9} strokeLinecap="round" />
      <path d={`M ${ex1} ${ey1} A ${r * 0.92} ${r * 0.92} 0 0 0 ${ex2} ${ey2}`} strokeWidth={1.2} opacity={0.5} />
      <line x1={cx - r} y1={cy} x2={cx - r * 0.78} y2={cy} strokeWidth={1} opacity={0.5} />
      <line x1={cx + r * 0.78} y1={cy} x2={cx + r} y2={cy} strokeWidth={1} opacity={0.5} />
    </g>
  );
}

/* ---------- the twelve parts (drawn at assembled positions) ---------- */

function TopPlate() {
  const cy = 400;
  return (
    <g className="part p-top" stroke="currentColor" fill="none">
      {/* prism hump */}
      <path d={`M 228 ${cy} L 242 ${cy - 58} Q 300 ${cy - 84} 358 ${cy - 58} L 372 ${cy}`} strokeWidth={2.6} />
      <path d={`M 244 ${cy} L 254 ${cy - 48} Q 300 ${cy - 68} 346 ${cy - 48} L 356 ${cy}`} strokeWidth={1} opacity={0.5} />
      {/* pentaprism lines */}
      <path d={`M 272 ${cy - 8} L 300 ${cy - 52} L 328 ${cy - 8}`} strokeWidth={1.4} />
      <line x1={272} y1={cy - 8} x2={328} y2={cy - 8} strokeWidth={1.4} />
      {/* EVF optics */}
      <circle cx={300} cy={cy - 30} r={11} strokeWidth={1.6} />
      <circle cx={300} cy={cy - 30} r={6} strokeWidth={1} opacity={0.6} />
      {/* hot shoe */}
      <rect x={270} y={cy - 86} width={60} height={13} strokeWidth={2} />
      <line x1={270} y1={cy - 79.5} x2={330} y2={cy - 79.5} strokeWidth={1} opacity={0.6} />
      <rect x={282} y={cy - 83} width={10} height={7} strokeWidth={1.2} />
      <rect x={308} y={cy - 83} width={10} height={7} strokeWidth={1.2} />
      {/* mode dials */}
      <g>
        <circle cx={212} cy={cy - 4} r={23} strokeWidth={2.2} />
        <circle cx={212} cy={cy - 4} r={23} strokeWidth={5} strokeDasharray="2.5 2.1" opacity={0.7} fill="none" />
        <circle cx={212} cy={cy - 4} r={12} strokeWidth={1.2} />
        <Ticks cx={212} cy={cy - 4} r={14.5} n={12} len={3.5} w={1.2} />
      </g>
      <g>
        <circle cx={388} cy={cy - 4} r={23} strokeWidth={2.2} />
        <circle cx={388} cy={cy - 4} r={23} strokeWidth={5} strokeDasharray="2.5 2.1" opacity={0.7} fill="none" />
        <circle cx={388} cy={cy - 4} r={12} strokeWidth={1.2} />
        <Ticks cx={388} cy={cy - 4} r={14.5} n={12} len={3.5} w={1.2} />
      </g>
      {/* shutter button */}
      <rect x={372} y={cy - 52} width={30} height={13} rx={6.5} strokeWidth={2} />
      <rect x={378} y={cy - 49} width={18} height={7} rx={3.5} strokeWidth={1} opacity={0.6} />
      {/* mic holes */}
      <g fill="currentColor" stroke="none" opacity={0.7}>
        {[-8, 0, 8].map((dx) =>
          [-4, 4].map((dy) => <circle key={`${dx}${dy}`} cx={252 + dx} cy={cy - 44 + dy} r={1.4} />)
        )}
      </g>
      <text x={300} y={cy - 60} textAnchor="middle" fontSize={9} fill="currentColor" stroke="none"
        fontFamily="ui-monospace, monospace" letterSpacing={3} opacity={0.85}>BOX</text>
      <Screw x={238} y={cy - 6} r={4.5} />
      <Screw x={362} y={cy - 6} r={4.5} />
    </g>
  );
}

function FrontBezel() {
  const cx = 300, cy = 520;
  return (
    <g className="part p-bezel" stroke="currentColor" fill="none">
      <defs>
        <path id="bezArc" d={`M ${cx} ${cy} m -52 0 a 52 52 0 1 1 104 0 a 52 52 0 1 1 -104 0`} fill="none" />
      </defs>
      <circle cx={cx} cy={cy} r={68} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={60} strokeWidth={7} strokeDasharray="3 2.2" opacity={0.75} />
      <circle cx={cx} cy={cy} r={55} strokeWidth={1} opacity={0.6} />
      <text fontSize={8.5} letterSpacing={2.5} fill="currentColor" stroke="none"
        fontFamily="ui-monospace, monospace" opacity={0.9}>
        <textPath href="#bezArc" startOffset="1%">THE BOX OPTICAL · 24–70mm 1:2.8 · ⌀77 · MADE FOR MOTION ·</textPath>
      </text>
      {/* filter thread */}
      <circle cx={cx} cy={cy} r={44} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={41.5} strokeWidth={0.8} opacity={0.6} />
      <circle cx={cx} cy={cy} r={39} strokeWidth={0.8} opacity={0.6} />
      <circle cx={cx} cy={cy} r={36} strokeWidth={2} />
      {/* index triangle */}
      <path d={`M ${cx} ${cy - 72} l -5 -8 h 10 z`} fill="currentColor" stroke="none" opacity={0.85} />
      <ScrewsOnCircle cx={cx} cy={cy} r={63} n={3} sr={4.5} offset={90} />
      <CenterMark cx={cx} cy={cy} />
    </g>
  );
}

function FrontGroup() {
  const cx = 300, cy = 560;
  return (
    <g className="part p-front" stroke="currentColor" fill="none">
      {/* cell with thread */}
      <circle cx={cx} cy={cy} r={58} strokeWidth={2.4} />
      <circle cx={cx} cy={cy} r={52} strokeWidth={0.9} opacity={0.7} />
      <circle cx={cx} cy={cy} r={49.5} strokeWidth={0.9} opacity={0.7} />
      <circle cx={cx} cy={cy} r={47} strokeWidth={0.9} opacity={0.7} />
      {/* spacer ring */}
      <circle cx={cx} cy={cy} r={43} strokeWidth={1.2} strokeDasharray="5 3" opacity={0.7} />
      {/* retaining ring with notches */}
      <circle cx={cx} cy={cy} r={39} strokeWidth={1.4} />
      <rect x={cx - 39} y={cy - 3} width={7} height={6} strokeWidth={1.2} />
      <rect x={cx + 32} y={cy - 3} width={7} height={6} strokeWidth={1.2} />
      {/* two elements */}
      <Glass cx={cx} cy={cy} r={34} />
      <circle cx={cx} cy={cy} r={20} strokeWidth={1} opacity={0.65} />
      <circle cx={cx} cy={cy} r={20} strokeWidth={4} strokeDasharray="2 2.4" opacity={0.4} fill="none" />
      <ScrewsOnCircle cx={cx} cy={cy} r={55} n={4} sr={3.6} offset={45} />
      <CenterMark cx={cx} cy={cy} />
    </g>
  );
}

function ApertureUnit() {
  const cx = 300, cy = 600;
  const blades = Array.from({ length: 9 }, (_, i) => {
    const a0 = i * 40;
    const [x1, y1] = pt(cx, cy, 50, a0);
    const [qx, qy] = pt(cx, cy, 42, a0 + 30);
    const [x2, y2] = pt(cx, cy, 15, a0 + 62);
    const [px, py] = pt(cx, cy, 50, a0);
    return { d: `M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`, px, py, key: i };
  });
  return (
    <g className="part p-aper" stroke="currentColor" fill="none">
      <circle cx={cx} cy={cy} r={58} strokeWidth={2.4} />
      {/* drive ring with gear teeth */}
      <circle cx={cx} cy={cy} r={52} strokeWidth={1.6} />
      <Ticks cx={cx} cy={cy} r={52} n={40} len={6} w={3} offset={4} />
      {/* blades */}
      <g strokeWidth={1.5}>
        {blades.map((b) => (
          <g key={b.key}>
            <path d={b.d} />
            <circle cx={b.px} cy={b.py} r={2.2} fill="currentColor" stroke="none" />
          </g>
        ))}
      </g>
      <circle cx={cx} cy={cy} r={15} strokeWidth={1.4} strokeDasharray="4 2.5" opacity={0.8} />
      {/* actuator lever */}
      <g stroke="#e08d57">
        <line x1={cx + 52} y1={cy + 10} x2={cx + 74} y2={cy + 26} strokeWidth={2.4} />
        <circle cx={cx + 74} cy={cy + 26} r={4} strokeWidth={1.8} />
        <line x1={cx + 52} y1={cy + 10} x2={cx + 58} y2={cy + 2} strokeWidth={1.4} />
      </g>
      <CenterMark cx={cx} cy={cy} />
    </g>
  );
}

function FocusGroup() {
  const cx = 300, cy = 640;
  const coils = Array.from({ length: 10 }, (_, i) => {
    const a = 195 + i * 15;
    const [x, y] = pt(cx, cy, 66, a);
    return { x, y, rot: a + 90, key: i };
  });
  return (
    <g className="part p-focus" stroke="currentColor" fill="none">
      {/* helicoid band */}
      <circle cx={cx} cy={cy} r={62} strokeWidth={2.2} />
      <circle cx={cx} cy={cy} r={55} strokeWidth={1.4} />
      <g strokeWidth={1} opacity={0.65}>
        {Array.from({ length: 36 }, (_, i) => {
          const a = i * 10;
          const [x1, y1] = pt(cx, cy, 55.5, a);
          const [x2, y2] = pt(cx, cy, 61.5, a + 7);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      {/* element cell + glass */}
      <circle cx={cx} cy={cy} r={50} strokeWidth={1.6} />
      <Glass cx={cx} cy={cy} r={42} />
      {/* AF motor coils */}
      <path d={`M ${pt(cx, cy, 74, 190).join(" ")} A 74 74 0 0 1 ${pt(cx, cy, 74, 350).join(" ")}`}
        strokeWidth={1.6} opacity={0.8} />
      <g stroke="#e08d57">
        {coils.map((c) => (
          <g key={c.key} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}>
            <rect x={-6.5} y={-9} width={13} height={18} rx={2} strokeWidth={1.5} fill="none" />
            <line x1={-6.5} y1={-3} x2={6.5} y2={-3} strokeWidth={0.9} />
            <line x1={-6.5} y1={3} x2={6.5} y2={3} strokeWidth={0.9} />
          </g>
        ))}
      </g>
      {/* position sensor + flex tail */}
      <rect x={cx + 58} y={cy + 40} width={26} height={12} strokeWidth={1.4} />
      <path d={`M ${cx + 71} ${cy + 52} q 18 4 22 22 q 3 14 -6 26`} strokeWidth={1.2} opacity={0.7} />
      <path d={`M ${cx + 77} ${cy + 52} q 18 4 22 22`} strokeWidth={0.8} opacity={0.5} />
      <CenterMark cx={cx} cy={cy} />
    </g>
  );
}

function RearGroup() {
  const cx = 300, cy = 680;
  return (
    <g className="part p-rear" stroke="currentColor" fill="none">
      {/* baffle ridges */}
      <circle cx={cx} cy={cy} r={56} strokeWidth={2.2} />
      <circle cx={cx} cy={cy} r={51} strokeWidth={1} opacity={0.7} />
      <circle cx={cx} cy={cy} r={46} strokeWidth={1} opacity={0.7} />
      {/* concave element */}
      <circle cx={cx} cy={cy} r={40} strokeWidth={2} fill="currentColor" fillOpacity={0.05} />
      <path d={`M ${pt(cx, cy, 30, 60).join(" ")} A 30 30 0 0 0 ${pt(cx, cy, 30, 120).join(" ")}`}
        strokeWidth={2.2} opacity={0.85} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={24} strokeWidth={0.9} opacity={0.55} />
      {/* contact block */}
      <g>
        <rect x={cx - 44} y={cy + 44} width={88} height={20} strokeWidth={1.6} />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={cx - 38 + i * 10} y={cy + 48} width={6} height={12}
            stroke="#d8a84e" strokeWidth={1.2} fill="#d8a84e" fillOpacity={0.25} />
        ))}
        <path d={`M ${cx - 44} ${cy + 64} h -14 M ${cx + 44} ${cy + 64} h 14`} strokeWidth={1} opacity={0.6} />
      </g>
      {/* retaining clips */}
      <path d={`M ${cx - 56} ${cy - 12} h -12 M ${cx + 56} ${cy - 12} h 12`} strokeWidth={1.6} />
      <ScrewsOnCircle cx={cx} cy={cy} r={53} n={4} sr={3.6} />
      <CenterMark cx={cx} cy={cy} />
    </g>
  );
}

function MountFlange() {
  const cx = 300, cy = 715;
  const lugs = [200, 320, 80];
  return (
    <g className="part p-mount" stroke="currentColor" fill="none">
      <circle cx={cx} cy={cy} r={64} strokeWidth={3} />
      {/* bayonet lugs */}
      <g strokeWidth={9} opacity={0.9}>
        {lugs.map((a) => {
          const [x1, y1] = pt(cx, cy, 58, a - 22);
          const [x2, y2] = pt(cx, cy, 58, a + 22);
          return <path key={a} d={`M ${x1} ${y1} A 58 58 0 0 1 ${x2} ${y2}`} />;
        })}
      </g>
      {/* felt light seal */}
      <circle cx={cx} cy={cy} r={50} strokeWidth={1.4} strokeDasharray="4 3" opacity={0.7} />
      <circle cx={cx} cy={cy} r={44} strokeWidth={2} />
      {/* red index */}
      <circle cx={cx} cy={cy - 64} r={4.5} fill="#ff5a5a" stroke="none" />
      <line x1={cx} y1={cy - 58} x2={cx} y2={cy - 50} strokeWidth={1.4} />
      <ScrewsOnCircle cx={cx} cy={cy} r={57} n={6} sr={4.2} offset={30} />
      <text x={cx + 34} y={cy + 46} fontSize={8} fill="currentColor" stroke="none"
        fontFamily="ui-monospace, monospace" opacity={0.75}>⌀54</text>
      <CenterMark cx={cx} cy={cy} />
    </g>
  );
}

function SensorUnit() {
  const cx = 300, cy = 760;
  const coils: Array<[number, number]> = [
    [cx - 72, cy - 32], [cx + 72, cy - 32], [cx - 72, cy + 32], [cx + 72, cy + 32],
  ];
  return (
    <g className="part p-sensor" stroke="currentColor" fill="none">
      {/* IBIS frame */}
      <rect x={cx - 92} y={cy - 48} width={184} height={96} rx={8} strokeWidth={2.4} />
      <rect x={cx - 84} y={cy - 40} width={168} height={80} rx={5} strokeWidth={1} opacity={0.5} />
      {/* voice-coil motors */}
      <g stroke="#e08d57">
        {coils.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 17} y={y - 12} width={34} height={24} rx={2} strokeWidth={1.6} fill="none" />
            {[-6, 0, 6].map((dy) => (
              <line key={dy} x1={x - 17} y1={y + dy} x2={x + 17} y2={y + dy} strokeWidth={0.9} />
            ))}
          </g>
        ))}
      </g>
      {/* sensor die + cover glass */}
      <rect x={cx - 46} y={cy - 32} width={92} height={64} strokeWidth={1.4} opacity={0.7} />
      <rect x={cx - 40} y={cy - 26} width={80} height={52} strokeWidth={2}
        fill="currentColor" fillOpacity={0.06} />
      <g strokeWidth={0.8} opacity={0.5}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={cx - 40 + (i + 1) * 10} y1={cy - 26} x2={cx - 40 + (i + 1) * 10} y2={cy + 26} />
        ))}
      </g>
      {/* position magnets */}
      <rect x={cx - 60} y={cy - 44} width={12} height={8} strokeWidth={1.2} />
      <rect x={cx + 48} y={cy + 36} width={12} height={8} strokeWidth={1.2} />
      {/* flex cable */}
      <path d={`M ${cx + 92} ${cy - 10} h 22 l 10 12 l -10 12 l 10 12 l -10 12`} strokeWidth={1.4} />
      <path d={`M ${cx + 92} ${cy - 4} h 18`} strokeWidth={0.8} opacity={0.6} />
      <Screw x={cx - 84} y={cy - 40} r={4} />
      <Screw x={cx + 84} y={cy - 40} r={4} />
      <Screw x={cx - 84} y={cy + 40} r={4} />
      <Screw x={cx + 84} y={cy + 40} r={4} />
    </g>
  );
}

function MainPCB() {
  const cx = 300, cy = 830;
  const traces = [
    `M ${cx - 80} ${cy - 26} h 34 l 14 -14 h 40`,
    `M ${cx - 80} ${cy - 10} h 22 l 12 12 h 52 l 10 -10`,
    `M ${cx - 80} ${cy + 8} h 48 l 10 10 h 30`,
    `M ${cx + 80} ${cy - 30} h -30 l -12 12 h -24`,
    `M ${cx + 80} ${cy - 6} h -44 l -10 -10`,
    `M ${cx + 80} ${cy + 18} h -26 l -14 14 h -38`,
    `M ${cx - 40} ${cy + 34} v -12 l 12 -12`,
    `M ${cx + 20} ${cy + 34} v -18`,
  ];
  const chips: Array<[number, number, number, number]> = [
    [cx - 62, cy - 28, 44, 26], [cx + 6, cy - 24, 34, 34], [cx - 30, cy + 2, 26, 18],
  ];
  return (
    <g className="part p-pcb" stroke="currentColor" fill="none">
      <rect x={cx - 92} y={cy - 42} width={184} height={84} rx={6} strokeWidth={2.4} />
      <rect x={cx - 86} y={cy - 36} width={172} height={72} rx={3} strokeWidth={0.8} opacity={0.5} />
      {/* traces */}
      <g strokeWidth={1.1} opacity={0.75}>
        {traces.map((d, i) => <path key={i} d={d} />)}
      </g>
      {/* vias */}
      <g fill="currentColor" stroke="none" opacity={0.7}>
        {[[cx - 46, cy - 40], [cx + 14, cy - 40], [cx - 58, cy + 2], [cx + 46, cy - 16], [cx + 54, cy + 32], [cx - 20, cy + 10]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.8} />
        ))}
      </g>
      {/* chips with pin stubs */}
      {chips.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} strokeWidth={1.8} fill="currentColor" fillOpacity={0.05} />
          <circle cx={x + 5} cy={y + 5} r={1.6} fill="currentColor" stroke="none" />
          <g strokeWidth={1}>
            {Array.from({ length: Math.floor(w / 8) }, (_, k) => (
              <line key={`t${k}`} x1={x + 6 + k * 8} y1={y} x2={x + 6 + k * 8} y2={y - 5} />
            ))}
            {Array.from({ length: Math.floor(w / 8) }, (_, k) => (
              <line key={`b${k}`} x1={x + 6 + k * 8} y1={y + h} x2={x + 6 + k * 8} y2={y + h + 5} />
            ))}
          </g>
        </g>
      ))}
      {/* shield can */}
      <rect x={cx + 44} y={cy - 2} width={40} height={30} strokeWidth={1.6} />
      <g strokeWidth={0.8} opacity={0.5}>
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={cx + 48 + i * 7} y1={cy + 2} x2={cx + 44 + i * 7} y2={cy + 24} />
        ))}
      </g>
      {/* crystal */}
      <rect x={cx - 84} y={cy + 16} width={24} height={12} rx={6} strokeWidth={1.2} />
      <text x={cx - 72} y={cy + 25} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none"
        fontFamily="ui-monospace, monospace" opacity={0.7}>24M</text>
      {/* mounting holes */}
      {[[cx - 84, cy - 34], [cx + 84, cy - 34], [cx - 84, cy + 34], [cx + 84, cy + 34]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} strokeWidth={1.4} />
      ))}
    </g>
  );
}

function Battery() {
  const cx = 300, cy = 890;
  return (
    <g className="part p-batt" stroke="currentColor" fill="none">
      <rect x={cx - 62} y={cy - 30} width={124} height={60} rx={7} strokeWidth={2.4} />
      <rect x={cx - 56} y={cy - 24} width={112} height={48} rx={4} strokeWidth={0.8} opacity={0.5} />
      {/* terminals */}
      {[-30, -10, 10, 30].map((dx, i) => (
        <g key={dx}>
          <rect x={cx + dx - 7} y={cy - 38} width={14} height={10} strokeWidth={1.4} />
          <line x1={cx + dx - 7} y1={cy - 33} x2={cx + dx + 7} y2={cy - 33} strokeWidth={0.9} opacity={0.6} />
          {i === 0 && <text x={cx + dx} y={cy - 41} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none" fontFamily="ui-monospace, monospace">+</text>}
          {i === 3 && <text x={cx + dx} y={cy - 41} textAnchor="middle" fontSize={7} fill="currentColor" stroke="none" fontFamily="ui-monospace, monospace">−</text>}
        </g>
      ))}
      {/* label */}
      <line x1={cx - 44} y1={cy - 8} x2={cx + 44} y2={cy - 8} strokeWidth={0.9} opacity={0.6} />
      <line x1={cx - 44} y1={cy - 1} x2={cx + 20} y2={cy - 1} strokeWidth={0.9} opacity={0.6} />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={9} fill="currentColor" stroke="none"
        fontFamily="ui-monospace, monospace" letterSpacing={1.5} opacity={0.9}>7.2V 2250mAh</text>
      {/* latch */}
      <rect x={cx + 62} y={cy - 10} width={10} height={20} rx={2} strokeWidth={1.4} />
      <line x1={cx + 62} y1={cy - 4} x2={cx + 72} y2={cy - 4} strokeWidth={1} opacity={0.6} />
      <line x1={cx + 62} y1={cy + 4} x2={cx + 72} y2={cy + 4} strokeWidth={1} opacity={0.6} />
    </g>
  );
}

function RearLCD() {
  const cx = 300, cy = 940;
  return (
    <g className="part p-lcd" stroke="currentColor" fill="none">
      {/* hinge barrels */}
      <circle cx={cx - 82} cy={cy - 20} r={10} strokeWidth={1.8} />
      <circle cx={cx - 82} cy={cy + 20} r={10} strokeWidth={1.8} />
      <line x1={cx - 82} y1={cy - 10} x2={cx - 82} y2={cy + 10} strokeWidth={1.4} />
      {/* glass */}
      <rect x={cx - 72} y={cy - 36} width={150} height={72} rx={5} strokeWidth={2.4} />
      <rect x={cx - 64} y={cy - 28} width={134} height={56} strokeWidth={1.2}
        fill="currentColor" fillOpacity={0.05} />
      {/* pixel grid hint */}
      <g strokeWidth={0.7} opacity={0.45}>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={cx - 64 + (i + 1) * 13.4} y1={cy - 28} x2={cx - 64 + (i + 1) * 13.4} y2={cy + 28} />
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <line key={`h${i}`} x1={cx - 64} y1={cy - 28 + (i + 1) * 14} x2={cx + 70} y2={cy - 28 + (i + 1) * 14} />
        ))}
      </g>
      {/* ribbon cable */}
      <path d={`M ${cx + 20} ${cy + 36} v 14 l 12 8 l -12 8 l 12 8 v 10`} strokeWidth={1.4} />
      <path d={`M ${cx + 28} ${cy + 36} v 12`} strokeWidth={0.8} opacity={0.6} />
      <Screw x={cx - 64} y={cy - 28} r={3.6} />
      <Screw x={cx + 62} y={cy - 28} r={3.6} />
      <Screw x={cx - 64} y={cy + 20} r={3.6} />
      <Screw x={cx + 62} y={cy + 20} r={3.6} />
    </g>
  );
}

function BasePlate() {
  const cx = 300, cy = 975;
  return (
    <g className="part p-base" stroke="currentColor" fill="none">
      <rect x={cx - 88} y={cy - 28} width={176} height={56} rx={9} strokeWidth={2.4} />
      <rect x={cx - 80} y={cy - 21} width={160} height={42} rx={6} strokeWidth={0.9} opacity={0.5} />
      {/* tripod socket */}
      <circle cx={cx} cy={cy} r={17} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={12.5} strokeWidth={0.9} opacity={0.7} />
      <circle cx={cx} cy={cy} r={9} strokeWidth={0.9} opacity={0.7} />
      <circle cx={cx} cy={cy} r={5.5} strokeWidth={1.4} />
      <Ticks cx={cx} cy={cy} r={17} n={24} len={4} w={1.1} />
      {/* strap lugs */}
      <rect x={cx - 100} y={cy - 8} width={12} height={16} rx={3} strokeWidth={1.4} />
      <rect x={cx + 88} y={cy - 8} width={12} height={16} rx={3} strokeWidth={1.4} />
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize={7.5} fill="currentColor" stroke="none"
        fontFamily="ui-monospace, monospace" letterSpacing={2} opacity={0.7}>SN 24-001337</text>
      <Screw x={cx - 66} y={cy - 14} r={4.2} />
      <Screw x={cx + 66} y={cy - 14} r={4.2} />
    </g>
  );
}

/* ---------- paper-phase notes: part tags, dimensions, title block ---------- */

const PART_TAGS: Array<{ n: string; x: number; y: number }> = [
  { n: "01", x: 192, y: 95 },
  { n: "02", x: 408, y: 220 },
  { n: "03", x: 408, y: 345 },
  { n: "04", x: 408, y: 470 },
  { n: "05", x: 192, y: 595 },
  { n: "06", x: 192, y: 720 },
  { n: "07", x: 408, y: 845 },
  { n: "08", x: 192, y: 970 },
  { n: "09", x: 408, y: 1095 },
  { n: "10", x: 192, y: 1220 },
  { n: "11", x: 192, y: 1345 },
  { n: "12", x: 408, y: 1470 },
];

const PART_NAMES: Record<string, string> = {
  "01": "TOP PLATE", "02": "FRONT BEZEL", "03": "FRONT GROUP", "04": "APERTURE UNIT",
  "05": "FOCUS GROUP", "06": "REAR GROUP", "07": "MOUNT FLANGE", "08": "SENSOR UNIT",
  "09": "MAIN PCB", "10": "BATTERY", "11": "REAR LCD", "12": "BASE PLATE",
};

function PaperNotes() {
  return (
    <g className="paper-notes" opacity={0} fontFamily="ui-monospace, monospace">
      {/* part tags */}
      {PART_TAGS.map((t) => (
        <g key={t.n}>
          <rect x={t.x - 13} y={t.y - 10} width={26} height={20} fill="#f4f1ea"
            stroke="currentColor" strokeWidth={1.2} />
          <text x={t.x} y={t.y + 3.5} textAnchor="middle" fontSize={10.5}
            fill="currentColor" stroke="none">{t.n}</text>
          <title>{PART_NAMES[t.n]}</title>
        </g>
      ))}
      {/* overall length dimension */}
      <g stroke="currentColor" strokeWidth={1} opacity={0.85} fill="none">
        <line x1={545} y1={95} x2={545} y2={1470} />
        <line x1={537} y1={103} x2={553} y2={87} />
        <line x1={537} y1={1462} x2={553} y2={1478} />
        <line x1={520} y1={95} x2={545} y2={95} opacity={0.5} />
        <line x1={520} y1={1470} x2={545} y2={1470} opacity={0.5} />
      </g>
      <text x={560} y={786} fontSize={11} fill="currentColor" stroke="none"
        transform="rotate(90 560 786)" textAnchor="middle" letterSpacing={2}>1375</text>
      {/* bezel diameter dimension */}
      <g stroke="currentColor" strokeWidth={1} opacity={0.85} fill="none">
        <line x1={232} y1={140} x2={368} y2={140} />
        <line x1={240} y1={136} x2={232} y2={144} />
        <line x1={360} y1={136} x2={368} y2={144} />
      </g>
      <text x={300} y={130} textAnchor="middle" fontSize={10.5} fill="currentColor"
        stroke="none" letterSpacing={1}>⌀136</text>
      {/* FIG label */}
      <text x={506} y={44} fontSize={10} fill="currentColor" stroke="none"
        letterSpacing={2} opacity={0.75}>FIG. 1</text>
      {/* title block */}
      <g>
        <rect x={24} y={1522} width={340} height={62} fill="#f4f1ea"
          stroke="currentColor" strokeWidth={1.4} />
        <line x1={24} y1={1552} x2={364} y2={1552} stroke="currentColor" strokeWidth={1} />
        <text x={36} y={1544} fontSize={13} fill="currentColor" stroke="none" letterSpacing={1.5}>
          THE BOX · MIRRORLESS CAMERA</text>
        <text x={36} y={1572} fontSize={9.5} fill="currentColor" stroke="none"
          letterSpacing={1} opacity={0.8}>EXPLODED ASSEMBLY — SCALE 1:1 — SHEET 01/01</text>
      </g>
    </g>
  );
}

/* ---------- feature callouts (site feature names, engineering style) ---------- */

const FEATURES = [
  { text: "SCROLL", color: "#00ffaa", ax: 232, ay: 220, tx: 96, ty: 220 },
  { text: "TIMELINE", color: "#ff4b4b", ax: 242, ay: 470, tx: 96, ty: 470 },
  { text: "SVG", color: "#05dbe9", ax: 208, ay: 1095, tx: 96, ty: 1095 },
  { text: "STAGGER", color: "#8b7bff", ax: 362, ay: 595, tx: 504, ty: 595 },
  { text: "SPRING", color: "#b7ff54", ax: 392, ay: 970, tx: 504, ty: 970 },
  { text: "DRAGGABLE", color: "#e962bf", ax: 378, ay: 1345, tx: 504, ty: 1345 },
];

function FeatureCallouts() {
  return (
    <g fontFamily="ui-monospace, monospace">
      <g id="feat-leaders">
        {FEATURES.map((f) => (
          <g key={f.text}>
            <path className="feat-leader" d={`M ${f.ax} ${f.ay} L ${f.tx} ${f.ty}`}
              stroke={f.color} strokeWidth={1.6} fill="none" />
            <circle cx={f.ax} cy={f.ay} r={3.4} fill={f.color} stroke="none" className="feat-dot" opacity={0} />
          </g>
        ))}
      </g>
      <g className="feat-labels" opacity={0}>
        {FEATURES.map((f) => {
          const left = f.tx < 300;
          return (
            <g key={f.text}>
              <rect x={left ? f.tx - 8 : f.tx - 118} y={f.ty - 13} width={126} height={26}
                fill="#f4f1ea" stroke="currentColor" strokeWidth={1.1} opacity={0.94} />
              <rect x={left ? f.tx - 8 : f.tx - 118} y={f.ty - 13} width={5} height={26}
                fill={f.color} stroke="none" />
              <text x={left ? f.tx + 8 : f.tx - 102} y={f.ty + 4.5} fontSize={12.5}
                fill="#2e2b28" stroke="none" letterSpacing={2.5}>{f.text}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

/* ---------- component ---------- */

const ORDER = ["top", "bezel", "front", "aper", "focus", "rear", "mount", "sensor", "pcb", "batt", "lcd", "base"];
const DY: Record<string, number> = {
  top: -305, bezel: -300, front: -215, aper: -130, focus: -45, rear: 40,
  mount: 130, sensor: 210, pcb: 265, batt: 330, lcd: 405, base: 495,
};

export default function Camera() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const drawables = FEATURES.map((f, i) =>
      createDrawable((root.querySelectorAll(".feat-leader") as NodeListOf<SVGPathElement>)[i])
    );

    const tl = createTimeline({ autoplay: false });
    tl.add(".cam-hint", { opacity: [1, 0], duration: 500 }, 700)
      .add(".axis-line", { opacity: [0, 1], duration: 800 }, 2000);

    ORDER.forEach((k, i) =>
      tl.add(`.p-${k}`, { y: DY[k], duration: 1600, ease: "inOutSine" }, 1800 + i * 130)
    );

    tl.add(".stage-bg", { backgroundColor: ["#252423", "#f4f1ea"], duration: 900 }, 5600)
      .add("#device-ink", { opacity: [1, 0], duration: 800 }, 5700)
      .add("#device-paper", { opacity: [0, 1], duration: 800 }, 5700)
      .add(".paper-notes", { opacity: [0, 1], duration: 800 }, 6300)
      .add(drawables, { draw: ["0 0", "0 1"], duration: 900, ease: "linear" }, 7000)
      .add(".feat-dot", { opacity: [0, 1], duration: 300 }, 7000)
      .add(".feat-labels", { opacity: [0, 1], duration: 600 }, 7300)
      .add(".feat-labels", { opacity: [1, 0], duration: 600 }, 8300)
      .add(".feat-dot", { opacity: [1, 0], duration: 300 }, 8300)
      .add("#feat-leaders", { opacity: [1, 0], duration: 600 }, 8300)
      .add(".paper-notes", { opacity: [1, 0], duration: 700 }, 8400);

    ORDER.forEach((k, i) =>
      tl.add(`.p-${k}`, { y: 0, duration: 1400, ease: "inOutSine" }, 8600 + i * 110)
    );

    tl.add("#device-paper", { opacity: [1, 0], duration: 900 }, 11300)
      .add("#device-ink", { opacity: [0, 1], duration: 900 }, 11300)
      .add(".stage-bg", { backgroundColor: ["#f4f1ea", "#252423"], duration: 900 }, 11300)
      .add(".axis-line", { opacity: [1, 0], duration: 600 }, 11300);

    const scroll = onScroll({
      target: root.querySelector(".cam-pin")!,
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
    <section ref={rootRef} id="camera" className="cam-root relative">
      <style>{`
        #device-ink { color: #d3cfc7; }
        #device-paper { color: #38352f; }
        .paper-notes, #feat-leaders, .feat-labels { color: #38352f; }
      `}</style>
      <div className="cam-pin h-[460vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="stage-bg absolute inset-0 bg-[#252423]" />

          <div className="absolute top-20 md:top-24 left-0 right-0 text-center px-6 pointer-events-none z-10">
            <p className="m-eyebrow mb-4">fig. 1 — exploded view</p>
            <h2 className="m-head font-display font-medium text-[#f4f1ea] text-4xl md:text-6xl tracking-tight">
              Anatomy of a camera.
            </h2>
          </div>

          <div className="absolute inset-0 flex items-start justify-center pt-36 md:pt-40 pb-4">
            <svg viewBox="0 0 600 1620" className="h-full w-auto max-w-[94vw]" role="img"
              aria-label="Exploded engineering drawing of a mirrorless camera">
              {/* ink drawing (dark phase) — the live artwork */}
              <g id="device-ink">
                <g id="deviceArt">
                  <line className="axis-line" x1={300} y1={30} x2={300} y2={1530}
                    stroke="currentColor" strokeWidth={1.2} strokeDasharray="30 5 7 5" opacity={0} />
                  <TopPlate />
                  <FrontBezel />
                  <FrontGroup />
                  <ApertureUnit />
                  <FocusGroup />
                  <RearGroup />
                  <MountFlange />
                  <SensorUnit />
                  <MainPCB />
                  <Battery />
                  <RearLCD />
                  <BasePlate />
                </g>
              </g>
              {/* paper drawing (blueprint phase) — live mirror of the ink art */}
              <use id="device-paper" href="#deviceArt" opacity={0} />
              <PaperNotes />
              <FeatureCallouts />
            </svg>
          </div>

          <p className="cam-hint absolute bottom-10 left-0 right-0 text-center m-eyebrow">
            scroll to strip it down
          </p>
        </div>
      </div>
    </section>
  );
}
