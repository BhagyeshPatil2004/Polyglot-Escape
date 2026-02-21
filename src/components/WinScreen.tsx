"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { BlinkingStarField, ShootingStars } from "@/app/page";
import DialogueBox from "./DialogueBox";
import AncientBaba from "./AncientBaba";
import LetterRain from "./LetterRain";

const PARTICLES = [
    { left: "4%", size: 3, color: "#ffd60a", delay: "0s", dur: "8s", },
    { left: "13%", size: 4, color: "#a855f7", delay: "1.5s", dur: "10s", },
    { left: "22%", size: 3, color: "#06d6a0", delay: "0.7s", dur: "7s", },
    { left: "31%", size: 4, color: "#ffd60a", delay: "2.2s", dur: "11s", },
    { left: "42%", size: 3, color: "#f4a261", delay: "0.4s", dur: "9s", },
    { left: "53%", size: 4, color: "#a855f7", delay: "1.1s", dur: "7.5s", },
    { left: "62%", size: 3, color: "#06d6a0", delay: "3s", dur: "9.5s", },
    { left: "73%", size: 4, color: "#ffd60a", delay: "0.3s", dur: "8.5s", },
    { left: "82%", size: 3, color: "#c77dff", delay: "1.8s", dur: "6.5s", },
    { left: "91%", size: 4, color: "#06d6a0", delay: "2.6s", dur: "10.5s", },
];

function ParticleBg() {
    return (
        <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
            {PARTICLES.map((p, i) => (
                <div key={i} style={{
                    position: "absolute", left: p.left, bottom: "0",
                    width: p.size, height: p.size, borderRadius: "50%",
                    background: p.color,
                    boxShadow: `0 0 ${p.size * 3}px ${p.color}88`,
                    animation: `particle-rise-${(i % 3) + 1} ${p.dur} ${p.delay} ease-in infinite`,
                }} />
            ))}
            {/* Slow ambient orbs */}
            <div style={{
                position: "absolute", top: "10%", left: "15%",
                width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle, #ffd60a0a 0%, transparent 70%)",
                animation: "float-pixel 6s ease-in-out infinite",
            }} />
            <div style={{
                position: "absolute", top: "60%", right: "10%",
                width: 160, height: 160, borderRadius: "50%",
                background: "radial-gradient(circle, #a855f70a 0%, transparent 70%)",
                animation: "float-pixel 8s ease-in-out infinite reverse",
            }} />
            <div style={{
                position: "absolute", top: "40%", left: "60%",
                width: 140, height: 140, borderRadius: "50%",
                background: "radial-gradient(circle, #06d6a00a 0%, transparent 70%)",
                animation: "float-pixel 7s ease-in-out 1s infinite",
            }} />
        </div>
    );
}

