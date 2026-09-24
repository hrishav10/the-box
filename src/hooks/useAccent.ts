"use client";

import { useEffect, useRef } from "react";
import { onScroll } from "animejs";

/**
 * Dispatches a `box:accent` window event with the section's accent color
 * when the section scrolls into view. The Backdrop listens and re-tints
 * the persistent dot grid — like animejs.com's background color wash.
 */
export function useAccent<T extends HTMLElement = HTMLElement>(color: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dispatch = () => {
      window.dispatchEvent(new CustomEvent<string>("box:accent", { detail: color }));
    };
    const obs = onScroll({
      target: el,
      enter: "top 65%",
      leave: "bottom 35%",
      onEnter: dispatch,
      onLeave: dispatch,
      onEnterBackward: dispatch,
      onLeaveBackward: dispatch,
    });
    return () => {
      obs.revert();
    };
  }, [color]);

  return ref;
}
