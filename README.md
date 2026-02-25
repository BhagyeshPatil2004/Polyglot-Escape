<div align="center">

# 🕵️‍♂️ Polyglot Escape

**A Multilingual Escape Room where Translation is your only weapon.**

[![Built for Lingo.dev](https://img.shields.io/badge/Powered%20By-Lingo.dev-0a0a0a?style=for-the-badge&logo=vercel)](https://lingo.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)

*Built for the Lingo.dev Hackathon 2026*

</div>

---

## � Screenshots

<img width="1919" height="927" alt="Screenshot 2026-02-21 220036" src="https://github.com/user-attachments/assets/8cd60c7e-696c-4d06-9806-c6d7ac92adbd" />

<img width="1919" height="928" alt="Screenshot 2026-02-21 220106" src="https://github.com/user-attachments/assets/e6f88f72-9ffa-491d-954d-2ccd28c1d8db" />

<img width="1919" height="929" alt="Screenshot 2026-02-21 220146" src="https://github.com/user-attachments/assets/453d593c-73c7-4e8b-8ddd-4971c7545656" />


## �📖 The Story

You awaken in the abandoned study of an ancient linguist. The door is locked, and the room is filled with cryptic clues: scorched diaries, cryptic murals, and strange chemical formulas. The catch? **Every clue is written in a different language.**

You are armed with a single tool: a **Magic Magnifying Glass**.

Hover your glass over any foreign text in the room to reveal its hidden meaning in real-time. Gather the translated clues, solve three distinct puzzles, and escape before the time runs out!

---

## 🌟 Why the Lingo.dev Integration Matters

### 1. The Magic Magnifying Glass (React SDK)
The core gameplay loops relies on the `@lingo.dev/sdk-react`. 
When the player hovers their cursor (styled as a magnifying glass) over decorative elements in the Stardew Valley-inspired world, we intercept the text and language tags (`data-clue="Güneş önce gelir" data-lang="Turkish"`). We then dynamically ping the translation engine to decode the text in real-time, displaying a beautiful UI tooltip.

### 2. Type-Safe UI Dictionaries (Lingo Compiler)
The game's actual user interface (Start Adventure buttons, Mission Briefings, Win Screens) isn't hardcoded. We use the Lingo.dev Compiler (`lingo.config.ts`) to generate type-safe dictionaries from our `src/locales/en.json`, ensuring our own UI is fully localizable.

### 3. Automated Translation (Lingo CLI & CI/CD)
Using the Lingo.dev CLI, our base strings are automatically translated into 10 different languages on every PR via our GitHub Actions workflow (`.github/workflows/lingo.yml`).

---

## 🎮 The Puzzles

Can you beat the escape room? You will encounter 8 different languages across 3 distinct puzzles:

| Puzzle | Translating From | The Challenge |
|--------|-----------------|---------------|
| **🔒 The Vault** | Japanese 🇯🇵, Arabic 🇸🇦 | Translate the linguist's scorch notes to deduce the 4-digit combination. |
| **⚗️ The Laboratory** | German 🇩🇪, Korean 🇰🇷, Russian 🇷🇺 | Read the foreign Warning Labels to mix the correct chemical antidote. |
| **🚪 The Final Door** | Latin 🏛️, Swahili 🇰🇪, Turkish 🇹🇷 | Decode the cryptic murals to press the ceremonial buttons in the correct sequence. |

---

## 🎨 Features & Polish

* **Chunky RPG Aesthetic:** A fully custom, Stardew Valley-inspired visual overhaul. Zero generic UI libraries. Everything from buttons, to dialogue boxes, to the win screen uses a consistent, custom CSS ruleset (`globals.css`) and `Press Start 2P` typography.
* **Cinematic Camera:** Sweeping CSS transforms and blurred backgrounds create an atmospheric intro sequence.
* **Interactive Top-Down Navigation:** Use WASD or click-to-move to navigate the Traveler around the cluttered study.
* **Intelligent Zone Detection:** The game tracks your spatial coordinates to trigger precise interaction prompts (`[E] WALL INSCRIPTION`) only when you are close to specific objects.
* **Dynamic Audio & VFX:** Floating particle dust, shooting stars, and one-shot sound effects for UI clicks and item pickups.
* **Stats Tracking:** At the end of the run, you are graded (S through C Rank) based on your speed and the number of words decoded.

---

## 🚀 Run it Locally

Ready to try and escape?

```bash
# Clone the repo
git clone https://github.com/yourusername/polyglot-escape.git
cd polyglot-escape

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **START ADVENTURE**.

---

## 🏗️ Architecture

We designed a robust system where Lingo.dev sits at the center of the gameplay loop, intercepting user interactions and injecting real-time translations onto the canvas.

```mermaid
graph TD
    %% Styling
    classDef lingo fill:#0a0a0a,stroke:#333,stroke-width:2px,color:#fff
    classDef ui fill:#1e0e00,stroke:#8b5a2b,stroke-width:2px,color:#ffd60a
    classDef dev fill:#118ab2,stroke:#095b77,stroke-width:2px,color:#fff
    classDef engine fill:#06d6a0,stroke:#049b73,stroke-width:2px,color:#000

    %% Nodes
    User(("Player 🧑‍💻"))
    NextJS["Next.js App Server"]:::ui
    
    subgraph "Client App UI"
        LandingPage["Landing.tsx"]:::ui
        GameScene["GameScene.tsx (RPG Engine)"]:::ui
        MagnifyingGlass["🔍 MagnifyingGlass.tsx"]:::ui
        WinScreen["WinScreen.tsx"]:::ui
    end
    
    subgraph "State & Data"
        Zustand[("Zustand GameStore\n(Time, Inventory, Stats)")]:::engine
        Locales["/data/rooms.ts\n(Foreign Clue Strings)"]:::engine
    end

    subgraph "Lingo.dev Ecosystem"
        LingoSDK["@lingo.dev/sdk-react"]:::lingo
        LingoCompiler["lingo.config.ts\n(UI Dictionaries)"]:::lingo
        LingoCLI["Lingo CLI / CI/CD"]:::lingo
    end

    %% Connections
    User -- "1. Starts Game" --> LandingPage
    LandingPage -- "Routes to" --> GameScene
    GameScene -- "Renders" --> Locales
    GameScene -- "Updates Stats" --> Zustand
    
    User -- "2. Moves Mouse Over Clue" --> MagnifyingGlass
    MagnifyingGlass -- "3. Extracts 'data-clue'" --> LingoSDK
    LingoSDK -- "4. Real-time translation lookup" --> LingoSDK
    LingoSDK -- "5. Returns English" --> MagnifyingGlass
    MagnifyingGlass -- "Updates Transl. Count" --> Zustand
    
    GameScene -- "6. Player Escapes" --> WinScreen
    Zustand -- "Reads Stats" --> WinScreen
    
    LingoCompiler -. "Build-time Translation" .-> LandingPage
    LingoCLI -. "Auto-translates en.json" .-> LingoCompiler
```

---
*Escape the room. Decode the world. Built for the Lingo.dev Hackathon.*
