class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: C_COMMON.SCENE_GAMEOVERSCENE });

        this.scoreInfo;
    }

    init(data) {
        // 引数を受け取る
        this.scoreInfo = data.scoreInfo;
    }

    create() {

        // 背景色の設定
        this.cameras.main.setBackgroundColor(C_COMMON.BG_COLOR_GAMEOVERSCENE);

        this.add.text(C_COMMON.D_WIDTH / 2, 200,
            'Game Over',
            {
                fontSize: C_COMMON.FONT_SIZE_LARGE,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12_BOLD,
                fill: '#fff'
            })
            .setOrigin(0.5);

        this.add.text(C_COMMON.D_WIDTH / 2, 350,
            'enemy defeated : ' + this.scoreInfo.enemiesDefeated,
            { fontSize: C_COMMON.FONT_SIZE_SMALL, fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' })
            .setOrigin(0.5);

        this.add.text(C_COMMON.D_WIDTH / 2, 390,
            'boss defeated : ' + this.scoreInfo.bossDefeated,
            { fontSize: C_COMMON.FONT_SIZE_SMALL, fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' })
            .setOrigin(0.5);

        const titleButton = this.add.text(C_COMMON.D_WIDTH / 2, 440,
            'To Title',
            { fontSize: C_COMMON.FONT_SIZE_SMALL, fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' })
            .setOrigin(0.5);

        titleButton.setInteractive();
        titleButton.on('pointerdown', () => {
            this.scene.start(C_COMMON.SCENE_TITLESCENE);
        });
    }
}