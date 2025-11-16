import * as Phaser from "phaser";
import { IntroScene } from "../scenes/IntroScene.js";
import { Scene1 } from "../scenes/scene1.js";
import { Scene2 } from "../scenes/scene2.js";
import {Scene3} from '../scenes/scene3.js'
import {Scene4} from '../scenes/scene4.js'
// ✅ Import all your scenes here as you add them

const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  scale: {
    mode: Phaser.Scale.ENVELOP,  // ✅ fills whole area (might crop slightly)
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  render: { pixelArt: true },
  physics: { 
    default: "arcade", 
    arcade: { gravity: { x:0,y: 0 }, debug: false } 
  },
  scene: [IntroScene, Scene1, Scene2, Scene3, Scene4], // ✅ Add your scenes here as you create them
};


export default config;