export default class DialogSystem {
  constructor(scene, dialogData) {
    this.scene = scene;
    this.dialogData = dialogData || [];
    this.dialogIndex = 0;
    this.textBox = null;
    this.text = null;
    this.isActive = false;
    this.onComplete = null;
    this.clickHandler = null; // Store reference to handler
  }

  startDialog() {
    if (!this.dialogData.length) return;
    this.isActive = true;
    this.createTextBox();
    this.showNextLine();
  }

  createTextBox() {
    const { width, height } = this.scene.scale;

    const boxWidth = width * 0.8;
    const boxHeight = 120;

    // Semi-transparent box
    this.textBox = this.scene.add.rectangle(
      width / 2,
      height - boxHeight / 2 - 20,
      boxWidth,
      boxHeight,
      0x000000,
      0.6
    );

    // Text field
    this.text = this.scene.add.text(
      width / 2 - boxWidth / 2 + 20,
      height - boxHeight + 20,
      "",
      {
        fontSize: "20px",
        color: "#ffffff",
        wordWrap: { width: boxWidth - 40 },
      }
    );

    // Remove ALL previous listeners to avoid conflicts
    this.scene.input.off("pointerdown");
    
    // Store the handler reference so we can remove it later
    this.clickHandler = () => this.showNextLine();
    this.scene.input.on("pointerdown", this.clickHandler);
  }

  showNextLine() {
    if (!this.isActive || !this.text) return;

    if (this.dialogIndex < this.dialogData.length) {
      const line = this.dialogData[this.dialogIndex];
      this.text.setText(`${line.speaker}: ${line.text}`);
      this.dialogIndex++;
    } else {
      this.endDialog();
    }
  }

  endDialog() {
    // Clean up UI elements
    if (this.textBox) {
      this.textBox.destroy();
      this.textBox = null;
    }
    if (this.text) {
      this.text.destroy();
      this.text = null;
    }

    // Remove the specific click handler
    if (this.clickHandler) {
      this.scene.input.off("pointerdown", this.clickHandler);
      this.clickHandler = null;
    }

    this.isActive = false;
    this.dialogIndex = 0;

    // Emit event
    this.scene.events.emit("dialogComplete");
    
    // Call the callback ONCE
    if (typeof this.onComplete === "function") {
      this.onComplete();
    }
  }
}