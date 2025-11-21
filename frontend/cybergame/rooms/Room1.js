import CodeEditor from "../CodeEditor.js";
import ClueDescription from "../ClueDescription.js";
import PasswordPopup from "../PasswordPopUp.js";
import api from '../api/api.js';

export class Room1 extends Phaser.Scene {
    constructor() {
        super({ key: "Room1" });
        this.collectedClues = [];
        this.dialogQueue = [];
        this.isTyping = false;
        this.dialogComplete = false;
        this.currentClueIndex = 0;
        this.completedClues = [];
        this.passwordFragments = []; // Track collected fragments
        
        // Track which clues belong to this room
        this.roomClues = ['room1_taskA', 'room1_taskB'];
        this.roomId = 'room1';
        this.objectToClue = {
            notebook: 'room1_taskA',
            server: 'room1_taskB'
        };
    }

    preload() {
        this.load.image("room1_bg", 'Room1.png');
        this.load.image("notebook", 'notebook.png');
        this.load.image("server", 'server.png');
        this.load.image("computer", 'computer.png');
    }

    async create() {
        this.userEmail = this.registry.get('userEmail');
        this.userId = this.registry.get('userId');
        this.userName = this.registry.get('userName');

        if (!this.userEmail || !this.userId) {
            try {
                const res = await api.get('/auth/me');
                this.userEmail = res.data.email;
                this.userId = res.data.sub || res.data._id;
                this.userName = res.data.name;
                
                this.registry.set('userEmail', res.data.email);
                this.registry.set('userId', this.userId);
                this.registry.set('userName', res.data.name);
            } catch (error) { 
                console.error('Error fetching user data:', error);
                this.scene.start('LoginScene');
                return;
            }
        }
        console.log('✅ User authenticated in Room1:', this.userEmail);

        // 🔹 LOAD USER'S GAME STATE (found clues, fragments, etc.)
        await this.loadUserGameState();

        const { width, height } = this.scale;

        // 🌟 FULLSCREEN BACKGROUND
        const bg = this.add.image(0, 0, "room1_bg").setOrigin(0);
        bg.setDisplaySize(width, height);

        // 🌟 RESPONSIVE SCALE FOR TEXT/UI
        const uiScale = width / 1280;

        // 🌟 SIDEBAR WIDTH/HEIGHT BASED ON SCREEN PERCENTAGE
        const sidebarWidth = width * 0.10;
        const sidebarHeight = height * 0.74;
        const sidebarY = height * 0.14;

        // LEFT SIDEBAR - Clues
        this.cluesSidebar = this.createSidebar(
            width * 0.02,
            sidebarY,
            sidebarWidth,
            sidebarHeight,
            "Clues",
            "#88e8d8"
        );

        // RIGHT SIDEBAR - Missions (Password Fragments)
        this.missionsSidebar = this.createSidebar(
            width * 0.89,
            sidebarY,
            sidebarWidth,
            sidebarHeight,
            "Missions",
            "#88e8d8"
        );

        // 🌟 DIALOG BOX
        const dialogBoxX = width * 0.15;
        const dialogBoxY = height * 0.70;
        const dialogBoxW = width * 0.70;
        const dialogBoxH = height * 0.19;

        this.createDialogBox(dialogBoxX, dialogBoxY, dialogBoxW, dialogBoxH);

        // 🌟 CLICKABLE OBJECTS
        this.notebook = this.add.image(width * 0.31, height * 0.60, "notebook")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.scaleN = uiScale * 0.03;
        this.notebook.setScale(this.scaleN);
        this.notebook.setAngle(20);

        this.notebook.on("pointerover", () => {
            this.notebook.setTint(0x00ffcc);
            this.tweens.add({
                targets: this.notebook,
                scale: this.scaleN * 1.1,
                duration: 200
            });
        });

        this.notebook.on('pointerout', () => {
            this.notebook.clearTint();
            this.tweens.add({
                targets: this.notebook,
                scale: this.scaleN,
                duration: 200
            });
        });

        this.notebook.on('pointerdown', () => {
            const clueKey = this.objectToClue.notebook;
            this.collectClue('notebook', 'Notebook', clueKey);
        });

        // SERVER
        this.server = this.add.image(width * 0.65, height * 0.58, "server")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.scaleS = uiScale * 0.2;
        this.server.setScale(this.scaleS);

        this.server.on("pointerover", () => {
            this.server.setTint(0x00ffcc);
            this.tweens.add({
                targets: this.server,
                scale: this.scaleS * 1.1,
                duration: 200
            });
        });

        this.server.on('pointerout', () => {
            this.server.clearTint();
            this.tweens.add({
                targets: this.server,
                scale: this.scaleS,
                duration: 200
            });
        });

        this.server.on('pointerdown', () => {
            const clueKey = this.objectToClue.server;
            this.collectClue('server', 'Server Terminal', clueKey);
        });

        // COMPUTER - Password Entry Point
        this.computer = this.add.image(width * 0.68, height * 0.5, "computer")
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        
        this.scaleC = uiScale * 0.09;
        this.computer.setScale(this.scaleC);

        this.computer.on("pointerover", () => {
            this.computer.setTint(0x00ffcc);
            this.tweens.add({
                targets: this.computer,
                scale: this.scaleC * 1.1,
                duration: 200
            });
        });

        this.computer.on('pointerout', () => {
            this.computer.clearTint();
            this.tweens.add({
                targets: this.computer,
                scale: this.scaleC,
                duration: 200
            });
        });

        // 🔹 COMPUTER CLICK - Opens Password Popup
        this.computer.on('pointerdown', () => {
            this.openPasswordPopup();
        });

        // 🔹 INITIAL DIALOG
        this.dialogQueue = [
            "Welcome to the Old Data Center.",
            "The first engineer left clues behind. Find them to unlock the first password fragment."
        ];

        this.showNextDialog();

        // 🔹 CREATE CLUE PROGRESS INDICATOR
        this.createClueProgressIndicator();

        // 🔹 INITIALIZE CODE EDITOR, DESCRIPTION, AND PASSWORD POPUP
        this.initializeEditors();
    }

