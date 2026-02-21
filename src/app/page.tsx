"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import MagnifyingGlass from "@/components/MagnifyingGlass";
import Room from "@/components/Room";
import WinScreen from "@/components/WinScreen";
import Timer from "@/components/Timer";
import IntroCinematic from "@/components/IntroCinematic";
import AudioManager from "@/components/AudioManager";
import { playSfx } from "@/utils/sfx";

const BG_MUSIC = "/assets/pixel_daydream.mp3";

// ── Blinking tiny star dots scattered across the BG ──────────────────────────
const BLINK_STARS = [
  { top: "5%", left: "8%", size: 3, anim: "star-blink", dur: "2.1s", delay: "0s" },
  { top: "9%", left: "22%", size: 2, anim: "star-blink-2", dur: "3.4s", delay: "0.7s" },
  { top: "3%", left: "40%", size: 4, anim: "star-blink-3", dur: "2.8s", delay: "1.2s" },
  { top: "7%", left: "62%", size: 2, anim: "star-blink", dur: "3.1s", delay: "0.4s" },
  { top: "4%", left: "80%", size: 3, anim: "star-blink-2", dur: "2.3s", delay: "1.8s" },
  { top: "15%", left: "5%", size: 2, anim: "star-blink-3", dur: "4.0s", delay: "0.2s" },
  { top: "18%", left: "30%", size: 3, anim: "star-blink", dur: "2.6s", delay: "2.1s" },
  { top: "12%", left: "55%", size: 4, anim: "star-blink-2", dur: "3.8s", delay: "0.9s" },
  { top: "20%", left: "75%", size: 2, anim: "star-blink-3", dur: "2.2s", delay: "1.5s" },
  { top: "22%", left: "90%", size: 3, anim: "star-blink", dur: "3.5s", delay: "0.3s" },
  { top: "30%", left: "2%", size: 2, anim: "star-blink-2", dur: "2.9s", delay: "1.1s" },
  { top: "35%", left: "15%", size: 3, anim: "star-blink-3", dur: "3.2s", delay: "2.5s" },
  { top: "28%", left: "45%", size: 4, anim: "star-blink", dur: "2.0s", delay: "0.6s" },
  { top: "33%", left: "68%", size: 2, anim: "star-blink-2", dur: "3.6s", delay: "1.7s" },
  { top: "38%", left: "88%", size: 3, anim: "star-blink-3", dur: "2.4s", delay: "0.8s" },
  { top: "48%", left: "6%", size: 2, anim: "star-blink", dur: "3.0s", delay: "2.0s" },
  { top: "52%", left: "25%", size: 4, anim: "star-blink-2", dur: "2.7s", delay: "0.5s" },
  { top: "45%", left: "72%", size: 3, anim: "star-blink-3", dur: "3.3s", delay: "1.3s" },
  { top: "55%", left: "92%", size: 2, anim: "star-blink", dur: "2.5s", delay: "1.9s" },
  { top: "62%", left: "3%", size: 3, anim: "star-blink-2", dur: "3.7s", delay: "0.1s" },
  { top: "68%", left: "18%", size: 2, anim: "star-blink-3", dur: "2.1s", delay: "2.3s" },
  { top: "65%", left: "50%", size: 4, anim: "star-blink", dur: "3.4s", delay: "0.7s" },
  { top: "72%", left: "78%", size: 2, anim: "star-blink-2", dur: "2.8s", delay: "1.4s" },
  { top: "75%", left: "95%", size: 3, anim: "star-blink-3", dur: "3.1s", delay: "0.2s" },
  { top: "82%", left: "8%", size: 2, anim: "star-blink", dur: "2.3s", delay: "1.6s" },
  { top: "85%", left: "38%", size: 3, anim: "star-blink-2", dur: "3.9s", delay: "0.9s" },
  { top: "80%", left: "60%", size: 4, anim: "star-blink-3", dur: "2.6s", delay: "2.2s" },
  { top: "88%", left: "82%", size: 2, anim: "star-blink", dur: "3.2s", delay: "0.4s" },
  { top: "93%", left: "12%", size: 3, anim: "star-blink-2", dur: "2.0s", delay: "1.0s" },
  { top: "90%", left: "48%", size: 2, anim: "star-blink-3", dur: "3.5s", delay: "1.8s" },
];

