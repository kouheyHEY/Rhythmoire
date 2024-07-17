const C_TS = {
    /** モード らせん */
    MODE_SPRIRAL: 1,
    /** モード 階段 */
    MODE_STAIR: 2,
    /** モード ランダム */
    MODE_RANDOM: 3,
    /** モード 縦連 */
    MODE_TATEREN: 4,
    /** 各モードの値と表示文字列 */
    MODE_DISP_STR_MAP: {
        '1': 'らせん',
        '2': 'かいだん',
        '3': 'らんだむ',
        '4': 'たてれん',
    },

    /** 同時押しモード 有効 */
    MULTI_VALID: 1,
    /** 同時押しモード 無効 */
    MULTI_INVALID: 2,
    /** 同時押しモード 同時押しのみ */
    MULTI_ONLY: 3,
    /** 同時押しモードの値と表示文字列 */
    MULTI_DISP_STR_MAP: {
        '1': 'むこう',
        '2': 'ゆうこう',
        '3': 'おんりー',
    },

    /** 項目名 モード */
    COL_STR_MODE: 'もーど',
    /** 項目名 同時押し */
    COL_STR_MULTI: 'どうじおし',
    /** 項目名 レーン数 */
    COL_STR_LANE_NUM: 'れーんのかず',
    /** 項目名 同時押し有効レーン数 */
    COL_STR_MULTI_LANE_NUM: 'さいだいどうじおし',
    /** 項目名 縦連数 */
    COL_STR_TATEREN_NUM: 'たてれんのかず',

    /** 表示用文字列 スタートボタン */
    DISP_STR_START: 'START',

    /** 表示位置 タイトル */
    DISP_POS_TITLE_Y: 60,
    /** 表示位置 スタートボタン */
    DISP_POS_START_Y: C_COMMON.D_HEIGHT - 100,

    /** 表示位置 1列目 */
    DISP_POS_COL1: C_COMMON.D_WIDTH / 3,
    /** 表示位置 2列目 */
    DISP_POS_COL2: C_COMMON.D_WIDTH * 2 / 3,

    /** 表示位置 初期Y座標 */
    DISP_POS_INIT_Y: 60,
    /** 表示位置 項目間の垂直間隔 */
    DISP_POS_SPAN_VERT_COL: 80,
    /** 表示位置 項目名と項目の垂直間隔 */
    DISP_POS_SPAN_VERT_COLVAL: 60,

};