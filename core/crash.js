
window.NotImplementedError = class NotImplementedError extends Error {
  constructor() {
    super("The method is not implemented.");
    this.name = "NotImplementedError";
  }
};

window.GlobalErrorHandler = {
  handled: false,
  cleanStart: false,
  onerror(event) {
    if (this.handled) return;
    this.handled = true;
    if (!this.cleanStart) {
      document.getElementById("loading").style.display = "none";
      requestAnimationFrame(() => this.crash(event));
      return;
    }
    this.stopGame();
    this.crash(event);
  },
  stopGame() {
    GameKeyboard.disable();
    GameIntervals.stop();
  },
  crash(message) {
    if (window.GameUI !== undefined && GameUI.initialized) {
      Modal.message.show(`${message}<br>Check the console for more details`, {}, 3);
    }

    debugger
  }
};

window.onerror = (event, source) => {
  if (!source.endsWith(".js")) return;
  GlobalErrorHandler.onerror(event);
};
