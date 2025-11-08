"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import bg from './../../../game-interface/assets/images/background.png'




const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

interface Level {
  _id: string
  name: string
  description: string
  xpReward: number
  isLocked: boolean
  order: number
  totalQuestions: number
}

export default function GameCanvas() {
    
 const[ levels, setLevels] = useState<Level[]>([])

     useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`${API_BASE}/levels/levels`)
        const data = await res.json()
        const sorted = data.sort((a: Level, b: Level) => a.order - b.order)
        setLevels(sorted)
      } catch (err) {
        console.error("Error fetching levels:", err)
      }
    }
    fetchLevels()
  }, [API_BASE]) 
  
  const gameRef = useRef<Phaser.Game | null>(null);




  useEffect(() => {
    class LevelSelectScene extends Phaser.Scene {
      constructor() {
        super("LevelSelectScene");
      }

      preload() {
        this.load.image("background", bg.src);
      }

      create() {
        const { width, height } = this.scale;

        // Background
        this.add.image(width / 2, height / 2, "background")
          .setOrigin(0.5)
          .setDisplaySize(width, height);

       

        // Level squares configuration
        const totalLevels = 5; // change to however many levels you have
        const cols = 5; 
        const spacingX = 200;
        const spacingY = 75;
        const startX = width / 2 - ((cols - 1) * spacingX) / 2;
        const startY = height / 2 - spacingY;

        for (let i = 0; i < totalLevels; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);

          const x = startX + col * spacingX;
          const y = startY + row * spacingY;

          // Level square (magical tile)
          const square = this.add.rectangle(x, y, 100, 100, 0x7E4B2A)
            
            .setInteractive({ useHandCursor: true })
            .on("pointerover", () => {
              square.setFillStyle(0x7E4B2B);
            })
            .on("pointerout", () => {
              square.setFillStyle(0x7E4B2A);
            })
            .on("pointerdown", () => {
              // For example, redirect to a specific level scene
              const levelNumber = i + 1;
              console.log(`Starting Level ${levelNumber}`);
              this.scene.start('Scene2');
            });

          // Level number text
          this.add.text(x, y, `${i + 1}`, {
            font: "48px Arial",
            color: "#ffffff",
            fontStyle: "bold",
          }).setOrigin(0.5);
        }

        
      }
    }

    // Dummy Level scene example
    class Level1Scene extends Phaser.Scene {
      constructor() {
        super("Level1Scene");
      }

      create() {
        this.add.text(100, 100, "Welcome to Level 1!", {
          font: "32px Arial",
          color: "#ffffff",
        });
      }
    }

    // Config
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-container",
      scene: [LevelSelectScene, Level1Scene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="phaser-container" className="w-full h-screen" />;
}
