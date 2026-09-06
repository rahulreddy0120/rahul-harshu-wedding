"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuestEntry {
  name: string;
  sangeeth: boolean;
  engagement: boolean;
  mehendi: boolean;
  haldi: boolean;
  wedding: boolean;
}

interface FormData {
  primaryName: string;
  email: string;
  phone: string;
  guests: GuestEntry[];
  dietary: string;
  songRequest: string;
  message: string;
}

const defaultGuest = (): GuestEntry => ({
  name: "",
  sangeeth: true,
  engagement: true,
  mehendi: true,
  haldi: true,
  wedding: true,
});

const events = [
  { key: "sangeeth" as const, label: "Sangeeth", emoji: "✨", color: "#D4AF37" },
  { key: "engagement" as const, label: "Engagement", emoji: "💍", color: "#E879F9" },
  { key: "mehendi" as const, label: "Mehendi", emoji: "🤚", color: "#2D9148" },
  { key: "haldi" as const, label: "Haldi", emoji: "☀️", color: "#E65100" },
  { key: "wedding" as const, label: "Wedding", emoji: "🪷", color: "#C9A84C" },
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function RSVPSection() {
  const [form, setForm] = useState<FormData>({
    primaryName: "",
    email: "",
    phone: "",
    guests: [defaultGuest()],
    dietary: "",
    songRequest: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const updateGuest = (index: number, field: keyof GuestEntry, value: string | boolean) => {
    setForm((prev) => {
      const guests = [...prev.guests];
      guests[index] = { ...guests[index], [field]: value };
      return { ...prev, guests };
    });
  };

  const addGuest = () => {
    if (form.guests.length < 8) {
      setForm((prev) => ({ ...prev, guests: [...prev.guests, defaultGuest()] }));
    }
  };

  const removeGuest = (index: number) => {
    if (form.guests.length > 1) {
      setForm((prev) => ({
        ...prev,
        guests: prev.guests.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("submitting");

    try {
      const res = await fetch("https://5e21pxysa4.execute-api.us-east-1.amazonaws.com/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitState("success");
      } else {
        console.error("RSVP error:", data);
        setSubmitState("error");
      }
    } catch (err) {
      console.error("RSVP fetch error:", err);
      setSubmitState("error");
    }
  };

  const inputStyle = {
    background: "rgba(201,168,76,0.05)",
    border: "1px solid rgba(201,168,76,0.25)",
    color: "#FAF6EE",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    color: "#C9A84C",
    fontFamily: "'Lato', sans-serif",
    fontWeight: 300,
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    display: "block",
    marginBottom: "0.5rem",
  } as React.CSSProperties;

  return (
    <section
      id="rsvp"
      className="py-28 px-6 relative"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0F0800 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #C9A84C 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p
            className="tracking-[0.3em] text-xs mb-4"
            style={{ color: "#C9A84C", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
          >
            WE HOPE TO SEE YOU THERE
          </p>
          <h2
            className="gold-text"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "0.08em",
            }}
          >
            RSVP
          </h2>
          <div className="section-divider mt-6 mb-6" />
          <p
            className="italic text-lg"
            style={{ color: "#E8D5A3", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
          >
            Please RSVP by October 1, 2026
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-8 gold-border"
              style={{ background: "rgba(201,168,76,0.05)" }}
            >
              <div className="text-5xl mb-6">🎊</div>
              <h3
                className="gold-text mb-4"
                style={{ fontFamily: "'Cinzel', serif", fontSize: "1.8rem", fontWeight: 400 }}
              >
                We Can&apos;t Wait to See You!
              </h3>
              <p
                className="italic text-lg"
                style={{ color: "#E8D5A3", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your RSVP has been received. We&apos;ll send a confirmation to your email soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Primary contact */}
              <div
                className="p-6"
                style={{ border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.03)" }}
              >
                <p
                  className="text-xs tracking-[0.25em] mb-6"
                  style={{ color: "#C9A84C", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  YOUR CONTACT DETAILS
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>PRIMARY NAME *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ravi & Family"
                      value={form.primaryName}
                      onChange={(e) => setForm((p) => ({ ...p, primaryName: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL *</label>
                    <input
                      required
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>PHONE (OPTIONAL)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Guest entries */}
              <div
                className="p-6"
                style={{ border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.03)" }}
              >
                <p
                  className="text-xs tracking-[0.25em] mb-6"
                  style={{ color: "#C9A84C", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  ATTENDING GUESTS
                </p>

                <div className="space-y-6">
                  {form.guests.map((guest, i) => (
                    <div
                      key={i}
                      className="p-4 relative"
                      style={{ border: "1px solid rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.02)" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-xs tracking-[0.15em]"
                          style={{ color: "#C9A84C", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                        >
                          GUEST {i + 1}
                        </span>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => removeGuest(i)}
                            className="text-xs"
                            style={{ color: "rgba(201,168,76,0.5)", fontFamily: "'Lato', sans-serif" }}
                          >
                            REMOVE
                          </button>
                        )}
                      </div>

                      <input
                        required
                        type="text"
                        placeholder={i === 0 ? "Your name" : "Guest name"}
                        value={guest.name}
                        onChange={(e) => updateGuest(i, "name", e.target.value)}
                        style={{ ...inputStyle, marginBottom: "1rem" }}
                      />

                      {/* Event checkboxes */}
                      <p
                        className="text-xs tracking-[0.15em] mb-3"
                        style={{ color: "#C9A84C66", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        ATTENDING EVENTS
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {events.map((ev) => (
                          <label
                            key={ev.key}
                            className="flex items-center gap-2 cursor-pointer p-2"
                            style={{
                              border: `1px solid ${guest[ev.key] ? ev.color + "66" : "rgba(201,168,76,0.1)"}`,
                              background: guest[ev.key] ? ev.color + "15" : "transparent",
                              transition: "all 0.2s",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={guest[ev.key]}
                              onChange={(e) => updateGuest(i, ev.key, e.target.checked)}
                              className="sr-only"
                            />
                            <span
                              className="w-4 h-4 flex items-center justify-center text-xs"
                              style={{
                                border: `1px solid ${ev.color}`,
                                background: guest[ev.key] ? ev.color : "transparent",
                                color: "#fff",
                                flexShrink: 0,
                              }}
                            >
                              {guest[ev.key] ? "✓" : ""}
                            </span>
                            <span
                              className="text-xs"
                              style={{
                                color: guest[ev.key] ? ev.color : "rgba(201,168,76,0.4)",
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: 300,
                              }}
                            >
                              {ev.emoji} {ev.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {form.guests.length < 8 && (
                  <button
                    type="button"
                    onClick={addGuest}
                    className="mt-4 text-xs tracking-[0.15em] px-4 py-2 transition-all duration-300"
                    style={{
                      border: "1px solid rgba(201,168,76,0.3)",
                      color: "#C9A84C",
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 300,
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    + ADD ANOTHER GUEST
                  </button>
                )}
              </div>

              {/* Additional info */}
              <div
                className="p-6"
                style={{ border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.03)" }}
              >
                <p
                  className="text-xs tracking-[0.25em] mb-6"
                  style={{ color: "#C9A84C", fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  A FEW MORE THINGS
                </p>
                <div className="space-y-4">
                  <div>
                    <label style={labelStyle}>DIETARY REQUIREMENTS</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Vegan, Nut allergy, Jain food..."
                      value={form.dietary}
                      onChange={(e) => setForm((p) => ({ ...p, dietary: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>🎵 SONG REQUEST FOR SANGEETH</label>
                    <input
                      type="text"
                      placeholder="What should we play for you?"
                      value={form.songRequest}
                      onChange={(e) => setForm((p) => ({ ...p, songRequest: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>💌 MESSAGE FOR THE COUPLE (OPTIONAL)</label>
                    <textarea
                      rows={4}
                      placeholder="Share a wish, memory, or message..."
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <motion.button
                  type="submit"
                  disabled={submitState === "submitting"}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-12 py-4 text-sm tracking-[0.25em] transition-all duration-300"
                  style={{
                    background: submitState === "submitting" ? "rgba(201,168,76,0.3)" : "#C9A84C",
                    color: "#0A0A0A",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 400,
                    border: "none",
                    cursor: submitState === "submitting" ? "wait" : "pointer",
                  }}
                >
                  {submitState === "submitting" ? "SENDING..." : "SEND RSVP ♾"}
                </motion.button>
                {submitState === "error" && (
                  <p className="mt-4 text-sm" style={{ color: "#E57373", fontFamily: "'Cormorant Garamond', serif" }}>
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
