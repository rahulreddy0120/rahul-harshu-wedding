"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  dress: string;
  details: string[];
  bg: string;
  accent: string;
  accentLight: string;
  textColor: string;
}

const events: Event[] = [
  {
    id: "sangeeth",
    emoji: "✨",
    name: "SANGEETH",
    subtitle: "Dance · Music · Celebration",
    date: "Thursday, November 12, 2026",
    time: "Evening",
    venue: "TBD, Texas",
    description:
      "Kick off the wedding week with the biggest party night. Family dance-offs, musical performances, and an evening that will be talked about for years. Come ready to dance.",
    dress: "Festive Indian wear · Black, navy, or champagne gold preferred",
    details: [
      "Family & friends dance performances",
      "Live music",
      "Dinner & late night snacks",
      "Open bar",
      "DJ till late",
    ],
    bg: "linear-gradient(135deg, #020014 0%, #0D0D2B 40%, #1A1040 100%)",
    accent: "#D4AF37",
    accentLight: "rgba(212,175,55,0.12)",
    textColor: "#E8E0F8",
  },
  {
    id: "engagement",
    emoji: "💍",
    name: "ENGAGEMENT",
    subtitle: "Rings · Blessings · Celebration",
    date: "Friday, November 13, 2026",
    time: "Noon",
    venue: "TBD, Texas",
    description:
      "The official exchange of rings as both families come together to bless Rahul and Harshu. A beautiful afternoon ceremony followed by lunch and celebration.",
    dress: "Semi-formal Indian wear · Bright, festive colours welcome",
    details: [
      "Ring exchange ceremony",
      "Family blessings",
      "Lunch served",
      "Photos with family",
    ],
    bg: "linear-gradient(135deg, #1A0A2E 0%, #2D1B69 40%, #4C1D95 100%)",
    accent: "#E879F9",
    accentLight: "rgba(232,121,249,0.12)",
    textColor: "#F5E6FF",
  },
  {
    id: "mehendi",
    emoji: "🤚",
    name: "MEHENDI",
    subtitle: "Music · Henna · Cocktails",
    date: "Friday, November 13, 2026",
    time: "Night",
    venue: "TBD, Texas",
    description:
      "An evening of intricate henna, joyful music, and cocktails as the celebrations continue. Watch the artists weave beautiful stories on hands that are about to hold each other forever.",
    dress: "Semi-formal · Parrot Green, Pink, or Yellow encouraged",
    details: [
      "Henna artists available all evening",
      "Live dhol & DJ music",
      "Cocktails & mocktails",
      "Snacks & dinner served",
    ],
    bg: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)",
    accent: "#E91E8C",
    accentLight: "rgba(233,30,140,0.15)",
    textColor: "#D8F3DC",
  },
  {
    id: "haldi",
    emoji: "☀️",
    name: "HALDI",
    subtitle: "Turmeric · Traditions · Sunshine",
    date: "Saturday, November 14, 2026",
    time: "Noon",
    venue: "TBD, Texas",
    description:
      "A vibrant, turmeric-filled afternoon ritual blessing the couple with prosperity and love. Get ready to get colorful — this is the most joyful celebration you'll ever be part of.",
    dress: "Casual · Bright yellows & oranges preferred (wear clothes you don't mind getting yellow!)",
    details: [
      "Traditional Haldi ceremony",
      "Family blessings ritual",
      "Lunch served",
      "Outdoor celebration (weather permitting)",
    ],
    bg: "linear-gradient(135deg, #7C2D12 0%, #C2410C 40%, #EA580C 100%)",
    accent: "#FDD835",
    accentLight: "rgba(253,216,53,0.15)",
    textColor: "#FFF3E0",
  },
  {
    id: "wedding",
    emoji: "🪷",
    name: "WEDDING",
    subtitle: "The Moment We Say 'I Do'",
    date: "Sunday, November 15, 2026",
    time: "Noon",
    venue: "TBD, Texas",
    description:
      "The main event. In the presence of our families and God, Rahul and Harshu exchange vows and begin their forever. A traditional Telugu ceremony followed by a reception.",
    dress: "Formal Indian or Western attire · Ivory, gold, pastels welcome",
    details: [
      "Traditional Telugu wedding ceremony",
      "Baraat procession",
      "Reception lunch & desserts",
      "Family celebrations",
    ],
    bg: "linear-gradient(135deg, #1A0A00 0%, #2C1810 40%, #3D2314 100%)",
    accent: "#C9A84C",
    accentLight: "rgba(201,168,76,0.12)",
    textColor: "#FAF6EE",
  },
];

