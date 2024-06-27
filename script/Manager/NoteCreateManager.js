class NoteCreateManager {
    constructor(laneNum, noteMng) {
        // 直前のノーツの生成レーン
        this.createdLane = 0;
        // 次レーンの生成方向
        this.createNoteDir = 1;
        // レーンの数
        this.laneNum = laneNum;

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
        this.notePerMsr = 12;
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
            this.noteMng.createNoteToLane(this.createPtrnSpiral());
            // ノーツの数を加算
            this.curNotesInMsr++;
        }


        console.log('------------------------------------');
    }

}