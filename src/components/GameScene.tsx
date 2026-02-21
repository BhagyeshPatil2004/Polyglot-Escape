"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { PUZZLES } from "@/data/rooms";
import { playSfx } from "@/utils/sfx";
import Puzzle1 from "./puzzles/Puzzle1";
import Puzzle2 from "./puzzles/Puzzle2";
import Puzzle3 from "./puzzles/Puzzle3";
import TutorialOverlay from "./TutorialOverlay";
import AncientBaba from "./AncientBaba";

// ─── Zone types ──────────────────────────────────────────────────────────────
type ZoneType = "puzzle" | "clue" | "deco";

interface Zone {
    id: string;
    puzzleId: number;
    type: ZoneType;
    x: number; y: number;
    width: number; height: number;
    label: string;
    clueIndex?: number;
    decoMessage?: string;
    // For decorative interactable objects with foreign text
    foreignText?: string;
    foreignLang?: string;
    foreignTranslation?: string;
}

// ─── Collectable items ───────────────────────────────────────────────────────
interface Collectable {
    id: string;
    puzzleId: number;  // which room it spawns in
    asset: string;     // filename without extension
    label: string;
    description: string;
    x: number; y: number; // center position
}

const COLLECTABLES: Collectable[] = [];

// ─── Interaction zones ────────────────────────────────────────────────────────
const SHOW_DEBUG_ZONES = false;

