"use client";
import { useEffect } from "react";

interface PhaserGameProps {
  startScene?: string;
}

export default function PhaserGame({ startScene = "IntroScene" }: PhaserGameProps) {
  useEffect(() => {
    let game: any;

    const initPhaser = async () => {
      const Phaser = await import("phaser");
      const configModule = await import("../game-interface/config/gameConfig");
      const config = configModule.default;

      // ✅ Correct dynamic import from scenes folder
      const sceneClass = await import(`../game-interface/scenes/${startScene}`).then(
        (mod) => mod[startScene]
      );

      // Add the scene class to config
      config.scene = [sceneClass];

      // Create Phaser game
      game = new Phaser.Game(config);
    };

    initPhaser();

    return () => {
      if (game) game.destroy(true);
    };
  }, [startScene]);

  return <div id="phaser-container" className="w-full h-full" />;
}
