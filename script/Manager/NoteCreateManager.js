class NoteCreateManager {
    constructor(laneNum, noteMng) {
        // 直前のノーツの生成レーン
        this.createdLane = 0;
        // 次レーンの生成方向
        this.createNoteDir = 1;
        // レーンの数
        this.laneNum = laneNum;

        // 秒あたりのノーツの生成数
        this.notePerSec = 12;
        // ノーツの生成間隔
        this.noteFrameSpan = Math.floor(C_COMMON.FPS / this.notePerSec);

        /** @type {NoteManager} */
        this.noteMng = noteMng;
    }

    /**
     * らせん状にノーツを生成
     * @returns ノーツを生成するレーン
     */
    createPtrnSpiral() {
        let createLane = this.createdLane + this.createNoteDir;

        if (createLane === this.laneNum - 1 || createLane === 0) {
            // らせんの方向転換
            this.createNoteDir *= -1;
        }
        this.createdLane = createLane;

        return createLane;
    }

    /**
     * ノーツを生成する
     * @param {number} frameCnt 現在のフレームカウント
     */
    createNote(frameCnt) {
        if (frameCnt % this.noteFrameSpan === 0) {
            this.noteMng.createNoteToLane(this.createPtrnSpiral());
        }
    }

}