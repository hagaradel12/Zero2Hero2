class Scene2 extends Phaser.Scene {
  constructor() {
    super({ key: "Scene2" });
    this.dialogSystem = null;
  }

  preload() {
    this.load.image("scene2_bg", "/assets/images/Background1.png");
  }

  create() {
    const width = this.game.config.width;
    const height = this.game.config.height;

    const bg = this.add.image(0, 0, "scene2_bg").setOrigin(0, 0);
    bg.setDisplaySize(width, height);

    this.dialogSystem = new DialogSystem(this);
    const dialogs = [
      {
        title: "Question 1",
        character: "Master Wizard",
        text: "Here lies your first chalenge. Read the spell on the left, then craft your code on the right.",
      },
    ];
    this.dialogSystem.showDialogSequence(dialogs);


    this.input.on("pointerdown", () => this.dialogSystem.nextDialog());

  }

  showQuestionAndEditor() {
    const width = this.game.config.width;
    const height = this.game.config.height;

    // Left question panel
    const questionPanel = this.add.rectangle(width * 0.25, height / 2, width * 0.45, height * 0.8, 0x101010, 0.9)
      .setStrokeStyle(2, 0x7b3ff3);
    this.add.text(width * 0.07, height * 0.2,
      "🧩 Question:\n\nWrite a function that prints numbers 1-5 to the console.\nThen run it!",
      { fontFamily: "monospace", fontSize: "18px", color: "#ffffff", wordWrap: { width: width * 0.4 } }
    );

    // Right side DOM container for Monaco + console
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = width * 0.55 + "px";
    container.style.top = height * 0.15 + "px";
    container.style.width = width * 0.4 + "px";
    container.style.height = height * 0.7 + "px";
    container.style.background = "#1e1e1e";
    container.style.border = "2px solid #21d4fd";
    container.style.borderRadius = "10px";
    container.style.overflow = "hidden";
    container.id = "editor-container";
    document.body.appendChild(container);

    // --- Monaco editor + real execution ---
    require(["vs/editor/editor.main"], () => {
      const editor = monaco.editor.create(container, {
        value: `function castSpell() {
  for (let i = 1; i <= 5; i++) console.log(i);
}
castSpell();`,
        language: "javascript",
        theme: "vs-dark",
        fontSize: 16,
        minimap: { enabled: false },
      });

      // Console output div
      const consoleDiv = document.createElement("div");
      consoleDiv.style.background = "#111";
      consoleDiv.style.color = "#00ff90";
      consoleDiv.style.padding = "10px";
      consoleDiv.style.height = "120px";
      consoleDiv.style.overflowY = "auto";
      consoleDiv.style.fontFamily = "monospace";
      consoleDiv.style.fontSize = "14px";
      consoleDiv.innerText = "🧪 Console ready...\n";
      container.appendChild(consoleDiv);

      // Run button
      const runBtn = document.createElement("button");
      runBtn.innerText = "Run Code ▶";
      runBtn.style.position = "absolute";
      runBtn.style.top = "8px";
      runBtn.style.right = "8px";
      runBtn.style.background = "#21d4fd";
      runBtn.style.border = "none";
      runBtn.style.padding = "6px 12px";
      runBtn.style.borderRadius = "6px";
      runBtn.style.cursor = "pointer";
      container.appendChild(runBtn);

      // Sandbox for execution
      runBtn.onclick = () => {
        const code = editor.getValue();
        consoleDiv.innerText = "";

        // capture console.log output safely
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const iframeWindow = iframe.contentWindow;

        iframeWindow.console.log = (...args) => {
          consoleDiv.innerText += args.join(" ") + "\n";
        };

        try {
          iframeWindow.eval(code);
        } catch (err) {
          consoleDiv.innerText += "❌ Error: " + err.message + "\n";
        }
        iframe.remove();
      };
    });
  }
}
