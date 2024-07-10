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
    }
}
