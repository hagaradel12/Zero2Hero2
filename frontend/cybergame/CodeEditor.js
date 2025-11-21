export default class CodeEditor {
    constructor(game, options = {}) {
        this.game = game;
        this.isMonacoLoaded = false;
        
        // 🔹 LOAD MONACO EDITOR DYNAMICALLY
        this.loadMonaco();
        
        // 🔹 MAIN EDITOR CONTAINER
        this.editorDiv = document.createElement('div');
        this.editorDiv.id = 'editor-container';
        this.editorDiv.style.display = 'none';
        this.editorDiv.style.position = 'fixed';
        this.editorDiv.style.width = options.width || '35%';
        this.editorDiv.style.height = options.height || '90%';
        // Position editor on the RIGHT side
        this.editorDiv.style.top = '5%';
        this.editorDiv.style.right = '2%';
       this.editorDiv.style.right = '2%';
        this.editorDiv.style.left = 'auto';
        this.editorDiv.style.transform = 'none';

        this.editorDiv.style.background = 'linear-gradient(135deg, #2A404F 0%, #16242B 100%)'; // UPDATED
        this.editorDiv.style.border = '2px solid rgba(0, 0, 0, 0.48)';
        this.editorDiv.style.borderRadius = '16px';
        this.editorDiv.style.zIndex = 1000;
        this.editorDiv.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.48)';
        this.editorDiv.style.overflow = 'hidden';
        document.body.appendChild(this.editorDiv);

        // 🔹 TOP BAR
        this.topBar = document.createElement('div');
        this.topBar.style.display = 'flex';
        this.topBar.style.alignItems = 'center';
        this.topBar.style.justifyContent = 'space-between';
        this.topBar.style.padding = '12px 16px';
        this.topBar.style.background = 'rgba(16, 18, 20, 0.7)';
        this.topBar.style.backdropFilter = 'blur(8px)';
        this.topBar.style.borderBottom = '1px solid rgba(28, 30, 33, 0.2)';
        this.editorDiv.appendChild(this.topBar);

        // Left section - Title & Language
        this.leftSection = document.createElement('div');
        this.leftSection.style.display = 'flex';
        this.leftSection.style.alignItems = 'center';
        this.leftSection.style.gap = '12px';
        this.topBar.appendChild(this.leftSection);

        // Title
        this.titleLabel = document.createElement('span');
        this.titleLabel.innerHTML = '💻 Code Editor';
        this.titleLabel.style.fontWeight = '600';
        this.titleLabel.style.color = '#D4D4D4';
        this.titleLabel.style.fontSize = '14px';
        this.titleLabel.style.fontFamily = 'Arial, sans-serif';
        this.leftSection.appendChild(this.titleLabel);

        

        // Right section - Action Buttons
        this.rightSection = document.createElement('div');
        this.rightSection.style.display = 'flex';
        this.rightSection.style.alignItems = 'center';
        this.rightSection.style.gap = '8px';
        this.topBar.appendChild(this.rightSection);

        // 💡 HINT BUTTON
        this.hintButton = this.createButton('💡 Hint', '#ca8a04', '#eab308');
        this.rightSection.appendChild(this.hintButton);

        // 💬 REVIEW BUTTON
        this.reviewButton = this.createButton('💬 Review', '#1e40af', '#3b82f6');
        this.rightSection.appendChild(this.reviewButton);

        // ▶ RUN BUTTON (functional)
        this.runButton = this.createButton('▶ Run', '#1e40af', '#3b82f6');
        this.rightSection.appendChild(this.runButton);

        // 🏁 FINISH BUTTON
        this.finishButton = this.createButton('🏁 Finish', '#15803d', '#22c55e');
        this.rightSection.appendChild(this.finishButton);

        // 🔹 MONACO EDITOR WRAPPER
        this.monacoWrapper = document.createElement('div');
        this.monacoWrapper.id = 'monaco-wrapper';
        this.monacoWrapper.style.width = '100%';
        this.monacoWrapper.style.height = 'calc(100% - 210px)'; // Leave space for top bar and console
        this.editorDiv.appendChild(this.monacoWrapper);

        // 🔹 CONSOLE OUTPUT
        this.consoleDiv = document.createElement('div');
        this.consoleDiv.style.width = '100%';
        this.consoleDiv.style.height = '150px';
        this.consoleDiv.style.background = 'rgba(0, 0, 0, 0.8)';
        this.consoleDiv.style.borderTop = '1px solid rgba(0, 0, 0, 0.2)';
        this.consoleDiv.style.padding = '16px';
        this.consoleDiv.style.overflowY = 'auto';
        this.consoleDiv.style.fontFamily = 'monospace';
        this.consoleDiv.style.fontSize = '13px';
        this.consoleDiv.style.color = '#4ade80';
        this.consoleDiv.style.borderBottomLeftRadius = '16px';
        this.consoleDiv.style.borderBottomRightRadius = '16px';
        this.consoleDiv.innerHTML = '<div style="color: #64748b;">💻 Console output will appear here...</div>';
        this.editorDiv.appendChild(this.consoleDiv);

        this.editor = null;
        this.onRunCallback = null;
        this.onFinishCallback = null;
        this.pendingInitData = null;
    }

    // 🔹 CREATE STYLED BUTTON
    createButton(text, bgColor, hoverColor) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.padding = '8px 16px';
        button.style.background = `rgba(${this.hexToRgb(bgColor)}, 0.4)`;
        button.style.border = `1px solid rgba(${this.hexToRgb(hoverColor)}, 0.3)`;
        button.style.borderRadius = '6px';
        button.style.color = '#D4D4D4';
        button.style.fontSize = '13px';
        button.style.fontWeight = '500';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.2s';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.gap = '6px';
        
        button.onmouseover = () => {
            button.style.background = `rgba(${this.hexToRgb(hoverColor)}, 0.4)`;
            button.style.transform = 'translateY(-1px)';
        };
        
        button.onmouseout = () => {
            button.style.background = `rgba(${this.hexToRgb(bgColor)}, 0.4)`;
            button.style.transform = 'translateY(0)';
        };

        return button;
    }

    // Helper: Convert hex to RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result 
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '59, 130, 246';
    }

    // 🔹 LOAD MONACO EDITOR DYNAMICALLY
    loadMonaco() {
        if (window.monaco) {
            this.isMonacoLoaded = true;
            console.log('✅ Monaco already loaded');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // Create loader script
            const loaderScript = document.createElement('script');
            loaderScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
            
            loaderScript.onload = () => {
                // Configure require.js
                window.require.config({ 
                    paths: { 
                        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
                    } 
                });

                // Load Monaco Editor
                window.require(['vs/editor/editor.main'], () => {
                    this.isMonacoLoaded = true;
                    console.log('✅ Monaco Editor loaded successfully!');
                    
                    // If there was pending initialization, do it now
                    if (this.pendingInitData) {
                        const { starterCode, language, theme } = this.pendingInitData;
                        this.initEditor(starterCode, language, theme);
                        this.pendingInitData = null;
                    }
                    
                    resolve();
                });
            };

            loaderScript.onerror = () => {
                console.error('❌ Failed to load Monaco Editor');
                reject(new Error('Monaco Editor failed to load'));
            };

            document.head.appendChild(loaderScript);
        });
    }

    initEditor(starterCode, language = 'java', theme = 'vs-dark') {
        // 🔹 IF MONACO NOT LOADED YET, SAVE DATA AND WAIT
        if (!this.isMonacoLoaded || !window.monaco) {
            console.log('⏳ Monaco not ready yet, queuing initialization...');
            this.pendingInitData = { starterCode, language, theme };
            return;
        }

        // 🔹 CREATE MONACO EDITOR
        this.editor = monaco.editor.create(this.monacoWrapper, {
            value: starterCode,
            language: language,
            theme: theme,
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontFamily: 'Fira Code, Courier New, monospace'
        });

        console.log('✅ Monaco Editor initialized');

        // 🔹 RUN BUTTON FUNCTIONALITY
        this.runButton.onclick = () => {
            if (this.onRunCallback) {
                const code = this.editor.getValue();
                this.consoleDiv.innerHTML = '<div style="color: #facc15;">⏳ Running code...</div>';
                this.onRunCallback(code);
            }
        };

        // 🔹 PLACEHOLDER CLICK HANDLERS (no functionality)
        this.hintButton.onclick = () => {
            console.log('💡 Hint button clicked (placeholder)');
        };

        this.reviewButton.onclick = () => {
            console.log('💬 Review button clicked (placeholder)');
        };

        // 🔹 FINISH BUTTON - call callback with current code
        this.finishButton.onclick = () => {
            console.log('🏁 Finish button clicked');
            if (this.onFinishCallback) {
                const code = this.editor.getValue();
                this.onFinishCallback(code);
            }
        };
    }

    show() {
        this.editorDiv.style.display = 'block';
        
        if (this.editor) {
            this.editor.layout(); // refresh layout
        }
    }

    hide() {
        this.editorDiv.style.display = 'none';
    }

    // 🔹 UPDATE CONSOLE OUTPUT
    setOutput(text, color = '#4ade80') {
        this.consoleDiv.innerHTML = `<div style="color: ${color};">${text}</div>`;
    }

    onRun(callback) {
        this.onRunCallback = callback;
    }

    onFinish(callback) {
        this.onFinishCallback = callback;
    }

    dispose() {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }
        if (this.editorDiv && this.editorDiv.parentNode) {
            this.editorDiv.parentNode.removeChild(this.editorDiv);
        }
    }
}