const ALL_ZONES: Zone[] = [
    // ── Room 1 ──────────────────────────────────────────────────────────────
    { id: "r1-desk", puzzleId: 1, type: "puzzle", x: 280, y: 290, width: 140, height: 70, label: "READ GRIMOIRE" },
    // Clue zones labeled SCROLL I/II/III so players know the letter ORDER - positioned on bookshelves
    { id: "r1-clue1", puzzleId: 1, type: "clue", x: 50, y: 140, width: 200, height: 60, label: "SCROLL I", clueIndex: 0 },
    { id: "r1-clue2", puzzleId: 1, type: "clue", x: 410, y: 490, width: 100, height: 70, label: "SCROLL II", clueIndex: 1 },
    { id: "r1-clue3", puzzleId: 1, type: "clue", x: 580, y: 200, width: 100, height: 60, label: "SCROLL III", clueIndex: 2 },
    { id: "r1-lamp", puzzleId: 1, type: "deco", x: 660, y: 140, width: 90, height: 70, label: "OIL LAMP", decoMessage: "A flickering oil lamp. It smells ancient." },
    // ─ Decorative translatable objects in Room 1 ─ positioned on/near objects
    {
        id: "r1-sign", puzzleId: 1, type: "deco", x: 720, y: 300, width: 60, height: 80, label: "SIGN",
        foreignText: "مخرج", foreignLang: "Arabic", foreignTranslation: "Exit"
    },
    {
        id: "r1-painting", puzzleId: 1, type: "deco", x: 360, y: 200, width: 120, height: 60, label: "PAINTING",
        foreignText: "La Conoscenza È Libertà", foreignLang: "Italian", foreignTranslation: "Knowledge is Freedom"
    },

    // ── Room 2 ──────────────────────────────────────────────────────────────
    { id: "r2-bench", puzzleId: 2, type: "puzzle", x: 290, y: 270, width: 190, height: 90, label: "MIX INGREDIENTS" },
    // Note: Room 2 clues are IN the puzzle (bottle labels in foreign languages)
    // ─ Decorative translatable objects in Room 2 ─ positioned on/near objects
    {
        id: "r2-formula", puzzleId: 2, type: "deco", x: 30, y: 200, width: 110, height: 60, label: "FORMULA",
        foreignText: "Φωτιά + Λάδι = Αντίδοτο", foreignLang: "Greek", foreignTranslation: "Fire + Oil = Antidote"
    },
    {
        id: "r2-warning", puzzleId: 2, type: "deco", x: 630, y: 200, width: 100, height: 60, label: "WARNING",
        foreignText: "Cuidado com o gás", foreignLang: "Portuguese", foreignTranslation: "Careful with the gas"
    },
    {
        id: "r2-label", puzzleId: 2, type: "deco", x: 150, y: 420, width: 90, height: 60, label: "LABEL",
        foreignText: "खतरनाक", foreignLang: "Hindi", foreignTranslation: "Dangerous"
    },

    // ── Room 3 ──────────────────────────────────────────────────────────────
    // Door trigger — bottom of the door arch (walkable floor level)
    { id: "r3-door", puzzleId: 3, type: "puzzle", x: 300, y: 420, width: 180, height: 80, label: "USE THE DOOR" },
    // Clue 1 — left bookshelf (bottom, in front of shelf, walkable)
    { id: "r3-clue1", puzzleId: 3, type: "clue", x: 40, y: 430, width: 180, height: 80, label: "WALL INSCRIPTION", clueIndex: 0 },
    // Clue 2 — moved to right shelf lower position (near object, not floor in front of player)
    { id: "r3-clue2", puzzleId: 3, type: "clue", x: 580, y: 480, width: 180, height: 60, label: "FLOOR CARVING", clueIndex: 1 },
    // Clue 3 — right bookshelf (middle shelf, near objects)
    { id: "r3-clue3", puzzleId: 3, type: "clue", x: 580, y: 360, width: 180, height: 60, label: "PAMPHLET", clueIndex: 2 },
    // ─ Decorative translatable objects in Room 3 ─ positioned on/near objects
    {
        id: "r3-latin", puzzleId: 3, type: "deco", x: 320, y: 200, width: 160, height: 60, label: "INSCRIPTION",
        foreignText: "Omnia vincit lingua", foreignLang: "Latin", foreignTranslation: "Language conquers all"
    },
    {
        id: "r3-turkish", puzzleId: 3, type: "deco", x: 620, y: 300, width: 110, height: 70, label: "TABLET",
        foreignText: "Güneş önce gelir", foreignLang: "Turkish", foreignTranslation: "The sun comes first"
    },
    {
        id: "r3-swahili", puzzleId: 3, type: "deco", x: 40, y: 300, width: 110, height: 70, label: "MURAL",
        foreignText: "Uhuru uko karibu", foreignLang: "Swahili", foreignTranslation: "Freedom is near"
    },

    // ─ Extra diary pages / false clues (purely for flavour & translation fun) ─
    {
        id: "r1-diary1", puzzleId: 1, type: "deco", x: 110, y: 360, width: 90, height: 70, label: "DIARY PAGE",
        foreignText: "今日も本に囲まれて幸せだ。鍵をどこに置いたかは…秘密。", foreignLang: "Japanese",
        foreignTranslation: "Surrounded by books again today. Where I left the key is... my little secret."
    },
    {
        id: "r1-diary2", puzzleId: 1, type: "deco", x: 520, y: 260, width: 90, height: 70, label: "DIARY PAGE",
        foreignText: "Los alumnos nunca miran la estantería de arriba. Allí guardo mis acertijos inútiles.", foreignLang: "Spanish",
        foreignTranslation: "Students never look at the top shelf. That is where I hide my useless riddles."
    },
    {
        id: "r2-diary2", puzzleId: 2, type: "deco", x: 560, y: 420, width: 90, height: 70, label: "SCRAP NOTE",
        foreignText: "إن لم تستطع قراءة هذا، ربما لا يجب أن mélanger أي شيء.", foreignLang: "Arabic",
        foreignTranslation: "If you cannot read this, perhaps you should not be mixing anything."
    },
    {
        id: "r3-diary1", puzzleId: 3, type: "deco", x: 150, y: 320, width: 90, height: 70, label: "DIARY PAGE",
        foreignText: "Linguarum murus non est lapis sed timor.", foreignLang: "Latin",
        foreignTranslation: "The wall of languages is not stone but fear."
    },
    {
        id: "r3-diary2", puzzleId: 3, type: "deco", x: 540, y: 320, width: 90, height: 70, label: "DIARY PAGE",
        foreignText: "언어는 문이다. 하지만 이 방의 문은 아직 고장난 것 같다.", foreignLang: "Korean",
        foreignTranslation: "Language is a door. Though the actual door in this room still seems broken."
    },
];


// ─── Backgrounds per room ────────────────────────────────────────────────────
const BG_MAP: Record<number, string> = { 1: "room1", 2: "room2", 3: "room3" };

