"use client";

import { useEffect } from "react";

/**
 * AutoScroll — gently scrolls the page downward at a slow, cinematic pace
 * after the guest enters (envelope opened). Pauses immediately if the guest
 * scrolls, touches, or uses the wheel, so it never fights manual control.
 * Stops at the bottom. Respects prefers-reduced-motion.
 */
export default function AutoScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let paused = false;
    let stopped = false;
    let resumeTimer: number | undefined;

    const SPEED = 0.35; // pixels per frame (~21px/sec — slow & gentle)

    const step = () => {
      if (stopped) return;
      if (!paused) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY < max - 1) {
          window.scrollBy(0, SPEED);
        }
      }
      raf = window.requestAnimationFrame(step);
    };

    // Pause on any manual interaction, resume after a quiet moment
    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, 4000);
    };

    const start = () => {
      // small delay so the hero settles first
      window.setTimeout(() => {
        if (!stopped) raf = window.requestAnimationFrame(step);
      }, 1200);
    };

    window.addEventListener("hr:play-music", start); // fired on envelope open
    window.addEventListener("wheel", pause, { passive: true });
    window.addEventListener("touchmove", pause, { passive: true });
    window.addEventListener("keydown", pause);

    return () => {
      stopped = true;
      if (raf) window.cancelAnimationFrame(raf);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      window.removeEventListener("hr:play-music", start);
      window.removeEventListener("wheel", pause);
      window.removeEventListener("touchmove", pause);
      window.removeEventListener("keydown", pause);
    };
  }, []);

  return null;
}
