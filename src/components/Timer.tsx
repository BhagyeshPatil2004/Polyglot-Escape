"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function Timer() {
    const { startTime, phase, getElapsedSeconds } = useGameStore();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (phase !== "playing") return;
        const id = setInterval(() => setSeconds(getElapsedSeconds()), 1000);
        return () => clearInterval(id);
    }, [phase, startTime, getElapsedSeconds]);

    const fmt = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    return (
        <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 14,
            color: seconds > 300 ? "#e63946" : "#ffd60a",
            textShadow: seconds > 300 ? "2px 2px 0 #9e2730" : "2px 2px 0 #b8970a",
            letterSpacing: 2,
        }}>
            ⏱ {fmt(seconds)}
        </span>
    );
}
