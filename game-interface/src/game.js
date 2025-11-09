// import { IntroScene } from './scenes/IntroScene.js'
// import { Scene1 } from './scenes/scene1.js'


// const config = {
//   type: Phaser.AUTO,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   parent: 'game-container',
//   scene: [Scene1],
//   backgroundColor: '#000000',
//   scale: {
//     mode: Phaser.Scale.RESIZE,
//     autoCenter: Phaser.Scale.CENTER_BOTH
//   },
//   physics: {
//     default: 'arcade',
//     arcade: { debug: false }
//   }
// }

// const game = new Phaser.Game(config)

// window.addEventListener('resize', () => {
//   game.scale.resize(window.innerWidth, window.innerHeight)
// })



import Phaser from 'phaser';
import { IntroScene } from './scenes/IntroScene';
import { Scene1 } from './scenes/scene1';
// import { Scene2 } from './scenes/Scene2'; // Add your other scenes

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  scene: [IntroScene, Scene1], // Add all your scenes here
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
const game = new Phaser.Game(config);

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const levelParam = urlParams.get("scene");

  const sceneMap = {
    lvl1: "Scene1",
    lvl2: "Scene1",
    lvl3: "Scene2"
  };

  const targetScene = levelParam ? sceneMap[levelParam] : "IntroScene";
  console.log("🚀 Booting scene:", targetScene);
  game.scene.start(targetScene);
});

