
class Scene1 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene2" });
    this.dialogSystem = null;
    this.isCharacterWalking = false;
  }

  preload() {
    // Load assets
    this.load.image("scene1_bg", "/assets/images/Background1.png");
    this.load.image("sign", "/assets/images/qpointer.png");
    this.load.image("character_idle", "/assets/images/characterg1.png");

    // Walking sprite sheet (8 frames)
    this.load.spritesheet("character_walk", "/assets/images/walk.png", {
      frameWidth: 185,
      frameHeight: 200,
    });
  }

  create() {
    const width = this.game.config.width;
    const height = this.game.config.height;

    // 🏞️ Background
    const bg = this.add.image(0, 0, "scene1_bg").setOrigin(0, 0);
    bg.setDisplaySize(width, height);

    // 🧍‍♂️ Idle character (visible at start)
    this.character = this.add.image(100, 580, "character_idle").setOrigin(0.5);
    const scale = (height * 0.3) / 200;
    this.character.setScale(scale);

    // 🌀 Define walking animation
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("character_walk", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // 🗨️ Dialog system setup
    this.dialogSystem = new DialogSystem(this);

    const dialogs = [
      {
        title: "Level 1",
        text: "Welcome, young apprentice, to the Workshop of Steps — the first hall of your magical journey.",
        character: "Master Wizard",
      },
      {
        title: "Level 1",
        text: "Before you can cast great spells or write complex programs, you must learn to see the small actions that make magic work.",
        character: "Master Wizard",
      },
      {
        title: "Level 1",
        text: "Here, you'll take one big task and break it into tiny, clear steps — just like listing every move in a spell.",
        character: "Master Wizard",
      },
      {
        title: "Level 1",
        text: "You'll learn that solving a problem starts long before writing a single line of code.",
        character: "Master Wizard",
      },
    ];

    // Start dialog after short delay
    this.time.delayedCall(1000, () => {
      this.dialogSystem.showDialogSequence(dialogs);
    });

    // Advance dialog with click or spacebar
    this.input.on("pointerdown", () => this.dialogSystem?.nextDialog());
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.dialogSystem?.nextDialog();
    }

    // 🏃 Character movement once walking starts
    if (this.isCharacterWalking) {
      this.character.x += 4;

      // Stop at specific point
      if (this.character.x >= 1800) {
        this.character.anims.stop();
        this.isCharacterWalking = false;

        // ✅ NEW: Transition to Scene2 after a brief delay
        this.time.delayedCall(1000, () => {
          this.scene.start("Scene2"); // <-- move to the coding/question scene
        });
      }
    }
  }
}

// --------------------------------------------------------
// Dialog System Class (Typewriter + Sign + Trigger Movement)
// --------------------------------------------------------
class DialogSystem {
  constructor(scene) {
    this.scene = scene;
    this.dialogs = [];
    this.currentDialogIndex = 0;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.createDialogBox();
  }

  createDialogBox() {
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;

    // Dialog box
    this.dialogBox = this.scene.add
      .rectangle(width / 2, height - 100, width * 0.5, 180, 0x000000, 0.8)
      .setStrokeStyle(3, 0x4a4a4a)
      .setOrigin(0.5);

    this.titleText = this.scene.add
      .text(width / 2, height - 170, "", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
        backgroundColor: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5);

    this.characterText = this.scene.add.text(width / 2 - 300, height - 140, "", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#b93ce7",
      fontStyle: "bold",
    });

    this.dialogText = this.scene.add.text(width / 2 - 300, height - 110, "", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: 600 },
    });

    this.continueText = this.scene.add
      .text(width / 2 + 280, height - 30, "Click to continue ▼", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#bdc3c7",
        fontStyle: "italic",
      })
      .setOrigin(1, 0.5);

    // Blink animation
    this.scene.tweens.add({
      targets: this.continueText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.hide();
  }

  showDialogSequence(dialogs) {
    this.dialogs = dialogs;
    this.currentDialogIndex = 0;
    this.show();
    this.displayCurrentDialog();
  }

  displayCurrentDialog() {
    if (this.currentDialogIndex >= this.dialogs.length) {
      this.hide();
      this.onDialogComplete();
      return;
    }

    const dialog = this.dialogs[this.currentDialogIndex];
    this.titleText.setText(dialog.title);
    this.characterText.setText(dialog.character + ":");
    this.typewriteText(dialog.text);
  }

  typewriteText(text) {
    this.isTyping = true;
    this.dialogText.setText("");
    this.currentText = text;
    this.currentCharacter = 0;

    if (this.typewriterTimer) this.typewriterTimer.remove();

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 30,
      callback: () => {
        this.dialogText.setText(
          this.currentText.substring(0, this.currentCharacter)
        );
        this.currentCharacter++;

        if (this.currentCharacter > this.currentText.length) {
          this.isTyping = false;
          this.typewriterTimer.remove();
          this.typewriterTimer = null;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  nextDialog() {
    if (this.isTyping) {
      this.typewriterTimer?.remove();
      this.dialogText.setText(this.currentText);
      this.isTyping = false;
    } else {
      this.currentDialogIndex++;
      this.displayCurrentDialog();
    }
  }

 onDialogComplete() {
  console.log("All dialogs completed!");

  const sceneKey = this.scene.scene.key;

  if (sceneKey === "Scene1") {
    // --- 🪧 Scene1: Show sign and trigger walking ---
    const sign = this.scene.add.image(850, 520, "sign").setOrigin(0.5);
    sign.setScale(0.38).setAlpha(0);

    this.scene.tweens.add({
      targets: sign,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        // 🧍 Replace idle image with animated sprite
        const { x, y, scale } = this.scene.character;
        this.scene.character.destroy(); // remove idle
        this.scene.character = this.scene.add
          .sprite(x, y, "character_walk")
          .setScale(scale)
          .setOrigin(0.5);

        // Start walking
        this.scene.character.play("walk");
        this.scene.isCharacterWalking = true;
      },
    });
  } else if (sceneKey === "Scene2") {
    // --- 🧠 Scene2: Show coding editor & question ---
    this.scene.showQuestionAndEditor();
  }
}


  show() {
    this.dialogBox.setVisible(true);
    this.titleText.setVisible(true);
    this.characterText.setVisible(true);
    this.dialogText.setVisible(true);
    this.continueText.setVisible(true);
  }

  hide() {
    this.dialogBox.setVisible(false);
    this.titleText.setVisible(false);
    this.characterText.setVisible(false);
    this.dialogText.setVisible(false);
    this.continueText.setVisible(false);
  }

  destroy() {
    if (this.typewriterTimer) this.typewriterTimer.remove();
  }
}
