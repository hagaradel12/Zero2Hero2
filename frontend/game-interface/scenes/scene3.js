import DialogSystem from "./DialogSystem.js";
import api from '../api/api.js';
import GameStateManager from '../gameStateManager.ts';

export class Scene3 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene3" });
    this.dialogSystem = null;
    this.storyShown = false;
    this.userEmail = null;
    this.userId = null;
    this.completedQuestions = [];
  }

  preload() {
    this.load.image("scene4_bg", "/level4.jpg");
    this.load.image("character_idle", "/characterg1.png");
    this.load.image("stone", "/potionq.png");
    this.load.image("question1p",'Icon381.png')
    this.load.image("question2p", 'Icon39.png')
    
  }

  async create() {
    // ========================================
    // 🔐 AUTHENTICATION & GAMESTATE INIT
    // ========================================
    this.userEmail = this.registry.get('userEmail');
    this.userId = this.registry.get('userId');
    this.userName = this.registry.get('userName');

    if (!this.userEmail || !this.userId) {
      try {
        const res = await api.get('/auth/me');
        this.userEmail = res.data.email;
        // JWT uses 'sub' field for user ID
        this.userId = res.data.sub || res.data._id;
        this.userName = res.data.name;
        
        this.registry.set('userEmail', res.data.email);
        this.registry.set('userId', this.userId);
        this.registry.set('userName', res.data.name);

        // ✅ Initialize GameStateManager
        GameStateManager.setUserId(this.userId);
      } catch (err) {
        console.error('❌ Authentication failed in Scene3');
        window.location.href = 'http://localhost:3000/login';
        return;
      }
    } else {
      // ✅ Initialize GameStateManager if coming from another scene
      GameStateManager.setUserId(this.userId);
    }

    console.log('✅ User authenticated in Scene3:', this.userEmail);

    // ✅ Save that we're in Scene1
    await GameStateManager.saveState('Scene3', 'lvl4');

    const { width, height } = this.scale;
    const levelId = "lvl4";

    // ✅ Load completed questions for this level
    this.completedQuestions = await GameStateManager.getCompletedQuestions(levelId);
    console.log('✅ Completed questions:', this.completedQuestions);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const bg = this.add.image(0, 0, "scene4_bg").setOrigin(0, 0);
    bg.setDisplaySize(width, height);

    const startX = width * 0.22;
    const startY = height * 0.77;
    this.character = this.add.image(startX, startY, "character_idle").setOrigin(0.5);
    const scale = (width / 1280);
    this.character.setScale(scale);


    // const potionq1 = this.add.image(0.16,0.77,"question1p").setOrigin(0.5);
    // const scalep = (width/1280)*2;
    

    const dialogs = await this.fetchLevelDialog(levelId);
    this.dialogSystem = new DialogSystem(this, dialogs);

    this.time.delayedCall(500, () => {
      this.dialogSystem.startDialog();
    });

    this.createStone(width * 0.23, height * 0.48, (width / 1280) * 0.9, levelId, 0);
    this.createStone(width * 0.73, height * 0.48, (width / 1280) * 0.9, levelId, 1);
    // this.createStone(width * 0.68, height * 0.62, (width / 1280) * 0.7, levelId, 2);

    this.createNextLevelButton();
  }

  createStone(x, y, scale, levelId, questionIndex) {
    const stone = this.add.image(x, y, "question2p").setOrigin(0.5);
    stone.setScale(scale);
    stone.setDepth(2);
    stone.setInteractive({ useHandCursor: true });
    
    // Check if this question is completed
    const isCompleted = this.completedQuestions.includes(questionIndex);
    
    if (isCompleted) {
      // Add checkmark overlay
      const checkmark = this.add.text(x, y, "✓", {
        fontSize: `${Math.round(scale * 300)}px`,
        color: "#4ade80",
        fontStyle: "bold",
      })
        .setOrigin(0.5)
        .setDepth(3);
      
      // Dim the stone slightly
      stone.setTint(0x888888);
    }
    
    stone.on("pointerdown", () => this.showStoryIntro(levelId, questionIndex));
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

      const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.85)
        .setOrigin(0, 0)
        .setDepth(100);

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
            this.showStartButton(overlay, modalBox, titleText, storyTextObj, levelId, question._id, questionIndex);
          }
        },
        loop: true,
      });
    } catch (err) {
      console.error("Failed to fetch story intro:", err);
      this.storyShown = false;
    }
  }

  showStartButton(overlay, modalBox, titleText, storyTextObj, levelId, questionId, questionIndex) {
    const { width, height } = this.scale;

    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonY = height / 2 + (height * 0.5) / 2 - 60;

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
        // Store questionIndex in URL for return tracking
        window.location.href = `http://localhost:3000/questions/${levelId}/${questionId}?questionIndex=${questionIndex}`;
      });

    const buttonText = this.add.text(width / 2, buttonY, "Start Quest →", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
    })
      .setOrigin(0.5)
      .setDepth(103);

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

  
createNextLevelButton() {
  const { width, height } = this.scale;
  const levelId = 'lvl4'; 

  // Create button in top-right corner
  const button = this.add.rectangle(
    width - 150,
    50,
    250,
    60,
    0x4a90e2
  )
    .setDepth(1000)
    .setInteractive({ useHandCursor: true })
    .setVisible(false); // Hidden by default

  const buttonText = this.add.text(
    width - 150,
    50,
    'Next Level →',
    {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    }
  )
    .setOrigin(0.5)
    .setDepth(1001)
    .setVisible(false);

  // Button interactions
  button.on('pointerover', function() {
    this.setFillStyle(0x3b82f6);
  });
  
  button.on('pointerout', function() {
    this.setFillStyle(0x4a90e2);
  });

  button.on('pointerdown', async () => {
    const result = await GameStateManager.tryAdvanceToNextScene(levelId);
    
    if (result.canAdvance && result.nextScene) {
      console.log('✅ Advancing to:', result.nextScene);
      this.scene.start(result.nextScene);
    } else {
      // Show message if can't advance
      this.showMessage(result.message);
    }
  });

  // ========================================
  // CHECK EVERY 2 SECONDS IF LEVEL IS COMPLETE
  // ========================================
  this.time.addEvent({
    delay: 2000,
    callback: async () => {
      const progress = await GameStateManager.checkLevelProgress(levelId);
      
      if (progress && progress.isComplete) {
        // Show button when level is complete
        button.setVisible(true);
        buttonText.setVisible(true);
        
        // Add pulse animation
        this.tweens.add({
          targets: [button, buttonText],
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 500,
          yoyo: true,
          repeat: -1,
        });
      }
    },
    loop: true,
  });
}

// ========================================
// HELPER: SHOW MESSAGE ON SCREEN
// ========================================
showMessage(message) {
  const { width, height } = this.scale;
  
  const bg = this.add.rectangle(
    width / 2,
    height / 2,
    width * 0.6,
    height * 0.2,
    0x000000,
    0.9
  ).setDepth(2000);

  const text = this.add.text(
    width / 2,
    height / 2,
    message,
    {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: width * 0.5 },
    }
  )
    .setOrigin(0.5)
    .setDepth(2001);

  // Auto-hide after 3 seconds
  this.time.delayedCall(3000, () => {
    bg.destroy();
    text.destroy();
  });
}

  update() {
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.dialogSystem?.showNextLine();
    }
  }
}