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

        // 各モードの現在の値
        // モード
        this.noteMode = C_TS.MODE_SPRIRAL;
        // 同時押しモード
        this.multiMode = C_TS.MULTI_VALID;
        // レーン数
        this.laneNum = 3;
        // 最大同時押し数
        this.maxMultiLaneNum = 2;

        // タイトル表示
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
        // 押下時ゲームシーンに遷移
        startButton.on('pointerdown', () => {
            this.scene.start(C_COMMON.SCENE_GAMESCENE);
        });


        // 表示文字列の縦方向間隔
        let dispY = C_TS.DISP_POS_INIT_Y;
        // 表示位置の調整
        dispY += C_TS.DISP_POS_SPAN_VERT_COL;

        // 項目名　モードを表示
        const colModeText = this.add.text(
            C_TS.DISP_POS_COL1, dispY, C_TS.COL_STR_MODE,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 項目名　同時押しモードを表示
        const colMultiText = this.add.text(
            C_TS.DISP_POS_COL2, dispY, C_TS.COL_STR_MULTI,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 表示位置の調整
        dispY += C_TS.DISP_POS_SPAN_VERT_COLVAL;

        // 現在のモードの表示
        const curModeText = this.add.text(
            C_TS.DISP_POS_COL1, dispY, C_TS.MODE_DISP_STR_MAP[this.noteMode],
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive();
        // 押下時テキストを変更
        curModeText.on('pointerdown', () => {
            this.noteMode = this.noteMode % Object.keys(C_TS.MODE_DISP_STR_MAP).length + 1;
            curModeText.setText(C_TS.MODE_DISP_STR_MAP[this.noteMode]);
        });

        // 現在の同時押しモードの表示
        const curMultiModeText = this.add.text(
            C_TS.DISP_POS_COL2, dispY, C_TS.MULTI_DISP_STR_MAP[this.multiMode],
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive();
        // 押下時テキストを変更
        curMultiModeText.on('pointerdown', () => {
            this.multiMode = this.multiMode % Object.keys(C_TS.MULTI_DISP_STR_MAP).length + 1;
            curMultiModeText.setText(C_TS.MULTI_DISP_STR_MAP[this.multiMode]);
        });

        // 表示位置の調整
        dispY += C_TS.DISP_POS_SPAN_VERT_COL;

        // 項目名　レーン数を表示
        const colLaneNum = this.add.text(
            C_TS.DISP_POS_COL1, dispY, C_TS.COL_STR_LANE_NUM,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 項目名　同時押し有効レーン数を表示
        const colMultiLaneNumText = this.add.text(
            C_TS.DISP_POS_COL2, dispY, C_TS.COL_STR_MULTI_LANE_NUM,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5);

        // 表示位置の調整
        dispY += C_TS.DISP_POS_SPAN_VERT_COLVAL;

        // レーン数を表示
        const laneNumText = this.add.text(
            C_TS.DISP_POS_COL1, dispY, this.laneNum,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive();
        // 押下時テキストを変更
        laneNumText.on('pointerdown', () => {
            this.laneNum = (this.laneNum - 1) % (C_GS.LANE_MAX - C_GS.LANE_MIN + 1) + 2;
            laneNumText.setText(this.laneNum);
        });

        // 最大同時押し数を表示
        const multiLaneNumText = this.add.text(
            C_TS.DISP_POS_COL2, dispY, this.maxMultiLaneNum,
            {
                fontSize: C_COMMON.FONT_SIZE_SMALL,
                fontFamily: C_COMMON.FONT_FAMILY_BIT12,
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive();
        // 押下時テキストを変更
        multiLaneNumText.on('pointerdown', () => {
            this.maxMultiLaneNum =
                (this.maxMultiLaneNum - 1) % (C_GS.LANE_MAX - C_GS.LANE_MIN + 1) + 2;
            if (this.maxMultiLaneNum > this.laneNum) {
                this.maxMultiLaneNum = C_GS.LANE_MIN;
            }
            multiLaneNumText.setText(this.maxMultiLaneNum);
        });

    }
}