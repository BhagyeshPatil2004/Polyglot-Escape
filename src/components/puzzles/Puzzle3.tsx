"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { PUZZLES } from "@/data/rooms";

interface Props { onSolve: (msg: string) => void; }

const SYMBOLS: Record<string, { imgSrc: string; clue: string; lang: string; color: string }> = {
    moon: { imgSrc: "/assets/moon.svg", clue: "चंद्रमा — तीसरा", lang: "Hindi", color: "#118ab2" },
    sun: { imgSrc: "/assets/sun.svg", clue: "Le soleil — premier", lang: "French", color: "#ffd60a" },
    star: { imgSrc: "/assets/star.svg", clue: "estrella — segunda", lang: "Spanish", color: "#f4a261" },
};
const POS_LABELS = ["1ST", "2ND", "3RD"];

export default function Puzzle3({ onSolve }: Props) {
    const puzzle = PUZZLES[2];
    const { solvePuzzle } = useGameStore();
    const [order, setOrder] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [tab, setTab] = useState<"note" | "order">("note");

    const addSymbol = (name: string) => {
        if (order.includes(name)) setOrder(order.filter(x => x !== name));
        else if (order.length < 3) setOrder([...order, name]);
    };

    const handleOpen = () => {
        if (!puzzle?.symbolOrder) return;
        if (order.join(",") === puzzle.symbolOrder.join(",")) {
            solvePuzzle(3);
            onSolve(puzzle.solvedMessage);
        } else {
            setError("✗ WRONG ORDER! CHECK THE CLUES IN THE ROOM...");
            setOrder([]);
            setTimeout(() => setError(""), 2500);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header + Tabs */}
            <div className="pixel-box-purple" style={{
                padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <p style={{ fontSize: 11, color: "#a855f7" }}>🚪 {puzzle.title.toUpperCase()}</p>
                <div style={{ display: "flex", gap: 8 }}>
                    {(["note", "order"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pixel-btn ${tab === t ? "pixel-btn-yellow" : ""}`}
                            style={{ padding: "8px 12px", fontSize: 9, opacity: tab === t ? 1 : 0.55 }}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* NOTE tab */}
            {tab === "note" && (
                <div className="pixel-box" style={{ padding: 20, minHeight: 220 }}>
                    {/* Celestial icons row */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 14 }}>
                        {[
                            { src: "/assets/sun.svg", label: "DAWN", hint: "French", color: "#ffd60a" },
                            { src: "/assets/star.svg", label: "DUSK", hint: "Spanish", color: "#f4a261" },
                            { src: "/assets/moon.svg", label: "MIDNIGHT", hint: "Hindi", color: "#118ab2" },
                        ].map(({ src, label, hint, color }) => (
                            <div key={label} style={{
                                flex: 1, textAlign: "center", padding: "12px 6px",
                                background: "#0d0d1a", border: `2px solid ${color}33`,
                                boxShadow: `0 0 10px ${color}11`,
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                                    <img src={src} width={38} height={38}
                                        style={{
                                            imageRendering: "pixelated",
                                            filter: `drop-shadow(0 0 8px ${color}88)`
                                        }} />
                                </div>
                                <p style={{ fontSize: 7, color, letterSpacing: 1 }}>{label}</p>
                                <p style={{ fontSize: 6, color: "#555", marginTop: 4 }}>{hint} inscription</p>
                            </div>
                        ))}
                    </div>

                    {/* Story flavour */}
                    <p style={{ fontSize: 10, color: "#a855f7", lineHeight: 2, letterSpacing: 1, marginBottom: 12, textAlign: "center" }}>
                        THREE CELESTIAL GUARDIANS BLOCK YOUR PATH.
                    </p>
                    <p style={{ fontSize: 9, color: "#aaa", lineHeight: 2, textAlign: "center", marginBottom: 10 }}>
                        INSCRIPTIONS AROUND THE ROOM REVEAL THE ORDER.
                    </p>
                    <p style={{ fontSize: 9, color: "#7c4a00", letterSpacing: 1, fontWeight: "bold", textAlign: "center" }}>
                        ↩ FIND THE 3 CLUES HIDDEN AROUND THE ROOM
                    </p>
                </div>
            )}


            {/* ORDER tab */}
            {tab === "order" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Current sequence */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 9, color: "#888", letterSpacing: 1 }}>ORDER: </span>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{
                                width: 52, height: 52,
                                border: `3px solid ${order[i] ? SYMBOLS[order[i]].color : "#333"}`,
                                background: order[i] ? `${SYMBOLS[order[i]].color}22` : "#1a1a2e",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, color: "#555",
                            }}>
                                {order[i]
                                    ? <img src={SYMBOLS[order[i]].imgSrc} width={34} height={34}
                                        style={{
                                            imageRendering: "pixelated",
                                            filter: `drop-shadow(0 0 6px ${SYMBOLS[order[i]].color}99)`
                                        }} />
                                    : `${i + 1}`
                                }
                            </div>
                        ))}
                        {order.length > 0 && (
                            <button onClick={() => setOrder([])} className="pixel-btn pixel-btn-red" style={{ fontSize: 9, padding: "8px 12px" }}>
                                RESET
                            </button>
                        )}
                    </div>

                    {/* Symbol buttons */}
                    <p style={{ fontSize: 9, color: "#888", letterSpacing: 1 }}>▶ CLICK IN THE CORRECT ORDER:</p>
                    <div style={{ display: "flex", gap: 12 }}>
                        {Object.entries(SYMBOLS).map(([name, { imgSrc, clue, lang, color }]) => {
                            const pos = order.indexOf(name);
                            const isSel = pos !== -1;
                            return (
                                <button
                                    key={name}
                                    data-clue={clue}
                                    data-lang={lang}
                                    onClick={() => addSymbol(name)}
                                    style={{
                                        flex: 1, padding: "18px 10px",
                                        background: isSel ? `${color}22` : "#1a1a2e",
                                        border: `4px solid ${isSel ? color : "#333"}`,
                                        boxShadow: isSel ? `0 0 20px ${color}66, 4px 4px 0 ${color}44` : "4px 4px 0 #333",
                                        cursor: "pointer",
                                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                                        fontFamily: "'Press Start 2P', monospace",
                                        transform: isSel ? "translate(2px,2px)" : "none",
                                        transition: "transform 0.05s",
                                    }}
                                >
                                    <img src={imgSrc} width={44} height={44}
                                        style={{
                                            imageRendering: "pixelated",
                                            filter: `drop-shadow(0 0 ${isSel ? 14 : 6}px ${color}${isSel ? "cc" : "66"})`
                                        }} />
                                    <span style={{ fontSize: 8, color, letterSpacing: 1 }}>{name.toUpperCase()}</span>
                                    <span style={{ fontSize: 7, color: "#06d6a0", animation: "blink 1.5s infinite" }}>HOVER</span>
                                    {isSel && <span style={{ fontSize: 11, color, fontWeight: "bold" }}>{POS_LABELS[pos]}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Open button */}
                    <button
                        onClick={handleOpen}
                        className={`pixel-btn ${order.length === 3 ? "pixel-btn-purple" : "pixel-btn-disabled"}`}
                        disabled={order.length !== 3}
                        style={{ width: "100%", padding: 18, fontSize: 12 }}
                    >
                        🚪 OPEN DOOR ({order.length}/3)
                    </button>

                    {error && <p style={{ fontSize: 9, color: "#e63946", letterSpacing: 1 }}>{error}</p>}
                </div>
            )}
        </div>
    );
}
