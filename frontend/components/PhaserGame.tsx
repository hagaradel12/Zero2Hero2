"use client";
import { useEffect, useRef } from "react";

interface PhaserGameProps {
  startScene?: string;
}

export default function PhaserGame({ startScene = "IntroScene" }: PhaserGameProps) {
  const gameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ✅ Prevent creating multiple game instances
    if (gameRef.current) return;

    const initPhaser = async () => {
      const Phaser = await import("phaser");
      const configModule = await import("../game-interface/config/gameConfig");
      const config = { ...configModule.default }; // Clone config

      // // ✅ Always load ALL scenes, let state manager decide which to start
      // const { IntroScene } = await import("../game-interface/scenes/IntroScene");
      // const { Scene1 } = await import("../game-interface/scenes/scene1");
      // // Import other scenes as needed...

      // config.scene = [IntroScene, Scene1];

      config.parent = "phaser-container";

      // Create Phaser game
      gameRef.current = new Phaser.Game(config);
      
      console.log('🎮 Phaser game initialized with scene:', startScene);
    };

    initPhaser();

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        console.log('🗑️ Destroying Phaser game instance');
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []); // Empty dependency - only run once

  return <div ref={containerRef} id="phaser-container" className="w-full h-full" />;
}