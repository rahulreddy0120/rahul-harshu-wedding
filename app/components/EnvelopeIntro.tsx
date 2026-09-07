"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

/**
 * EnvelopeIntro — cartoon style
 * A bouncy sealed envelope. The guest drags Noah 🐶 up to the envelope to
 * "deliver" the invitation, which pops the seal and opens it. Tapping the
 * envelope also opens it (fallback). Shows once per browser session.
 */
export default function EnvelopeIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const noahX = useMotionValue(0);
  const noahY = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const seen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("hr_envelope_seen") === "1";
    if (seen) {
      setDismissed(true);
      return;
    }
    setVisible(true);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function triggerOpen() {
    if (opening) return;
    setDelivered(true);
    setOpening(true);
    try {
      window.sessionStorage.setItem("hr_envelope_seen", "1");
      window.dispatchEvent(new Event("hr:play-music"));
    } catch {
      /* ignore */
    }
    // Send Noah flying up into the envelope for the "delivery" beat
    animate(noahY, -170, { type: "spring", stiffness: 200, damping: 14 });
    animate(noahX, 0, { type: "spring", stiffness: 200, damping: 14 });

    window.setTimeout(() => {
      setVisible(false);
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        setDismissed(true);
        window.scrollTo(0, 0);
      }, 700);
    }, 2400);
  }

  // When Noah is dragged high enough (up toward the envelope), open.
  function handleDragEnd() {
    if (noahY.get() < -90) {
      triggerOpen();
    } else {
      // bounce back
      animate(noahX, 0, { type: "spring", stiffness: 300, damping: 18 });
      animate(noahY, 0, { type: "spring", stiffness: 300, damping: 18 });
    }
  }

  if (!mounted || dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`envelope-overlay ${opening ? "is-opening" : ""} ${
        visible ? "" : "is-gone"
      }`}
    >
      <div className="envelope-stage" ref={stageRef}>
        {/* Envelope (also tappable as a fallback) */}
        <button
          type="button"
          className={`envelope cartoon ${opening ? "open" : ""}`}
          onClick={triggerOpen}
          aria-label="Open your wedding invitation"
        >
          {/* Letter that pops out */}
          <div className="letter">
            <div className="letter-inner">
              <p className="letter-eyebrow">You are invited to celebrate</p>
              <h2 className="letter-names">Harshini &amp; Rahul</h2>
              <div className="letter-rule" />
              <p className="letter-date">November 12–15, 2026 · Texas</p>
            </div>
          </div>

          <div className="env-back" />
          <div className="env-body" />
          <div className="env-left" />
          <div className="env-right" />
          <div className="env-bottom" />

          {/* Flap + wax seal with a little p<->ribbon tag */}
          <div className="env-flap">
            <div className="wax-seal">
              <span>H&nbsp;♾&nbsp;R</span>
            </div>
            {/* cartoon "pop" burst on open */}
            <span className={`pop-burst ${delivered ? "go" : ""}`}>✦</span>
          </div>
        </button>

        {/* Draggable Noah */}
        {!opening && (
          <motion.div
            className="noah-drag"
            drag
            dragConstraints={stageRef}
            dragElastic={0.35}
            style={{ x: noahX, y: noahY }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.15, rotate: [-6, 6, -6] }}
            animate={{ y: [0, -6, 0] }}
            transition={{ y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" } }}
            aria-label="Drag Noah up to the envelope to open it"
          >
            <span className="noah-emoji">🐶</span>
            <span className="noah-tail">🐾</span>
          </motion.div>
        )}

        {!opening ? (
          <p className="tap-hint">Drag Noah up to open — or tap the envelope 🐾</p>
        ) : (
          <motion.p
            className="tap-hint delivered"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Noah delivered your invitation! 🐶💌
          </motion.p>
        )}
        <p className="audio-note">🔊 Best experienced with sound on</p>
      </div>
    </div>
  );
}
