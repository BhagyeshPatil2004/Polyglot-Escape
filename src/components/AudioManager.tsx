"use client";

import { useEffect, useState } from "react";

// ── Module-level singleton so only ONE audio plays at all times ──────────────
let _audio: HTMLAudioElement | null = null;
let _started = false;

function getAudio(src: string): HTMLAudioElement {
    if (!_audio) {
        _audio = new Audio(src);
        _audio.loop = true;
        _audio.volume = 0.35;
    }
    return _audio;
}

export function startMusic(src: string) {
    const audio = getAudio(src);
    if (_started) return;
    audio.play().then(() => { _started = true; }).catch(() => { });
}

// ── Component: renders a 🎵/🔇 mute toggle button ───────────────────────────
interface Props { src: string; autoPlay?: boolean; }

export default function AudioManager({ src, autoPlay = true }: Props) {
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        const audio = getAudio(src);
        if (autoPlay && !_started) {
            // Try immediately; if blocked, defer to first user interaction
            audio.play().then(() => { _started = true; }).catch(() => {
                const unlock = () => {
                    if (!_started) { audio.play().then(() => { _started = true; }).catch(() => { }); }
                    window.removeEventListener("click", unlock);
                    window.removeEventListener("keydown", unlock);
                };
                window.addEventListener("click", unlock);
                window.addEventListener("keydown", unlock);
            });
        }
    }, [src, autoPlay]);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const audio = getAudio(src);
        const next = !muted;
        audio.muted = next;
        // If music hasn't started yet, play it now
        if (!_started && !next) { audio.play().then(() => { _started = true; }).catch(() => { }); }
        setMuted(next);
    };

    return (
        <button
            onClick={toggle}
            title={muted ? "Unmute music" : "Mute music"}
            style={{
                background: "transparent",
                border: "2px solid #555",
                color: muted ? "#555" : "#ffd60a",
                fontSize: 14,
                padding: "4px 8px",
                cursor: "pointer",
                fontFamily: "'Press Start 2P', monospace",
                lineHeight: 1,
            }}
        >
            {muted ? "🔇" : "🎵"}
        </button>
    );
}
