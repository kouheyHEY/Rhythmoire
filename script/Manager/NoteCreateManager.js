class NoteCreateManager {
    constructor(gameSetInfo, noteMng) {
        /** @type {GameSetInfoModel} ゲーム設定情報 */
        this.gsInfo = gameSetInfo;

        // ランダムの場合の設定
        // 縦連の許容個数
        this.dplctLimit = 2;
        // 同時押しモードが混在の場合の、同時押しの割合
        this.multiRate = 0.5;

        // 許容する同時押しの数をセット
        this.gsInfo.setMultiNumList();
        this.multiNumList = [];
        for (const [idx, flg] of this.gsInfo.multiNumFlgList.entries()) {
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

        // 縦連回数
        this.curTaterenNum = 0;
        this.taterenCreateLane = [];

        /** @type {NoteManager} */
        this.noteMng = noteMng;
    }

    /** 縦連にノーツを生成する */
    createPtrnTateren() {
        // 指定回数の縦連を生成していた場合、縦連回数を0にする
        if (this.curTaterenNum === this.gsInfo.taterenNum) {
            this.curTaterenNum = 0;
        }

        // 縦連回数が0の場合、新たに縦連を生成する
        if (this.curTaterenNum === 0) {
            // 縦連生成レーンを決定
            this.taterenCreateLane = this.createPtrnRandom();
        }

        // 縦連回数をカウントする
        this.curTaterenNum++;

        return this.taterenCreateLane;
    }

    /**
     * らせん状にノーツを生成
     * @returns ノーツを生成するレーン
     */
    createPtrnSpiral() {
        let createLane = this.createdLane;

        this.createdLane += this.createNoteDir;

        if (this.createdLane === this.gsInfo.laneNum - 1 || this.createdLane === 0) {
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

        this.createdLane = (this.gsInfo.laneNum + this.createdLane + this.createNoteDir) % this.gsInfo.laneNum;

        return createLane;
    }

    /**
     * ランダムにノーツを生成
     * @return ノーツを生成するレーン
     */
    createPtrnRandom() {
        let createLane = 0;
        // 同時押しをする場合
        if (this.gsInfo.multiMode !== C_GS.MULTIMODE_OFF) {
            // 同時押しの個数を取得
            let multiNum = this.multiNumList[
                Math.floor(Math.random() * this.multiNumList.length)
            ];

            // 同時押しをするレーンの番号を取得
            let laneRange = Array.from(Array(this.gsInfo.laneNum), (_, i) => i);
            let multiLaneList = [];

            for (let i = 0; i < multiNum; i++) {
                // 同時押しするレーン
                let laneIndex = Math.floor(Math.random() * laneRange.length);
                // 同時押しレーンのリストに追加
                multiLaneList.push(laneRange[laneIndex]);
                // 同時押しレーン候補配列から選ばれたレーンを削除
                laneRange.splice(laneIndex, 1);
            }

            console.log(this.multiNumList);

            createLane = multiLaneList;
        } else {
            // 同時押ししない場合は単一の数値を返す
            createLane = [Math.floor(Math.random() * this.gsInfo.laneNum)];
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
            if (this.gsInfo.noteMode === C_GS.CREATE_PTRN_SPIRAL) {
                this.noteMng.createNoteToLane(this.createPtrnSpiral());

            } else if (this.gsInfo.noteMode === C_GS.CREATE_PTRN_STAIR) {
                this.noteMng.createNoteToLane(this.createPtrnStair());

            } else if (this.gsInfo.noteMode === C_GS.CREATE_PTRN_TATEREN) {
                let laneList = this.createPtrnTateren();
                for (let l of laneList) {
                    this.noteMng.createNoteToLane(l);
                }
            } else if (this.gsInfo.noteMode === C_GS.CREATE_PTRN_RANDOM) {
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