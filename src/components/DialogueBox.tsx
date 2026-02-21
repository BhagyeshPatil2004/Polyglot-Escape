"use client";

import { useState, useEffect } from "react";
import { playSfx } from "@/utils/sfx";

interface DialogueBoxProps {
    characterName: string;
    characterPortrait: string;
    messages: string[];
    onComplete: () => void;
    autoAdvance?: boolean;
}

export default function DialogueBox({ characterName, characterPortrait, messages, onComplete, autoAdvance = false }: DialogueBoxProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    const currentMessage = messages[currentMessageIndex] ?? "";

    // Typewriter effect
    useEffect(() => {
        if (!isTyping) return;
        if (displayedText.length < currentMessage.length) {
            const timer = setTimeout(() => {
                setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
            }, 30);
            return () => clearTimeout(timer);
        } else {
            setIsTyping(false);
            if (autoAdvance && currentMessageIndex < messages.length - 1) {
                setTimeout(() => {
                    setCurrentMessageIndex(i => i + 1);
                    setDisplayedText("");
                    setIsTyping(true);
                }, 2000);
            }
        }
    }, [displayedText, currentMessage, isTyping, currentMessageIndex, messages.length, autoAdvance]);

    const handleClick = () => {
        if (isTyping) {
            // Skip to end of current message
            setDisplayedText(currentMessage);
            setIsTyping(false);
        } else {
            // Next message or close
            if (currentMessageIndex < messages.length - 1) {
                playSfx("click");
                setCurrentMessageIndex(i => i + 1);
                setDisplayedText("");
                setIsTyping(true);
            } else {
                playSfx("click");
                onComplete();
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                position: "fixed",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                maxWidth: "800px",
                zIndex: 30000,
                cursor: "pointer",
                fontFamily: "'Press Start 2P', monospace",
            }}
        >
            {/* Dialogue box */}
            <div style={{
                background: "linear-gradient(180deg, rgba(30,25,45,0.95) 0%, rgba(15,10,25,0.95) 100%)",
                border: "4px solid #8b7355",
                borderTop: "6px solid #a68c69",
                borderBottom: "6px solid #5d4037",
                borderRadius: "8px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,214,10,0.1)",
                padding: "24px 32px",
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                minHeight: 180,
                backdropFilter: "blur(10px)",
            }}>
                {/* Character portrait */}
                <div style={{
                    flexShrink: 0,
                    width: 120,
                    height: 120,
                    border: "4px solid #5d4037",
                    borderRadius: "4px",
                    background: "radial-gradient(circle, #2a2a3a 0%, #1a1a1a 100%)",
                    boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,214,10,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Subtle portrait glow behind Baba */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "radial-gradient(circle at center, rgba(255,214,10,0.15) 0%, transparent 60%)",
                        animation: "pulseGlow 3s infinite",
                    }} />
                    <img
                        src={characterPortrait}
                        alt={characterName}
                        style={{
                            width: "100%",
                            height: "100%",
                            imageRendering: "pixelated",
                            objectFit: "contain",
                            position: "relative",
                            zIndex: 1,
                            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
                        }}
                    />
                </div>

                {/* Text area */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Nameplate */}
                    <div style={{
                        alignSelf: "flex-start",
                        background: "linear-gradient(90deg, #4a3a2a 0%, #2a1a0a 100%)",
                        border: "2px solid #a68c69",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
                    }}>
                        <p style={{
                            fontSize: 12,
                            color: "#ffd60a",
                            letterSpacing: 2,
                            margin: 0,
                            textShadow: "2px 2px 0 #000, 0 0 10px rgba(255,214,10,0.5)",
                        }}>
                            {characterName.toUpperCase()}
                        </p>
                    </div>

                    {/* Dialogue text */}
                    <p style={{
                        fontSize: 16,
                        color: "#f8f4e6",
                        lineHeight: 1.8,
                        letterSpacing: 1,
                        margin: 0,
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                        minHeight: "3em",
                    }}>
                        {displayedText}
                        {isTyping && (
                            <span style={{
                                animation: "blink 0.7s step-end infinite",
                                color: "#ffd60a",
                                marginLeft: 8,
                            }}>█</span>
                        )}
                    </p>

                    {/* Click hint */}
                    {!isTyping && (
                        <p style={{
                            fontSize: 10,
                            color: "#a68c69",
                            letterSpacing: 2,
                            marginTop: "auto",
                            textAlign: "right",
                            animation: "blink 1.5s infinite",
                            textShadow: "1px 1px 0 #000",
                        }}>
                            [CLICK TO {currentMessageIndex < messages.length - 1 ? "CONTINUE" : "CLOSE"}]
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
