export class IntroRoom extends Phaser.Scene {
    constructor() {
        super({ key: "IntroRoom" });
        this.dialogText = "";
        this.currentDialog = "";
        this.dialogQueue = [];
        this.isTyping = false;
        this.dialogComplete = false;
        this.collectedClues = [];
        this.cluesContainer = null;
    }

    preload() {
        this.load.image("intro_bg", 'intropic.jpg');
        this.load.image("clue1", 'flashdrive.png');
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background image
        const bg = this.add.image(0, 0, 'intro_bg').setOrigin(0, 0);
        
        const scaleX = width / bg.width;
        const scaleY = (height * 0.65) / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        // Calculate positions
        const imageHeight = height * 0.6;
        const sidebarStartY = 100;
        const dialogY = imageHeight + 10;
        const dialogHeight = height - imageHeight - 150;  
        const sidebarWidth = 120;

        // Left sidebar - Clues
        const cluesSidebar = this.createSidebar(20, sidebarStartY, sidebarWidth, 570, "Clues", 0x00ffcc);
        this.cluesSidebar = cluesSidebar;
        
        // Right sidebar - Missions
        this.createSidebar(width - sidebarWidth - 20, sidebarStartY, sidebarWidth, 570, "Missions", 0x00ffcc);

        // Dialog box at bottom
        this.createDialogBox(
            sidebarWidth + 60, 
            550, 
            width - (sidebarWidth * 2) - 120, 
            dialogHeight
        );

        // Clue item (make it interactive)
        this.clue1 = this.add.image(width * 0.64, height * 0.7, 'clue1').setOrigin(0.5, 0.5);
        const scaleC = (width / 1280) * 0.05;
        this.clue1.setScale(scaleC);
        this.clue1.setAngle(20);
        this.clue1.setInteractive({ useHandCursor: true });

        // Add hover effect
        this.clue1.on('pointerover', () => {
            this.clue1.setTint(0x00ffcc);
            this.tweens.add({
                targets: this.clue1,
                scale: scaleC * 1.2,
                duration: 200
            });
        });

        this.clue1.on('pointerout', () => {
            this.clue1.clearTint();
            this.tweens.add({
                targets: this.clue1,
                scale: scaleC,
                duration: 200
            });
        });

        // Click handler for clue
        this.clue1.on('pointerdown', () => {
            this.collectClue('clue1', 'Flash Drive');
        });

        // Queue multiple dialogs
        this.dialogQueue = [
            "Welcome to Zero2Hero! Your mission is to navigate through the cyber world, uncover clues, and complete missions. Good luck!",
            "A major tech company is facing a critical security breach. Sensitive data is leaking from inside, but the source is still unknown.",
            "Security teams have traced the breach to one of the internal servers—yet only the company's Main Security Terminal can shut it down.",
            "There's a problem: the shutdown terminal requires a 5-part password, and the engineers who know how to retrieve each piece have gone missing after the incident.",
            "To stop the data leak, you must search through the facility's secure rooms, solve each engineer's training challenge, and recover their segment of the password.",
            "Find all five parts. Reach the Main Terminal. Shut down the compromised server before the breach spreads.",
            "Time is critical. The company's future depends on you. Let's get started!"            
        ];

        // Clue dialog content
        this.ClueDialog = [
            "If you're reading this… the breach started where the oldest logs sleep.",
            "The noise is overwhelming — only what survives the filters can be trusted.",
            "Find the room where the servers hum like they're still alive. Extract what remains. Only the true numbers still speak the truth.",
            "Location Tag: ODC-01… Old Data Center.",
            "Bring clarity to chaos. What survives the noise… unlocks the path forward."
        ];

        // Start the first dialog
        this.showNextDialog();
    }

