"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { PUZZLES } from "@/data/rooms";

interface Props { onSolve: (msg: string) => void; }

// Each bottle has:
//   - color: visual tint
//   - label: FOREIGN language name displayed on the bottle
//   - lang: language for magnifying glass
//   - id: internal key the answer is checked against
const BOTTLES = [
    { id: "water", color: "#118ab2", label: "물", lang: "Korean", emoji: "💧" },
    { id: "blue crystal", color: "#7b2d8b", label: "파란 수정", lang: "Korean", emoji: "🔮" },
    { id: "acid", color: "#06d6a0", label: "Säure", lang: "German", emoji: "⚗️" },
    { id: "fire", color: "#e63946", label: "نار", lang: "Arabic", emoji: "🔥" },
    { id: "oil", color: "#f4a261", label: "масло", lang: "Russian", emoji: "🫙" },
];

/** The antidote recipe written in Russian — players must hover with magnifying glass to read it */
const RECIPE_CLUE = { text: "Смешайте масло с огнём чтобы нейтрализовать яд", lang: "Russian" };

export default function Puzzle2({ onSolve }: Props) {
    const puzzle = PUZZLES[1];
    const { solvePuzzle } = useGameStore();
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [tab, setTab] = useState<"note" | "mix">("note");

    const toggle = (id: string) =>
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
        );

    const handleMix = () => {
        if (!puzzle?.requiredItems) return;
        const sorted = [...selected].sort().join(",");
        const correct = [...puzzle.requiredItems].sort().join(",");
        if (sorted === correct) {
            solvePuzzle(2);
            onSolve(puzzle.solvedMessage);
        } else {
            setError("✗ WRONG COMBINATION! USE THE MAGNIFYING GLASS TO TRANSLATE...");
            setTimeout(() => setError(""), 2800);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Header + Tabs */}
            <div className="pixel-box-blue" style={{
                padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <p style={{ fontSize: 11, color: "#118ab2" }}>⚗ {puzzle.title.toUpperCase()}</p>
                <div style={{ display: "flex", gap: 8 }}>
                    {(["note", "mix"] as const).map(t => (
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

            {/* NOTE tab — shows the antidote recipe */}
            {tab === "note" && (
                <div className="pixel-box" style={{ padding: 20, minHeight: 220 }}>
                    <p style={{ fontSize: 32, marginBottom: 16, textAlign: "center" }}>☣️</p>
                    <p style={{ fontSize: 10, color: "#e63946", lineHeight: 2, letterSpacing: 1, marginBottom: 16, textAlign: "center" }}>
                        ⚠ PURPLE GAS DETECTED — ANTIDOTE REQUIRED!
                    </p>

                    <p style={{ fontSize: 9, color: "#7c4a00", letterSpacing: 1, fontWeight: "bold", textAlign: "center", marginTop: 20 }}>
                        🔍 TRANSLATE THE BOTTLE LABELS TO FIND THE RIGHT TWO EXPERIMENTS!
                    </p>
                </div>
            )}

            {/* MIX tab */}
            {tab === "mix" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <p style={{ fontSize: 9, color: "#888", letterSpacing: 1 }}>
                        ▶ HOVER BOTTLES WITH 🔍 TO TRANSLATE · SELECT 2 TO MIX:
                    </p>

                    {/* Bottle grid — 3 top, 2 bottom centred */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        {BOTTLES.slice(0, 3).map(({ id, color, label, lang, emoji }) => {
                            const isSel = selected.includes(id);
                            return (
                                <button
                                    key={id}
                                    onClick={() => toggle(id)}
                                    style={{
                                        background: isSel ? `${color}22` : "#1a1a2e",
                                        border: `4px solid ${isSel ? "#ffd60a" : color}`,
                                        boxShadow: isSel
                                            ? `0 0 20px ${color}88, 4px 4px 0 #b8970a`
                                            : `4px 4px 0 ${color}55`,
                                        padding: "14px 8px",
                                        cursor: "pointer",
                                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                                        fontFamily: "'Press Start 2P', monospace",
                                        transform: isSel ? "translate(2px,2px)" : "none",
                                        transition: "transform 0.05s",
                                    }}
                                >
                                    {/* Bottle image with emoji fallback */}
                                    <span style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img
                                            src="/assets/Glass-bottle.svg"
                                            alt={id}
                                            onError={e => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                                const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                if (sib) sib.style.display = "flex";
                                            }}
                                            style={{
                                                width: 44, height: 44,
                                                filter: `drop-shadow(0 0 8px ${color}) sepia(1) saturate(5) hue-rotate(${hueForColor(color)})`,
                                                imageRendering: "pixelated",
                                            }}
                                        />
                                        <span style={{ display: "none", fontSize: 32, position: "absolute" }}>{emoji}</span>
                                    </span>
                                    {/* Foreign label — magnifying glass translates this */}
                                    <span
                                        data-clue={label}
                                        data-lang={lang}
                                        style={{
                                            fontSize: lang === "Arabic" ? 18 : 12,
                                            color: isSel ? "#ffd60a" : color,
                                            textAlign: "center",
                                            fontFamily: "serif",
                                            cursor: "default",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    {isSel && <span style={{ fontSize: 9, color: "#ffd60a" }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                    {/* Bottom row — last 2 centred */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {BOTTLES.slice(3).map(({ id, color, label, lang, emoji }) => {
                            const isSel = selected.includes(id);
                            return (
                                <button
                                    key={id}
                                    onClick={() => toggle(id)}
                                    style={{
                                        background: isSel ? `${color}22` : "#1a1a2e",
                                        border: `4px solid ${isSel ? "#ffd60a" : color}`,
                                        boxShadow: isSel
                                            ? `0 0 20px ${color}88, 4px 4px 0 #b8970a`
                                            : `4px 4px 0 ${color}55`,
                                        padding: "14px 8px",
                                        cursor: "pointer",
                                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                                        fontFamily: "'Press Start 2P', monospace",
                                        transform: isSel ? "translate(2px,2px)" : "none",
                                        transition: "transform 0.05s",
                                    }}
                                >
                                    <span style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img
                                            src="/assets/Glass-bottle.svg"
                                            alt={id}
                                            onError={e => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                                const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                                                if (sib) sib.style.display = "flex";
                                            }}
                                            style={{
                                                width: 44, height: 44,
                                                filter: `drop-shadow(0 0 8px ${color}) sepia(1) saturate(5) hue-rotate(${hueForColor(color)})`,
                                                imageRendering: "pixelated",
                                            }}
                                        />
                                        <span style={{ display: "none", fontSize: 32, position: "absolute" }}>{emoji}</span>
                                    </span>
                                    <span
                                        data-clue={label}
                                        data-lang={lang}
                                        style={{
                                            fontSize: lang === "Arabic" ? 18 : 12,
                                            color: isSel ? "#ffd60a" : color,
                                            textAlign: "center",
                                            fontFamily: "serif",
                                            cursor: "default",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    {isSel && <span style={{ fontSize: 9, color: "#ffd60a" }}>✓</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={handleMix}
                            className={`pixel-btn ${selected.length === 2 ? "pixel-btn-purple" : "pixel-btn-disabled"}`}
                            disabled={selected.length !== 2}
                            style={{ flex: 1, padding: 16, fontSize: 11 }}
                        >
                            ⚗ MIX ({selected.length}/2)
                        </button>
                        {selected.length > 0 && (
                            <button
                                onClick={() => setSelected([])}
                                className="pixel-btn pixel-btn-red"
                                style={{ fontSize: 9, padding: "8px 12px" }}
                            >
                                CLEAR
                            </button>
                        )}
                    </div>

                    {error && <p style={{ fontSize: 9, color: "#e63946", letterSpacing: 1 }}>{error}</p>}
                </div>
            )}
        </div>
    );
}

// Map accent color to CSS hue-rotate degrees for tinting the bottle SVG
function hueForColor(hex: string): string {
    const map: Record<string, string> = {
        "#118ab2": "180deg",  // blue (water)
        "#7b2d8b": "260deg",  // purple (blue crystal)
        "#06d6a0": "150deg",  // green (acid)
        "#e63946": "0deg",    // red (fire)
        "#f4a261": "30deg",   // orange (oil)
    };
    return map[hex] ?? "0deg";
}