export function BlinkingStarField() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {BLINK_STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            borderRadius: "50%",
            background: i % 3 === 0 ? "#ffd60a" : i % 3 === 1 ? "#9fdeef" : "#ffffff",
            boxShadow: i % 3 === 0
              ? `0 0 ${s.size * 2}px #ffd60a`
              : i % 3 === 1
                ? `0 0 ${s.size * 2}px #9fdeef`
                : `0 0 ${s.size * 2}px #ffffff88`,
            animation: `${s.anim} ${s.dur} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Shooting stars ────────────────────────────────────────────────────────────
const SHOOTING_STARS = [
  { top: "8%", left: "5%", delay: "0s", dur: "3.5s", color: "#ffd60a", angle: "30deg" },
  { top: "20%", right: "10%", delay: "4.2s", dur: "2.8s", color: "#9fdeef", angle: "150deg" },
  { top: "5%", left: "60%", delay: "8.0s", dur: "3.2s", color: "#ffffff", angle: "-20deg" },
  { top: "14%", right: "5%", delay: "2.1s", dur: "4.0s", color: "#a855f7", angle: "210deg" },
  { top: "30%", left: "10%", delay: "5.5s", dur: "3.8s", color: "#06d6a0", angle: "-45deg" },
];

export function ShootingStars() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {SHOOTING_STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top, left: (s as any).left, right: (s as any).right,
            transform: `rotate(${s.angle})`,
          }}
        >
          <div
            style={{
              width: 70, height: 2,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${s.color}, transparent)`,
              boxShadow: `0 0 6px ${s.color}, 0 0 12px ${s.color}88`,
              opacity: 0,
              animation: `shoot ${s.dur} ${s.delay} ease-out infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Rising particles ──────────────────────────────────────────────────────────
const PARTICLES = [
  { left: "4%", size: 4, color: "#ffd60a", delay: "0s", dur: "7s" },
  { left: "12%", size: 3, color: "#f4a261", delay: "1.5s", dur: "10s" },
  { left: "20%", size: 5, color: "#ffeedd", delay: "0.7s", dur: "8s" },
  { left: "29%", size: 3, color: "#ffd60a", delay: "2.2s", dur: "11s" },
  { left: "38%", size: 4, color: "#f4a261", delay: "0.4s", dur: "9s" },
  { left: "47%", size: 3, color: "#ffeedd", delay: "1.1s", dur: "7.5s" },
  { left: "56%", size: 5, color: "#ffd60a", delay: "3s", dur: "9.5s" },
  { left: "65%", size: 3, color: "#f4a261", delay: "0.3s", dur: "8.5s" },
  { left: "74%", size: 4, color: "#ffeedd", delay: "1.8s", dur: "6.5s" },
  { left: "83%", size: 3, color: "#ffd60a", delay: "2.6s", dur: "10.5s" },
  { left: "91%", size: 5, color: "#f4a261", delay: "0.9s", dur: "7s" },
  { left: "97%", size: 3, color: "#ffeedd", delay: "1.4s", dur: "9s" },
];

function ParticleBg() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.left, bottom: "0",
          width: p.size, height: p.size, borderRadius: "50%",
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}88`,
          animation: `particle-rise-${(i % 3) + 1} ${p.dur} ${p.delay} ease-in infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Floating edge decorations (book, moon, bottle only) ───────────────────────
function FloatingAssets() {
  const assets = [
    { src: "/assets/moon.svg", top: "8%", right: "4%", size: 52, dur: "7s", delay: "1.2s", opacity: 0.28, rotate: 10 },
    { src: "/assets/book.svg", bottom: "20%", left: "2%", size: 50, dur: "6s", delay: "0.5s", opacity: 0.25, rotate: 8 },
    { src: "/assets/Glass-bottle.svg", bottom: "16%", right: "3%", size: 42, dur: "8s", delay: "2s", opacity: 0.28, rotate: -5 },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {assets.map((a, i) => (
        <div key={i} style={{
          position: "absolute",
          top: (a as any).top,
          bottom: (a as any).bottom,
          left: (a as any).left,
          right: (a as any).right,
          width: a.size, height: a.size,
          opacity: a.opacity,
          animation: `float-pixel ${a.dur} ease-in-out infinite`,
          animationDelay: a.delay,
          transform: `rotate(${a.rotate}deg)`,
          filter: "brightness(0.85) saturate(0.6)",
        }}>
          <img src={a.src} width={a.size} height={a.size}
            style={{ imageRendering: "pixelated", width: "100%", height: "100%" }} />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function RetroBox({ children, style, className }: any) {
  return (
    <div className={className} style={{
      background: "#2d3540",
      border: "6px solid #d4c29c",
      outline: "4px solid #15181d",
      borderRadius: "2px",
      boxShadow: "inset 0 0 20px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.9)",
      position: "relative",
      padding: "16px",
      ...style
    }}>
      {/* Corner Ornaments */}
      <div style={{ position: "absolute", top: -3, left: -3, width: 16, height: 16, background: "#8b7e65" }} />
      <div style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, background: "#8b7e65" }} />
      <div style={{ position: "absolute", bottom: -3, left: -3, width: 16, height: 16, background: "#8b7e65" }} />
      <div style={{ position: "absolute", bottom: -3, right: -3, width: 16, height: 16, background: "#8b7e65" }} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GamePage() {
  const { phase, playerName, startGame } = useGameStore();
  const [glassEnabled, setGlassEnabled] = useState(true);
  const [showCinematic, setShowCinematic] = useState(false);

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro" && !showCinematic) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#080c12", // Very dark blue/grey base
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Press Start 2P', monospace",
        padding: "16px",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        {/* Panning room BG */}
        <div style={{
          position: "fixed", inset: 0,
          backgroundImage: "url('/assets/room1.svg')",
          backgroundSize: "120%", backgroundPosition: "0% 50%",
          filter: "brightness(0.2) sepia(0.3) blur(3px)",
          animation: "pan-bg 60s ease-in-out infinite alternate",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Twinkling star field (reused as dust motes) */}
        <BlinkingStarField />

        {/* Particles (reused as rising embers) */}
        <ParticleBg />

        {/* Vignette */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.9) 100%)",
        }} />

        {/* ─── MAIN CONTENT ─── */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", width: "100%", maxWidth: 640,
          transform: "scale(0.8) translateY(-4%)", // Scale down to fit and pull up
          transformOrigin: "center center",
        }}>

          {/* ── TITLE BLOCK ── */}
          <RetroBox style={{ width: "100%", marginBottom: 16, textAlign: "center", animation: "slideDownFade 0.8s ease-out" }}>
            {/* Character — bottom-right corner slightly popping out */}
            <div style={{
              position: "absolute", bottom: -8, right: 24,
              width: 72, height: 72,
              animation: "float-pixel 3s ease-in-out infinite",
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.8))",
              zIndex: 2,
            }}>
              <img src="/assets/Character-front.svg" alt="Traveler" width={72} height={72}
                style={{ imageRendering: "pixelated" }} />
            </div>

            <h1 style={{
              fontSize: 28, color: "#ffd60a",
              textShadow: "4px 4px 0 #7a6000, 0 0 30px #ffd60a",
              marginBottom: 6, letterSpacing: 4, lineHeight: 1.3,
            }}>POLYGLOT</h1>
            <h1 style={{
              fontSize: 36, color: "#e63946",
              textShadow: "4px 4px 0 #8b0000, 0 0 40px #e63946",
              marginBottom: 10, letterSpacing: 6,
            }}>ESCAPE</h1>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <img src="/assets/star.svg" width={12} height={12} style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 4px #ffd60a)" }} />
              <p style={{ color: "#d4c29c", fontSize: 10, letterSpacing: 4, textShadow: "2px 2px 0 #000" }}>LINGO.DEV ADVENTURE</p>
              <img src="/assets/star.svg" width={12} height={12} style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 4px #ffd60a)" }} />
            </div>
          </RetroBox>

          {/* ── MISSION BRIEFING ── */}
          <RetroBox style={{ width: "100%", marginBottom: 12, padding: "16px 20px", animation: "slideUpFade 0.8s ease-out 0.2s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <img src="/assets/book.svg" width={24} height={24}
                style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 8px #d4c29c)" }} />
              <p style={{ color: "#ffd60a", fontSize: 12, letterSpacing: 4, textShadow: "2px 2px 0 #000" }}>MISSION BRIEFING</p>
            </div>
            {[
              "YOU ARE TRAPPED IN THE LINGUIST'S STUDY.",
              "EVERY CLUE IS IN A FOREIGN LANGUAGE.",
              "YOUR WEAPON: A MAGIC MAGNIFYING GLASS!",
            ].map((line, i) => (
              <p key={i} style={{
                color: "#f8f9fa", fontSize: 10, lineHeight: 2.5, paddingLeft: 12,
                borderLeft: "4px solid #d4c29c", marginBottom: 8, textShadow: "2px 2px 0 #000"
              }}>{line}</p>
            ))}
          </RetroBox>

          {/* ── HOW TO PLAY ── */}
          <RetroBox style={{ width: "100%", marginBottom: 16, padding: "16px 20px", animation: "slideUpFade 0.8s ease-out 0.4s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <img src="/assets/magnifying-glass.svg" width={24} height={24}
                style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 8px #06d6a0)" }} />
              <p style={{ color: "#06d6a0", fontSize: 12, letterSpacing: 4, textShadow: "2px 2px 0 #000" }}>HOW TO PLAY</p>
            </div>
            {[
              { iconSrc: "/assets/magnifying-glass.svg", text: "HOVER TEXT → TRANSLATE IT" },
              { iconSrc: "/assets/lock.svg", text: "SOLVE 3 PUZZLES TO ESCAPE" },
              { iconSrc: "/assets/star.svg", text: "FASTEST TIME WINS" },
            ].map(({ iconSrc, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <img src={iconSrc} width={20} height={20}
                  style={{
                    imageRendering: "pixelated",
                    filter: "drop-shadow(0 0 6px #06d6a0)", flexShrink: 0
                  }} />
                <p style={{ color: "#b8f5d8", fontSize: 10, lineHeight: 1.8, textShadow: "2px 2px 0 #000" }}>{text}</p>
              </div>
            ))}
          </RetroBox>

          {/* ── START BUTTON ── */}
          <button
            onClick={() => {
              playSfx("click");
              setShowCinematic(true);
            }}
            className="pixel-btn pixel-btn-green"
            style={{
              fontSize: 14, padding: "16px 32px", width: "100%", marginBottom: 12,
              animation: "pulseGlowEpic 2s infinite, slideUpFade 0.8s ease-out 0.6s both, buttonHover 0.3s ease",
              boxShadow: "0 0 40px #06d6a066, 8px 8px 0 #002211",
              letterSpacing: 4,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <img src="/assets/magnifying-glass.svg" width={24} height={24}
                style={{ imageRendering: "pixelated", filter: "invert(1) brightness(0.3)" }} />
              ► START ADVENTURE
            </span>
          </button>

          {/* Skip button styled like a dark UI button */}
          <button
            onClick={() => {
              playSfx("click");
              startGame();
            }}
            className="pixel-btn pixel-btn-blue"
            style={{
              fontSize: 10, padding: "12px 20px", width: "100%",
              boxShadow: "0 0 20px #118ab266, 6px 6px 0 #053b4d",
              letterSpacing: 3,
            }}
          >
            SKIP INTRO → PLAY NOW
          </button>

          {/* Footer */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, opacity: 0.6 }}>
            <img src="/assets/moon.svg" width={16} height={18}
              style={{ imageRendering: "pixelated" }} />
            <p style={{ color: "#8b7e65", fontSize: 8, letterSpacing: 4, textShadow: "1px 1px 0 #000" }}>© LINGO.DEV HACKATHON 2026</p>
            <img src="/assets/moon.svg" width={16} height={18}
              style={{ imageRendering: "pixelated", transform: "scaleX(-1)" }} />
          </div>
        </div>
      </main>
    );
  }

  // ── CINEMATIC ──────────────────────────────────────────────────────────────
  if (showCinematic && phase === "intro") {
    return (
      <>
        <AudioManager src={BG_MUSIC} autoPlay />
        <IntroCinematic onFinish={() => { setShowCinematic(false); startGame(); }} />
      </>
    );
  }

  // ── WIN SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "complete") return (
    <>
      <AudioManager src={BG_MUSIC} autoPlay />
      <WinScreen />
    </>
  );

  // ── PLAYING ────────────────────────────────────────────────────────────────
  return (
    <main className="scanlines" style={{ cursor: "none", height: "100vh", overflow: "hidden" }}>
      <AudioManager src={BG_MUSIC} autoPlay />

      {/* PIXEL HUD */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 52,
        background: "#0f0f0f", borderBottom: "4px solid #ffd60a",
        boxShadow: "0 4px 0 0 #b8970a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", zIndex: 200,
        fontFamily: "'Press Start 2P', monospace",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/assets/magnifying-glass.svg" width={18} height={18}
            style={{ imageRendering: "pixelated", filter: "brightness(2) sepia(1) saturate(4) hue-rotate(5deg)" }} />
          <span style={{ color: "#ffd60a", fontSize: 10 }}>P-ESCAPE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Timer />
          <AudioManager src={BG_MUSIC} autoPlay={false} />
          <button
            onClick={() => setGlassEnabled((v) => !v)}
            className={`pixel-btn ${glassEnabled ? "pixel-btn-yellow" : "pixel-btn-disabled"}`}
            style={{ fontSize: 7, padding: "6px 10px" }}
          >
            {glassEnabled ? "GLASS:ON" : "GLASS:OFF"}
          </button>
          <span style={{ color: "#06d6a0", fontSize: 8 }}>{playerName.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ paddingTop: 52 }}>
        <Room />
      </div>

      <MagnifyingGlass enabled={glassEnabled} />
    </main>
  );
}
