import IntroScene from "../scenes/introScene";


export const gameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 1280,
  height: 720,
  backgroundColor: "#000",
  scene: [Scene2, IntroScene],
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};
