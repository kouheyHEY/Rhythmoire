class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: C_COMMON.SCENE_GAMESCENE });
    }

    /**
     * タイトルから値を受け取る
     * @param {GameSetInfoModel} data ゲームの設定情報モデル
     */
    init(data) {
        /** @type {GameSetInfoModel} ゲーム設定情報 */
        this.gsInfo = data;
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

        // 1ノーツ当たりの理想スコア
        this.noteScore = C_GS.NOTES_SCORE_GREAT;

        // ゲームオーバーフラグ
        this.gameOverFlg = false;
        // ノーツ生成可能フラグ
        this.createNotesFlg = true;

        /** @type {ScoreInfo} スコア情報 */
        this.scoreInfo = new ScoreInfo();

        /** @type {NoteManager} ノートマネージャ */
        this.noteMng = new NoteManager(this, this.gsInfo);

        /** @type {InputManager} キーイベントマネージャ */
        this.inputMng = new InputManager(this);
        for (let code of C_GS.LANE_KEY_LIST) {
            this.inputMng.addKeyCodes(code);
        }

        /** @type {NoteCreateManager} ノーツ作成マネージャ */
        this.noteCreateMng = new NoteCreateManager(this.gsInfo, this.noteMng);

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
        // FPS表示
        this.labelFps.setText('fps : ' + Math.floor(this.game.loop.actualFps));

        // スコア表示
        this.textScore.setText(String(this.scoreInfo.scoreNum).padStart(6, '0'));

        // ゲームオーバー判定
        if (this.gameOverFlg) {
            console.log("To GameOver !");
            // ゲームオーバーシーンに遷移
            this.scene.start(C_COMMON.SCENE_GAMEOVERSCENE, { scoreInfo: this.scoreInfo });
        }

        // フレームカウント加算
        this.frameCount++;

        /* ノーツの生成 */
        this.noteCreateMng.createNote(this.frameCount);

        // ボタン押下時、ノーツの消去を行う
        for (const [idx, key] of C_GS.LANE_KEY_LIST.entries()) {
            if (idx > this.gsInfo.laneNum - 1) {
                break;
            }
            if (this.inputMng.getJustPushedKeyOf(key)) {
                let frameDist = Math.abs(this.noteMng.tapLane(idx));
                if (frameDist <= C_GS.NOTES_SCORE_FRAME_ERROR) {
                    let score = 0;
                    let scoreRank = 'ERROR';
                    // スコアの判定
                    if (frameDist <= C_GS.NOTES_SCORE_FRAME_GREAT) {
                        // GREATの判定
                        score = this.noteScore * C_GS.NOTES_SCORE_MAP.GREAT;
                        scoreRank = 'GREAT';
                    } else if (frameDist <= C_GS.NOTES_SCORE_FRAME_GOOD) {
                        // GOODの判定
                        score = this.noteScore * C_GS.NOTES_SCORE_MAP.GOOD;
                        scoreRank = 'GOOD';
                    } else {
                        scoreRank = 'ERROR';
                    }
                    this.dispNoteScoreRank(scoreRank, idx);
                    this.scoreInfo.scoreNum += score;
                }
            }
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

        for (let l = 0; l <= this.gsInfo.laneNum; l++) {
            // レーンの色を設定
            if (l === 0) {
                // 左端の場合
                laneColor = C_GS.LANE_COLOR_LEFT;
            } else if (l === this.gsInfo.laneNum) {
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
            } else if (l === this.gsInfo.laneNum - 1) {
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

            if (l < this.gsInfo.laneNum) {
                // レーンの背景色の設定
                this.grph.fillStyle(laneBgColor);
                // レーンの背景を描画
                this.grph.fillRect(laneStartX, laneStartY, laneWidth, C_COMMON.D_HEIGHT);
            }

            laneStartX += laneWidth;
            laneEndX += laneWidth;

            if (l !== this.gsInfo.laneNum) {
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

        // ノーツマネージャに判定線の長さを設定
        this.noteMng.msrLineLen = notesLineWidth + C_GS.LANE_WEIGHT;
    }

    /**
     * スコア文字列を表示する
     * @param {string} scoreRank スコアランク
     * @param {number} laneIdx レーンの順番
     */
    dispNoteScoreRank(scoreRank, laneIdx) {
        // レーンの位置を計算
        let scoreTextX = C_GS.LANE_INIT_X + C_GS.LANE_WIDTH_ENDS / 2;
        let scoreTextY = C_COMMON.D_HEIGHT - C_GS.NOTESLINE_Y * 2;
        if (laneIdx > 0 && laneIdx <= this.gsInfo.laneNum - 1) {
            scoreTextX +=
                C_GS.LANE_WIDTH_ENDS / 2
                + (1 + (laneIdx - 1) * 2) * C_GS.LANE_WIDTH_MID / 2;
            if (laneIdx === this.gsInfo.laneNum - 1) {
                scoreTextX += (C_GS.LANE_WIDTH_ENDS - C_GS.LANE_WIDTH_MID) / 2;
            }
        }

        let scoreText = this.add.text(scoreTextX, scoreTextY, scoreRank, {
            fontSize: C_GS.NOTES_SCORE_TEXT_SIZE,
            fontFamily: C_COMMON.FONT_FAMILY_BIT12,
            fill: C_GS.NOTES_SCORE_TEXT_COLOR_MAP[scoreRank]
        }).setOrigin(0.5);

        this.tweens.add({
            targets: scoreText,
            y: scoreText.y - C_GS.NOTES_SCORE_TEXT_UP_DIST,
            duration: C_GS.NOTES_SCORE_TEXT_DISP_TIME,
            ease: 'Linear',
            onComplete: () => {
                // テキストを削除
                scoreText.destroy();
            }
        });

    }
}