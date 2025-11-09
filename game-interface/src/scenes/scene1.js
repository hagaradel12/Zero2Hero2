
// import DialogSystem from "./DialogSystem";

// export class Scene1 extends Phaser.Scene {
//   constructor() {
//     super({ key: "Scene1" });
//     this.dialogSystem = null;
//     this.storyShown = false;
//   }

//   preload() {
//     this.load.image("scene1_bg", "/assets/images/level2.jpg");
//     this.load.image("character_idle", "/assets/images/characterg1.png");
//     this.load.image("stone", "/assets/images/potionq.png");
//   }

//   async create() {
//     const { width, height } = this.scale;

//     // Space key
//     this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

//     // 🖼️ Background
//     const bg = this.add.image(0, 0, "scene1_bg").setOrigin(0, 0);
//     bg.setDisplaySize(width, height);

//     // 👤 Character
//     const startX = width * 0.5;
//     const startY = height * 0.78;
//     this.character = this.add.image(startX, startY, "character_idle").setOrigin(0.5);
//     const scale = width / 1280;
//     this.character.setScale(scale);

//     // 💬 Fetch dialog for the level
//     const levelId = "lvl2";
//     const dialogs = await this.fetchLevelDialog(levelId);

//     // 💬 Create dialog system
//     this.dialogSystem = new DialogSystem(this, dialogs);

//     // Start dialog
//     this.time.delayedCall(500, () => {
//       this.dialogSystem.startDialog();
//     });

//     // 🪨 Clickable stone1
// // 🪨 Create clickable stones, each with its own question index
// const stone1 = this.add.image(width * 0.12, height * 0.78, "stone").setOrigin(0.5);
// stone1.setScale((width / 1280) * 0.1);
// stone1.setDepth(2);
// stone1.setInteractive({ useHandCursor: true });
// stone1.on("pointerdown", () => this.showStoryIntro(levelId, 0)); // question 1

// const stone2 = this.add.image(width * 0.38, height * 0.74, "stone").setOrigin(0.5);
// stone2.setScale((width / 1280) * 0.07);
// stone2.setDepth(15);
// stone2.setInteractive({ useHandCursor: true });
// stone2.on("pointerdown", () => this.showStoryIntro(levelId, 1)); // question 2

// const stone3 = this.add.image(width * 0.80, height * 0.72, "stone").setOrigin(0.5);
// stone3.setScale((width / 1280) * 0.05);
// stone3.setDepth(2);
// stone3.setInteractive({ useHandCursor: true });
// stone3.on("pointerdown", () => this.showStoryIntro(levelId, 2)); // question 3

//   }

//   // Fetch level dialog from backend
//   async fetchLevelDialog(levelId) {
//     try {
//       const res = await fetch(`http://localhost:3002/levels/${levelId}/dialog`);
//       const data = await res.json();
//       return data; // array of { speaker, text }
//     } catch (err) {
//       console.error("Failed to fetch dialog:", err);
//       return [{ speaker: "System", text: "Could not load dialog." }];
//     }
//   }

//   // Fetch story intro from backend
//   async fetchStory(levelId) {
//     try {
//       const res = await fetch(`http://localhost:3002/levels/${levelId}`);
//       const data = await res.json();
//       return data.storyIntro || "Welcome to this level!";
//     } catch (err) {
//       console.error("Failed to fetch story:", err);
//       return "Welcome to this level!";
//     }
//   }

//   // Show story intro from first question of the level
//  // Show story intro for a specific question
// async showStoryIntro(levelId, questionIndex) {
//   if (this.storyShown) return;
//   this.storyShown = true;

//   try {
//     const res = await fetch(`http://localhost:3002/questions/level/${levelId}`);
//     const data = await res.json();

//     if (!data || data.length === 0 || !data[questionIndex]) {
//       console.error("Question not found for this stone:", questionIndex);
//       return;
//     }

//     const question = data[questionIndex];
//     const storyText = question.storyIntro || "Welcome to this question!";

