class NoteCreateManager {
    constructor(laneNum, noteMng) {
        // レーンの数
        this.laneNum = laneNum;

        // ノーツの生成パターン
        this.createPtrn = C_GS.CREATE_PTRN_RANDOM;

        // ランダムの場合の設定
        // 縦連の許容個数
        this.dplctLimit = 2;
        // 同時押しモード
        this.multiMode = C_GS.MULTIMODE_ON;
        // 同時押しモードが混在の場合の、同時押しの割合
        this.multiRate = 0.5;
        // 同時押しの数ごとの許容フラグ配列
        this.multiNumFlgList = Array(this.laneNum);
        this.multiNumFlgList.fill(true);
        // 許容する同時押しの数
        this.multiNumList = [];
        for (const [idx, flg] of this.multiNumFlgList.entries()) {
            if (flg) {
                this.multiNumList.push(idx + 1);
            }
        }

        // 直前のノーツの生成レーン
        this.createdLane = 0;
        // 次レーンの生成方向
        this.createNoteDir = 1;

        // 拍子
        this.beat = 4;

        // 現時点の小節数
        this.curMsrLine = 0;
        // BPM
        this.bpm = 120;
        // 小節線の生成間隔
        this.msrLineFrameSpan = C_COMMON.FPS * 60 / this.bpm;

        // 現時点の小節内でのノーツ数
        this.curNotesInMsr = 0;
        // 小節当たりのノーツ数
        this.notePerMsr = 8;
        // ノーツの生成間隔
        this.noteFrameSpan = this.beat * this.msrLineFrameSpan / this.notePerMsr;

        console.log(`ノーツの生成間隔フレーム:${this.noteFrameSpan}`);

        /** @type {NoteManager} */
        this.noteMng = noteMng;
    }

    /**
     * らせん状にノーツを生成
     * @returns ノーツを生成するレーン
     */
    createPtrnSpiral() {
        let createLane = this.createdLane;

        this.createdLane += this.createNoteDir;

        if (this.createdLane === this.laneNum - 1 || this.createdLane === 0) {
            // らせんの方向転換
            this.createNoteDir *= -1;
        }

        return createLane;
    }

    /**
     * 階段状にノーツを生成
     * @return ノーツを生成するレーン
     */
    createPtrnStair() {
        let createLane = this.createdLane;

        this.createdLane = (this.laneNum + this.createdLane + this.createNoteDir) % this.laneNum;

        return createLane;
    }

    /**
     * ランダムにノーツを生成
     * @return ノーツを生成するレーン
     */
    createPtrnRandom() {
        let createLane = 0;
        // 同時押しをする場合
        if (this.multiMode === C_GS.MULTIMODE_ON) {
            // 同時押しの個数を取得
            let multiNum = this.multiNumList[
                Math.floor(Math.random() * this.multiNumList.length)
            ];

            // 同時押しをするレーンの番号を取得
            let laneRange = Array.from(Array(this.laneNum), (_, i) => i);
            let multiLaneList = [];

            for (let i = 0; i < multiNum; i++) {
                // 同時押しするレーン
                let laneIndex = Math.floor(Math.random() * laneRange.length);
                // 同時押しレーンのリストに追加
                multiLaneList.push(laneRange[laneIndex]);
                // 同時押しレーン候補配列から選ばれたレーンを削除
                laneRange.splice(laneIndex, 1);
            }

            createLane = multiLaneList;
        } else {
            // 同時押ししない場合は単一の数値を返す
            createLane = [Math.floor(Math.random() * this.laneNum)];
        }

        return createLane;
    }

    /**
     * ノーツを生成する
     * @param {number} frameCnt 現在のフレームカウント
     */
    createNote(frameCnt) {
        // 必要であれば小節線を追加
        if (frameCnt >= this.curMsrLine * this.msrLineFrameSpan) {
            this.noteMng.createMsrLine(this.curMsrLine % this.beat !== 0);
            // 小節の数を加算
            this.curMsrLine++;
            if (this.curMsrLine % this.beat === 1) {
                // 小節内のノーツ数をリセット
                this.curNotesInMsr = 0;
            }
        }

        // ノーツの生成
        if (
            frameCnt - Math.floor((this.curMsrLine - 1) / this.beat) * this.beat * this.msrLineFrameSpan
            >= this.curNotesInMsr * this.noteFrameSpan
        ) {
            // ノーツの生成パターンによって場合分け
            if (this.createPtrn === C_GS.CREATE_PTRN_SPIRAL) {
                this.noteMng.createNoteToLane(this.createPtrnSpiral());

            } else if (this.createPtrn === C_GS.CREATE_PTRN_STAIR) {
                this.noteMng.createNoteToLane(this.createPtrnStair());

            } else if (this.createPtrn === C_GS.CREATE_PTRN_RANDOM) {
                let laneList = this.createPtrnRandom();
                for (let l of laneList) {
                    this.noteMng.createNoteToLane(l);
                }

            }
            // ノーツの数を加算
            this.curNotesInMsr++;
        }

        console.log('------------------------------------');
    }

}