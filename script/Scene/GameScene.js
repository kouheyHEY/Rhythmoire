class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: C_COMMON.SCENE_GAMESCENE });
    }

    create() {
        /* 変数定義 */

        this.frameCount = 0;
        // デバイスの種類を保持
        this.deviceIsPC = !this.sys.game.device.os.android && !this.sys.game.device.os.iOS;

        // 描画用オブジェクト
        this.grph = this.add.graphics();

        // タッチ時の座標
        this.pointerX = 0;
        this.pointerY = 0;

        // ノーツ数
        this.laneNum = 7;

        // ゲームオーバーフラグ
        this.gameOverFlg = false;
        // ノーツ生成可能フラグ
        this.createNotesFlg = true;

        /** @type {ScoreInfo} スコア情報 */
        this.scoreInfo = new ScoreInfo();

        /** @type {NoteManager} ノートマネージャ */
        this.noteMng = new NoteManager(this, this.laneNum);

        /** @type {InputManager} キーイベントマネージャ */
        this.inputMng = new InputManager(this);
        for (let code of C_GS.LANE_KEY_LIST) {
            this.inputMng.addKeyCodes(code);
        }

        /* 画面描画 */

        // 背景色の設定
        this.cameras.main.setBackgroundColor(C_COMMON.BG_COLOR_GAMESCENE);

        // 各テキスト
        // FPS表示
        this.labelFps = this.add.text(
            C_COMMON.D_WIDTH - 20, 40, 'fps : ' + this.game.loop.actualFps,
            { fontSize: '32px', fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' }
        ).setOrigin(1);

        // スコア表示
        this.labelScore = this.add.text(
            C_COMMON.D_WIDTH - 20, 160, 'Score',
            { fontSize: '32px', fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' }
        ).setOrigin(1);
        this.textScore = this.add.text(
            C_COMMON.D_WIDTH - 20, 240, String(this.scoreInfo.scoreNum).padStart(6, '0'),
            { fontSize: '64px', fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' }
        ).setOrigin(1);

        // レーンの描画を行う
        this.createLanes();

    }

    /**
     * 毎フレーム行う更新処理
     */
    update() {

        // テキスト更新
        this.labelFps.setText('fps : ' + Math.floor(this.game.loop.actualFps));

        // ゲームオーバー判定
        if (this.gameOverFlg) {
            console.log("To GameOver !");
            // ゲームオーバーシーンに遷移
            this.scene.start(C_COMMON.SCENE_GAMEOVERSCENE, { scoreInfo: this.scoreInfo });
        }

        // フレームカウント加算
        this.frameCount++;

        // ノーツの生成
        if (this.frameCount % 30 === 0 && this.noteMng.canCreateNoteFlg) {
            console.log("noteCreate");
            this.noteMng.createNoteToLane((this.frameCount / 30) % this.laneNum);
        }

        // ボタン押下時、ノーツのアニメーション再開＋ノーツ生成
        let laneKeyPushed = this.inputMng.getPushedKeyOf(C_GS.LANE_KEY_LIST[this.noteMng.onLineLane]);
        if (laneKeyPushed) {
            this.noteMng.removeNote(this.noteMng.onLineLane);
        }

        // ノーツの移動
        this.noteMng.moveAllNotes();

    }

    /**
     * レーンの描画を行う
     */
    createLanes() {
        let laneColor = 0;
        let laneBgColor = 0;

        let laneStartX = C_GS.LANE_INIT_X;
        let laneStartY = 0;
        let laneEndX = C_GS.LANE_INIT_X;
        let laneEndY = C_COMMON.D_HEIGHT;

        let laneWidth = 0;

        let notesLineWidth = 0;
        let notesLineHeight = C_GS.NOTESLINE_WEIGHT;
        let notesLineX = C_GS.LANE_INIT_X;
        let notesLineY = C_COMMON.D_HEIGHT - C_GS.NOTESLINE_Y;

        for (let l = 0; l <= this.laneNum; l++) {
            // レーンの色を設定
            if (l === 0) {
                // 左端の場合
                laneColor = C_GS.LANE_COLOR_LEFT;
            } else if (l === this.laneNum) {
                // 中間の場合
                laneColor = C_GS.LANE_COLOR_RIGHT;
            } else {
                // 右端の場合
                laneColor = C_GS.LANE_COLOR_MID;
            }

            // レーンの背景色と幅を設定
            if (l === 0) {
                // 左端の場合
                laneBgColor = C_GS.LANE_BGCOLOR_LEFT;
                laneWidth = C_GS.LANE_WIDTH_ENDS;
            } else if (l === this.laneNum - 1) {
                // 中間の場合
                laneBgColor = C_GS.LANE_BGCOLOR_RIGHT;
                laneWidth = C_GS.LANE_WIDTH_ENDS;
            } else {
                // 右端の場合
                laneBgColor = C_GS.LANE_BGCOLOR_MID;
                laneWidth = C_GS.LANE_WIDTH_MID;
            }

            // 太さの設定
            this.grph.lineStyle(C_GS.LANE_WEIGHT, laneColor);

            // レーンの線を描画
            this.grph.beginPath()
                .moveTo(laneStartX, laneStartY)
                .lineTo(laneEndX, laneEndY)
                .closePath()
                .fill()
                .stroke();

            if (l < this.laneNum) {
                // レーンの背景色の設定
                this.grph.fillStyle(laneBgColor);
                // レーンの背景を描画
                this.grph.fillRect(laneStartX, laneStartY, laneWidth, C_COMMON.D_HEIGHT);
            }

            laneStartX += laneWidth;
            laneEndX += laneWidth;

            if (l !== this.laneNum) {
                // 判定線の幅
                notesLineWidth += laneWidth;
            }
        }

        // 判定線の描画
        this.grph.lineStyle(notesLineHeight, C_GS.NOTESLINE_COLOR);
        this.grph.beginPath()
            .moveTo(notesLineX - C_GS.LANE_WEIGHT / 2, notesLineY)
            .lineTo(notesLineX + notesLineWidth + C_GS.LANE_WEIGHT / 2, notesLineY)
            .closePath()
            .fill()
            .stroke();

        this.grph.lineStyle(1, 0xFFFFFF);
        this.grph.beginPath()
            .moveTo(0, notesLineY)
            .lineTo(10000, notesLineY)
            .closePath()
            .fill()
            .stroke();
    }
}