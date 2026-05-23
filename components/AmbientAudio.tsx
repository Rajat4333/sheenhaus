"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Bottom-right ambient audio toggle. 90-second loop, off by default.
 * Preference persisted to localStorage.
 *
 * Audio file: /public/audio/sheenhaus-mood.mp3 (90s loop).
 * If the file is missing, the toggle silently no-ops on click (no error).
 */
export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Resume the prior preference, but only if the file is reachable
    const a = new Audio("/audio/sheenhaus-mood.mp3");
    a.loop = true;
    a.volume = 0.25;
    a.preload = "metadata";

    const onCanPlay = () => setAvailable(true);
    const onError   = () => setAvailable(false);

    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("error", onError);
    audioRef.current = a;

    // Autoplay policies: only resume if the user previously opted in
    if (localStorage.getItem("sheenhaus-mood") === "on") {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }

    return () => {
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("error", onError);
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
      localStorage.setItem("sheenhaus-mood", "off");
    } else {
      a.play()
        .then(() => {
          setPlaying(true);
          localStorage.setItem("sheenhaus-mood", "on");
        })
        .catch(() => {
          // Audio missing or blocked — fail silently
        });
    }
  };

  if (!available) return null;

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute studio ambience" : "Play studio ambience"}
      className="fixed bottom-6 left-6 z-30 group inline-flex items-center gap-3 px-3 py-2 rounded-full transition-colors duration-500"
      style={{
        background: "rgba(26, 22, 18, 0.04)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(138, 106, 53, 0.18)",
      }}
    >
      <span className="relative inline-flex items-center justify-center w-3 h-3">
        {/* Three bars — animate when playing */}
        <span
          className={`absolute w-[2px] bg-accent rounded-full transition-all duration-500 ${
            playing ? "h-3 animate-pulse-slow" : "h-1.5"
          }`}
          style={{ left: "2px" }}
        />
        <span
          className={`absolute w-[2px] bg-accent rounded-full transition-all duration-500 ${
            playing ? "h-2 animate-pulse-slow" : "h-2.5"
          }`}
          style={{ left: "6px", animationDelay: "0.4s" }}
        />
        <span
          className={`absolute w-[2px] bg-accent rounded-full transition-all duration-500 ${
            playing ? "h-2.5 animate-pulse-slow" : "h-1.5"
          }`}
          style={{ left: "10px", animationDelay: "0.8s" }}
        />
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-mid whitespace-nowrap">
        {playing ? "Mood · On" : "Mood · Off"}
      </span>
    </button>
  );
}
