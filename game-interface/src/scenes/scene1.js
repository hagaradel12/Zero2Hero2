// import DialogSystem from "./DialogSystem";

// export class Scene1 extends Phaser.Scene {
//   constructor() {
//     super({ key: "Scene1" });
//     this.dialogSystem = null;
//     this.isCharacterWalking = false;

//     this.startPos = { x: 0.08, y: 0.78 };
//     this.stopPos = { x: 1.1, y: 1};
//   }

//   preload() {
//     this.load.image("scene1_bg", "/assets/images/level2.jpg");
//     this.load.image("sign", "/assets/images/qpointer.png");
//     this.load.image("character_idle", "/assets/images/characterg1.png");
//     this.load.spritesheet("character_walk", "/assets/images/walk.png", {
//       frameWidth: 185,
//       frameHeight: 200,
//     });
//   }

//   async create() {
//     this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
//     const { width, height } = this.scale;

//     // Background
//     const bg = this.add.image(0, 0, "scene1_bg").setOrigin(0, 0);
//     bg.setDisplaySize(width, height);

//     // Character - USE SPRITE, NOT IMAGE!
//     const startX = width * this.startPos.x;
//     const startY = height * this.startPos.y;
//     this.character = this.add.sprite(startX, startY, "character_idle").setOrigin(0.5);
//     const scale = width / 1280;
//     this.character.setScale(scale);

//     // Walk animation
//     if (!this.anims.exists("walk")) {
//       this.anims.create({
//         key: "walk",
//         frames: this.anims.generateFrameNumbers("character_walk", { start: 0, end: 7 }),
//         frameRate: 10,
//         repeat: -1,
//       });
//     }

//     // Fetch dialog from backend
//     const levelId = "lvl2";
//     const dialogs = await this.fetchDialog(levelId);

//     // Dialog system
//     this.dialogSystem = new DialogSystem(this, dialogs);

//     // Set the callback BEFORE starting dialog
//     this.dialogSystem.onComplete = () => {
//       console.log("✅ Dialog complete - showing sign first");
//       this.showSignThenWalk();
//     };

//     // Start dialog after delay
//     this.time.delayedCall(1000, () => {
//       this.dialogSystem.startDialog();
//     });
//   }

//   async fetchDialog(levelId) {
//     try {
//       const res = await fetch(`http://localhost:3002/levels/${levelId}/dialog`);
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       console.error("Failed to fetch dialog:", error);
//       return [{ speaker: "System", text: "Could not load dialog from server." }];
//     }
//   }

//   showSignThenWalk() {
//     const { width, height } = this.scale;
    
//     // 📍 Show the sign FIRST - position it where character will walk to
//     const signX = width * 0.5; // Same X as stopPos
//     const signY = height * 0.77;
    
//     this.sign = this.add.image(signX, signY, "sign").setOrigin(0.5);
//     this.sign.setScale((width / 1280)* 0.3);
//     this.sign.setAlpha(0);
    
//     console.log("📍 Sign created at destination, fading in...");
    
//     // Fade in the sign with a bounce effect
//     this.tweens.add({
//       targets: this.sign,
//       alpha: 1,
//       y: signY - 10, // Slight bounce down
//       duration: 600,
//       ease: 'Back.easeOut',
//       onComplete: () => {
//         // Bounce back up slightly
//         this.tweens.add({
//           targets: this.sign,
//           y: signY,
//           duration: 200,
//           ease: 'Sine.easeOut',
//           onComplete: () => {
//             console.log("🚶 Now starting character walk");
//             // THEN start walking after sign appears
//             this.time.delayedCall(300, () => {
//               this.startCharacterWalk();
//             });
//           }
//         });
//       }
//     });
//   }

//   startCharacterWalk() {
//     console.log("🚶 Starting character walk animation");
    
//     this.isCharacterWalking = true;
//     this.character.setTexture("character_walk");
//     this.character.play("walk");
//   }

//   update() {
//     // Allow space key to advance dialog
//     if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
//       this.dialogSystem?.showNextLine();
//     }

//     // Character movement
//     if (this.isCharacterWalking) {
//       const { width } = this.scale;
//       this.character.x += width * 0.0045;

