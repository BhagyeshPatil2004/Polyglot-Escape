"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { PUZZLES } from "@/data/rooms";

interface Props { onSolve: (msg: string) => void; }

export default function Puzzle1({ onSolve }: Props) {
    const puzzle = PUZZLES[0];
    const { solvePuzzle } = useGameStore();
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const [tab, setTab] = useState<"scroll" | "speak">("scroll");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim().toUpperCase() === puzzle.answer) {
            solvePuzzle(1);
            onSolve(puzzle.solvedMessage);
        } else {
            setShake(true);
            setError("✗ WRONG WORD! Translate the three scrolls to find the hidden letters.");
            setTimeout(() => { setError(""); setShake(false); }, 3500);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header + Tab Buttons */}
            <div className="pixel-box-yellow" style={{
                padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
                <p style={{ fontSize: 11, color: "#ffd60a" }}>🔒 {puzzle.title.toUpperCase()}</p>
                <div style={{ display: "flex", gap: 8 }}>
                    {(["scroll", "speak"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pixel-btn ${tab === t ? "pixel-btn-yellow" : ""}`}
                            style={{ padding: "8px 12px", fontSize: 9, opacity: tab === t ? 1 : 0.55 }}
                        >
                            {t === "scroll" ? "CLUES" : "SPEAK"}
                        </button>
                    ))}
                </div>
            </div>

            {/* CLUES tab — story context only, clues are in the room */}
            {tab === "scroll" && (
                <div className="pixel-box" style={{ padding: "16px", textAlign: "center" }}>
                    <p style={{ fontSize: 24, marginBottom: 8 }}>📖</p>

                    <p style={{ fontSize: 9, color: "#aaa", lineHeight: 1.8, letterSpacing: 1, marginBottom: 12 }}>
                        {puzzle.description}
                    </p>

                    {/* How to solve — numbered steps */}
                    <div style={{ background: "#0d1a0d", border: "2px solid #06d6a0", padding: "12px 16px", textAlign: "left", marginBottom: 10 }}>
                        <p style={{ fontSize: 8, color: "#06d6a0", letterSpacing: 1, marginBottom: 8 }}>📋 HOW TO OPEN THE GRIMOIRE:</p>
                        {[
                            "Walk up to SCROLL I in the room → translate the letter",
                            "Walk up to SCROLL II in the room → translate the letter",
                            "Walk up to SCROLL III in the room → translate the letter",
                            "Go to SPEAK tab → type the 3 letters in order (I, II, III)",
                        ].map((step, i) => (
                            <p key={i} style={{ fontSize: 7, color: "#c8ffc8", marginBottom: 6, lineHeight: 1.6 }}>
                                {i + 1}. {step}
                            </p>
                        ))}
                    </div>

                    <p style={{ fontSize: 8, color: "#7c4a00", letterSpacing: 1, fontWeight: "bold" }}>
                        ↩ EXPLORE THE ROOM TO FIND THE THREE SCROLLS
                    </p>
                </div>
            )}


            {/* SPEAK tab */}
            {tab === "speak" && (
                <div className="pixel-box" style={{ padding: 24, textAlign: "center" }}>
                    {/* Letter slots visual */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
                        {["I", "II", "III"].map((r, i) => (
                            <div key={r} style={{
                                width: 44, height: 52,
                                border: "3px solid #555",
                                background: input[i] ? "#1a2c1a" : "#111",
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: 3,
                            }}>
                                <span style={{ fontSize: 16, color: input[i] ? "#06d6a0" : "#333" }}>
                                    {input[i] ?? "?"}
                                </span>
                                <span style={{ fontSize: 4, color: "#555" }}>LTR {r}</span>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: 7, color: "#f4a261", marginBottom: 16, letterSpacing: 1, lineHeight: 1.8 }}>
                        💡 {puzzle.answerHint.toUpperCase()}
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: 12, animation: shake ? "shake 0.3s ease" : "none" }}
                    >
                        <input
                            className="pixel-input"
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase())}
                            placeholder="_ _ _"
                            maxLength={3}
                            style={{ textAlign: "center", fontSize: 22, width: "100%", letterSpacing: 10 }}
                        />
                        <button type="submit" className="pixel-btn pixel-btn-yellow" disabled={input.length !== 3} style={{ width: "100%", padding: 12 }}>
                            SPEAK WORD ►
                        </button>
                    </form>
                    {error && <p style={{ fontSize: 7, color: "#e63946", marginTop: 12, letterSpacing: 1 }}>{error}</p>}
                </div>
            )}
        </div>
    );
}
