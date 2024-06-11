const C_GS = {

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

    /** ノーツの下降スピード（px/1000ms） */
    NOTES_SPEED: 256,

    /** 判定線の位置（下から） */
    NOTESLINE_Y: 128,
    /** 判定線の色 */
    NOTESLINE_COLOR: 0xff0000,
    /** 判定線の太さ */
    NOTESLINE_WEIGHT: 16,

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
};