//       if (this.character.x >= width * this.stopPos.x) {
//         console.log("🛑 Character reached destination");
        
//         // Stop walking animation
//         if (this.character.anims) {
//           this.character.anims.stop();
//         }
//         this.character.setTexture("character_idle");
//         this.isCharacterWalking = false;

//         // Slight delay before moving to next scene
//         this.time.delayedCall(1000, () => {
//           this.scene.start("Scene2");
//         });
//       }
//     }
//   }
// }
import DialogSystem from "./DialogSystem";

export class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene1" });
    this.dialogSystem = null;
    this.storyShown = false;
  }

  preload() {
    this.load.image("scene1_bg", "/assets/images/level2.jpg");
    this.load.image("character_idle", "/assets/images/characterg1.png");
    this.load.image("stone", "/assets/images/stoneq.png");
  }

  async create() {
    const { width, height } = this.scale;

    // Space key
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // 🖼️ Background
    const bg = this.add.image(0, 0, "scene1_bg").setOrigin(0, 0);
    bg.setDisplaySize(width, height);

    // 👤 Character
    const startX = width * 0.5;
    const startY = height * 0.78;
    this.character = this.add.image(startX, startY, "character_idle").setOrigin(0.5);
    const scale = width / 1280;
    this.character.setScale(scale);

    // 💬 Fetch dialog for the level
    const levelId = "lvl2";
    const dialogs = await this.fetchLevelDialog(levelId);

    // 💬 Create dialog system
    this.dialogSystem = new DialogSystem(this, dialogs);

    // Start dialog
    this.time.delayedCall(500, () => {
      this.dialogSystem.startDialog();
    });

    // 🪨 Clickable stone
    const stone1 = this.add.image(width * 0.19, height * 0.80, "stone").setOrigin(0.5);
    stone1.setScale((width / 1280) * 0.1);
    stone1.setDepth(2);
    stone1.setInteractive({ useHandCursor: true });
    stone1.on("pointerdown", () => this.showStoryIntro(levelId));
  }

  // Fetch level dialog from backend
  async fetchLevelDialog(levelId) {
    try {
      const res = await fetch(`http://localhost:3002/levels/${levelId}/dialog`);
      const data = await res.json();
      return data; // array of { speaker, text }
    } catch (err) {
      console.error("Failed to fetch dialog:", err);
      return [{ speaker: "System", text: "Could not load dialog." }];
    }
  }

  // Fetch story intro from backend
  async fetchStory(levelId) {
    try {
      const res = await fetch(`http://localhost:3002/levels/${levelId}`);
      const data = await res.json();
      return data.storyIntro || "Welcome to this level!";
    } catch (err) {
      console.error("Failed to fetch story:", err);
      return "Welcome to this level!";
    }
  }

  // Show story intro from first question of the level
  async showStoryIntro(levelId) {
    if (this.storyShown) return;
    this.storyShown = true;

    try {
      const res = await fetch(`http://localhost:3002/questions/level/${levelId}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        console.error("No questions found for this level");
        return;
      }

      const firstQuestion = data[0];
      const storyText = firstQuestion.storyIntro || "Welcome to this level!";

      const { width, height } = this.scale;

      // Background for text
      this.add.rectangle(width / 2, height * 0.8, width * 0.8, height * 0.25, 0x000000, 0.7);

      // Typewriter effect
      let displayText = "";
      const textObj = this.add.text(width / 2, height * 0.8, "", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        wordWrap: { width: width * 0.75 },
        align: "center",
      }).setOrigin(0.5);

      let i = 0;
      const typing = this.time.addEvent({
        delay: 30,
        callback: () => {
          displayText += storyText[i];
          textObj.setText(displayText);
          i++;
          if (i >= storyText.length) {
            typing.remove(false);
            // Redirect to question page after a short delay
            this.time.delayedCall(500, () => {
              window.location.href = `http://localhost:3000/questions/${levelId}/${firstQuestion._id}`;
            });
          }
        },
        loop: true
      });
    } catch (err) {
      console.error("Failed to fetch story intro:", err);
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.dialogSystem?.showNextLine();
    }
  }
}