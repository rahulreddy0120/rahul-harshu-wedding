"use client";

import { useEffect } from "react";

/**
 * AutoScroll — gently scrolls the page downward at a slow, cinematic pace.
 * Starts when the guest opens the envelope (hr:play-music) OR, if the
 * envelope was already dismissed this session, shortly after load.
 * Pauses on manual scroll/touch/wheel/key and resumes after a quiet moment.
 * Stops at the bottom. Respects prefers-reduced-motion.
 */
export default function AutoScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let paused = false;
    let stopped = false;
    let started = false;
    let acc = 0; // accumulate sub-pixel movement so slow speed still scrolls
    let resumeTimer: number | undefined;

    const SPEED = 0.4; // px per frame (~24px/sec)

    const step = () => {
      if (stopped) return;
      if (!paused) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY < max - 1) {
          acc += SPEED;
          if (acc >= 1) {
            const px = Math.floor(acc);
            window.scrollBy(0, px);
            acc -= px;
          }
        }
      }
      raf = window.requestAnimationFrame(step);
    };

    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, 5000);
    };

    const start = () => {
      if (started) return;
      started = true;
      window.setTimeout(() => {
        if (!stopped) raf = window.requestAnimationFrame(step);
      }, 1500);
    };

    // Start on envelope open...
    window.addEventListener("hr:play-music", start);
    // ...or if the envelope was already seen this session, start after load.
    const seen =
      window.sessionStorage.getItem("hr_envelope_seen") === "1";
    if (seen) {
      window.setTimeout(start, 800);
    }

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