//     const { width, height } = this.scale;

//     // 🖤 Background for story text
//     this.add.rectangle(width / 2, height * 0.8, width * 0.8, height * 0.25, 0x000000, 0.7);

//     // ✨ Typewriter effect
//     let displayText = "";
//     const textObj = this.add.text(width / 2, height * 0.8, "", {
//       fontFamily: "Arial",
//       fontSize: "18px",
//       color: "#ffffff",
//       wordWrap: { width: width * 0.75 },
//       align: "center",
//     }).setOrigin(0.5);

//     let i = 0;
//     const typing = this.time.addEvent({
//       delay: 30,
//       callback: () => {
//         displayText += storyText[i];
//         textObj.setText(displayText);
//         i++;
//         if (i >= storyText.length) {
//           typing.remove(false);
//           // Redirect to correct question after typing ends
//           this.time.delayedCall(500, () => {
//             window.location.href = `http://localhost:3000/questions/${levelId}/${question._id}`;
//           });
//         }
//       },
//       loop: true
//     });
//   } catch (err) {
//     console.error("Failed to fetch story intro:", err);
//   }
// }


//   update() {
//     if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
//       this.dialogSystem?.showNextLine();
//     }
//   }
// }


// ========================================
// FILE: phaser-game/src/scenes/Scene1.js
// PURPOSE: Level 2 scene with story modal
// CHANGES: Added auth check, centered story modal with Start button
// ========================================

import DialogSystem from "./DialogSystem";
import api from '../api/api.js';

