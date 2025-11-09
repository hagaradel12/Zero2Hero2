// import api from '../api/api.js'

// export class IntroScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'IntroScene' })
//     this.startPos = { x: 0.08, y: 0.66 }
//     this.stopPos = { x: 0.15, y: 0.75 }
//   }

//   preload() {
//     this.load.image('intro_bg', '/assets/images/intro2.jpg')
//     this.load.image('character_idle', '/assets/images/characterg1.png')
//     this.load.spritesheet('character_walk', '/assets/images/walk.png', {
//       frameWidth: 185,
//       frameHeight: 200
//     })
//     this.load.image('play_button', '/assets/images/play.png')
//   }

// // In IntroScene
// async create() {
//   try {
//     const res = await api.get('/auth/me'); // Cookies sent automatically
//     console.log('✅ Authenticated:', res.data);
//   } catch (err) {
//     console.error('❌ Not authenticated:', err);
//     // Redirect to login
//     window.location.href = 'http://localhost:3000/login';
//   }


//     const { width, height } = this.scale

//     const bg = this.add.image(0, 0, 'intro_bg').setOrigin(0, 0)
//     bg.setDisplaySize(width, height)

//     const startX = width * this.startPos.x
//     const startY = height * this.startPos.y
//     const stopX = width * this.stopPos.x

//     this.character = this.add.sprite(startX, startY, 'character_walk')
//     this.character.setScale(width / 1280)

//     this.anims.create({
//       key: 'walk',
//       frames: this.anims.generateFrameNumbers('character_walk', { start: 0, end: 7 }),
//       frameRate: 8,
//       repeat: -1
//     })

//     this.character.play('walk')
//     this.tweens.add({
//       targets: this.character,
//       x: stopX,
//       duration: 2000,
//       ease: 'Power2',
//       onComplete: () => {
//         this.time.delayedCall(10, () => {
//           this.character.anims.stop()
//           this.character.setTexture('character_idle')
//           this.showDialog()
//         })
//       }
//     })
//   }

//   showDialog() {
//     const { width, height } = this.scale
//     const dialogBox = this.add.rectangle(width / 2, height * 0.88, width * 0.8, height * 0.12, 0x000000, 0.6)
//     dialogBox.setStrokeStyle(2, 0xffffff)
//     dialogBox.setAlpha(0)

//     const dialogText = this.add
//       .text(width / 2, height * 0.875, '', {
//         fontFamily: 'serif',
//         fontSize: `${Math.round(width * 0.018)}px`,
//         color: '#fff',
//         wordWrap: { width: width * 0.75 },
//         align: 'center'
//       })
//       .setOrigin(0.5)

//     this.tweens.add({
//       targets: dialogBox,
//       alpha: 1,
//       duration: 600,
//       ease: 'Sine.easeIn',
//       onComplete: () => {
//         this.typeText(dialogText, 'Welcome, young apprentice...', () => this.showPlayButton())
//       }
//     })
//   }

//   typeText(textObject, fullText, onComplete) {
//     let i = 0
//     this.time.addEvent({
//       delay: 40,
//       repeat: fullText.length - 1,
//       callback: () => {
//         textObject.text += fullText[i]
//         i++
//         if (i === fullText.length && onComplete) onComplete()
//       }
//     })
//   }

//   showPlayButton() {
//     const { width, height } = this.scale
//     const playButton = this.add.image(width / 2, height / 2, 'play_button').setInteractive().setScale(width / 1800).setAlpha(0)

//     this.tweens.add({ targets: playButton, alpha: 1, duration: 800, ease: 'Sine.easeIn' })

//     playButton.on('pointerdown', () => {
//       playButton.setVisible(false)
//       this.startJourney()
//     })
//   }

//   startJourney() {
//     const { width } = this.scale
//     this.character.setTexture('character_walk')
//     this.character.play('walk')
//     this.tweens.add({
//       targets: this.character,
//       x: width + 200,
//       duration: 3000,
//       ease: 'Linear',
//       onComplete: () => {
//         this.character.anims.stop()
//         this.character.setTexture('character_idle')
//         this.scene.start('Scene1')
//       }
//     })
//   }
// }

