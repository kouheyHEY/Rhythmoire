class GameSetInfoModel {
    constructor() {
        /** モード */
        this.noteMode = C_TS.MODE_SPRIRAL;
        /** 同時押しモード */
        this.multiMode = C_TS.MULTI_VALID;
        /** レーン数 */
        this.laneNum = C_GS.LANE_MIN;
        /** 最大同時押し数 */
        this.maxMultiLaneNum = C_GS.LANE_MIN;
        /** 縦連数 */
        this.taterenNum = C_GS.TATEREN_MIN;

        /** 同時押しレーン数の許容フラグ配列 */
        this.multiNumFlgList = Array(this.laneNum);
    }

    /**
     * 同時押しレーン数の許容フラグ配列をセットする
     */
    setMultiNumList() {

        if (this.multiMode === C_TS.MULTI_VALID) {
            for (let l = 0; l < this.laneNum; l++) {
                this.multiNumFlgList[l] = (l < this.maxMultiLaneNum);
            }
        } else if (this.multiMode === C_TS.MULTI_ONLY) {
            this.multiNumFlgList.fill(false);
            this.multiNumFlgList[this.maxMultiLaneNum - 1] = true;
        }
    }
}
