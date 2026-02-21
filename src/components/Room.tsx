
import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import GameScene from "./GameScene";

export default function Room() {
    const { solvedPuzzles, currentPuzzle } = useGameStore();

    return (
        <div style={{
            width: "100%",
            height: "calc(100vh - 52px)",
            background: "#1a1008",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
        }}>
            <GameScene />
        </div>
    );
}
