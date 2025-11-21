import * as Phaser from "phaser";
import { IntroRoom } from "../rooms/IntroRoom";
import {Room1} from "../rooms/Room1";

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

  scene: [IntroRoom,Room1], // ✅ Add your scenes here as you create them
};


export default config;