    initializeEditors() {
        // Initialize Code Editor
        this.codeEditor = new CodeEditor(this);
        
        // Initialize Description Panel
        this.clueDescription = new ClueDescription(this);

        // Initialize Password Popup
        this.passwordPopup = new PasswordPopup(this);

        // Default starter code
        const defaultCode = `public class Room1Clue {
    public static void main(String[] args) {
        // Your code here
    }
}`;

        this.codeEditor.initEditor(defaultCode, "java");

        // 🔹 RUN BUTTON HANDLER
        this.codeEditor.onRun(async (code) => {
            await this.executeCode(code);
        });

        // 🔹 FINISH BUTTON HANDLER
        this.codeEditor.onFinish(async (code) => {
            console.log('🏁 Finish clicked - saving code...');
            await this.saveCodeToDB(code);
            this.closeBothWindows();
        });
    }

    async openPasswordPopup() {
        // 🔹 CHECK IF USER HAS FOUND ALL CLUES FROM BACKEND
        try {
            const userResponse = await api.get(`/users/${this.userId}/game-state`);
            const userData = userResponse.data;
            
            // Get found clues for this room
            const foundCluesInRoom = userData.foundClues?.[this.roomId] || [];
            
            // Define all clue keys that should be found in this room
            const requiredClueKeys = ['notebook', 'server']; // Object keys that need to be collected
            
            // Check if all required clues have been found
            const allCluesFound = requiredClueKeys.every(clueKey => 
                foundCluesInRoom.includes(clueKey)
            );

            if (!allCluesFound) {
                const missingClues = requiredClueKeys.filter(
                    clueKey => !foundCluesInRoom.includes(clueKey)
                );
                
                this.dialogQueue = [
                    "The computer screen flickers...",
                    "\"ACCESS DENIED: Some clues are still missing.\"",
                    `You need to find: ${missingClues.join(', ')}`
                ];
                this.showNextDialog();
                return;
            }

            // 🔹 All clues found, get the expected answer from the last clue
            const lastClueKey = this.roomClues[this.roomClues.length - 1];
            
            const clueResponse = await api.get(`/clue/by-key/${lastClueKey}`);
            const clue = clueResponse.data;
            const expectedAnswer = String(clue.testCases[0].expectedOutput);

            // Show password popup
            this.passwordPopup.show(
                expectedAnswer,
                // On Correct
                async () => {
                    await this.onPasswordCorrect(expectedAnswer);
                },
                // On Incorrect
                () => {
                    console.log('Incorrect password attempt');
                }
            );

        } catch (error) {
            console.error('Error checking clues or loading password:', error);
            this.dialogQueue = [
                "Error accessing computer system.",
                "Please try again."
            ];
            this.showNextDialog();
        }
    }

