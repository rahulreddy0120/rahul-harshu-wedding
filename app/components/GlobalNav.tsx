"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Events", href: "#events" },
  { label: "Venue", href: "#venue" },
  { label: "Dress Code", href: "#dresscode" },
  { label: "Gallery", href: "#gallery" },
  { label: "RSVP", href: "#rsvp" },
];

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {/* autoplay blocked */});
    }
    setMusicOn(!musicOn);
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      {/* Background music (provide your own audio file in /public) */}
      <audio ref={audioRef} loop>
        <source src="/music/wedding-theme.mp3" type="audio/mpeg" />
      </audio>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
        style={{
          background: scrolled
            ? "rgba(10, 10, 10, 0.92)"
            : "rgba(10, 10, 10, 0.3)",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            className="flex items-center gap-2 no-underline"
            style={{ textDecoration: "none" }}
          >
            <span
              className="gold-text"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
              }}
            >
              R ♾ H
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-xs tracking-[0.15em] transition-all duration-200 no-underline"
                style={{
                  color: "rgba(201,168,76,0.6)",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 300,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#C9A84C"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(201,168,76,0.6)"; }}
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Music toggle */}
            <button
              onClick={toggleMusic}
              className="w-8 h-8 flex items-center justify-center transition-all duration-200"
              style={{
                border: "1px solid rgba(201,168,76,0.3)",
                color: musicOn ? "#C9A84C" : "rgba(201,168,76,0.4)",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
              aria-label={musicOn ? "Mute music" : "Play music"}
              title={musicOn ? "Mute music" : "Play music"}
            >
              {musicOn ? "♫" : "♩"}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                className="block w-5 h-px"
                style={{ background: "#C9A84C" }}
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1 }}
                className="block w-5 h-px"
                style={{ background: "#C9A84C" }}
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                className="block w-5 h-px"
                style={{ background: "#C9A84C" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "rgba(5, 5, 5, 0.98)" }}
          >
            {/* Close area */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
              <div
                className="mb-4"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.5rem",
                  letterSpacing: "0.15em",
                }}
              >
                <span className="gold-text">R ♾ H</span>
              </div>

              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-lg tracking-[0.2em] no-underline"
                  style={{
                    color: "rgba(201,168,76,0.7)",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 300,
                    textDecoration: "none",
                  }}
                >
                  {link.label.toUpperCase()}
                </motion.a>
              ))}

              <div className="section-divider mt-4" />

              <p
                className="italic"
                style={{ color: "rgba(201,168,76,0.3)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Two hearts, one forever — and Noah. 🐶
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
