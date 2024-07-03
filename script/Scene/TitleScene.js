class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: C_COMMON.SCENE_TITLESCENE });
    }

    create() {

        // 背景色の設定
        this.cameras.main.setBackgroundColor(C_COMMON.BG_COLOR_TITLESCENE);

        /*
        // bgmを再生し続ける
        let bgm = this.sound.get(C_ASSETS.MUSIC_KEY_BGM);
        if (bgm == null || !bgm.isPlaying) {
            bgm = this.sound.add(C_ASSETS.MUSIC_KEY_BGM);
            bgm.setVolume(C_ASSETS.MUSIC_BGM_VOLUME);
            bgm.play();
            bgm.setLoop(true);
        }
        */

        // 表示文字列の縦方向間隔
        let dispRow = 0;
        let dispInitY = C_TS.DISP_POS_INIT_Y;

        this.add.text(
            C_COMMON.D_WIDTH / 2, C_TS.DISP_POS_TITLE_Y, C_COMMON.GAME_TITLE,
            {
                fontSize: C_COMMON.FONT_SIZE_LARGE,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12_BOLD,
                fill: '#fff'
            }).setOrigin(0.5);

        const startButton = this.add.text(
            C_COMMON.D_WIDTH / 2, C_TS.DISP_POS_START_Y, C_TS.DISP_STR_START,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // スタートボタンを有効化
        startButton.setInteractive();

        // モードを表示
        const colModeText = this.add.text(
            C_TS.DISP_POS_COL1, dispInitY + dispRow * C_TS.DISP_POS_SPAN_VERT,
            C_TS.COL_STR_MODE,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 同時押しモードを表示
        const colMultiText = this.add.text(
            C_TS.DISP_POS_COL2, dispInitY + dispRow * C_TS.DISP_POS_SPAN_VERT,
            C_TS.COL_STR_MULTI,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        dispRow++;
        // レーン数を表示
        const colLaneNum = this.add.text(
            C_TS.DISP_POS_COL1, dispInitY + dispRow * C_TS.DISP_POS_SPAN_VERT,
            C_TS.COL_STR_LANE_NUM,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 同時押し有効レーン数を表示
        const colMultiLaneNumText = this.add.text(
            C_TS.DISP_POS_COL2, dispInitY + dispRow * C_TS.DISP_POS_SPAN_VERT,
            C_TS.COL_STR_MULTI_LANE_NUM,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 押下時ゲームシーンに遷移
        startButton.on('pointerdown', () => {
            this.scene.start(C_COMMON.SCENE_GAMESCENE);
        });
    }
}