const C_GS = {
    /** プレイヤーの初期位置X */
    PLAYER_INIT_POS_X: C_COMMON.D_WIDTH / 2,
    /** プレイヤーの初期位置Y */
    PLAYER_INIT_POS_Y: C_COMMON.D_HEIGHT * 3 / 4,
    /** プレイヤーの表示倍率 */
    PLAYER_SIZE_RATE: 0.5,
    /** 表示に対する当たり判定の倍率 */
    PLAYER_COLLIDE_SIZE_RATE: 0.5,

    /** 弾の発射間隔（ms） */
    BULLET_PLAYER_NORMAL_FIRE_SPAN: 100,
    /** 弾のスピード */
    BULLET_PLAYER_NORMAL_SPEED: -2000,
    /** 弾の表示倍率 */
    BULLET_PLAYER_SIZE_RATE: 0.5,

    /** すべて弾の当たり判定の倍率 */
    BULLET_COLLIDE_SIZE_RATE: Math.cos(Math.PI / 4),

    /** 敵1のスピード */
    ENEMY_1_SPEED: 100,
    /** 敵1の出現間隔（ms） */
    ENEMY_1_GENERATE_SPAN: 700,
    /** 敵1の弾発射間隔（ms） */
    BULLET_ENEMY_1_FIRE_SPAN: 1000,
    /** 敵1の弾スピード */
    BULLET_ENEMY_1_SPEED: 200,
    /** 敵1の弾の表示倍率 */
    BULLET_ENEMY_1_SIZE_RATE: 0.5,

    /** ボスの初期位置X */
    BOSS_INIT_POS_X: C_COMMON.D_WIDTH / 2,
    /** ボスの初期位置Y */
    BOSS_INIT_POS_Y: 100,
    /** ボスの表示倍率 */
    BOSS_1_SIZE_RATE: 0.75,
    /** ボスの表示倍率に対する当たり判定の倍率 */
    BOSS_1_COLLIDE_SIZE_RATE: 0.5,

    /** ボスを生成する敵機の撃墜数間隔 */
    BOSS_SPAWN_FOR_DEFEAT_ENEMIES: 15,
    /** ボスのスピード */
    BOSS_1_SPEED: 100,
    /** ボスの移動単位 */
    BOSS_1_MOVE_DIST: 160,
    /** ボスの移動単位の振れ幅 */
    BOSS_1_MOVE_DIST_SCAT: 25,
    /** ボスの1フレームごとの移動確率 */
    BOSS_1_MOVE_PROB_PER_FRAME: 1 / (C_COMMON.FPS * 2),

    /** ボスの弾発射パターン1 */
    BOSS_FIRE_PATTERN_1: 1,
    /** ボスの弾発射パターン2 */
    BOSS_FIRE_PATTERN_2: 2,
    /** ボスの弾発射パターン3 */
    BOSS_FIRE_PATTERN_3: 3,

    /** ボスの体力 */
    BOSS_1_HP: 480,
    /** ボスの弾発射パターン1の体力範囲の下限 */
    BOSS_1_FIRE_PATTERN_1_HP: 320,
    /** ボスの弾発射パターン2の体力範囲の下限 */
    BOSS_1_FIRE_PATTERN_2_HP: 160,
    /** ボスの弾発射パターン3の体力範囲の下限 */
    BOSS_1_FIRE_PATTERN_3_HP: 0,

    /** ボスの弾の表示倍率 パターン1 */
    BULLET_BOSS_1_SIZE_RATE_PATTERN_1: 1.0,
    /** ボスの弾発射間隔（ms）パターン1 */
    BULLET_BOSS_1_FIRE_SPAN_PATTERN_1: 550,
    /** ボスの弾スピード パターン1 */
    BULLET_BOSS_1_SPEED_PATTERN_1: 250,
    /** ボスの弾発射角度の範囲 パターン1 */
    BULLET_BOSS_1_RANGE_PATTERN_1: 90,
    /** ボスの弾発射角度の変化量 パターン1 */
    BULLET_BOSS_1_ANGLE_DELTA_PATTERN_1: 15,

    /** ボスの弾の表示倍率 パターン2 */
    BULLET_BOSS_1_SIZE_RATE_PATTERN_2: 0.25,
    /** ボスの弾発射間隔（ms）パターン2 */
    BULLET_BOSS_1_FIRE_SPAN_PATTERN_2: 160,
    /** ボスの弾スピード パターン2 */
    BULLET_BOSS_1_SPEED_PATTERN_2: 150,
    /** ボスの弾発射角度の変化量 パターン2 */
    BULLET_BOSS_1_ANGLE_DELTA_PATTERN_2: 24,
    /** ボスの弾発射角度の間隔 パターン2 */
    BULLET_BOSS_1_ANGLE_SPAN_PATTERN_2: 7.3,

    /** ボスの追尾弾発射の間隔（フレーム） パターン3 */
    BULLET_BOSS_1_FRAME_SPAN_PATTERN_3: C_COMMON.FPS * 2,

    /** ボスのHPバー */
    HPBAR_BOSS_WIDTH: 300,
    HPBAR_BOSS_HEIGHT: 20,
    HPBAR_BOSS_POS_X: 20,
    HPBAR_BOSS_POS_Y: 20,

    HPBAR_BOSS_COLOR_LIFE: 0x00FF00,
    HPBAR_BOSS_COLOR_NOLIFE: 0xFF0000,
}