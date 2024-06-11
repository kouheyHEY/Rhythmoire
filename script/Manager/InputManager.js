class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.observeKeyMap = {};
    }

    /**
     * 監視するキーの追加
     * @param {string} keyCode マネージャに登録するキーのキーコード
     */
    addKeyCodes(keyCode) {
        this.observeKeyMap[keyCode] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keyCode]);
    }

    /**
     * 指定したキーの状態を取得
     * @param {string} keyCode 取得するキーのキーコード
     * @returns キーの状態（押されていればtrue）
     */
    getPushedKeyOf(keyCode) {
        return this.observeKeyMap[keyCode].isDown;
    }
}