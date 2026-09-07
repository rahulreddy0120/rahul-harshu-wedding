"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MusicPlayer — floating control for the wedding song.
 * Mobile browsers (esp. iOS Safari) only allow audio to start from a direct
 * user gesture. So we attach one-time first-interaction listeners
 * (pointerdown / touchend / click / the envelope-open event) and start
 * playback from within that gesture. A manual button remains as a fallback.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("/music/mangalyam.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audioRef.current = audio;

    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));

    const tryStart = () => {
      if (startedRef.current) return;
      audio
        .play()
        .then(() => {
          startedRef.current = true;
          removeListeners();
        })
        .catch(() => {
          /* still blocked; will retry on next interaction */
        });
    };

    const removeListeners = () => {
      window.removeEventListener("hr:play-music", tryStart);
      document.removeEventListener("pointerdown", tryStart);
      document.removeEventListener("touchend", tryStart);
      document.removeEventListener("click", tryStart);
      document.removeEventListener("keydown", tryStart);
    };

    // Envelope open dispatches this; also catch the very first interaction.
    window.addEventListener("hr:play-music", tryStart);
    document.addEventListener("pointerdown", tryStart);
    document.addEventListener("touchend", tryStart);
    document.addEventListener("click", tryStart);
    document.addEventListener("keydown", tryStart);

    return () => {
      removeListeners();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

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