// ─── Clue pop-up ─────────────────────────────────────────────────────────────
function ClueCard({ clue, onClose }: { clue: { text: string; languageName: string }; onClose: () => void }) {
    return (
        <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.82)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000,
        }}>
            <div className="pixel-box" style={{ padding: 28, maxWidth: 400, width: "88%", textAlign: "center" }}>
                <p style={{ fontSize: 7, color: "#ffd60a", letterSpacing: 2, marginBottom: 16 }}>
                    📜 [{clue.languageName.toUpperCase()}]
                </p>
                <p
                    data-clue={clue.text}
                    data-lang={clue.languageName}
                    style={{ fontSize: 30, color: "#f8f8f8", fontFamily: "serif", letterSpacing: 3, marginBottom: 20, lineHeight: 1.6 }}
                >
                    {clue.text}
                </p>
                <p style={{ fontSize: 7, color: "#06d6a0", animation: "blink 1.5s infinite", marginBottom: 20 }}>
                    🔍 HOVER OVER TEXT TO TRANSLATE
                </p>
                <button onClick={onClose} className="pixel-btn pixel-btn-red" style={{ fontSize: 7, padding: "8px 16px" }}>
                    ✖ CLOSE
                </button>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GameScene() {
    const { currentPuzzle, solvedPuzzles, finishGame, inventory, addToInventory, isPaused, setPaused, translationCount, journal } = useGameStore();

    const [pos, setPos] = useState({ x: 400, y: 460 });
    const [facing, setFacing] = useState<"front" | "back" | "left" | "right">("front");
    const [isMoving, setIsMoving] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);
    const [activeZone, setActiveZone] = useState<Zone | null>(null);
    const [showPuzzle, setShowPuzzle] = useState(false);
    const [showClue, setShowClue] = useState<{ text: string; languageName: string } | null>(null);
    const [showForeignDeco, setShowForeignDeco] = useState<{ text: string; lang: string; label: string } | null>(null);
    const [showJournal, setShowJournal] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [foundClues, setFoundClues] = useState<Set<string>>(new Set());
    const [seenZones, setSeenZones] = useState<Set<string>>(new Set());
    const [seenIntros, setSeenIntros] = useState<Set<number>>(new Set());
    // Which collectables have been picked up locally (for animation/hiding)
    const [pickedUp, setPickedUp] = useState<Set<string>>(new Set());
    const [showRoomAdvance, setShowRoomAdvance] = useState(false);
    const [showExitAnimation, setShowExitAnimation] = useState(false);

    const keys = useRef<Set<string>>(new Set());
    const moveInterval = useRef<NodeJS.Timeout | null>(null);
    const speed = 4;
    const PICKUP_RADIUS = 36;

    // ── ESC = pause ───────────────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPaused(!isPaused);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isPaused]);

    const puzzle = PUZZLES[currentPuzzle - 1];
    const roomZones = ALL_ZONES.filter(z => z.puzzleId === currentPuzzle);
    const clueZones = roomZones.filter(z => z.type === "clue");
    const roomItems = COLLECTABLES.filter(c => c.puzzleId === currentPuzzle && !pickedUp.has(c.id));
    const isModalOpen = showPuzzle || !!showClue || !!showForeignDeco;
    const bg = currentPuzzle === 3 && (solvedPuzzles.includes(3) || showExitAnimation)
        ? "room3.1"
        : BG_MAP[currentPuzzle] ?? "room1";

    // ── Movement ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const tick = () => {
            const isDialogueActive = showTutorial || !seenIntros.has(currentPuzzle);
            if (isPaused || isDialogueActive) return;
            let dx = 0, dy = 0, nf = facing;
            if (keys.current.has("arrowup") || keys.current.has("w")) { dy -= speed; nf = "back"; }
            if (keys.current.has("arrowdown") || keys.current.has("s")) { dy += speed; nf = "front"; }
            if (keys.current.has("arrowleft") || keys.current.has("a")) { dx -= speed; nf = "left"; }
            if (keys.current.has("arrowright") || keys.current.has("d")) { dx += speed; nf = "right"; }
            if (dx || dy) {
                setFacing(nf as any);
                setIsMoving(true);
                setPos(p => ({
                    x: Math.max(40, Math.min(760, p.x + dx)),
                    y: Math.max(100, Math.min(560, p.y + dy)),
                }));
            } else {
                setIsMoving(false);
            }
        };
        moveInterval.current = setInterval(tick, 16);
        return () => { if (moveInterval.current) clearInterval(moveInterval.current); };
    }, [facing, isPaused, showTutorial, seenIntros, currentPuzzle]);

    // ── Collectable auto-pickup ───────────────────────────────────────────────
    useEffect(() => {
        roomItems.forEach(item => {
            const dist = Math.hypot(pos.x - item.x, pos.y - item.y);
            if (dist < PICKUP_RADIUS) {
                setPickedUp(prev => new Set([...prev, item.id]));
                addToInventory(item.id);
                setMessage(`✦ PICKED UP: ${item.label}!`);
                playSfx("chime");
                setTimeout(() => setMessage(null), 2500);
            }
        });
    }, [pos]);

    // ── Key listeners ─────────────────────────────────────────────────────────
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            keys.current.add(e.key.toLowerCase());
            if (e.key.toLowerCase() === "e" && activeZone && !isModalOpen) {
                handleInteract(activeZone);
            }
            if (e.key === "Escape") { setShowPuzzle(false); setShowClue(null); setShowForeignDeco(null); }
        };
        const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    }, [activeZone, isModalOpen]);

    // ── Zone detection ────────────────────────────────────────────────────────
    useEffect(() => {
        const zone = roomZones.find(z =>
            pos.x >= z.x && pos.x <= z.x + z.width &&
            pos.y >= z.y && pos.y <= z.y + z.height
        );
        setActiveZone(zone ?? null);
    }, [pos, currentPuzzle]);

    // ── Interact ─────────────────────────────────────────────────────────────
    const handleInteract = (zone: Zone) => {
        playSfx("click");
        setSeenZones(prev => new Set([...prev, zone.id]));
        if (zone.type === "puzzle") {
            setShowPuzzle(true);
        } else if (zone.type === "clue") {
            const clue = puzzle.clues[zone.clueIndex ?? 0];
            if (clue) {
                setFoundClues(prev => new Set([...prev, zone.id]));
                setShowClue({ text: clue.text, languageName: clue.languageName });
            }
        } else if (zone.foreignText) {
            // Decorative zone with foreign language text — show hoverable popup
            setShowForeignDeco({ text: zone.foreignText, lang: zone.foreignLang ?? "Unknown", label: zone.label });
        } else {
            setMessage(zone.decoMessage ?? "Nothing interesting here.");
            setTimeout(() => setMessage(null), 2500);
        }
    };

    const handlePuzzleSolved = (msg: string) => {
        setShowPuzzle(false);
        setFoundClues(new Set());
        setMessage(msg);
        setPos({ x: 400, y: 460 });
        setTimeout(() => setMessage(null), 3500);
        const nowSolved = solvedPuzzles.length + 1;
        playSfx("chime");
        if (nowSolved < 3) {
            setShowRoomAdvance(true);
            setTimeout(() => setShowRoomAdvance(false), 1800);
        }
        if (nowSolved >= 3) {
            setShowExitAnimation(true);
            // White explosion happens, then transition to win screen
            setTimeout(() => {
                finishGame();
            }, 2500);
        }
    };

    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <>
            <div style={{ display: "flex", gap: 0, alignItems: "stretch", width: "100%", maxWidth: 1060, margin: "0 auto" }}>

                {/* ══ LEFT SIDEBAR ═══════════════════════════════════════════════ */}
                <div style={{
                    width: 280, flexShrink: 0,
                    display: "flex", flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "12px 12px 12px 0",
                    gap: 10,
                }}>
                    {/* TOP GROUP */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                        {/* Baba's Room Hint Box */}
                        <div style={{
                            background: "#2d3540",
                            border: "4px solid #d4c29c",
                            outline: "2px solid #15181d",
                            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)",
                            padding: "12px",
                            position: "relative",
                            display: "flex", flexDirection: "column", gap: 10,
                        }}>
                            {/* Corner Ornaments */}
                            <div style={{ position: "absolute", top: -2, left: -2, width: 6, height: 6, background: "#8b7e65" }} />
                            <div style={{ position: "absolute", top: -2, right: -2, width: 6, height: 6, background: "#8b7e65" }} />
                            <div style={{ position: "absolute", bottom: -2, left: -2, width: 6, height: 6, background: "#8b7e65" }} />
                            <div style={{ position: "absolute", bottom: -2, right: -2, width: 6, height: 6, background: "#8b7e65" }} />

                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <img
                                    src="/assets/AncientBaba.svg"
                                    alt="Baba"
                                    style={{
                                        width: 48, height: 64, objectFit: "contain",
                                        imageRendering: "pixelated",
                                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                                    }}
                                />
                                <div>
                                    <p style={{ fontSize: 7, color: "#d4c29c", letterSpacing: 1, marginBottom: 4 }}>
                                        ANCIENT BABA:
                                    </p>
                                    <p style={{ fontSize: 9, color: "#ffd60a", letterSpacing: 1 }}>
                                        {puzzle.title.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div style={{ height: 1, background: "#8b7e65", opacity: 0.3 }} />

                            <p style={{
                                fontSize: 8, color: "#f8f9fa",
                                lineHeight: 1.8, letterSpacing: 0.5,
                                textShadow: "1px 1px 0 #111"
                            }}>
                                "{puzzle.babaHint}"
                            </p>
                        </div>

                        {/* Clue tracker */}
                        <div className="pixel-box" style={{ padding: "10px 14px" }}>
                            <p style={{ fontSize: 6, color: "#888", letterSpacing: 1, marginBottom: 8 }}>CLUES FOUND:</p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {clueZones.map(z => (
                                    <div
                                        key={z.id}
                                        title={foundClues.has(z.id) ? z.label : "???"}
                                        style={{
                                            width: 14, height: 14,
                                            background: foundClues.has(z.id) ? "#06d6a0" : "#2a2a2a",
                                            border: "2px solid #555",
                                            boxShadow: foundClues.has(z.id) ? "0 0 6px #06d6a0" : "none",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Translation counter + Journal toggle */}
                        <div className="pixel-box" style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                <p style={{ fontSize: 6, color: "#888", letterSpacing: 1 }}>🔍 TRANSLATIONS:</p>
                                <button
                                    onClick={() => setShowJournal(v => !v)}
                                    style={{
                                        background: showJournal ? "#06d6a0" : "#1a1a1a",
                                        border: "2px solid #06d6a0",
                                        color: showJournal ? "#000" : "#06d6a0",
                                        fontSize: 5, padding: "2px 5px", cursor: "pointer",
                                        letterSpacing: 1, fontFamily: "'Press Start 2P', monospace",
                                    }}
                                >
                                    📖 LOG
                                </button>
                            </div>
                            <p style={{ fontSize: 14, color: translationCount > 0 ? "#06d6a0" : "#444", letterSpacing: 1 }}>
                                {translationCount}
                            </p>
                        </div>

                        {/* Translation Journal — collapsible */}
                        {showJournal && (
                            <div className="pixel-box" style={{ padding: "10px 12px", maxHeight: 200, overflowY: "auto" }}>
                                <p style={{ fontSize: 6, color: "#ffd60a", letterSpacing: 1, marginBottom: 10 }}>📖 WORD JOURNAL</p>
                                {journal.length === 0 ? (
                                    <p style={{ fontSize: 5, color: "#444", letterSpacing: 1 }}>No words yet.<br />Hover text with the magnifying glass!</p>
                                ) : (
                                    journal.map((entry, i) => (
                                        <div key={i} style={{ marginBottom: 8, borderBottom: "1px solid #2a2a2a", paddingBottom: 6 }}>
                                            <p style={{ fontSize: 6, color: "#f8f8f8", letterSpacing: 1, fontFamily: "serif" }}>{entry.original}</p>
                                            <p style={{ fontSize: 5, color: "#888", letterSpacing: 1 }}>[{entry.language}]</p>
                                            <p style={{ fontSize: 5, color: "#06d6a0", letterSpacing: 1 }}>→ {entry.translated}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Inventory */}
                        <div className="pixel-box" style={{ padding: "10px 14px" }}>
                            <p style={{ fontSize: 6, color: "#888", letterSpacing: 1, marginBottom: 8 }}>🎒 INVENTORY:</p>
                            {inventory.length === 0 ? (
                                <p style={{ fontSize: 6, color: "#444", letterSpacing: 1 }}>EMPTY</p>
                            ) : (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {inventory.map(id => {
                                        const item = COLLECTABLES.find(c => c.id === id)!;
                                        return (
                                            <div
                                                key={id}
                                                title={item.description}
                                                style={{
                                                    width: 40, height: 40,
                                                    background: "#1a1a2e",
                                                    border: "3px solid #ffd60a",
                                                    boxShadow: "0 0 8px #ffd60a88",
                                                    display: "flex", flexDirection: "column",
                                                    alignItems: "center", justifyContent: "center",
                                                    padding: 4, gap: 2,
                                                    cursor: "default",
                                                }}
                                            >
                                                <img
                                                    src={`/assets/${item.asset}.svg`}
                                                    alt={item.label}
                                                    style={{ width: 22, height: 22, imageRendering: "pixelated" }}
                                                />
                                                <span style={{ fontSize: 4, color: "#ffd60a", textAlign: "center", letterSpacing: 0.5 }}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BOTTOM GROUP */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button
                            className="pixel-btn pixel-btn-yellow"
                            style={{ fontSize: 8, padding: "14px 10px", width: "100%", letterSpacing: 1 }}
                            onClick={() => setShowPuzzle(true)}
                        >
                            🔓 SOLVE PUZZLE
                        </button>
                        <p style={{ fontSize: 6, color: "#555", textAlign: "center", letterSpacing: 1 }}>
                            ROOM {currentPuzzle} / 3
                        </p>
                    </div>
                </div>

                {/* ══ GAME CANVAS ════════════════════════════════════════════════ */}
                <div style={{
                    position: "relative", width: 800, height: 600, flexShrink: 0,
                    backgroundImage: `url('/assets/${bg}.svg')`,
                    backgroundSize: "cover", imageRendering: "pixelated",
                    boxShadow: "0 0 0 4px #261409, 0 0 20px rgba(0,0,0,0.5)",
                    overflow: "hidden", userSelect: "none",
                }}>
                    {/* Room label badge */}
                    <div style={{
                        position: "absolute", top: 8, left: 8, zIndex: 10, pointerEvents: "none",
                        background: "rgba(0,0,0,0.65)", border: "2px solid #ffd60a", padding: "4px 8px",
                    }}>
                        <p style={{ fontSize: 6, color: "#ffd60a", letterSpacing: 1 }}>ROOM {currentPuzzle} / 3</p>
                    </div>

                    {/* Zone debug outlines (dev only) */}
                    {SHOW_DEBUG_ZONES && roomZones.map(z => (
                        <div key={z.id} style={{
                            position: "absolute", left: z.x, top: z.y, width: z.width, height: z.height,
                            border: z.type === "puzzle"
                                ? "2px dashed rgba(255,214,10,0.4)"
                                : z.type === "clue"
                                    ? "2px dashed rgba(6,214,160,0.4)"
                                    : "2px dashed rgba(255,255,255,0.12)",
                            pointerEvents: "none", zIndex: 2,
                        }} />
                    ))}

                    {/* Clue / interactable sparkle icons */}
                    {roomZones.map(z => {
                        const isClue = z.type === "clue";
                        const isSeen = seenZones.has(z.id) || (isClue && foundClues.has(z.id));
                        const color = "#ffd60a";
                        const dullColor = "#b08900";
                        const iconY = z.y + z.height / 2 - 10;
                        return (
                            <div key={`icon-${z.id}`} style={{
                                position: "absolute",
                                left: z.x + z.width / 2 - 8,
                                top: iconY,
                                display: "flex", flexDirection: "column", alignItems: "center",
                                pointerEvents: "none", zIndex: 3,
                            }}>
                                <span style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    animation: isSeen ? "none" : "float-pixel 2s ease-in-out infinite",
                                    color: isSeen ? dullColor : color,
                                    filter: isSeen
                                        ? `drop-shadow(0 0 4px ${dullColor})`
                                        : `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 4px ${color})`,
                                    opacity: isSeen ? 0.6 : 1,
                                }}>
                                    {isSeen ? "✓" : "!"}
                                </span>
                            </div>
                        );
                    })}



                    {/* ── COLLECTABLES on the floor ─────────────────────────── */}
                    {roomItems.map(item => (
                        <div key={item.id} style={{
                            position: "absolute",
                            left: item.x - 20, top: item.y - 20,
                            width: 40, height: 40,
                            zIndex: Math.floor(item.y),
                            pointerEvents: "none",
                            animation: "float-pixel 2s ease-in-out infinite",
                            filter: "drop-shadow(0 0 10px #ffd60a) drop-shadow(0 0 5px #ffd60a)",
                        }}>
                            <img
                                src={`/assets/${item.asset}.svg`}
                                alt={item.label}
                                style={{ width: 40, height: 40, imageRendering: "pixelated" }}
                            />
                            {/* Floating label */}
                            <div style={{
                                position: "absolute", bottom: 44, left: "50%",
                                transform: "translateX(-50%)", whiteSpace: "nowrap",
                                background: "rgba(0,0,0,0.75)", border: "1px solid #ffd60a",
                                padding: "2px 6px",
                            }}>
                                <span style={{ fontSize: 5, color: "#ffd60a", letterSpacing: 1 }}>
                                    ✦ {item.label}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Player */}
                    <div style={{
                        position: "absolute",
                        left: pos.x - 32, top: pos.y - 64,
                        width: 64, height: 64,
                        zIndex: Math.floor(pos.y) + 5,
                        // Walking bob: tiny vertical bounce when moving
                        animation: isMoving ? "walk-bob 0.3s steps(2, end) infinite" : "none",
                    }}>
                        <img
                            src={`/assets/Character-${facing}.svg`}
                            alt="Player" width={64} height={64}
                            style={{ imageRendering: "pixelated", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}
                            onError={e => { e.currentTarget.src = "/assets/Character-front.svg"; }}
                        />

                        {/* Speech bubble */}
                        {message && (
                            <div style={{
                                position: "absolute", bottom: 72, left: "50%",
                                transform: "translateX(-50%)", whiteSpace: "nowrap",
                                background: "#fff", color: "#000",
                                padding: "6px 10px", fontSize: 7,
                                zIndex: 30000, border: "2px solid #000",
                                fontFamily: "'Press Start 2P', monospace",
                                animation: "fadeIn 0.2s ease",
                            }}>
                                {message}
                                <div style={{
                                    position: "absolute", bottom: -5, left: "50%", marginLeft: -5,
                                    width: 0, height: 0,
                                    borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                                    borderTop: "5px solid #000",
                                }} />
                            </div>
                        )}
                    </div>

                    {/* Interaction prompt */}
                    {activeZone && !isModalOpen && (
                        <div
                            className={activeZone.type === "clue" ? "pixel-box-green" : "pixel-box-yellow"}
                            style={{
                                position: "absolute",
                                left: Math.min(pos.x + 20, 650),
                                top: Math.max(pos.y - 88, 8),
                                padding: "7px 12px",
                                zIndex: 9000,
                                animation: "float-pixel 2s infinite",
                                cursor: "pointer",
                            }}
                            onClick={() => handleInteract(activeZone)}
                        >
                            <p style={{ fontSize: 7, color: activeZone.type === "clue" ? "#06d6a0" : "#5d4037", whiteSpace: "nowrap" }}>
                                [E / CLICK] {activeZone.label}
                            </p>
                        </div>
                    )}

                    {/* Clue card modal */}
                    {showClue && <ClueCard clue={showClue} onClose={() => setShowClue(null)} />}

                    {/* Decorative foreign-text popup */}
                    {showForeignDeco && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(0,0,0,0.82)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 10000,
                        }}>
                            <div className="pixel-box" style={{ padding: 28, maxWidth: 400, width: "88%", textAlign: "center" }}>
                                <p style={{ fontSize: 7, color: "#f4a261", letterSpacing: 2, marginBottom: 6 }}>
                                    📜 [{showForeignDeco.label} — {showForeignDeco.lang.toUpperCase()}]
                                </p>
                                {/* The foreign text is hoverable by the magnifying glass */}
                                <p
                                    data-clue={showForeignDeco.text}
                                    data-lang={showForeignDeco.lang}
                                    style={{
                                        fontSize: 22, color: "#f8f8f8", fontFamily: "serif",
                                        letterSpacing: 3, marginBottom: 20, lineHeight: 1.6,
                                        cursor: "crosshair",
                                    }}
                                >
                                    {showForeignDeco.text}
                                </p>
                                <p style={{ fontSize: 7, color: "#06d6a0", animation: "blink 1.5s infinite", marginBottom: 20 }}>
                                    🔍 HOVER TEXT TO TRANSLATE
                                </p>
                                <button
                                    onClick={() => setShowForeignDeco(null)}
                                    className="pixel-btn pixel-btn-red"
                                    style={{ fontSize: 7, padding: "8px 16px" }}
                                >
                                    ✖ CLOSE
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Puzzle solve modal */}
                    {showPuzzle && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(0,0,0,0.88)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 10000,
                        }}>
                            <div style={{ position: "relative", width: "92%", maxWidth: 620 }}>
                                <button
                                    onClick={() => setShowPuzzle(false)}
                                    className="pixel-btn pixel-btn-red"
                                    style={{ position: "absolute", top: -24, right: 0, padding: "8px 14px", fontSize: 8, zIndex: 10001 }}
                                >
                                    ✖ CLOSE
                                </button>
                                <div style={{
                                    background: "#16161a",
                                    border: "4px solid #333",
                                    boxShadow: "8px 8px 0 #000",
                                    padding: 24,
                                    maxHeight: "80vh",
                                    overflowY: "auto",
                                }}>
                                    {currentPuzzle === 1 && <Puzzle1 onSolve={handlePuzzleSolved} />}
                                    {currentPuzzle === 2 && <Puzzle2 onSolve={handlePuzzleSolved} />}
                                    {currentPuzzle === 3 && <Puzzle3 onSolve={handlePuzzleSolved} />}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Room advance overlay */}
                    {showRoomAdvance && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(0,0,0,0.75)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 15000,
                            animation: "fadeIn 0.3s ease",
                        }}>
                            <div className="pixel-box-yellow" style={{
                                padding: "24px 32px",
                                textAlign: "center",
                                minWidth: 300,
                                animation: "room-promote 2s ease-out",
                                position: "relative",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    inset: -20,
                                    background: "radial-gradient(circle, rgba(255,214,10,0.2) 0%, transparent 70%)",
                                    animation: "room-glow 2s ease-out infinite",
                                    borderRadius: "8px",
                                    zIndex: -1,
                                }} />
                                <p style={{ fontSize: 12, color: "#5d4037", letterSpacing: 2, marginBottom: 12, fontWeight: "bold" }}>
                                    ✦ ROOM CLEARED! ✦
                                </p>
                                <div style={{
                                    fontSize: 18,
                                    color: "#d97706",
                                    letterSpacing: 4,
                                    marginBottom: 8,
                                    animation: "arrowPulse 1s ease-in-out infinite",
                                }}>
                                    → NEXT ROOM →
                                </div>
                                <p style={{ fontSize: 7, color: "#555", letterSpacing: 1 }}>
                                    NEW CLUES AWAIT AHEAD
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Final exit / door animation before win screen */}
                    {showExitAnimation && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.98) 70%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            zIndex: 20000,
                            animation: "shake-intense 0.4s ease-in-out infinite", // Added screen shake
                        }}>
                            <div style={{
                                position: "relative",
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                transform: "translateY(-80px)", // Shift up to align with the door in the background
                            }}>
                                {/* Multiple glow rings - scaled up drastically */}
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} style={{
                                        position: "absolute",
                                        top: "50%", left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 300 + i * 150, // Massive glow
                                        height: 300 + i * 150,
                                        borderRadius: "50%",
                                        background: `radial-gradient(circle, rgba(255,230,150,${0.6 - i * 0.15}) 0%, transparent 60%)`,
                                        filter: "blur(4px)",
                                        animation: `door-burst-intense 1.5s cubic-bezier(0.1, 0.7, 1.0, 0.1) ${i * 0.2}s infinite`,
                                    }} />
                                ))}

                                {/* Bright white explosion - delayed and blinding */}
                                <div style={{
                                    position: "absolute",
                                    inset: -500, // Cover the entire screen
                                    background: "radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 100%)",
                                    animation: "epic-white-explosion 1.5s ease-in 1.5s forwards",
                                    pointerEvents: "none",
                                    zIndex: 10,
                                }} />
                                <p style={{
                                    marginTop: 40,
                                    fontSize: 14,
                                    color: "#fff",
                                    letterSpacing: 6,
                                    textShadow: "0 0 20px #ffd60a, 0 0 40px #ffd60a",
                                    animation: "pulseGlowEpic 1s ease-in-out infinite",
                                    zIndex: 2,
                                }}>
                                    ASCENDING...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tutorial overlay — shown on game start */}
            {showTutorial && (
                <AncientBaba
                    lines={[
                        "Ahem. Welcome to the Linguist's Archive.",
                        "I am the Ancient Baba, Guardian of this place.",
                        "You must translate everything to escape!",
                        "Use WASD or the Arrow keys to walk around.",
                        "Press [E] or click to interact with glowing things.",
                        "Hover your Magnifying Glass over foreign text.",
                        "And finally... open PUZZLES to solve them.",
                        "Good luck. You're going to need it."
                    ]}
                    onComplete={() => { setShowTutorial(false); setPaused(false); }}
                />
            )}

            {/* Room Intro overlay — shown when entering a new room */}
            {!showTutorial && !seenIntros.has(currentPuzzle) && (
                <AncientBaba
                    lines={puzzle.babaRoomIntro}
                    onComplete={() => {
                        setSeenIntros(prev => new Set(prev).add(currentPuzzle));
                        setPaused(false);
                    }}
                />
            )}

            {/* Pause overlay — toggled by ESC */}
            {isPaused && !showTutorial && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 40000,
                    background: "rgba(0,0,0,0.82)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Press Start 2P', monospace",
                }}>
                    <div style={{
                        background: "#16161a",
                        border: "4px solid #ffd60a",
                        boxShadow: "8px 8px 0 #b8970a",
                        padding: "40px 52px",
                        textAlign: "center",
                        minWidth: 320,
                    }}>
                        <p style={{ fontSize: 20, color: "#ffd60a", letterSpacing: 3, marginBottom: 12 }}>⏸ PAUSED</p>
                        <p style={{ fontSize: 7, color: "#666", marginBottom: 32, letterSpacing: 1 }}>PRESS [ESC] TO RESUME</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button onClick={() => setPaused(false)} className="pixel-btn pixel-btn-green" style={{ fontSize: 9, padding: "14px 24px" }}>
                                ▶ RESUME
                            </button>
                            <button onClick={() => { setShowTutorial(true); setPaused(false); }} className="pixel-btn" style={{ fontSize: 7, padding: "10px 16px" }}>
                                ❓ HOW TO PLAY
                            </button>
                            <button onClick={() => window.location.reload()} className="pixel-btn pixel-btn-red" style={{ fontSize: 7, padding: "10px 16px" }}>
                                ↩ RESTART
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
