"use client";

import { useEffect, useState } from "react";

/**
 * EnvelopeIntro
 * A sealed wedding envelope shown on first load. Tapping it plays an
 * open animation (flap lifts, letter rises) and then reveals the site.
 * Shows once per browser session (sessionStorage).
 */
export default function EnvelopeIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Skip if already seen this session
    const seen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("hr_envelope_seen") === "1";
    if (seen) {
      setDismissed(true);
      return;
    }
    // Lock scroll while the intro is up, and start at the very top
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

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    try {
      window.sessionStorage.setItem("hr_envelope_seen", "1");
    } catch {
      /* ignore */
    }
    // After the open animation, fade the overlay away and restore scroll
    window.setTimeout(() => {
      setVisible(false);
      // Reveal the site from the very top (hero), not wherever the page was
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        setDismissed(true);
        window.scrollTo(0, 0);
      }, 700);
    }, 1900);
  }

  if (!mounted || dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`envelope-overlay ${opening ? "is-opening" : ""} ${
        visible ? "" : "is-gone"
      }`}
    >
      <div className="envelope-stage">
        <button
          type="button"
          className={`envelope ${opening ? "open" : ""}`}
          onClick={handleOpen}
          aria-label="Open your wedding invitation"
        >
          {/* The letter that rises out of the envelope */}
          <div className="letter">
            <div className="letter-inner">
              <p className="letter-eyebrow">You are invited to celebrate</p>
              <h2 className="letter-names">Harshini &amp; Rahul</h2>
              <div className="letter-rule" />
              <p className="letter-date">November 12–15, 2026 · Texas</p>
            </div>
          </div>

          {/* Envelope body */}
          <div className="env-back" />
          <div className="env-body" />
          <div className="env-left" />
          <div className="env-right" />
          <div className="env-bottom" />

          {/* Flap + wax seal */}
          <div className="env-flap">
            <div className="wax-seal">
              <span>H&nbsp;♾&nbsp;R</span>
            </div>
          </div>
        </button>

        {!opening && (
          <p className="tap-hint">Tap to open your invitation</p>
        )}
      </div>
    </div>
  );
}
