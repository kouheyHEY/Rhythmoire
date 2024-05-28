class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(1);

        this.speed = C_GS.BOSS_1_SPEED;
        this.hp = C_GS.BOSS_1_HP;

        // ボスの行動パターン
        this.firePattern = C_GS.BOSS_FIRE_PATTERN_1;

        this.setScale(C_GS.BOSS_1_SIZE_RATE);
        this.body.setSize(this.width * C_GS.BOSS_1_COLLIDE_SIZE_RATE, this.height * C_GS.BOSS_1_COLLIDE_SIZE_RATE);

        // 移動制御フラグ
        this.moveFlg = false;
        // 移動方向 X
        this.moveDirX = 0;
        // 移動距離 X
        this.moveDistX = 0;
        // 移動先x座標
        this.movePosX = 0;
        // 移動方向 Y
        this.moveDirY = 0;
        // 移動距離 Y
        this.moveDistY = 0;
        // 移動先y座標
        this.movePosY = C_GS.BOSS_INIT_POS_Y;

        // 弾発射パターン2の時の発射角度
        this.fireAnglePattern2 = 0;
    }

    /**
     * ボスの移動処理
     */
    updateMove() {
        if (!this.moveFlg) {
            // 移動制御フラグがfalseの場合

            // 一定確率で移動を発生させる
            if (Math.random() < C_GS.BOSS_1_MOVE_PROB_PER_FRAME) {
                this.moveFlg = true;

                // x方向の移動距離を設定
                this.moveDirX = 1 - Phaser.Math.RND.between(0, 1) * 2;
                this.moveDistX = C_GS.BOSS_1_MOVE_DIST +
                    Phaser.Math.RND.between(-1, 1) * C_GS.BOSS_1_MOVE_DIST_SCAT;
                this.movePosX = this.x + (this.moveDirX * this.moveDistX);

                // 画面外に出てしまう場合は逆方向に移動、目標を再計算
                if (this.movePosX < (this.width / 2)
                    || this.movePosX > C_COMMON.D_WIDTH - (this.width / 2)) {
                    this.moveDirX *= -1;
                    this.movePosX = this.x + (this.moveDirX * this.moveDistX);
                }

                if (this.firePattern == C_GS.BOSS_FIRE_PATTERN_1) {

                    // 移動速度を設定する
                    this.setVelocityX(this.moveDirX * C_GS.BOSS_1_SPEED);

                } else if (this.firePattern == C_GS.BOSS_FIRE_PATTERN_2
                    || this.firePattern == C_GS.BOSS_FIRE_PATTERN_3) {

                    // y方向の移動距離を設定
                    this.moveDirY = 1 - Phaser.Math.RND.between(0, 1) * 2;
                    this.moveDistY = C_GS.BOSS_1_MOVE_DIST +
                        Phaser.Math.RND.between(-1, 1) * C_GS.BOSS_1_MOVE_DIST_SCAT;
                    this.movePosY = this.y + (this.moveDirY * this.moveDistY);

                    // 画面外に出てしまう場合は逆方向に移動、目標を再計算
                    if (this.movePosY < (this.height / 2)
                        || this.movePosY > C_COMMON.D_HEIGHT - (this.height / 2)) {
                        this.moveDirY *= -1;
                        this.movePosY = this.y + (this.moveDirY * this.moveDistY);
                    }

                    // 移動速度を設定
                    let angle = Phaser.Math.Angle.Between(
                        this.x, this.y,
                        this.movePosX, this.movePosY
                    );

                    this.setVelocity(
                        Math.cos(angle) * C_GS.BOSS_1_SPEED,
                        Math.sin(angle) * C_GS.BOSS_1_SPEED
                    );
                }

            }
        } else {
            // 移動フラグがtrueの場合

            // 移動先までの距離を計算
            let distFromMovePos = 0;
            if (this.firePattern == C_GS.BOSS_FIRE_PATTERN_1) {
                distFromMovePos = Math.abs(this.movePosX - this.x);
            } else if (this.firePattern == C_GS.BOSS_FIRE_PATTERN_2
                || this.firePattern == C_GS.BOSS_FIRE_PATTERN_3) {
                distFromMovePos = Phaser.Math.Distance.Between(this.x, this.y, this.movePosX, this.movePosY);
            }

            if (distFromMovePos <= (C_GS.BOSS_1_SPEED / this.scene.game.loop.actualFps)) {
                // 移動先までの距離が十分に近い場合

                // 移動を停止する
                this.setVelocity(0, 0);
                this.moveFlg = false;
            }

        }

    }

}