    createSidebar(x, y, w, h, title, color) {
        // Border
        const border = this.add.graphics();
        border.lineStyle(4, color, 1);
        border.strokeRoundedRect(x, y, w, h, 10);

        // Title background
        const titleBg = this.add.graphics();
        titleBg.fillStyle(0x1a1a2e, 0.9);
        titleBg.fillRoundedRect(x + 5, y + 5, w - 10, 50, 10);

        // Title text
        const titleText = this.add.text(x + w / 2, y + 30, title, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#00ffcc',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Content area
        const contentBg = this.add.graphics();
        contentBg.fillStyle(0x0f1419, 0.7);
        contentBg.fillRoundedRect(x + 5, y + 60, w - 10, h - 65, 8);

        return { border, titleBg, titleText, contentBg, x, y, w, h };
    }

    createDialogBox(x, y, w, h) {
        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x88e8d8, 1);
        bg.fillRoundedRect(x + 3, y + 3, w - 6, h - 6, 50);

        // Make dialog box interactive
        const hitArea = this.add.rectangle(x, y, w, h, 0x000000, 0)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        hitArea.on('pointerdown', () => {
            this.handleDialogClick();
        });

        // Text area
        this.dialogTextObj = this.add.text(x + w / 2, y + 30, "", {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#1a1a2e',
            fontStyle: 'bold',
            wordWrap: { width: w - 60 },
            align: 'center'
        }).setOrigin(0.5, 0); 

        // Add click indicator
        this.clickIndicator = this.add.text(x + w - 40, y + h - 30, "▼", {
            fontSize: '20px',
            color: '#1a1a2e'
        }).setVisible(false);

        // Animate the indicator
        this.tweens.add({
            targets: this.clickIndicator,
            y: this.clickIndicator.y + 5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.dialogBox = { bg, x, y, w, h };
    }

    collectClue(clueKey, clueName) {
        // Check if already collected
        if (this.collectedClues.includes(clueKey)) {
            return;
        }

        // Add to collected clues
        this.collectedClues.push(clueKey);

        // Add visual effect
        this.tweens.add({
            targets: this.clue1,
            alpha: 0,
            scale: 0,
            duration: 500,
            onComplete: () => {
                this.clue1.destroy();
            }
        });

        // Add to sidebar
        this.addClueToSidebar(clueKey, clueName);

        // Add new dialog about finding the clue
        this.dialogQueue.unshift(`You found a clue: ${clueName}! This might help you solve the mystery.`);
        
        // If not currently showing dialog, start the new one
        if (!this.isTyping && !this.dialogComplete) {
            this.showNextDialog();
        }
    }

    addClueToSidebar(clueKey, clueName) {
        const sidebar = this.cluesSidebar;
        const clueY = sidebar.y + 120 + (this.collectedClues.length - 1) * 70;
        
        // Add clue image to sidebar
        const clueIcon = this.add.image(sidebar.x + sidebar.w / 2, clueY, clueKey)
            .setScale(0.15)
            .setInteractive({ useHandCursor: true });
        
        // Add clue name text
        const clueText = this.add.text(sidebar.x + sidebar.w / 2, clueY + 30, clueName, {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            color: '#00ffcc',
            align: 'center',
            wordWrap: { width: sidebar.w - 20 }
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Add hover effects for clue icon
        clueIcon.on('pointerover', () => {
            clueIcon.setTint(0xffffff);
            clueText.setColor('#ffffff');
            this.tweens.add({
                targets: [clueIcon, clueText],
                scale: clueIcon.scale * 1.1,
                duration: 200
            });
        });

        clueIcon.on('pointerout', () => {
            clueIcon.clearTint();
            clueText.setColor('#00ffcc');
            this.tweens.add({
                targets: [clueIcon, clueText],
                scale: clueIcon.scale / 1.1,
                duration: 200
            });
        });

        // Make both icon and text clickable to view clue dialog
        clueIcon.on('pointerdown', () => {
            this.startClueDialog(clueKey);
        });

        clueText.on('pointerdown', () => {
            this.startClueDialog(clueKey);
        });

        // Add glow effect
        this.tweens.add({
            targets: [clueIcon, clueText],
            alpha: { from: 0, to: 1 },
            scale: { from: 0, to: clueIcon.scale },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    showDialog(text) {
        this.currentDialog = text;
        this.dialogText = "";
        this.isTyping = true;
        this.dialogComplete = false;
        this.clickIndicator.setVisible(false);
        this.typewriterEffect();
    }

    showNextDialog() {
        if (this.dialogQueue.length > 0) {
            const nextDialog = this.dialogQueue.shift();
            this.showDialog(nextDialog);
        } else {
            // All dialogs finished - show arrow if we just finished clue dialog
            this.clickIndicator.setVisible(false);
            
            // Check if we need to show the arrow (after clue dialogs)
            if (this.collectedClues.length > 0 && !this.nextArrow) {
                this.showNextRoomPointer();
            }
        }
    }

    handleDialogClick() {
        if (this.isTyping) {
            // Skip typewriter effect and show full text immediately
            this.dialogText = this.currentDialog;
            this.dialogTextObj.setText(this.dialogText);
            this.isTyping = false;
            this.dialogComplete = true;
            this.clickIndicator.setVisible(true);
        } else if (this.dialogComplete) {
            // Move to next dialog
            this.showNextDialog();
        }
    }

    typewriterEffect() {
        if (this.dialogText.length < this.currentDialog.length) {
            this.dialogText += this.currentDialog[this.dialogText.length];
            this.dialogTextObj.setText(this.dialogText);
            
            this.time.delayedCall(30, () => {
                this.typewriterEffect();
            });
        } else {
            // Typewriter complete
            this.isTyping = false;
            this.dialogComplete = true;
            this.clickIndicator.setVisible(true);
        }
    }

    // Helper method to add missions
    addMissionItem(text, x, y) {
        const mission = this.add.text(x, y, text, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#00ffcc',
            wordWrap: { width: 160 }
        }).setInteractive({ useHandCursor: true });

        mission.on('pointerover', () => {
            mission.setColor('#ffffff');
        });

        mission.on('pointerout', () => {
            mission.setColor('#00ffcc');
        });

        return mission;
    }

    startClueDialog(clueKey) {
        // Clear current dialog queue and load clue dialog
        this.dialogQueue = [...this.ClueDialog];

        // If a dialog is currently showing, complete it first
        if (this.isTyping) {
            this.dialogText = this.currentDialog;
            this.dialogTextObj.setText(this.dialogText);
            this.isTyping = false;
            this.dialogComplete = true;
        }

        // Add the "click arrow" message to the queue
        this.dialogQueue.push("➡ Click the arrow to move to the next room.");

        // Start clue dialog
        this.showNextDialog();
    }

    showNextRoomPointer() {
        const { width, height } = this.cameras.main;

        this.nextArrow = this.add.text(width - 80, height - 80, "➜", {
            fontSize: "60px",
            color: "#00ffcc"
        })
        .setInteractive({ useHandCursor: true });

        this.tweens.add({
            targets: this.nextArrow,
            x: width - 70,
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        this.nextArrow.on("pointerdown", () => {
            this.scene.start("Room1");  
        });
    }
}