export default function EventsSection() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  return (
    <section
      id="events"
      className="py-28 px-6 relative"
      style={{ background: "#0A0A0A" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p
          className="tracking-[0.3em] text-xs mb-4"
          style={{ color: "#C9A84C", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
        >
          5 CELEBRATIONS · 2 FAMILIES · 1 FOREVER
        </p>
        <h2
          className="gold-text"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            letterSpacing: "0.1em",
          }}
        >
          The Wedding Festival
        </h2>
        <div className="section-divider mt-6 mb-6" />
        <p
          className="italic text-lg"
          style={{ color: "#E8D5A3", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
        >
          Click any event to see the full details
        </p>
      </motion.div>

      {/* Event Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
            className="relative cursor-pointer overflow-hidden"
            style={{
              background: event.bg,
              border: `1px solid ${event.accent}33`,
              boxShadow: `0 4px 30px ${event.accent}22`,
              minHeight: "300px",
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${event.accentLight}, transparent 70%)` }}
            />

            {/* Corner accents */}
            <span className="absolute top-3 left-3 w-3 h-3 border-t border-l" style={{ borderColor: event.accent }} />
            <span className="absolute top-3 right-3 w-3 h-3 border-t border-r" style={{ borderColor: event.accent }} />
            <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l" style={{ borderColor: event.accent }} />
            <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r" style={{ borderColor: event.accent }} />

            <div className="p-8 flex flex-col h-full">
              <span className="text-4xl mb-4">{event.emoji}</span>
              <h3
                className="mb-2"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.15em",
                  color: event.accent,
                  fontWeight: 500,
                }}
              >
                {event.name}
              </h3>
              <p
                className="italic mb-6"
                style={{
                  color: event.textColor,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.95rem",
                  opacity: 0.8,
                }}
              >
                {event.subtitle}
              </p>
              <div className="mt-auto">
                <p
                  className="text-xs tracking-wider mb-1"
                  style={{ color: event.accent, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  {event.date}
                </p>
                <p
                  className="text-xs"
                  style={{ color: event.textColor, fontFamily: "'Lato', sans-serif", fontWeight: 300, opacity: 0.7 }}
                >
                  {event.time}
                </p>
              </div>

              <div
                className="mt-4 text-xs text-center py-2 tracking-[0.15em]"
                style={{
                  border: `1px solid ${event.accent}55`,
                  color: event.accent,
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 300,
                }}
              >
                {activeEvent === event.id ? "CLOSE ↑" : "VIEW DETAILS ↓"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded event detail panel */}
      <AnimatePresence>
        {activeEvent && (() => {
          const ev = events.find((e) => e.id === activeEvent)!;
          return (
            <motion.div
              key={activeEvent}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl mx-auto mt-4 overflow-hidden"
              style={{
                background: ev.bg,
                border: `1px solid ${ev.accent}44`,
              }}
            >
              <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8">
                <div>
                  <span
                    className="text-xs tracking-[0.25em] mb-3 block"
                    style={{ color: ev.accent, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                  >
                    {ev.date} · {ev.time}
                  </span>
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "1.8rem",
                      color: ev.accent,
                      fontWeight: 400,
                    }}
                  >
                    {ev.emoji} {ev.name}
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{
                      color: ev.textColor,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.1rem",
                    }}
                  >
                    {ev.description}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: ev.accent, fontFamily: "'Lato', sans-serif" }}
                  >
                    📍 {ev.venue}
                  </p>
                </div>
                <div>
                  <div className="mb-6">
                    <p
                      className="text-xs tracking-[0.2em] mb-3"
                      style={{ color: ev.accent, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                    >
                      WHAT TO EXPECT
                    </p>
                    <ul className="space-y-2">
                      {ev.details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: ev.textColor, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                        >
                          <span style={{ color: ev.accent }}>◆</span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="p-4"
                    style={{
                      background: ev.accentLight,
                      border: `1px solid ${ev.accent}33`,
                    }}
                  >
                    <p
                      className="text-xs tracking-[0.2em] mb-2"
                      style={{ color: ev.accent, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                    >
                      👗 DRESS CODE
                    </p>
                    <p
                      className="text-sm italic"
                      style={{ color: ev.textColor, fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {ev.dress}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
