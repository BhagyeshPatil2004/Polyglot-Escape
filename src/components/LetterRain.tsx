"use client";

import { useEffect, useState } from "react";

// Random characters from various languages
const LANGUAGE_CHARS = [
    // Japanese
    "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
    "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
    "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
    // Chinese
    "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
    "天", "地", "人", "水", "火", "木", "金", "土",
    // Arabic
    "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر",
    "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف",
    // Greek
    "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ",
    "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ",
    // Cyrillic
    "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и",
    "й", "к", "л", "м", "н", "о", "п", "р", "с", "т",
    // Hindi
    "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ",
    "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ",
    // Korean
    "가", "나", "다", "라", "마", "바", "사", "아", "자", "차",
    "카", "타", "파", "하",
    // Latin/Roman (for variety)
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
];

interface Letter {
    char: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
    opacity: number;
}

export default function LetterRain() {
    const [letters, setLetters] = useState<Letter[]>([]);

    useEffect(() => {
        const newLetters: Letter[] = Array.from({ length: 80 }, () => ({
            char: LANGUAGE_CHARS[Math.floor(Math.random() * LANGUAGE_CHARS.length)],
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4,
            size: 14 + Math.random() * 10,
            opacity: 0.3 + Math.random() * 0.4,
        }));
        setLetters(newLetters);
    }, []);

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
        }}>
            {letters.map((letter, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${letter.left}%`,
                        top: "-50px",
                        fontSize: letter.size,
                        color: `rgba(255, 255, 255, ${letter.opacity})`,
                        fontFamily: "'Press Start 2P', monospace",
                        textShadow: `0 0 ${letter.size / 2}px rgba(255, 255, 255, ${letter.opacity * 0.5})`,
                        animation: `letter-fall ${letter.duration}s linear ${letter.delay}s infinite`,
                        userSelect: "none",
                    }}
                >
                    {letter.char}
                </div>
            ))}
        </div>
    );
}
