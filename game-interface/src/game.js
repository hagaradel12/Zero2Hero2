import { IntroScene } from './scenes/IntroScene.js'
import { Scene1 } from './scenes/scene1.js'


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  scene: [IntroScene, Scene1],
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  }
}

const game = new Phaser.Game(config)

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight)
})
