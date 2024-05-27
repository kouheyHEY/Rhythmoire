// PreloadScene.js
class PreLoadScene extends Phaser.Scene {
    constructor() {
        super({ key: C_COMMON.SCENE_PRELOADSCENE });
    }

    preload() {
        // 画像の読み込み
        // プレイヤー
        this.load.image(
            C_ASSETS.IMAGE_KEY_PLAYER,
            C_ASSETS.FILE_PATH_IMAGE +
            C_ASSETS.FILE_PATH_IMAGE_PLAYER +
            C_ASSETS.IMAGE_FILE_PLAYER
        );
        // プレイヤーの弾
        this.load.image(
            C_ASSETS.IMAGE_KEY_BULLET_PLAYER_NORMAL,
            C_ASSETS.FILE_PATH_IMAGE +
            C_ASSETS.FILE_PATH_IMAGE_BULLET_PLAYER +
            C_ASSETS.IMAGE_FILE_BULLET_PLAYER_NORMAL
        );
        // 敵
        this.load.image(
            C_ASSETS.IMAGE_KEY_ENEMY_1,
            C_ASSETS.FILE_PATH_IMAGE +
            C_ASSETS.FILE_PATH_IMAGE_ENEMY +
            C_ASSETS.IMAGE_FILE_ENEMY_1
        );
        // 敵の弾
        this.load.image(
            C_ASSETS.IMAGE_KEY_BULLET_ENEMY_1,
            C_ASSETS.FILE_PATH_IMAGE +
            C_ASSETS.FILE_PATH_IMAGE_BULLET_ENEMY +
            C_ASSETS.IMAGE_FILE_BULLET_ENEMY_1
        );
        // ボス
        this.load.image(
            C_ASSETS.IMAGE_KEY_BOSS_1,
            C_ASSETS.FILE_PATH_IMAGE +
            C_ASSETS.FILE_PATH_IMAGE_BOSS +
            C_ASSETS.IMAGE_FILE_BOSS_1
        );
        // ボスの弾
        this.load.image(
            C_ASSETS.IMAGE_KEY_BULLET_BOSS_1,
            C_ASSETS.FILE_PATH_IMAGE +
            C_ASSETS.FILE_PATH_IMAGE_BULLET_BOSS +
            C_ASSETS.IMAGE_FILE_BULLET_BOSS_1
        );

        // 弾の発射音
        this.load.audio(
            C_ASSETS.MUSIC_KEY_SHOOT_1,
            C_ASSETS.FILE_PATH_MUSIC + C_ASSETS.MUSIC_FILE_SHOOT_1);
        // 弾の発射音
        this.load.audio(
            C_ASSETS.MUSIC_KEY_BGM,
            C_ASSETS.FILE_PATH_MUSIC + C_ASSETS.MUSIC_FILE_BGM);

    }

    create() {
        // タイトルシーンに遷移
        this.scene.start(C_COMMON.SCENE_TITLESCENE);
    }
}
