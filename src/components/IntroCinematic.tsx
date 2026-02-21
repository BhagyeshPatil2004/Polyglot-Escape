"use client";

import { useState, useEffect, useRef } from "react";

interface Props { onFinish: () => void; }

const PANELS = [
    {
        bg: "radial-gradient(ellipse at 60% 40%, #1a0030 0%, #08000f 70%)",
        accent: "#c77dff",
        glow: "#9b5de5",
        icon: "/assets/book.svg",
        title: "THE LINGUIST'S ARCHIVE",
        lines: [
            "Deep in an ancient city exists a legendary",
            "Archive — sealed for a thousand years.",
            "",
            "Its walls hold the knowledge of every",
            "language ever spoken on Earth.",
        ],
    },
    {
        bg: "radial-gradient(ellipse at 40% 60%, #001a10 0%, #000a06 70%)",
        accent: "#06d6a0",
        glow: "#06d6a0",
        icon: "/assets/lock.svg",
        title: "THE TRAP",
        lines: [
            "You were searching for a rare manuscript",
            "when the great doors sealed behind you.",
            "",
            "The Archive's guardian speaks:",
            "\"Only the polyglot may leave.\"",
        ],
    },
    {
        bg: "radial-gradient(ellipse at 50% 50%, #1a1000 0%, #080600 70%)",
        accent: "#ffd60a",
        glow: "#ffd60a",
        icon: "/assets/magnifying-glass.svg",
        title: "YOUR ONLY WEAPON",
        lines: [
            "Among the dust you find a glowing",
            "Magnifying Glass — a translator's tool.",
            "",
            "Every lock, every clue, every book",
            "speaks a different foreign tongue.",
            "",
            "Translate. Solve. ESCAPE.",
        ],
    },
];

// ── Starfield canvas ──────────────────────────────────────────────────────────
function Starfield({ color }: { color: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + 0.4,
            speed: Math.random() * 0.4 + 0.1,
            opacity: Math.random(),
            dir: Math.random() > 0.5 ? 1 : -1,
        }));

        let frame = 0;
        let raf: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.opacity += 0.008 * s.dir;
                if (s.opacity > 1) { s.opacity = 1; s.dir = -1; }
                if (s.opacity < 0.1) { s.opacity = 0.1; s.dir = 1; }
                s.y -= s.speed * 0.3;
                if (s.y < 0) s.y = canvas.height;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = color + Math.floor(s.opacity * 255).toString(16).padStart(2, "0");
                ctx.fill();
            });
            frame++;
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, [color]);

    return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

export default function IntroCinematic({ onFinish }: Props) {
    const [panel, setPanel] = useState(0);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [done, setDone] = useState(false);

    const current = PANELS[panel];
    const visibleLines = current.lines.slice(0, lineIndex + 1);
    const lastLine = visibleLines[visibleLines.length - 1] ?? "";
    const displayedLastLine = lastLine.slice(0, charIndex);

    // Typewriter effect
    useEffect(() => {
        if (done) return;
        const lines = current.lines;
        const line = lines[lineIndex] ?? "";

        if (charIndex < line.length) {
            const t = setTimeout(() => setCharIndex(c => c + 1), line === "" ? 0 : 24);
            return () => clearTimeout(t);
        }
        if (lineIndex < lines.length - 1) {
            const t = setTimeout(() => { setLineIndex(l => l + 1); setCharIndex(0); }, line === "" ? 60 : 280);
            return () => clearTimeout(t);
        }
        setDone(true);
    }, [charIndex, lineIndex, panel, done, current.lines]);

    const goNext = () => {
        if (!done) {
            setLineIndex(current.lines.length - 1);
            setCharIndex(current.lines[current.lines.length - 1]?.length ?? 0);
            setDone(true);
            return;
        }
        if (panel < PANELS.length - 1) {
            setPanel(p => p + 1);
            setLineIndex(0); setCharIndex(0); setDone(false);
        } else {
            onFinish();
        }
    };

    const allVisible = done
        ? current.lines
        : [...current.lines.slice(0, lineIndex), displayedLastLine];

    return (
        <div
            onClick={goNext}
            style={{
                position: "fixed", inset: 0,
                background: current.bg,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                fontFamily: "'Press Start 2P', monospace",
                cursor: "pointer",
                zIndex: 99999,
                userSelect: "none",
                transition: "background 0.8s ease",
            }}
        >
            {/* Animated starfield */}
            <Starfield color={current.glow} />

            {/* Scanline overlay */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 6px)",
                pointerEvents: "none", zIndex: 1,
            }} />

            {/* Vignette */}
            <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
                pointerEvents: "none", zIndex: 1,
            }} />

            {/* Panel progress dots */}
            <div style={{ position: "absolute", top: 24, right: 28, display: "flex", gap: 10, zIndex: 5 }}>
                {PANELS.map((_, i) => (
                    <div key={i} style={{
                        width: 12, height: 12,
                        background: i === panel ? current.accent : "#222",
                        border: `2px solid ${i === panel ? current.accent : "#444"}`,
                        boxShadow: i === panel ? `0 0 12px ${current.accent}` : "none",
                        transition: "all 0.4s",
                    }} />
                ))}
            </div>

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 5, maxWidth: 640, width: "90%", textAlign: "center" }}>

                {/* Big icon — pixel-art SVG */}
                <div style={{
                    margin: "0 auto 28px",
                    width: 88, height: 88,
                    animation: "float-pixel 2.5s ease-in-out infinite",
                    filter: `drop-shadow(0 0 24px ${current.glow})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <img
                        src={current.icon}
                        width={88} height={88}
                        style={{ imageRendering: "pixelated", width: "100%", height: "100%" }}
                    />
                </div>

                {/* Title badge */}
                <div style={{
                    border: `3px solid ${current.accent}`,
                    padding: "14px 32px", marginBottom: 40, display: "inline-block",
                    boxShadow: `0 0 32px ${current.glow}55, inset 0 0 20px ${current.glow}11, 4px 4px 0 ${current.glow}33`,
                    background: `${current.glow}0a`,
                }}>
                    <p style={{
                        fontSize: 14, color: current.accent, letterSpacing: 4,
                        textShadow: `0 0 16px ${current.glow}`, margin: 0
                    }}>
                        {current.title}
                    </p>
                </div>

                {/* Story text */}
                <div style={{ minHeight: 220 }}>
                    {allVisible.map((line, i) => (
                        <p key={i} style={{
                            fontSize: 11,
                            fontWeight: "bold",
                            color: line === "" ? "transparent" : "#f0e6d0",
                            lineHeight: 2.6,
                            letterSpacing: 1.5,
                            minHeight: "1em",
                            textShadow: `0 0 10px ${current.glow}66`,
                        }}>
                            {i === allVisible.length - 1 && !done ? (
                                <>
                                    {line}
                                    <span style={{ animation: "blink 0.7s step-end infinite", color: current.accent }}>█</span>
                                </>
                            ) : line}
                        </p>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div style={{ position: "absolute", bottom: 36, zIndex: 5, textAlign: "center" }}>
                <p style={{
                    fontSize: 9,
                    color: done ? current.accent : "#333",
                    letterSpacing: 3,
                    animation: done ? "blink 1.2s infinite" : "none",
                    textShadow: done ? `0 0 12px ${current.glow}` : "none",
                }}>
                    {done
                        ? (panel < PANELS.length - 1 ? "▶  CLICK TO CONTINUE" : "▶  CLICK TO BEGIN")
                        : "CLICK TO SKIP"}
                </p>
            </div>
        </div>
    );
}