export class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene1" });
    this.dialogSystem = null;
    this.storyShown = false;
    this.userEmail = null;
    this.userId = null;
  }

  preload() {
    this.load.image("scene1_bg", "/assets/images/level2.jpg");
    this.load.image("character_idle", "/assets/images/characterg1.png");
    this.load.image("stone", "/assets/images/potionq.png");
  }

  async create() {
    // ========================================
    // 🔐 GET USER DATA FROM REGISTRY - NEW CODE
    // ========================================
    this.userEmail = this.registry.get('userEmail');
    this.userId = this.registry.get('userId');
    this.userName = this.registry.get('userName');

    // If data is missing, re-authenticate
    if (!this.userEmail) {
      try {
        const res = await api.get('/auth/me');
        this.userEmail = res.data.email;
        this.userId = res.data._id;
        this.userName = res.data.name;
        
        this.registry.set('userEmail', res.data.email);
        this.registry.set('userId', res.data._id);
        this.registry.set('userName', res.data.name);
      } catch (err) {
        console.error('❌ Authentication failed in Scene1');
        window.location.href = 'http://localhost:3000/login';
        return;
      }
    }

    console.log('✅ User authenticated in Scene1:', this.userEmail);
    // ========================================

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

    // ========================================
    // 🪨 CLICKABLE STONES - UPDATED
    // ========================================
    const stone1 = this.add.image(width * 0.12, height * 0.78, "stone").setOrigin(0.5);
    stone1.setScale((width / 1280) * 0.1);
    stone1.setDepth(2);
    stone1.setInteractive({ useHandCursor: true });
    stone1.on("pointerdown", () => this.showStoryIntro(levelId, 0));

    const stone2 = this.add.image(width * 0.38, height * 0.74, "stone").setOrigin(0.5);
    stone2.setScale((width / 1280) * 0.07);
    stone2.setDepth(15);
    stone2.setInteractive({ useHandCursor: true });
    stone2.on("pointerdown", () => this.showStoryIntro(levelId, 1));

    const stone3 = this.add.image(width * 0.80, height * 0.72, "stone").setOrigin(0.5);
    stone3.setScale((width / 1280) * 0.05);
    stone3.setDepth(2);
    stone3.setInteractive({ useHandCursor: true });
    stone3.on("pointerdown", () => this.showStoryIntro(levelId, 2));
  }

  async fetchLevelDialog(levelId) {
    try {
      const res = await fetch(`http://localhost:3002/levels/${levelId}/dialog`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to fetch dialog:", err);
      return [{ speaker: "System", text: "Could not load dialog." }];
    }
  }

  // ========================================
  // 📖 SHOW STORY INTRO - COMPLETELY NEW
  // ========================================
  async showStoryIntro(levelId, questionIndex) {
    if (this.storyShown) return;
    this.storyShown = true;

    try {
      const res = await fetch(`http://localhost:3002/questions/level/${levelId}`);
      const data = await res.json();

      if (!data || data.length === 0 || !data[questionIndex]) {
        console.error("Question not found for this stone:", questionIndex);
        this.storyShown = false;
        return;
      }

      const question = data[questionIndex];
      const storyText = question.storyIntro || "Welcome to this question!";

      const { width, height } = this.scale;

      // 🌑 Full screen dark overlay
      const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.85)
        .setOrigin(0, 0)
        .setDepth(100);

      // 📦 Story modal box (centered)
      const modalWidth = width * 0.7;
      const modalHeight = height * 0.5;
      const modalBox = this.add.rectangle(
        width / 2,
        height / 2,
        modalWidth,
        modalHeight,
        0x1a1a2e,
        1
      )
        .setDepth(101)
        .setStrokeStyle(3, 0x4a90e2);

      // 📜 Story title
      const titleText = this.add.text(
        width / 2,
        height / 2 - modalHeight / 2 + 40,
        "📖 Quest Briefing",
        {
          fontFamily: "Georgia, serif",
          fontSize: `${Math.round(width * 0.025)}px`,
          color: "#4a90e2",
          fontStyle: "bold",
        }
      )
        .setOrigin(0.5)
        .setDepth(102);

      // ✨ Typewriter story text
      let displayText = "";
      const storyTextObj = this.add.text(
        width / 2,
        height / 2,
        "",
        {
          fontFamily: "Arial, sans-serif",
          fontSize: `${Math.round(width * 0.018)}px`,
          color: "#ffffff",
          wordWrap: { width: modalWidth - 80 },
          align: "center",
          lineSpacing: 8,
        }
      )
        .setOrigin(0.5)
        .setDepth(102);

      let i = 0;
      const typing = this.time.addEvent({
        delay: 30,
        callback: () => {
          displayText += storyText[i];
          storyTextObj.setText(displayText);
          i++;
          if (i >= storyText.length) {
            typing.remove(false);
            this.showStartButton(overlay, modalBox, titleText, storyTextObj, levelId, question._id);
          }
        },
        loop: true,
      });
    } catch (err) {
      console.error("Failed to fetch story intro:", err);
      this.storyShown = false;
    }
  }

  // ========================================
  // 🚀 SHOW START BUTTON - COMPLETELY NEW
  // ========================================
  showStartButton(overlay, modalBox, titleText, storyTextObj, levelId, questionId) {
    const { width, height } = this.scale;

    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonY = height / 2 + (height * 0.5) / 2 - 60;

    // ✅ Start Quest Button
    const startButton = this.add.rectangle(
      width / 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      0x4ade80
    )
      .setDepth(102)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () {
        this.setFillStyle(0x22c55e);
      })
      .on("pointerout", function () {
        this.setFillStyle(0x4ade80);
      })
      .on("pointerdown", () => {
        // 🎯 Redirect to Next.js question page
        window.location.href = `http://localhost:3000/questions/${levelId}/${questionId}`;
      });

    const buttonText = this.add.text(width / 2, buttonY, "Start Quest →", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
    })
      .setOrigin(0.5)
      .setDepth(103);

    // Pulsing animation
    this.tweens.add({
      targets: startButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.dialogSystem?.showNextLine();
    }
  }
}

// ========================================
// WHAT CHANGED:
// ========================================
// ✅ Gets user data from registry
// ✅ Story modal is now centered with dark overlay
// ✅ Typewriter effect for story text
// ✅ Start button appears after typing completes
// ✅ Start button redirects to Next.js question page