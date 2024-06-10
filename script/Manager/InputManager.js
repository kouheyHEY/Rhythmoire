class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.keyMap = {};
    }
    
    addKeyCodes(keyCode) {
        this.keyMap[keyCode] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keyCode]);
    }
    
    getPushedKeyOf(keyCode) {
        return this.keyMap[keyCode].isDown;
    }
}