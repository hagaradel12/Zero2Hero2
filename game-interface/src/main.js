import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

function preload() {
  this.load.image('logo', 'https://labs.phaser.io/assets/sprites/phaser3-logo.png');
}

function create() {
  const logo = this.add.image(400, 300, 'logo');
  this.tweens.add({
    targets: logo,
    y: 500,
    duration: 1500,
    yoyo: true,
    repeat: -1
  });
}

function update() {}
