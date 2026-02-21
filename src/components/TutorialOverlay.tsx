"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

interface Props { onDismiss: () => void; }

const STEPS = [
    { icon: "⌨️", title: "MOVE", desc: "WASD or Arrow Keys to walk around the room" },
    { icon: "🖱️", title: "INTERACT", desc: "Press [E] or Click on a glowing zone to interact" },
    { icon: "🔍", title: "TRANSLATE", desc: "Hover the Magnifying Glass over foreign text to translate it" },
    { icon: "🎒", title: "COLLECT", desc: "Walk over glowing items to pick them up automatically" },
    { icon: "🔓", title: "SOLVE", desc: "Open the puzzle modal via SOLVE PUZZLE in the sidebar" },
];

export default function TutorialOverlay({ onDismiss }: Props) {
    const [step, setStep] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const isLast = step === STEPS.length - 1;
    const current = STEPS[step];

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss();
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50000,
            background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Press Start 2P', monospace",
        }}>
            <div style={{
                background: "#16161a",
                border: "4px solid #ffd60a",
                boxShadow: "8px 8px 0 #b8970a",
                padding: "36px 40px",
                maxWidth: 480, width: "90%",
                textAlign: "center",
            }}>
                {/* Title */}
                <p style={{ fontSize: 7, color: "#888", letterSpacing: 2, marginBottom: 20 }}>
                    HOW TO PLAY — ({step + 1}/{STEPS.length})
                </p>

                {/* Step icon */}
                <div style={{ fontSize: 64, marginBottom: 16, animation: "float-pixel 2s ease-in-out infinite" }}>
                    {current.icon}
                </div>

                {/* Step title */}
                <p style={{ fontSize: 14, color: "#ffd60a", letterSpacing: 2, marginBottom: 12 }}>
                    {current.title}
                </p>

                {/* Step description */}
                <p style={{ fontSize: 8, color: "#c8c8c8", lineHeight: 2.2, letterSpacing: 1, marginBottom: 32 }}>
                    {current.desc}
                </p>

                {/* Progress dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
                    {STEPS.map((_, i) => (
                        <div key={i} style={{
                            width: 10, height: 10,
                            background: i === step ? "#ffd60a" : "#333",
                            border: "2px solid #555",
                            boxShadow: i === step ? "0 0 6px #ffd60a" : "none",
                            cursor: "pointer",
                        }} onClick={() => setStep(i)} />
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    {step > 0 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="pixel-btn"
                            style={{ fontSize: 7, padding: "10px 16px" }}
                        >
                            ← BACK
                        </button>
                    )}
                    {!isLast ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="pixel-btn pixel-btn-yellow"
                            style={{ fontSize: 7, padding: "10px 20px" }}
                        >
                            NEXT →
                        </button>
                    ) : (
                        <button
                            onClick={handleDismiss}
                            className="pixel-btn pixel-btn-green"
                            style={{ fontSize: 8, padding: "12px 24px" }}
                        >
                            ▶ START GAME!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
