export default class PasswordPopup {
    constructor(game) {
        this.game = game;
        this.createPopup();
    }

    createPopup() {
        // Main container
        this.popupDiv = document.createElement('div');
        this.popupDiv.id = 'password-popup';
        this.popupDiv.style.display = 'none';
        this.popupDiv.style.position = 'fixed';
        this.popupDiv.style.top = '50%';
        this.popupDiv.style.left = '50%';
        this.popupDiv.style.transform = 'translate(-50%, -50%)';
        this.popupDiv.style.width = '450px';
        this.popupDiv.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
        this.popupDiv.style.border = '3px solid #88e8d8';
        this.popupDiv.style.borderRadius = '16px';
        this.popupDiv.style.padding = '32px';
        this.popupDiv.style.zIndex = '10000';
        this.popupDiv.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.7)';
        this.popupDiv.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.popupDiv);

        // Overlay background
        this.overlay = document.createElement('div');
        this.overlay.style.display = 'none';
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.background = 'rgba(0, 0, 0, 0.7)';
        this.overlay.style.zIndex = '9999';
        this.overlay.style.backdropFilter = 'blur(5px)';
        document.body.appendChild(this.overlay);

        // Title
        const title = document.createElement('h2');
        title.innerHTML = '🔐 Enter Password Fragment';
        title.style.margin = '0 0 24px 0';
        title.style.color = '#88e8d8';
        title.style.fontSize = '24px';
        title.style.fontWeight = '600';
        title.style.textAlign = 'center';
        this.popupDiv.appendChild(title);

        // Description
        const description = document.createElement('p');
        description.innerHTML = 'The computer awaits your answer.<br>What did you discover from the corrupted logs?';
        description.style.color = '#cbd5e1';
        description.style.fontSize = '15px';
        description.style.marginBottom = '24px';
        description.style.textAlign = 'center';
        description.style.lineHeight = '1.6';
        this.popupDiv.appendChild(description);

        // Input field
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Enter your answer...';
        this.inputField.style.width = '100%';
        this.inputField.style.padding = '14px 16px';
        this.inputField.style.background = 'rgba(15, 23, 42, 0.8)';
        this.inputField.style.border = '2px solid rgba(136, 232, 216, 0.3)';
        this.inputField.style.borderRadius = '8px';
        this.inputField.style.color = '#e2e8f0';
        this.inputField.style.fontSize = '16px';
        this.inputField.style.fontFamily = 'Arial, sans-serif';
        this.inputField.style.outline = 'none';
        this.inputField.style.marginBottom = '20px';
        this.inputField.style.boxSizing = 'border-box';

        this.inputField.onfocus = () => {
            this.inputField.style.borderColor = '#88e8d8';
        };

        this.inputField.onblur = () => {
            this.inputField.style.borderColor = 'rgba(136, 232, 216, 0.3)';
        };

        this.popupDiv.appendChild(this.inputField);

        // Message area (for feedback)
        this.messageArea = document.createElement('div');
        this.messageArea.style.minHeight = '24px';
        this.messageArea.style.marginBottom = '16px';
        this.messageArea.style.textAlign = 'center';
        this.messageArea.style.fontSize = '14px';
        this.messageArea.style.fontWeight = '600';
        this.popupDiv.appendChild(this.messageArea);

        // Buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '12px';
        buttonsDiv.style.justifyContent = 'center';
        this.popupDiv.appendChild(buttonsDiv);

        // Submit button
        this.submitButton = document.createElement('button');
        this.submitButton.innerHTML = '✓ Submit';
        this.submitButton.style.padding = '12px 32px';
        this.submitButton.style.background = 'linear-gradient(135deg, #88e8d8, #5fb8a8)';
        this.submitButton.style.border = 'none';
        this.submitButton.style.borderRadius = '8px';
        this.submitButton.style.color = '#0f172a';
        this.submitButton.style.fontSize = '16px';
        this.submitButton.style.fontWeight = '600';
        this.submitButton.style.cursor = 'pointer';
        this.submitButton.style.transition = 'all 0.3s';

        this.submitButton.onmouseover = () => {
            this.submitButton.style.transform = 'scale(1.05)';
            this.submitButton.style.boxShadow = '0 4px 20px rgba(136, 232, 216, 0.4)';
        };

        this.submitButton.onmouseout = () => {
            this.submitButton.style.transform = 'scale(1)';
            this.submitButton.style.boxShadow = 'none';
        };

        buttonsDiv.appendChild(this.submitButton);

        // Cancel button
        this.cancelButton = document.createElement('button');
        this.cancelButton.innerHTML = '✕ Cancel';
        this.cancelButton.style.padding = '12px 32px';
        this.cancelButton.style.background = 'rgba(239, 68, 68, 0.2)';
        this.cancelButton.style.border = '2px solid rgba(239, 68, 68, 0.4)';
        this.cancelButton.style.borderRadius = '8px';
        this.cancelButton.style.color = '#ef4444';
        this.cancelButton.style.fontSize = '16px';
        this.cancelButton.style.fontWeight = '600';
        this.cancelButton.style.cursor = 'pointer';
        this.cancelButton.style.transition = 'all 0.3s';

        this.cancelButton.onmouseover = () => {
            this.cancelButton.style.background = 'rgba(239, 68, 68, 0.3)';
            this.cancelButton.style.transform = 'scale(1.05)';
        };

        this.cancelButton.onmouseout = () => {
            this.cancelButton.style.background = 'rgba(239, 68, 68, 0.2)';
            this.cancelButton.style.transform = 'scale(1)';
        };

        this.cancelButton.onclick = () => this.hide();

        buttonsDiv.appendChild(this.cancelButton);

        // Allow Enter key to submit
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitButton.click();
            }
        });
    }

    show(expectedAnswer, onCorrect, onIncorrect) {
        this.expectedAnswer = String(expectedAnswer).trim();
        this.onCorrect = onCorrect;
        this.onIncorrect = onIncorrect;

        this.overlay.style.display = 'block';
        this.popupDiv.style.display = 'block';
        this.inputField.value = '';
        this.messageArea.innerHTML = '';
        this.inputField.focus();

        // Set submit handler
        this.submitButton.onclick = () => {
            this.checkAnswer();
        };
    }

    checkAnswer() {
        const userAnswer = this.inputField.value.trim();

        if (!userAnswer) {
            this.showMessage('Please enter an answer', '#ef4444');
            return;
        }

        if (userAnswer === this.expectedAnswer) {
            this.showMessage('✅ Correct!', '#4ade80');
            
            // Delay to show success message
            setTimeout(() => {
                this.hide();
                if (this.onCorrect) {
                    this.onCorrect();
                }
            }, 1000);
        } else {
            this.showMessage('❌ Incorrect. Try again!', '#ef4444');
            if (this.onIncorrect) {
                this.onIncorrect();
            }
            
            // Shake animation
            this.popupDiv.style.animation = 'shake 0.5s';
            setTimeout(() => {
                this.popupDiv.style.animation = '';
            }, 500);
        }
    }

    showMessage(text, color) {
        this.messageArea.innerHTML = text;
        this.messageArea.style.color = color;
    }

    hide() {
        this.overlay.style.display = 'none';
        this.popupDiv.style.display = 'none';
        this.inputField.value = '';
        this.messageArea.innerHTML = '';
    }

    dispose() {
        if (this.popupDiv && this.popupDiv.parentNode) {
            this.popupDiv.parentNode.removeChild(this.popupDiv);
        }
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) translateX(0); }
        25% { transform: translate(-50%, -50%) translateX(-10px); }
        75% { transform: translate(-50%, -50%) translateX(10px); }
    }
`;
document.head.appendChild(style);