// ========================================
// FILE: phaser-game/src/scenes/IntroScene.js
// PURPOSE: Check auth and store user data
// CHANGES: Added authentication check and registry storage
// ========================================

import api from '../api/api.js';

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
    this.startPos = { x: 0.08, y: 0.66 };
    this.stopPos = { x: 0.15, y: 0.75 };
    this.userEmail = null;
  }

  preload() {
    this.load.image('intro_bg', '/assets/image/intro2.jpg');
    this.load.image('character_idle', '/assets/image/characterg1.png');
    this.load.spritesheet('character_walk', '/assets/image/walk.png', {
      frameWidth: 185,
      frameHeight: 200,
    });
    this.load.image('play_button', '/assets/image/play.png');
  }

  async create() {
    // ========================================
    // 🔐 AUTHENTICATION CHECK - NEW CODE
    // ========================================
    try {
      const res = await api.get('/auth/me');
      console.log('✅ Authenticated:', res.data);
      this.userEmail = res.data.email;
      
      // 💾 Store user data in Phaser registry (accessible in all scenes)
      this.registry.set('userEmail', res.data.email);
      this.registry.set('userId', res.data._id);
      this.registry.set('userName', res.data.name);
    } catch (err) {
      console.error('❌ Not authenticated:', err);
      window.location.href = 'http://localhost:3000/login';
      return; // Stop scene creation
    }



    // ========================================

    const { width, height } = this.scale;

    const bg = this.add.image(0, 0, 'intro_bg').setOrigin(0, 0);
    bg.setDisplaySize(width, height);

    const startX = width * this.startPos.x;
    const startY = height * this.startPos.y;
    const stopX = width * this.stopPos.x;

    this.character = this.add.sprite(startX, startY, 'character_walk');
    this.character.setScale(width / 1280);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('character_walk', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.character.play('walk');
    this.tweens.add({
      targets: this.character,
      x: stopX,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(10, () => {
          this.character.anims.stop();
          this.character.setTexture('character_idle');
          this.showDialog();
        });
      },
    });
  }

  showDialog() {
    const { width, height } = this.scale;
    const dialogBox = this.add.rectangle(
      width / 2,
      height * 0.88,
      width * 0.8,
      height * 0.12,
      0x000000,
      0.6
    );
    dialogBox.setStrokeStyle(2, 0xffffff);
    dialogBox.setAlpha(0);

    const dialogText = this.add
      .text(width / 2, height * 0.875, '', {
        fontFamily: 'serif',
        fontSize: `${Math.round(width * 0.018)}px`,
        color: '#fff',
        wordWrap: { width: width * 0.75 },
        align: 'center',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: dialogBox,
      alpha: 1,
      duration: 600,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.typeText(dialogText, 'Welcome, young apprentice...', () =>
          this.showPlayButton()
        );
      },
    });
  }

  typeText(textObject, fullText, onComplete) {
    let i = 0;
    this.time.addEvent({
      delay: 40,
      repeat: fullText.length - 1,
      callback: () => {
        textObject.text += fullText[i];
        i++;
        if (i === fullText.length && onComplete) onComplete();
      },
    });
  }

  showPlayButton() {
    const { width, height } = this.scale;
    const playButton = this.add
      .image(width / 2, height / 2, 'play_button')
      .setInteractive()
      .setScale(width / 1800)
      .setAlpha(0);

    this.tweens.add({
      targets: playButton,
      alpha: 1,
      duration: 800,
      ease: 'Sine.easeIn',
    });

    playButton.on('pointerdown', () => {
      playButton.setVisible(false);
      this.startJourney();
    });
  }

  startJourney() {
    const { width } = this.scale;
    this.character.setTexture('character_walk');
    this.character.play('walk');
    this.tweens.add({
      targets: this.character,
      x: width + 200,
      duration: 3000,
      ease: 'Linear',
      onComplete: () => {
        this.character.anims.stop();
        this.character.setTexture('character_idle');
         this.scene.start('Scene1');
      },
    });
  }
}

