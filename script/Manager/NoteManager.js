class NoteManager {
    constructor(scene, laneNum) {
        this.scene = scene;
        this.laneNum = laneNum;
        this.noteGroupList = [];

        // ノーツのグループを作成する
        for (let l = 0; l < this.laneNum; l++) {
            this.noteGroupList.push(this.scene.add.group());
        }
    }

    /**
     * レーンを指定してノーツを生成する
     * @param {int} laneIdx 生成するレーン番号
     * @returns false:失敗 true:成功
     */
    createNoteToLane(laneIdx) {
        // レーン数チェック
        if (laneIdx >= this.laneNum || laneIdx < 0) {
            return false;
        }

        // ノーツの初期位置
        let noteX = C_GS.LANE_INIT_X;
        let noteY = - C_GS.NOTES_HEIGHT * 2;

        if (laneIdx >= 1) {
            noteX += C_GS.LANE_WIDTH_ENDS + (laneIdx - 1) * C_GS.LANE_WIDTH_MID;
        }

        // ノーツの幅、高さ
        let noteW = 0;
        let noteH = 0;

        if (laneIdx === 0 || laneIdx === this.laneNum - 1) {
            noteW = C_GS.LANE_WIDTH_ENDS;
        } else {
            noteW = C_GS.LANE_WIDTH_MID;
        }

        noteH = C_GS.NOTES_HEIGHT;

        // ノートオブジェクトの生成
        let note = this.scene.add.graphics();

        note.lineStyle(2, C_GS.NOTES_NORMAL_COLOR_EDGE)
            .fillStyle(C_GS.NOTES_NORMAL_COLOR_FILL, 1);

        // 長方形を描画
        note.fillRect(noteX, noteY, noteW, noteH)
            .strokeRect(noteX, noteY, noteW, noteH);

        // 図形を下に移動するトゥイーンを作成
        // 等速直線運動
        this.scene.tweens.add({
            targets: note,
            y: C_COMMON.D_HEIGHT + C_GS.NOTES_HEIGHT * 2,
            duration: C_COMMON.D_HEIGHT / C_GS.NOTES_SPEED * 1000,
            ease: 'Linear',
            onComplete: () => {
                note.destroy();
            }
        });

        this.noteGroupList[laneIdx].add(note);

    }
}