const C_GS = {

    /** レーン数の最小値 */
    LANE_MIN: 2,
    /** レーン数の最大値 */
    LANE_MAX: 7,

    /** レーンの初期X位置（左上） */
    LANE_INIT_X: 10,
    /** レーンの幅（両端） */
    LANE_WIDTH_ENDS: 120,
    /** レーンの幅（中） */
    LANE_WIDTH_MID: 96,
    /** レーンの色（左端） */
    LANE_COLOR_LEFT: 0x6666FF,
    /** レーンの色（右端） */
    LANE_COLOR_RIGHT: 0xFF6666,
    /** レーンの色（中） */
    LANE_COLOR_MID: 0x66FF66,
    /** レーンの背景（左端） */
    LANE_BGCOLOR_LEFT: 0x08081c,
    /** レーンの背景（右端） */
    LANE_BGCOLOR_RIGHT: 0x1c0808,
    /** レーンの背景（中間） */
    LANE_BGCOLOR_MID: 0x081c08,

    /** レーンの太さ */
    LANE_WEIGHT: 4,

    /** ノーツの縦幅 */
    NOTES_HEIGHT: 16,

    /** ノーツの色 内側 */
    NOTES_NORMAL_COLOR_FILL: 0xffffff,
    /** ノーツの色 外側 */
    NOTES_NORMAL_COLOR_EDGE: 0x888888,

    /** ノーツの色 左端 */
    NOTES_COLOR_LEFT: 0x1111FF,
    /** ノーツの色 左端 外側 */
    NOTES_COLOR_LEFT_EDGE: 0x0A0A88,
    /** ノーツの色 右端 */
    NOTES_COLOR_RIGHT: 0xFF1111,
    /** ノーツの色 右端 外側 */
    NOTES_COLOR_RIGHT_EDGE: 0x880A0A,
    /** ノーツの色 中間_奇数 */
    NOTES_COLOR_ODD: 0xDDFFDD,
    /** ノーツの色 中間_奇数 外側 */
    NOTES_COLOR_ODD_EDGE: 0x0A550A,
    /** ノーツの色 中間_偶数 */
    NOTES_COLOR_EVEN: 0x448844,
    /** ノーツの色 中間_偶数 */
    NOTES_COLOR_EVEN_EDGE: 0x0A550A,

    /** ノーツの下降スピード（px/frame） */
    NOTES_SPEED: 8,

    /** ノーツの判定幅 frame（GREAT） */
    NOTES_SCORE_FRAME_GREAT: 2,
    /** ノーツの判定幅 frame（GOOD） */
    NOTES_SCORE_FRAME_GOOD: 9,
    /** ノーツの判定幅 frame（ERROR） */
    NOTES_SCORE_FRAME_ERROR: 30,

    /** ノーツのスコアの割合 */
    NOTES_SCORE_MAP: {
        GREAT: 1.0,
        GOOD: 0.5
    },

    /** ノーツのスコアの理想値 */
    NOTES_SCORE_GREAT: 100,
    /** ノーツのスコアの文字の大きさ */
    NOTES_SCORE_TEXT_SIZE: '32px',
    /** ノーツのスコアの文字の色 */
    NOTES_SCORE_TEXT_COLOR_MAP: {
        GREAT: '#FFDFBF',
        GOOD: '#80B0EE',
        ERROR: '#FF8080'
    },
    /** ノーツのスコアの上への移動距離 */
    NOTES_SCORE_TEXT_UP_DIST: 16,
    /** ノーツのスコアの表示時間(ms) */
    NOTES_SCORE_TEXT_DISP_TIME: 200,

    /** 判定線の位置（下から） */
    NOTESLINE_Y: 128,
    /** 判定線の色 */
    NOTESLINE_COLOR: 0xff0000,
    /** 判定線の太さ */
    NOTESLINE_WEIGHT: 16,

    /** 小節線の色 */
    MEASURE_LINE_COLOR: 0xFFFFFF,
    /** 小節線の透明度 表拍以外 */
    MEASURE_LINE_MID: 0.25,
    /** 小節線の太さ 表拍 */
    MEASURE_LINE_WEIGHT: 2,
    /** 小節線の太さ 表拍以外 */
    MEASURE_LINE_WEIGHT_MID: 1,

    /** レーンごとのキーのリスト */
    LANE_KEY_LIST: [
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K"
    ],

    /** ノーツの生成パターン らせん */
    CREATE_PTRN_SPIRAL: 1,
    /** ノーツの生成パターン 階段 */
    CREATE_PTRN_STAIR: 2,
    /** ノーツの生成パターン ランダム */
    CREATE_PTRN_RANDOM: 3,
    /** ノーツの生成パターン 縦連 */
    CREATE_PTRN_TATEREN: 4,

    /** 同時押しの対応モード 同時押しなし */
    MULTIMODE_OFF: 1,
    /** 同時押しの対応モード 同時押しあり */
    MULTIMODE_ON: 2,

    /** 縦連数 最小 */
    TATEREN_MIN: 2,
    /** 縦連数 最大 */
    TATEREN_MAX: 32,

};