import { Controller } from "jsnes";

// Mapping keyboard code to [controller, button]
const KEYS = {
  75: [1, Controller.BUTTON_A, "K"], // X
  74: [1, Controller.BUTTON_B, "J"], // Y (Central European keyboard)
  90: [1, Controller.BUTTON_B, "Z"], // Z
  70: [1, Controller.BUTTON_SELECT, "F"], // Right Ctrl
  72: [1, Controller.BUTTON_START, "H"], // Enter
  87: [1, Controller.BUTTON_UP, "W"], // Up
  83: [1, Controller.BUTTON_DOWN, "S"], // Down
  65: [1, Controller.BUTTON_LEFT, "A"], // Left
  68: [1, Controller.BUTTON_RIGHT, "D"], // Right
  73: [1, Controller.BUTTON_A, "I", true], // TurboA
  85: [1, Controller.BUTTON_B, "U", true], // TurboB
  103: [2, Controller.BUTTON_A, "Num-7"], // Num-7
  105: [2, Controller.BUTTON_B, "Num-9"], // Num-9
  99: [2, Controller.BUTTON_SELECT, "Num-3"], // Num-3
  97: [2, Controller.BUTTON_START, "Num-1"], // Num-1
  104: [2, Controller.BUTTON_UP, "Num-8"], // Num-8
  98: [2, Controller.BUTTON_DOWN, "Num-2"], // Num-2
  100: [2, Controller.BUTTON_LEFT, "Num-4"], // Num-4
  102: [2, Controller.BUTTON_RIGHT, "Num-6"] // Num-6
};

export default class KeyboardController {
  constructor(options) {
    this.onButtonDown = options.onButtonDown;
    this.onButtonUp = options.onButtonUp;
    this.turboSpeed = 1e3 / 30;
    this.turboKeys = new Set();
    this.lastUpdateTime = Date.now();
  }

  turbo() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    for(let code of this.turboKeys) {
      const key = this.keys[code];
      if (deltaTime >= this.turboSpeed) {
        this.onButtonDown(key[0], key[1]);
        this.lastUpdateTime = currentTime;
      } else {
        this.onButtonUp(key[0], key[1]);
      }
    }
  }

  loadKeys = () => {
    var keys;
    try {
      keys = localStorage.getItem("keys");
      if (keys) {
        keys = JSON.parse(keys);
      }
    } catch (e) {
      console.log("Failed to get keys from localStorage.", e);
    }

    this.keys = keys || KEYS;
  };

  setKeys = newKeys => {
    try {
      localStorage.setItem("keys", JSON.stringify(newKeys));
      this.keys = newKeys;
    } catch (e) {
      console.log("Failed to set keys in localStorage");
    }
  };

  handleKeyDown = e => {
    var key = this.keys[e.keyCode];
    if (key) {
      if (key[3]) {
        if (!this.turboKeys.has(e.keyCode)) {
          this.onButtonDown(key[0], key[1]);
          this.turboKeys.add(e.keyCode);
        }
      } else {
        this.onButtonDown(key[0], key[1]);
      }
      e.preventDefault();
    }
  };

  handleKeyUp = e => {
    var key = this.keys[e.keyCode];
    if (key) {
      this.onButtonUp(key[0], key[1]);
      if (key[3] && this.turboKeys.has(e.keyCode)) {
        this.turboKeys.delete(e.keyCode)
      }
      e.preventDefault();
    }
  };

  handleKeyPress = e => {
    e.preventDefault();
  };
}