export default function WinScreen() {
    const { playerName, startTime, inventory, seenLanguages, translationCount } = useGameStore();
    const [showDialogue, setShowDialogue] = useState(true);
    const [showStats, setShowStats] = useState(false);

    const seconds = Math.floor((Date.now() - (startTime ?? Date.now())) / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    const timeStr = `${mm}:${ss}`;

    const rating =
        seconds < 120 ? { label: "S RANK · SPEEDRUNNER!", color: "#ffd60a", stars: "★★★★★" } :
            seconds < 180 ? { label: "A RANK · LINGUIST!", color: "#06d6a0", stars: "★★★★☆" } :
                seconds < 300 ? { label: "B RANK · EXPLORER!", color: "#118ab2", stars: "★★★☆☆" } :
                    { label: "C RANK · ESCAPED!", color: "#f4a261", stars: "★★☆☆☆" };

    const handleShare = () => {
        const text = `🕵️‍♂️ I escaped the Polyglot Room in ${timeStr}!\n\n${rating.label} ${rating.stars}\n🌍 Decoded ${translationCount} words\n🎒 Items found: ${inventory.length}/2\n\nBuilt with @lingodev for the Hackathon!\n\nCheck it out: https://github.com/BhagyeshPatil2004/polyglot-escape`;

        // Copy to clipboard
        navigator.clipboard.writeText(text).catch(() => { });

        // Open Twitter/X Share intent
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, "_blank");
    };

    const ancientBabaMessages = [
        `Congratulations, ${playerName || "Traveler"}!`,
        "You have proven yourself a true polyglot.",
        "The Archive recognizes your mastery of languages.",
        "You are free to leave...",
        "But remember: knowledge is the greatest treasure.",
        "May your journey continue with wisdom!",
    ];

    return (
        <main style={{
            minHeight: "100vh", maxHeight: "100vh",
            background: "linear-gradient(160deg, #1e0e00 0%, #100820 50%, #080c12 100%)", // Earthy to dark night sky
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            fontFamily: "'Press Start 2P', monospace",
            padding: "16px",
            overflow: "hidden", // Prevent scroll
            position: "relative",
        }}>
            {/* Dark vignette overlay */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
                background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
            }} />
            {/* Letter rain background */}
            <LetterRain />

            <ParticleBg />
            <BlinkingStarField />
            <ShootingStars />

            {/* Vignette */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2,
                background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
            }} />

            {/* AncientBaba Dialogue */}
            {showDialogue && (
                <AncientBaba
                    lines={ancientBabaMessages}
                    onComplete={() => {
                        setShowDialogue(false);
                        setShowStats(true);
                    }}
                    showOverlay={false}
                />
            )}

            <div style={{
                position: "relative",
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: 700, // Widened from 480
                opacity: showStats ? 1 : 0,
                transform: showStats ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)", // Pop in animation
                transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Bouncy transition
                pointerEvents: showStats ? "auto" : "none",
            }}>

                {/* Title — massive emphasis row */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                    <h1 style={{
                        fontSize: 36, color: "#ffd60a", textShadow: "4px 4px 0 #7a6000, 0 0 30px #ffd60a",
                        marginBottom: 10, textAlign: "center", letterSpacing: 4
                    }}>YOU ESCAPED!</h1>
                    <p style={{ color: "#06d6a0", fontSize: 12, letterSpacing: 4, textShadow: "0 0 20px #06d6a0" }}>
                        CONGRATULATIONS, {playerName.toUpperCase()}!
                    </p>
                </div>

                {/* Stats — Chunky RPG Wood */}
                <div style={{
                    width: "100%", padding: "20px 24px", marginBottom: 16,
                    background: "linear-gradient(145deg, #1e0e00 0%, #100820 60%, #001a0d 100%)",
                    border: "3px solid #8b5a2b",
                    boxShadow: "0 0 30px #000000bb, 4px 4px 0 #2d1500, inset 0 0 30px rgba(0,0,0,0.5)",
                    position: "relative",
                }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                        {[
                            { label: "TIME", value: timeStr, color: "#ffd60a" },
                            { label: "PUZZLES", value: "3/3", color: "#06d6a0" },
                            { label: "WORDS", value: String(translationCount), color: "#118ab2" },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{
                                textAlign: "center", padding: "12px 0",
                                background: "rgba(0,0,0,0.4)",
                                border: `2px solid ${color}66`,
                                boxShadow: "2px 2px 0 rgba(0,0,0,0.3)"
                            }}>
                                <p style={{ fontSize: 8, color: "#a89f91", marginBottom: 10, letterSpacing: 2 }}>{label}</p>
                                <p style={{ fontSize: 22, color, textShadow: `2px 2px 0 #000, 0 0 10px ${color}55` }}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {inventory.length > 0 && (
                        <div style={{
                            marginBottom: 16, padding: "12px", background: "rgba(0,0,0,0.3)",
                            border: "2px dashed #8b5a2b", textAlign: "center"
                        }}>
                            <p style={{ fontSize: 8, color: "#a89f91", marginBottom: 8, letterSpacing: 2 }}>SECRET LOOT FOUND:</p>
                            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
                                {inventory.includes("map") && (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                        <img src="/assets/Map.svg" width={40} height={40}
                                            style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))" }} />
                                        <span style={{ fontSize: 8, color: "#c77dff", textShadow: "1px 1px 0 #000" }}>TORN MAP</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div style={{ borderTop: "2px solid #8b5a2b", paddingTop: 16, textAlign: "center" }}>
                        <p style={{
                            fontSize: 18, letterSpacing: 4, color: rating.color,
                            textShadow: "2px 2px 0 #000", marginBottom: 8
                        }}>
                            {rating.label}
                        </p>
                        <p style={{ fontSize: 20, color: rating.color, letterSpacing: 8, opacity: 0.9, textShadow: "2px 2px 0 #000" }}>
                            {rating.stars}
                        </p>
                    </div>
                </div>

                {/* Languages */}
                <div style={{
                    width: "100%", padding: "16px 24px", marginBottom: 20,
                    background: "rgba(5,10,0,0.92)", border: "3px solid #06d6a033",
                    boxShadow: "0 0 24px #06d6a022, 6px 6px 0 #001a10",
                    textAlign: "center",
                }}>
                    <p style={{
                        fontSize: 14, color: "#06d6a0", marginBottom: 12, letterSpacing: 3,
                        textShadow: "0 0 12px #06d6a0"
                    }}>🌍 LANGUAGES DECODED</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                        {([
                            { lang: "Japanese", flag: "🇯🇵", abbr: "JP" },
                            { lang: "Arabic", flag: "🇸🇦", abbr: "SA" },
                            { lang: "German", flag: "🇩🇪", abbr: "DE" },
                            { lang: "Korean", flag: "🇰🇷", abbr: "KR" },
                            { lang: "Russian", flag: "🇷🇺", abbr: "RU" },
                            { lang: "French", flag: "🇫🇷", abbr: "FR" },
                            { lang: "Hindi", flag: "🇮🇳", abbr: "IN" },
                            { lang: "Spanish", flag: "🇪🇸", abbr: "ES" },
                        ]).map(({ lang, flag, abbr }) => {
                            const unlocked = seenLanguages.includes(lang);
                            return (
                                <div key={lang} title={lang} style={{ textAlign: "center", opacity: unlocked ? 1 : 0.15 }}>
                                    <div style={{ fontSize: 28, filter: unlocked ? "drop-shadow(0 0 10px #06d6a0)" : "none", marginBottom: 4 }}>
                                        {flag}
                                    </div>
                                    <p style={{ fontSize: 10, color: unlocked ? "#06d6a0" : "#555" }}>{abbr}</p>
                                </div>
                            );
                        })}
                    </div>
                    <p style={{ fontSize: 10, color: "#888", letterSpacing: 2 }}>{seenLanguages.length} / 8 UNLOCKED</p>
                    <p style={{ fontSize: 8, color: "#06d6a0", marginTop: 8, opacity: 0.7, letterSpacing: 1 }}>TRANSLATED BY LINGO.DEV ⚡</p>
                </div >

                {/* Primary Action Buttons */}
                <div style={{ display: "flex", gap: 24, width: "100%", justifyContent: "center" }}>
                    <button
                        onClick={handleShare}
                        className="pixel-btn pixel-btn-blue"
                        style={{ fontSize: 14, padding: "20px 40px", letterSpacing: 2, boxShadow: "0 0 30px #118ab288, 6px 6px 0 #053b4d" }}
                    >
                        📤 SHARE RESULT
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="pixel-btn pixel-btn-green"
                        style={{ fontSize: 14, padding: "20px 40px", letterSpacing: 2, boxShadow: "0 0 30px #06d6a088, 6px 6px 0 #002211" }}
                    >
                        ↩ PLAY AGAIN
                    </button>
                </div>
            </div>
        </main>
    );
}
