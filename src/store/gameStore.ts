import { create } from "zustand";

export type GamePhase = "intro" | "playing" | "complete";

export interface JournalEntry {
    original: string;   // the foreign word/phrase
    language: string;   // e.g. "Japanese"
    translated: string; // English result
    timestamp: number;  // Date.now()
}

interface GameStore {
    playerName: string;
    phase: GamePhase;
    currentPuzzle: number; // 1, 2, 3
    solvedPuzzles: number[];
    startTime: number | null;
    endTime: number | null;
    // Puzzle 2 state: which bottles were clicked
    selectedBottles: string[];

    // Inventory system
    inventory: string[];
    addToInventory: (item: string) => void;

    // Translation tracking (for HUD counter + WinScreen flags)
    translationCount: number;
    seenLanguages: string[];
    trackTranslation: (lang: string) => void;

    // Translation Journal — log every unique word translated
    journal: JournalEntry[];
    addToJournal: (entry: JournalEntry) => void;

    // Pause state
    isPaused: boolean;
    setPaused: (v: boolean) => void;

    setPlayerName: (name: string) => void;
    startGame: () => void;
    solvePuzzle: (puzzleId: number) => void;
    finishGame: () => void;
    toggleBottle: (bottleId: string) => void;
    resetBottles: () => void;
    getElapsedSeconds: () => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
    playerName: "",
    phase: "intro",
    currentPuzzle: 1,
    solvedPuzzles: [],
    startTime: null,
    endTime: null,
    selectedBottles: [],
    inventory: [],
    translationCount: 0,
    seenLanguages: [],
    journal: [],
    isPaused: false,

    setPlayerName: (name) => set({ playerName: name }),

    startGame: () =>
        set({ phase: "playing", startTime: Date.now(), currentPuzzle: 1, solvedPuzzles: [], inventory: [], translationCount: 0, seenLanguages: [], journal: [] }),

    solvePuzzle: (puzzleId) => {
        const { solvedPuzzles } = get();
        if (solvedPuzzles.includes(puzzleId)) return;
        const next = [...solvedPuzzles, puzzleId];
        const nextPuzzle = puzzleId < 3 ? puzzleId + 1 : 3;
        set({ solvedPuzzles: next, currentPuzzle: nextPuzzle });
    },

    addToInventory: (item) => {
        const { inventory } = get();
        if (!inventory.includes(item)) {
            set({ inventory: [...inventory, item] });
        }
    },

    trackTranslation: (lang) => {
        const { seenLanguages, translationCount } = get();
        set({
            translationCount: translationCount + 1,
            seenLanguages: seenLanguages.includes(lang) ? seenLanguages : [...seenLanguages, lang],
        });
    },

    addToJournal: (entry) => {
        const { journal } = get();
        // Deduplicate by original text — same word only logged once
        if (journal.some(j => j.original === entry.original)) return;
        set({ journal: [...journal, entry] });
    },

    setPaused: (v) => set({ isPaused: v }),

    finishGame: () => set({ phase: "complete", endTime: Date.now() }),

    toggleBottle: (bottleId) => {
        const { selectedBottles } = get();
        if (selectedBottles.includes(bottleId)) {
            set({ selectedBottles: selectedBottles.filter((b) => b !== bottleId) });
        } else {
            set({ selectedBottles: [...selectedBottles, bottleId] });
        }
    },

    resetBottles: () => set({ selectedBottles: [] }),

    getElapsedSeconds: () => {
        const { startTime, endTime } = get();
        if (!startTime) return 0;
        const end = endTime ?? Date.now();
        return Math.floor((end - startTime) / 1000);
    },
}));
