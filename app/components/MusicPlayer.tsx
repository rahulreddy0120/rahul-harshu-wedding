"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MusicPlayer — a small floating control that plays the wedding song.
 * It listens for the "hr:play-music" event (fired when the guest opens the
 * envelope, a valid user gesture) so autoplay isn't blocked, and also lets
 * guests toggle play/pause manually. Loops softly at a gentle volume.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio("/music/mangalyam.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;
    setReady(true);

    const startPlaying = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          /* blocked — user can tap the button */
        });
    };

    // Triggered by the envelope open (user gesture)
    window.addEventListener("hr:play-music", startPlaying);

    return () => {
      window.removeEventListener("hr:play-music", startPlaying);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="music-btn"
    >
      <span className={`music-icon ${playing ? "spin" : ""}`}>♪</span>
      <span className="music-label">{playing ? "Music On" : "Play Music"}</span>
    </button>
  );
}