    async onPasswordCorrect(fragment) {
        // Add fragment to missions sidebar
        this.addFragmentToMissions(fragment);

        // Save fragment to backend
        if (this.userId) {
            try {
                await api.post(`/users/${this.userId}/complete-room`, {
                    roomId: this.roomId,
                    passwordFragment: fragment
                });
                console.log('✅ Password fragment saved to backend');
            } catch (error) {
                console.error('Error saving fragment:', error);
            }
        }

        // Show success dialog
        this.dialogQueue = [
            "🎉 CORRECT!",
            `Password Fragment #1: ${fragment}`,'for next room',
            "Trace continues → patterns repeat where signals loop...",
            "Click the arrow to proceed."
        ];
        
        this.showNextDialog();
        this.showNextRoomPointer();
    }

    addFragmentToMissions(fragment) {
        // Add to local array
        this.passwordFragments.push(fragment);

        const sidebar = this.missionsSidebar;
        const fragmentIndex = this.passwordFragments.length - 1;
        const fragmentY = sidebar.y + 80 + fragmentIndex * 60;

        // Create fragment display
        const fragmentBg = this.add.graphics();
        fragmentBg.fillStyle(0x88e8d8, 0.2);
        fragmentBg.lineStyle(2, 0x88e8d8, 1);
        fragmentBg.fillRoundedRect(
            sidebar.x + 10,
            fragmentY - 20,
            sidebar.w - 20,
            50,
            8
        );
        fragmentBg.strokeRoundedRect(
            sidebar.x + 10,
            fragmentY - 20,
            sidebar.w - 20,
            50,
            8
        );

        // Fragment number label
        const label = this.add.text(
            sidebar.x + sidebar.w / 2,
            fragmentY - 5,
            `Fragment ${fragmentIndex + 1}`,
            {
                fontSize: '11px',
                fontFamily: 'Arial, sans-serif',
                color: '#88e8d8',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Fragment value
        const valueText = this.add.text(
            sidebar.x + sidebar.w / 2,
            fragmentY + 12,
            fragment,
            {
                fontSize: '16px',
                fontFamily: 'monospace',
                color: '#ffffff',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Animate entrance
        this.tweens.add({
            targets: [fragmentBg, label, valueText],
            alpha: { from: 0, to: 1 },
            scale: { from: 0.8, to: 1 },
            duration: 600,
            ease: 'Back.easeOut'
        });

        // Show temporary success message
        this.showTemporaryMessage('🔓 Password Fragment Acquired!', 3000);
    }

    showTemporaryMessage(message, duration = 2000) {
        const { width, height } = this.cameras.main;
        
        const messageText = this.add.text(width / 2, 50, message, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#4ade80',
            backgroundColor: '#1a1a2e',
            padding: { x: 20, y: 10 },
            borderRadius: 8
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(10000);

        this.tweens.add({
            targets: messageText,
            alpha: { from: 0, to: 1 },
            duration: 300
        });

        this.time.delayedCall(duration, () => {
            this.tweens.add({
                targets: messageText,
                alpha: 0,
                duration: 300,
                onComplete: () => messageText.destroy()
            });
        });
    }

    async executeCode(code) {
        try {
            const response = await fetch('http://localhost:3002/code-execution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: "java",
                    code: code
                })
            });

            const result = await response.json();
            
            if (result.output) {
                this.codeEditor.setOutput(result.output, '#4ade80');
            } else if (result.error) {
                this.codeEditor.setOutput(`❌ Error:\n${result.error}`, '#ef4444');
            } else {
                this.codeEditor.setOutput('✅ Code executed successfully!', '#4ade80');
            }

        } catch (err) {
            this.codeEditor.setOutput(`❌ Error: ${err.message}`, '#ef4444');
        }
    }

    async onClueComplete(clueKey) {
        this.completedClues.push(clueKey);
        this.currentClueIndex++;

        if (this.userId) {
            try {
                await api.post(`/users/${this.userId}/complete-question`, {
                    roomId: this.roomId,
                    questionIndex: this.completedClues.length - 1
                });
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }

        if (this.currentClueIndex >= this.roomClues.length) {
            this.dialogQueue = [
                "✅ All clues collected!",
                "Now, go to the computer and enter the final answer to unlock the password fragment."
            ];
            this.showNextDialog();
        } else {
            this.dialogQueue = [
                `✅ Task ${this.currentClueIndex} complete!`,
                "Great work! Look for the next clue to continue..."
            ];
            this.showNextDialog();
        }
    }

    createSidebar(x, y, w, h, title, color) {
        const border = this.add.graphics();
        border.lineStyle(4, Phaser.Display.Color.HexStringToColor(color).color, 1);
        border.strokeRoundedRect(x, y, w, h, 10);

        const titleBg = this.add.graphics();
        titleBg.fillStyle(0x1a1a2e, 0.9);
        titleBg.fillRoundedRect(x + 5, y + 5, w - 10, 50, 10);

        const titleText = this.add.text(x + w / 2, y + 30, title, {
            fontSize: `${20 * (this.scale.width / 1280)}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#00ffcc',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const contentBg = this.add.graphics();
        contentBg.fillStyle(0x0f1419, 0.7);
        contentBg.fillRoundedRect(x + 5, y + 60, w - 10, h - 65, 8);

        return { border, titleBg, titleText, contentBg, x, y, w, h };
    }

    createDialogBox(x, y, w, h) {
        const bg = this.add.graphics();
        bg.fillStyle(Phaser.Display.Color.HexStringToColor('#88e8d8').color, 1);
        bg.fillRoundedRect(x + 3, y + 3, w - 6, h - 6, 50);

        const hitArea = this.add.rectangle(x, y, w, h, 0x000000, 0)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        hitArea.on('pointerdown', () => {
            this.handleDialogClick();
        });

        this.dialogTextObj = this.add.text(x + w / 2, y + 30, "", {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#1a1a2e',
            fontStyle: 'bold',
            wordWrap: { width: w - 60 },
            align: 'center'
        }).setOrigin(0.5, 0); 

        this.clickIndicator = this.add.text(x + w - 40, y + h - 30, "▼", {
            fontSize: '20px',
            color: '#1a1a2e'
        }).setVisible(false);

        this.tweens.add({
            targets: this.clickIndicator,
            y: this.clickIndicator.y + 5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.dialogBox = { bg, x, y, w, h };
    }

    collectClue(clueKey, clueName, clueTaskKey) {
        // clueKey = 'notebook' or 'server' (the object identifier)
        // clueTaskKey = 'room1_taskA' or 'room1_taskB' (the task identifier)
        
        // Check if already collected
        if (this.collectedClues.includes(clueKey)) {
            this.dialogQueue = [
                "You've already collected this clue.",
                "Check the sidebar to review it."
            ];
            this.showNextDialog();
            return;
        }

        // Add to collected clues
        this.collectedClues.push(clueKey);

        // 🔹 VISUAL EFFECT - Remove from scene
        const targetObject = clueKey === 'notebook' ? this.notebook : this.server;
        
        this.tweens.add({
            targets: targetObject,
            alpha: 0,
            scale: 0,
            duration: 500,
            onComplete: () => {
                targetObject.destroy();
            }
        });

        // 🔹 ADD TO SIDEBAR
        this.addClueToSidebar(clueKey, clueName, clueTaskKey);

        // 🔹 UPDATE PROGRESS INDICATOR
        this.updateClueProgressIndicator();

        // 🔹 MARK CLUE AS FOUND IN BACKEND (using clueKey as clueId)
        if (this.userId) {
            api.post(`/users/${this.userId}/clue-found`, {
                roomId: this.roomId,
                clueId: clueKey  // 'notebook' or 'server'
            }).then(response => {
                console.log('✅ Clue saved to backend:', response.data);
            }).catch(error => {
                console.error('Error saving clue:', error);
            });
        }

        // 🔹 SHOW CLUE FOUND DIALOG
        this.dialogQueue = [
            `📓 You found: ${clueName}!`,
            "Click on it in the sidebar to read its contents and start solving."
        ];
        
        this.showNextDialog();
    }

    addClueToSidebar(clueKey, clueName, clueTaskKey) {
        const sidebar = this.cluesSidebar;
        const clueIndex = this.collectedClues.length - 1;
        const clueY = sidebar.y + 80 + clueIndex * 80;
        
        const clueScale = clueKey === 'server' ? 0.2 : 0.08;
        
        const clueIcon = this.add.image(sidebar.x + sidebar.w / 2, clueY, clueKey)
            .setScale(clueScale)
            .setInteractive({ useHandCursor: true });
        
        const clueText = this.add.text(sidebar.x + sidebar.w / 2, clueY + 35, clueName, {
            fontSize: '10px',
            fontFamily: 'Arial, sans-serif',
            color: '#88e8d8',
            align: 'center',
            wordWrap: { width: sidebar.w - 20 }
        }).setOrigin(0.5);

        clueIcon.on('pointerover', () => {
            clueIcon.setTint(0xffffff);
            clueText.setColor('#ffffff');
        });

        clueIcon.on('pointerout', () => {
            clueIcon.clearTint();
            clueText.setColor('#88e8d8');
        });

        clueIcon.on('pointerdown', () => {
            this.openClueWindows(clueTaskKey);
        });

        this.tweens.add({
            targets: [clueIcon, clueText],
            alpha: { from: 0, to: 1 },
            scale: { from: 0, to: clueIcon.scale },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    async openClueWindows(clueKey) {
        const clueDialogs = {
            'room1_taskA': [
                "The notebook creaks open… pages warped by time.",
                "A torn scrap is wedged between the notes — its ink fractured, symbols scattered.",
                "\"@2#1!8&\"",
                "The engineer left this on purpose… but buried it in noise.",
                "What survived the corruption hides in plain sight.",
                "Find what remains untouched."
            ],
            'room1_taskB': [
                "EVENS ONLY. ADD THEM."
            ]
        };

        this.dialogQueue = clueDialogs[clueKey] || ["No clue dialog defined."];

        this.events.once('dialogsComplete', async () => {
            await this.clueDescription.loadClue(clueKey);
            this.clueDescription.show();
            this.updateCodeEditorForClue(clueKey);
            this.codeEditor.show();
        });

        this.showNextDialog();
    }

    async updateCodeEditorForClue(clueKey) {
        const generalStarterCode = `public class Solution {
    public static void main(String[] args) {
        // Your investigation starts here.
    }
}`;

        console.log(`📖 Loading code for room ${this.roomId}...`);

        let savedCode = "";
        try {
            const res = await api.get(`/user-code/${this.userId}/${this.roomId}`);
            savedCode = res.data.code || "";
            
            if (savedCode) {
                console.log('✅ Loaded saved code from database');
            } else {
                console.log('ℹ️ No saved code found, using starter code');
            }
        } catch (err) {
            console.error("❌ Error loading saved code:", err);
        }

        const codeToLoad = savedCode || generalStarterCode;

        if (this.codeEditor.editor) {
            this.codeEditor.editor.setValue(codeToLoad);
        }
    }

    closeBothWindows() {
        this.codeEditor.hide();
        this.clueDescription.hide();
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
            this.clickIndicator.setVisible(false);
            this.events.emit('dialogsComplete');
        }
    }

    handleDialogClick() {
        if (this.isTyping) {
            this.dialogText = this.currentDialog;
            this.dialogTextObj.setText(this.dialogText);
            this.isTyping = false;
            this.dialogComplete = true;
            this.clickIndicator.setVisible(true);
        } else if (this.dialogComplete) {
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
            this.isTyping = false;
            this.dialogComplete = true;
            this.clickIndicator.setVisible(true);
        }
    }

    showNextRoomPointer() {
        const { width, height } = this.cameras.main;

        this.nextArrow = this.add.text(width - 80, height - 80, "➜", {
            fontSize: "60px",
            color: '#88e8d8'
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
            this.scene.start("Room2");
        });
    }

    shutdown() {
        if (this.codeEditor) {
            this.codeEditor.dispose();
        }
        if (this.clueDescription) {
            this.clueDescription.dispose();
        }
        if (this.passwordPopup) {
            this.passwordPopup.dispose();
        }
    }

    async saveCodeToDB(codeFromEditor) {
        if (!this.userId || !codeFromEditor) {
            console.warn('⚠️ Cannot save code');
            return;
        }

        try {
            const response = await api.post(`/user-code/${this.userId}/${this.roomId}`, {
                code: codeFromEditor
            });

            console.log('✅ Code saved successfully:', response.data);
            this.showTemporaryMessage('💾 Code saved!', 2000);
            
        } catch (err) {
            console.error('❌ Error saving code:', err);
            this.showTemporaryMessage('⚠️ Failed to save code', 2000);
        }
    }

    async loadUserGameState() {
        if (!this.userId) return;

        try {
            const response = await api.get(`/users/${this.userId}/game-state`);
            const gameState = response.data;

            console.log('📊 Loaded game state:', gameState);

            // Load found clues for this room
            const foundCluesInRoom = gameState.foundClues?.[this.roomId] || [];
            
            // Mark clues as already collected (prevent re-collecting)
            this.collectedClues = [...foundCluesInRoom];
            
            console.log(`✅ Found ${foundCluesInRoom.length} clues already collected in ${this.roomId}`);

            // Load password fragments
            const fragments = gameState.passwordFragments || {};
            if (fragments[this.roomId]) {
                this.passwordFragments.push(fragments[this.roomId]);
                console.log(`✅ Found password fragment for ${this.roomId}: ${fragments[this.roomId]}`);
            }

        } catch (error) {
            console.error('Error loading game state:', error);
        }
    }

    createClueProgressIndicator() {
        const { width, height } = this.scale;
        
        // Position at top center
        const x = width / 2;
        const y = 30;

        // Background
        const bgWidth = 200;
        const bgHeight = 40;
        
        const bg = this.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.9);
        bg.lineStyle(2, 0x88e8d8, 1);
        bg.fillRoundedRect(x - bgWidth/2, y - bgHeight/2, bgWidth, bgHeight, 8);
        bg.strokeRoundedRect(x - bgWidth/2, y - bgHeight/2, bgWidth, bgHeight, 8);
        bg.setScrollFactor(0);
        bg.setDepth(1000);

        // Required clues for this room
        const requiredClueKeys = ['notebook', 'server'];
        const foundCount = this.collectedClues.filter(clue => 
            requiredClueKeys.includes(clue)
        ).length;

        // Progress text
        this.clueProgressText = this.add.text(x, y, `🔍 Clues: ${foundCount}/${requiredClueKeys.length}`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#88e8d8',
            fontWeight: 'bold'
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1001);

        this.clueProgressBg = bg;
    }

    updateClueProgressIndicator() {
        const requiredClueKeys = ['notebook', 'server'];
        const foundCount = this.collectedClues.filter(clue => 
            requiredClueKeys.includes(clue)
        ).length;

        if (this.clueProgressText) {
            this.clueProgressText.setText(`🔍 Clues: ${foundCount}/${requiredClueKeys.length}`);
            
            // Change color when all clues are found
            if (foundCount === requiredClueKeys.length) {
                this.clueProgressText.setColor('#4ade80');
                
                // Add glow effect
                this.tweens.add({
                    targets: this.clueProgressText,
                    scale: { from: 1, to: 1.1 },
                    duration: 300,
                    yoyo: true,
                    repeat: 2
                });
            }
        }
    }
}