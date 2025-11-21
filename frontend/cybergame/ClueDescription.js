export default class ClueDescription {
    constructor(game, options = {}) {
        this.game = game;
        
        // 🔹 MAIN DESCRIPTION CONTAINER
        this.descriptionDiv = document.createElement('div');
        this.descriptionDiv.id = 'description-container';
        this.descriptionDiv.style.display = 'none';
        this.descriptionDiv.style.position = 'fixed';
        this.descriptionDiv.style.width = options.width || '35%';
        this.descriptionDiv.style.height = options.height || '90%';
        // Position description on the LEFT side
        this.descriptionDiv.style.top = '5%';
        this.descriptionDiv.style.left = '2%';
        this.descriptionDiv.style.right = 'auto';
        this.descriptionDiv.style.transform = 'none';
        // UPDATED: Background to match the dark teal/blue editor theme
        this.descriptionDiv.style.background = 'linear-gradient(135deg, #2A404F 0%, #16242B 100%)';
        // UPDATED: Border from cyan to a subtle gray
        this.descriptionDiv.style.border = '2px solid rgba(150, 150, 150, 0.3)';
        this.descriptionDiv.style.borderRadius = '16px';
        this.descriptionDiv.style.zIndex = 999;
        this.descriptionDiv.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
        this.descriptionDiv.style.overflow = 'hidden';
        this.descriptionDiv.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(this.descriptionDiv);

        // 🔹 TOP BAR
        this.topBar = document.createElement('div');
        this.topBar.style.display = 'flex';
        this.topBar.style.alignItems = 'center';
        this.topBar.style.justifyContent = 'space-between';
        this.topBar.style.padding = '16px 20px';
        this.topBar.style.background = 'rgba(16, 18, 20, 0.9)';
        this.topBar.style.backdropFilter = 'blur(8px)';
        // UPDATED: Border from cyan to a subtle dark gray
        this.topBar.style.borderBottom = '1px solid rgba(150, 150, 150, 0.1)';
        this.descriptionDiv.appendChild(this.topBar);

        // Title
        this.titleLabel = document.createElement('h2');
        this.titleLabel.innerHTML = '📋 Task Description';
        this.titleLabel.style.margin = '0';
        this.titleLabel.style.fontWeight = '600';
        this.titleLabel.style.color = '#D4D4D4'; // Kept Off-White/Light Gray
        this.titleLabel.style.fontSize = '20px';
        this.topBar.appendChild(this.titleLabel);

        // Close button
        this.closeButton = document.createElement('button');
        this.closeButton.innerHTML = '✕';
        this.closeButton.style.padding = '6px 12px';
        this.closeButton.style.background = 'rgba(239, 68, 68, 0.2)';
        this.closeButton.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        this.closeButton.style.borderRadius = '6px';
        this.closeButton.style.color = '#D4D4D4';
        this.closeButton.style.fontSize = '18px';
        this.closeButton.style.fontWeight = 'bold';
        this.closeButton.style.cursor = 'pointer';
        this.closeButton.style.transition = 'all 0.2s';
        
        this.closeButton.onmouseover = () => {
            this.closeButton.style.background = 'rgba(239, 68, 68, 0.4)';
            this.closeButton.style.transform = 'scale(1.1)';
        };
        
        this.closeButton.onmouseout = () => {
            this.closeButton.style.background = 'rgba(239, 68, 68, 0.2)';
            this.closeButton.style.transform = 'scale(1)';
        };

        this.closeButton.onclick = () => this.hide();
        this.topBar.appendChild(this.closeButton);

        // 🔹 CONTENT AREA
        this.contentDiv = document.createElement('div');
        this.contentDiv.style.padding = '24px';
        this.contentDiv.style.overflowY = 'auto';
        this.contentDiv.style.height = 'calc(100% - 80px)';
        this.contentDiv.style.color = '#e2e8f0';
        this.contentDiv.style.fontSize = '15px';
        this.contentDiv.style.lineHeight = '1.8';
        this.descriptionDiv.appendChild(this.contentDiv);

        // Custom scrollbar styling
        const style = document.createElement('style');
        style.textContent = `
            #description-container::-webkit-scrollbar {
                width: 8px;
            }
            #description-container::-webkit-scrollbar-track {
                background: rgba(30, 40, 50, 0.5);
                border-radius: 4px;
            }
            #description-container::-webkit-scrollbar-thumb {
                /* UPDATED: Cyan to Forest Green accent */
                background: rgba(88, 183, 129, 0.3); 
                border-radius: 4px;
            }
            #description-container::-webkit-scrollbar-thumb:hover {
                /* UPDATED: Cyan to Forest Green accent */
                background: rgba(88, 183, 129, 0.5);
            }
        `;
        document.head.appendChild(style);

        this.currentClue = null;
    }

    // 🔹 FETCH AND DISPLAY PUZZLE FROM BACKEND
    async loadClue(clueKey) {
        try {
            // Show loading state
            this.contentDiv.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 40px; margin-bottom: 16px;">⏳</div>
                    <div style="color: #58B781;">Loading Clue...</div>
                </div>
            `;
            
            this.show();

            // Fetch clue from backend
            const response = await fetch(`http://localhost:3002/clue/by-key/${clueKey}`);
            
            if (!response.ok) {
                throw new Error('Failed to load clue');
            }

            const clue = await response.json();
            this.currentClue = clue;
            this.displayClue(clue);

        } catch (error) {
            console.error('❌ Error loading clue:', error);
            this.contentDiv.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 40px; margin-bottom: 16px;">❌</div>
                    <div style="color: #ef4444; font-weight: 600;">Error loading clue</div>
                    <div style="color: #94a3b8; font-size: 13px; margin-top: 8px;">${error.message}</div>
                </div>
            `;
        }
    }

    // 🔹 DISPLAY PUZZLE CONTENT
    displayClue(clue) {
        let html = `
            <div style="margin-bottom: 24px;">
                <h3 style="color: #58B781; font-size: 22px; margin: 0 0 12px 0; font-weight: 600;">
                    ${clue.title}
                </h3>
                <div style="width: 50px; height: 3px; background: linear-gradient(90deg, #58B781, transparent); margin-bottom: 20px;"></div>
            </div>

            <div style="background: rgba(88, 183, 129, 0.1); border-left: 4px solid #58B781; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <div style="font-weight: 600; color: #58B781; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    📝 Task Guidance
                </div>
                <div style="color: #cbd5e1;">
                    ${clue.guidance}
                </div>
            </div>
        `;

        // Add test cases if available
        if (clue.testCases && clue.testCases.length > 0) {
            html += `
                <div style="margin-top: 24px;">
                    <div style="font-weight: 600; color: #58B781; margin-bottom: 12px; font-size: 16px;">
                        🧪 Test Cases (Expected Output)
                    </div>
                </div>
            `;

            clue.testCases.forEach((testCase, index) => {
                const inputStr = this.formatValue(testCase.input);
                const outputStr = this.formatValue(testCase.expectedOutput);

                html += `
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(88, 183, 129, 0.2); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="color: #94a3b8; font-size: 13px; margin-bottom: 8px; font-weight: 600;">
                            Test Case ${index + 1}
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; align-items: start;">
                                <span style="color: #58B781; min-width: 80px; font-weight: 500;">Input:</span>
                                <code style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; color: #60A5FA; font-family: 'Courier New', monospace; font-size: 13px; flex: 1;">${inputStr}</code>
                            </div>
                            <div style="display: flex; align-items: start;">
                                <span style="color: #58B781; min-width: 80px; font-weight: 500;">Expected:</span>
                                <code style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px; border-radius: 4px; color: #4ade80; font-family: 'Courier New', monospace; font-size: 13px; flex: 1;">${outputStr}</code>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // Add helpful hint section
        html += `
            <div style="margin-top: 24px; padding: 16px; background: rgba(202, 138, 4, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 20px;">💡</span>
                    <span style="color: #eab308; font-weight: 600; font-size: 14px;">Debugging Tip</span>
                </div>
                <div style="color: #D4D4D4; font-size: 13px;">
                    Compare your console output with the expected output shown above. Debug your code until they match exactly!
                </div>
            </div>
        `;

        this.contentDiv.innerHTML = html;
    }

    // 🔹 HELPER: Format input/output values for display
    formatValue(value) {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value, null, 2)
                .replace(/\n/g, '<br>')
                .replace(/ /g, '&nbsp;');
        }
        return String(value);
    }

    show() {
        this.descriptionDiv.style.display = 'block';
    }

    hide() {
        this.descriptionDiv.style.display = 'none';
    }

    dispose() {
        if (this.descriptionDiv && this.descriptionDiv.parentNode) {
            this.descriptionDiv.parentNode.removeChild(this.descriptionDiv);
        }
    }
}