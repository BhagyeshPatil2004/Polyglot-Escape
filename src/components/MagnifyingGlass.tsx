"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";

interface TranslationCache {
    [key: string]: string;
}

interface MagnifyingGlassProps {
    enabled: boolean;
}

const translationCache: TranslationCache = {};

// Language name → ISO 639-1 code for MyMemory API
const LANG_CODE_MAP: Record<string, string> = {
    Japanese: "ja",
    Arabic: "ar",
    German: "de",
    Korean: "ko",
    Russian: "ru",
    French: "fr",
    Hindi: "hi",
    Spanish: "es",
    Portuguese: "pt",
    Chinese: "zh",
    Greek: "el",
    Thai: "th",
    Italian: "it",
    Latin: "la",
    Turkish: "tr",
    Swahili: "sw",
};

async function translateText(text: string, sourceLang: string): Promise<string> {
    const langCode = LANG_CODE_MAP[sourceLang] ?? "ja";
    const cacheKey = `${text}::${langCode}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langCode}|en`
        );
        const data = await res.json();
        const translated: string = data?.responseData?.translatedText ?? text;
        translationCache[cacheKey] = translated;
        return translated;
    } catch {
        return text;
    }
}

export default function MagnifyingGlass({ enabled }: MagnifyingGlassProps) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [tooltip, setTooltip] = useState<{ text: string; lang: string } | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [visible, setVisible] = useState(false);
    const lastTarget = useRef<Element | null>(null);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { trackTranslation, addToJournal, phase } = useGameStore();

    const handleMouseMove = useCallback(
        async (e: MouseEvent) => {
            if (!enabled) return;
            setPos({ x: e.clientX, y: e.clientY });
            setVisible(true);

            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el || el === lastTarget.current) return;
            lastTarget.current = el;

            const clueEl = el.closest("[data-clue]") as HTMLElement | null;

            if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

            if (!clueEl) {
                hoverTimeout.current = setTimeout(() => {
                    setTooltip(null);
                }, 200);
                return;
            }

            const text = clueEl.dataset.clue ?? "";
            const lang = clueEl.dataset.lang ?? "Japanese";

            setIsTranslating(true);
            setTooltip({ text: "Translating...", lang });

            const translated = await translateText(text, lang);
            setIsTranslating(false);
            setTooltip({ text: translated, lang });

            // Track stats + log to journal
            if (phase === "playing") {
                trackTranslation(lang);
                addToJournal({ original: text, language: lang, translated, timestamp: Date.now() });
            }
        },
        [enabled, phase]
    );

    const handleMouseLeave = useCallback(() => {
        setVisible(false);
        setTooltip(null);
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    if (!enabled || !visible) return null;

    const tooltipX = Math.min(pos.x + 40, (typeof window !== "undefined" ? window.innerWidth : 1200) - 200);
    const tooltipY = Math.max(pos.y - 60, 8);

    return (
        <>
            {/* Glass lens */}
            <div
                style={{
                    position: "fixed",
                    left: pos.x - 32,
                    top: pos.y - 32,
                    width: 64,
                    height: 64,
                    pointerEvents: "none",
                    zIndex: 20000,
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
                    transform: "rotate(-15deg)",
                }}
            >
                {/* SVG Asset */}
                <img
                    src="/assets/magnifying-glass.svg"
                    alt="Magnifying Glass"
                    width={64}
                    height={64}
                    style={{ imageRendering: "pixelated" }}
                />
            </div>

            {/* Translation tooltip */}
            {tooltip && (
                <div
                    style={{
                        position: "fixed",
                        left: tooltipX,
                        top: tooltipY,
                        background: "rgba(45, 27, 14, 0.95)", // Earthy dark brown
                        border: "3px solid #8b5a2b", // Wood border
                        borderRadius: 6,
                        padding: "10px 14px",
                        maxWidth: 240,
                        pointerEvents: "none",
                        zIndex: 20001,
                        boxShadow: "0 8px 16px rgba(0,0,0,0.6)",
                        animation: "fadeIn 0.15s ease",
                    }}
                >
                    <p
                        style={{
                            fontSize: 10,
                            color: "#e8b923", // Gold text
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            fontFamily: "'Press Start 2P', monospace",
                        }}
                    >
                        🔍 {tooltip.lang} → English
                    </p>
                    <p
                        style={{
                            fontSize: 12,
                            color: "#f4ecd7", // Cream text
                            fontStyle: isTranslating ? "italic" : "normal",
                            fontFamily: "'Press Start 2P', monospace",
                            lineHeight: 1.6,
                            textShadow: "1px 1px 0 #000",
                        }}
                    >
                        {isTranslating ? "Translating..." : `"${tooltip.text}"`}
                    </p>
                </div>
            )}
        </>
    );
}
