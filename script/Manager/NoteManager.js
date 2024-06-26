class NoteManager {
    constructor(scene, laneNum) {
        this.scene = scene;
        this.laneNum = laneNum;
        this.noteGroupList = [];
        this.tweenGroupList = [];

        this.tweenPauseFlg = false;
        this.canCreateNoteFlg = true;

        /** ノーツが乗っているレーンの番号 */
        this.onLineLane = 0;

        // ノーツとトゥイーンのグループを作成する
        for (let l = 0; l < this.laneNum; l++) {
            this.noteGroupList.push(this.scene.add.group());
            this.tweenGroupList.push(this.scene.add.group());
        }

        // 判定線までの距離
        let distLine = C_COMMON.D_HEIGHT - C_GS.NOTESLINE_Y;
        // 画面上部からの、ノーツの相対位置
        let noteOffsetY = C_GS.NOTES_SPEED * 3;
        // ノーツの初期位置
        this.noteInitY = distLine - (
            Math.round(distLine / C_GS.NOTES_SPEED) * C_GS.NOTES_SPEED
            + noteOffsetY
        );
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
        let noteInitY = this.noteInitY;

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
        note.x = noteInitX;
        note.y = noteInitY;

        console.log(`note: (${note.x}, ${note.y})`);
        console.log(`rect: (${noteInitX}, ${noteInitY})`);

        note.lineStyle(2, noteColorEdge)
            .fillStyle(noteColor, 1);

        // 長方形を描画
        note.fillRect(0, - C_GS.NOTES_HEIGHT / 2, noteW, noteH)
            .strokeRect(0, - C_GS.NOTES_HEIGHT / 2, noteW, noteH);

        this.noteGroupList[laneIdx].add(note);
    }

    /**
     * ノーツを削除する
     * @param {number}
     */
    removeNote(lane) {
        let removeNote = this.noteGroupList[lane].getChildren().shift();
        removeNote.destroy();
    }

    /**
     * 全てのノーツを下に移動させる
     */
    moveAllNotes() {
        for (let noteGroup of this.noteGroupList) {
            let removeNoteFlg = false;
            for (const [idx, note] of noteGroup.getChildren().entries()) {
                note.y += C_GS.NOTES_SPEED;
                if (note.y > (C_COMMON.D_HEIGHT - C_GS.NOTESLINE_Y)) {
                    console.lg("aaa");
                }
                if (idx === 0 && note.y > C_COMMON.D_HEIGHT) {
                    removeNoteFlg = true;
                }
            }
            if (removeNoteFlg) {
                let note = noteGroup.getChildren().shift();
                note.destroy();
            }
        }
    }

}