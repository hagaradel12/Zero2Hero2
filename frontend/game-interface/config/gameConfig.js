import * as Phaser from "phaser";
import { IntroScene } from "../scenes/IntroScene";
import {Scene1} from "../scenes/scene2";
const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  width: 1280,
  height: 720,
  physics: {
    default: "arcade",
    arcade: { gravity: {x:0 ,y: 0 }, debug: false },
  },
  scene: [IntroScene, Scene1],
};

export default config;
