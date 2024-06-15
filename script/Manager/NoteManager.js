class NoteManager {
    constructor(scene, laneNum) {
        this.scene = scene;
        this.laneNum = laneNum;
        this.noteGroupList = [];
        this.tweenGroupList = [];

        this.tweenPauseFlg = false;

        /** ノーツが乗っているレーンの番号 */
        this.onLineLane = 0;

        // ノーツとトゥイーンのグループを作成する
        for (let l = 0; l < this.laneNum; l++) {
            this.noteGroupList.push(this.scene.add.group());
            this.tweenGroupList.push(this.scene.add.group());
        }
    }

    /**
     * レーンを指定してノーツを生成する
     * @param {int} laneIdx 生成するレーン番号
     * @returns false:失敗 true:成功
     */
    createNoteToLane(laneIdx) {
        if (this.tweenPauseFlg) {
            return true;
        }

        // レーン数チェック
        if (laneIdx >= this.laneNum || laneIdx < 0) {
            return false;
        }

        // ノーツの初期位置
        let noteInitX = C_GS.LANE_INIT_X;
        let noteInitY = - C_GS.NOTES_HEIGHT * 2;

        if (laneIdx >= 1) {
            noteInitX += C_GS.LANE_WIDTH_ENDS + (laneIdx - 1) * C_GS.LANE_WIDTH_MID;
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

        // ノーツの色
        let noteColorEdge = 0;
        let noteColor = 0;

        if (laneIdx === 0) {
            noteColor = C_GS.NOTES_COLOR_LEFT;
            noteColorEdge = C_GS.NOTES_COLOR_LEFT_EDGE;
        } else if (laneIdx === this.laneNum - 1) {
            noteColor = C_GS.NOTES_COLOR_RIGHT;
            noteColorEdge = C_GS.NOTES_COLOR_RIGHT_EDGE;
        } else {
            if (laneIdx % 2 === 0) {
                noteColor = C_GS.NOTES_COLOR_EVEN;
                noteColorEdge = C_GS.NOTES_COLOR_EVEN_EDGE;
            } else {
                noteColor = C_GS.NOTES_COLOR_ODD;
                noteColorEdge = C_GS.NOTES_COLOR_ODD_EDGE;
            }
        }

        // ノートオブジェクトの生成
        let note = this.scene.add.graphics();

        note.lineStyle(2, noteColorEdge)
            .fillStyle(noteColor, 1);

        // 長方形を描画
        note.fillRect(noteInitX, noteInitY, noteW, noteH)
            .strokeRect(noteInitX, noteInitY, noteW, noteH);

        // 図形を下に移動するトゥイーンを作成
        // 等速直線運動
        this.tweenGroupList[laneIdx].add(
            this.scene.tweens.add({
                targets: note,
                y: C_COMMON.D_HEIGHT - C_GS.NOTESLINE_Y + C_GS.NOTES_HEIGHT * 3 / 2,
                duration: C_COMMON.D_HEIGHT / C_GS.NOTES_SPEED * 1000,
                ease: 'Linear',
                onComplete: () => {
                    this.pauseAllNotes();
                    this.setOnLineLane(laneIdx);
                }
            })
        );

        this.noteGroupList[laneIdx].add(note);

    }

    /**
     * ノーツが停止しているレーンの番号を設定する
     * @param {number} laneIdx ノーツが停止しているレーンの番号
     */
    setOnLineLane(laneIdx) {
        this.onLineLane = laneIdx;
    }

    /**
     * すべてのトゥイーンを停止する
     */
    pauseAllNotes() {
        if (this.tweenPauseFlg) {
            return;
        }
        console.log("STOP: " + this.onLineLane);
        this.scene.tweens.pauseAll();
        this.tweenPauseFlg = true;
    }

    /**
     * すべてのトゥイーンを再開する
     */
    resumeAllNotes() {
        if (!this.tweenPauseFlg) {
            return;
        }
        this.scene.tweens.resumeAll();
        this.tweenPauseFlg = false;
    }

    /**
     * ノーツを削除する
     * @param {number}
     */
    removeNote(lane) {
        let removeNote = this.noteGroupList[lane].getChildren()[0];
        this.noteGroupList[lane].remove(removeNote);
        removeNote.destroy();
    }

}