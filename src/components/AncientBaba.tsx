"use client";

import { useState, useEffect } from "react";

interface Props {
    lines: string[];
    onComplete: () => void;
    showOverlay?: boolean;
}

export default function AncientBaba({ lines, onComplete, showOverlay = true }: Props) {
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [done, setDone] = useState(false);

    const currentLine = lines[lineIndex] || "";
    const displayedText = currentLine.slice(0, charIndex);

    useEffect(() => {
        if (done) return;

        if (charIndex < currentLine.length) {
            const t = setTimeout(() => {
                setCharIndex(c => c + 1);
            }, 30); // text speed
            return () => clearTimeout(t);
        } else {
            setDone(true);
        }
    }, [charIndex, currentLine, done]);

    const handleNext = () => {
        if (!done) {
            // Skip typing animation
            setCharIndex(currentLine.length);
            setDone(true);
        } else {
            if (lineIndex < lines.length - 1) {
                // Next line
                setLineIndex(l => l + 1);
                setCharIndex(0);
                setDone(false);
            } else {
                // Finished
                onComplete();
            }
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 60000,
            background: "transparent", pointerEvents: "none",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "24px",
        }}>
            {/* Overlay to block clicks behind it */}
            <div
                style={{
                    position: "absolute", inset: 0,
                    background: showOverlay ? "rgba(0,0,0,0.5)" : "transparent",
                    pointerEvents: "auto"
                }}
                onClick={handleNext}
            />

            {/* Container for Bust + Dialogue Box */}
            <div style={{
                position: "relative", zIndex: 1, pointerEvents: "auto",
                width: "95%", maxWidth: 1200, margin: "0 auto",
                display: "flex", alignItems: "flex-end", gap: "24px",
                paddingBottom: "16px",
            }}>

                {/* Character Bust (Left) */}
                <div style={{
                    position: "relative",
                    width: "320px", height: "420px", // Scaled up massively
                    flexShrink: 0,
                    animation: "float-pixel 3.5s ease-in-out infinite",
                    zIndex: 2,
                    filter: "drop-shadow(0px 12px 24px rgba(0,0,0,0.8))",
                }}>
                    <img
                        src="/assets/AncientBaba.svg"
                        alt="Ancient Baba"
                        style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
                    />
                    {/* Nameplate */}
                    <div style={{
                        position: "absolute", bottom: "-16px", left: "16px", right: "16px", // Larger offset
                        background: "#1e2229", border: "6px solid #3c4046",
                        padding: "12px 0", textAlign: "center",
                        boxShadow: "0 6px 0 #15181d",
                    }}>
                        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 16, color: "#fff", margin: 0, textShadow: "2px 2px 0 #000" }}>
                            ANCIENT BABA
                        </p>
                    </div>
                </div>

                {/* Dialogue Box (Right) */}
                <div
                    onClick={handleNext}
                    style={{
                        flex: 1, minHeight: "220px", // Much taller box
                        background: "#2d3540",
                        border: "8px solid #d4c29c",
                        outline: "6px solid #15181d", // Outer dark outline
                        borderRadius: "2px",
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.6), 0 16px 30px rgba(0,0,0,0.8)",
                        padding: "32px 48px",
                        position: "relative",
                        cursor: "pointer",
                        display: "flex", flexDirection: "column",
                        transform: "translateY(-32px)", // Lift up to align with taller bust
                    }}
                >
                    {/* Corner Ornaments */}
                    <div style={{ position: "absolute", top: -4, left: -4, width: 20, height: 20, background: "#8b7e65" }} />
                    <div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, background: "#8b7e65" }} />
                    <div style={{ position: "absolute", bottom: -4, left: -4, width: 20, height: 20, background: "#8b7e65" }} />
                    <div style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, background: "#8b7e65" }} />

                    <p style={{
                        fontFamily: "'Press Start 2P', monospace",
                        color: "#f8f9fa",
                        fontSize: 22, // Huge, readable font
                        lineHeight: 2.2,
                        textShadow: "3px 3px 0 #111",
                        margin: 0,
                    }}>
                        {displayedText}
                        {!done && <span style={{ animation: "blink 0.5s step-end infinite", marginLeft: 8 }}>█</span>}
                    </p>

                    {/* Blinking indicator when text is done */}
                    {done && (
                        <div style={{
                            position: "absolute", bottom: 24, right: 32,
                            animation: "bounce 1s infinite",
                        }}>
                            <span style={{ fontSize: 24, color: "#ffd60a", filter: "drop-shadow(3px 3px 0 #000)" }}>
                                ▼
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
