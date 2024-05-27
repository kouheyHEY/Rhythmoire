class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: C_COMMON.SCENE_GAMESCENE });
    }

    create() {
        // デバイスの種類を保持
        this.deviceIsPC = !this.sys.game.device.os.android && !this.sys.game.device.os.iOS

        // 背景色の設定
        this.cameras.main.setBackgroundColor(C_COMMON.BG_COLOR_GAMESCENE);

        // タッチ時の座標
        this.pointerBaseX = 0;
        this.pointerBaseY = 0;
        this.playerBaseX = 0;
        this.playerBaseY = 0;

        // スコア情報
        this.scoreInfo = new ScoreInfo();

        // 各テキスト
        this.labelFps = this.add.text(600, 40,
            'fps : ' + this.game.loop.actualFps,
            { fontSize: '32px', fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' })
            .setOrigin(1);
        this.labelEnemiesDefeatNum = this.add.text(600, 80,
            'enemy defeat : ' + this.scoreInfo.enemiesDefeated,
            { fontSize: '32px', fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' })
            .setOrigin(1);
        this.labelBossDefeatNum = this.add.text(600, 120,
            'boss defeat : ' + this.scoreInfo.bossDefeated,
            { fontSize: '32px', fontFamily: C_COMMON.FONT_FAMILY_BIT12, fill: '#fff' })
            .setOrigin(1);

        // ボスのHPゲージ
        this.bossHpBar = this.add.graphics();
        // 赤色のバー
        this.bossHpBar.fillStyle(C_GAMESCENE.HPBAR, 1);
        // 画面上部の指定位置に表示
        this.bossHpBar.fillRect(
            C_GAMESCENE.HPBAR_BOSS_POS_X, C_GAMESCENE.HPBAR_BOSS_POS_Y,
            C_GAMESCENE.HPBAR_BOSS_WIDTH, C_GAMESCENE.HPBAR_BOSS_HEIGHT
        );

        // ゲームオーバーフラグ
        this.gameOverFlg = false;

        // フレームカウント
        this.frameCount = 0;

        // 弾の発射制御フラグ
        this.firePlayerBulletFlg = true;
        // 敵機の生成フラグ
        this.enemySpawnFlg = true;
        // ボスの生成フラグ
        this.bossSpawnFlg = true;

        // プレイヤーの生成
        this.player = new Player(
            this,
            C_GAMESCENE.PLAYER_INIT_POS_X,
            C_GAMESCENE.PLAYER_INIT_POS_Y,
            C_ASSETS.IMAGE_KEY_PLAYER
        );

        // ボスの情報
        this.bosses = this.physics.add.group();

        // プレイヤーの弾のグループを作成
        this.playerBullets = this.physics.add.group();

        // プレイヤーの弾を一定間隔で発射するタイマーを設定
        this.playerBulletTimer = this.time.addEvent({
            delay: C_GAMESCENE.BULLET_PLAYER_NORMAL_FIRE_SPAN,
            callback: this.firePlayerBullet,
            callbackScope: this,
            loop: true
        });

        // 敵のグループを作成
        this.enemies = this.physics.add.group();

        // 敵を一定時間ごとに生成
        this.time.addEvent({
            delay: C_GAMESCENE.ENEMY_1_GENERATE_SPAN,
            callback: () => {
                let enemyX = Phaser.Math.Between(0, this.sys.game.config.width);
                let enemyY = -100;
                // 敵を生成
                this.spawnEnemy(enemyX, enemyY);
            },
            callbackScope: this,
            loop: true
        });

        // 敵の弾のグループを作成
        this.enemyBullets = this.physics.add.group();
        // ボスの弾のグループを作成
        this.bossBullets = this.physics.add.group();

        /** 衝突判定の作成 */
        // 敵とプレイヤーの衝突
        this.physics.add.overlap(this.player, this.enemies, this.collidePlayerAndEnemy, null, this);
        // ボスとプレイヤーの衝突
        this.physics.add.overlap(this.player, this.bosses, this.collidePlayerAndBoss, null, this);

        // 敵の弾とプレイヤーの衝突
        this.physics.add.overlap(this.player, this.enemyBullets, this.collidePlayerAndEnemyBullet, null, this);
        // ボスの弾とプレイヤーの衝突
        this.physics.add.overlap(this.player, this.bossBullets, this.collidePlayerAndBossBullet, null, this);

        // プレイヤーの弾と敵の衝突
        this.physics.add.overlap(this.playerBullets, this.enemies, this.collidePlayerBulletAndEnemy, null, this);
        // プレイヤーの弾とボスの衝突
        this.physics.add.overlap(this.playerBullets, this.bosses, this.collidePlayerBulletAndBoss, null, this);

    }

    update() {
        this.input.on('pointerdown', (pointer) => {
            // スマートフォンの場合、マウスの基点を保持
            if (!this.deviceIsPC) {
                this.pointerBaseX = pointer.x;
                this.pointerBaseY = pointer.y;
                this.playerBaseX = this.player.x;
                this.playerBaseY = this.player.y;
            }
        });

        // 敵機の撃墜数が一定数を超えた場合
        if ((this.scoreInfo.enemiesDefeated + this.scoreInfo.bossDefeated) % C_GAMESCENE.BOSS_SPAWN_FOR_DEFEAT_ENEMIES == 0
            && this.scoreInfo.enemiesDefeated != 0) {
            // ボスを生成
            this.spawnBoss(C_GAMESCENE.BOSS_INIT_POS_X, C_GAMESCENE.BOSS_INIT_POS_Y);
        }

        // プレイヤーの位置更新
        this.movePlayer();

        // ボスの更新処理
        this.updateBoss();

        this.drawBossHpGuage();

        // 画面外に出たプレイヤーの弾を削除
        this.playerBullets.getChildren().forEach(bullet => {
            if (bullet.y < 0) {
                bullet.destroy();
            }
        });

        // 画面外に出た敵の弾を削除
        this.enemyBullets.getChildren().forEach(bullet => {
            if (bullet.y > C_COMMON.D_HEIGHT
                || bullet.y < 0
                || bullet.x > C_COMMON.D_WIDTH
                || bullet.x < 0
            ) {
                bullet.destroy();
            }
        });

        // 画面外に出た敵の削除
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y > C_COMMON.D_HEIGHT) {
                enemy.destroy();
            }
        });

        // 画面外に出たボスの弾を削除
        this.bossBullets.getChildren().forEach(bullet => {
            if (bullet.y > C_COMMON.D_HEIGHT
                || bullet.y < 0
                || bullet.x > C_COMMON.D_WIDTH
                || bullet.x < 0
            ) {
                bullet.destroy();
            }
        });

        // テキスト更新
        this.labelEnemiesDefeatNum.setText('enemy defeat : ' + this.scoreInfo.enemiesDefeated);
        this.labelBossDefeatNum.setText('boss defeat : ' + this.scoreInfo.bossDefeated);
        this.labelFps.setText('fps : ' + Math.floor(this.game.loop.actualFps));

        // ゲームオーバー判定
        if (this.gameOverFlg) {
            console.log("To GameOver !");
            // ゲームオーバーシーンに遷移
            this.scene.start(C_COMMON.SCENE_GAMEOVERSCENE, { scoreInfo: this.scoreInfo });
        }

        // フレームカウント加算
        this.frameCount++;
    }

    /** 敵を生成 */
    spawnEnemy(enemyX, enemyY) {
        // 生成フラグがfalseなら処理を終了
        if (!this.enemySpawnFlg) {
            return;
        }

        // 敵の生成
        const enemy = new Enemy(this, enemyX, enemyY, C_ASSETS.IMAGE_KEY_ENEMY_1);

        this.enemies.add(enemy);

        enemy.setVelocityY(C_GAMESCENE.ENEMY_1_SPEED);

        // 敵が一定の時間ごとに弾を発射
        enemy.bulletTimer = this.time.addEvent({
            delay: C_GAMESCENE.BULLET_ENEMY_1_FIRE_SPAN,
            callback: () => this.fireEnemyBullet(enemy),
            callbackScope: this,
            loop: true
        });

        // 敵が削除されたとき
        enemy.on('destroy', () => {
            // 弾発射イベントを削除
            enemy.bulletTimer.remove();
        });
    }

    /** ボスを生成 */
    spawnBoss(bossX, bossY) {
        // 生成フラグがfalseなら処理を終了
        if (!this.bossSpawnFlg) {
            return;
        }

        // 生成フラグをfalseに
        this.bossSpawnFlg = false;
        this.enemySpawnFlg = false;

        // 敵の生成
        let boss = new Boss(this, bossX, bossY, C_ASSETS.IMAGE_KEY_BOSS_1);

        this.bosses.add(boss);

        // 敵が一定の時間ごとに弾を発射
        boss.bulletTimer = this.time.addEvent({
            delay: C_GAMESCENE.BULLET_BOSS_1_FIRE_SPAN_PATTERN_1,
            callback: () => this.fireBossBullet(boss),
            callbackScope: this,
            loop: true
        });

        // ボスが削除されたとき
        boss.on('destroy', () => {
            // 弾発射イベントを削除
            boss.bulletTimer.remove();
            // 生成フラグをtrueに
            this.bossSpawnFlg = true;
            this.enemySpawnFlg = true;
        });
    }

    /**
     * プレイヤーの弾を発射する
     */
    firePlayerBullet() {
        // 発射制御フラグがfalseの場合
        if (!this.firePlayerBulletFlg) {
            // 弾を発射せず処理を終了する
            return;
        }

        // 弾をプレイヤーの位置から生成
        const bullet = this.playerBullets.create(
            this.player.x,
            this.player.y,
            C_ASSETS.IMAGE_KEY_BULLET_PLAYER_NORMAL
        );
        bullet.setScale(C_GAMESCENE.BULLET_PLAYER_SIZE_RATE);
        bullet.body.setSize(bullet.width * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE, bullet.height * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE);

        // 弾の速度設定
        bullet.setVelocityY(
            C_GAMESCENE.BULLET_PLAYER_NORMAL_SPEED
        );

        // 効果音の再生
        this.playSound(C_ASSETS.MUSIC_KEY_SHOOT_1);
    }

    /**
     * 敵の弾を発射する
     */
    fireEnemyBullet(enemy) {
        // 弾を敵の位置から生成
        const bullet = this.enemyBullets.create(
            enemy.x,
            enemy.y,
            C_ASSETS.IMAGE_KEY_BULLET_ENEMY_1
        );
        bullet.setScale(C_GAMESCENE.BULLET_ENEMY_1_SIZE_RATE);
        bullet.body.setSize(bullet.width * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE, bullet.height * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE);

        // 弾をプレイヤーの位置に向かって発射
        let angle = Phaser.Math.Angle.Between(
            enemy.x, enemy.y,
            this.player.x, this.player.y
        );

        // 弾の角度＋速度設定
        bullet.setVelocity(
            Math.cos(angle) * C_GAMESCENE.BULLET_ENEMY_1_SPEED,
            Math.sin(angle) * C_GAMESCENE.BULLET_ENEMY_1_SPEED
        );

        // 効果音の再生
        this.playSound(C_ASSETS.MUSIC_KEY_SHOOT_1, 1.25, 1.25);
    }

    /**
     * ボスの弾を発射する
     */
    fireBossBullet(boss) {
        // パターン1の場合、またはパターン3の場合
        if (boss.firePattern == C_GAMESCENE.BOSS_FIRE_PATTERN_1
            || (boss.firePattern == C_GAMESCENE.BOSS_FIRE_PATTERN_3
                && this.frameCount > C_GAMESCENE.BULLET_BOSS_1_FRAME_SPAN_PATTERN_3)) {

            this.frameCount = 0;

            // 発射角度範囲の上限と下限
            let angleLimitTop = C_GAMESCENE.BULLET_BOSS_1_RANGE_PATTERN_1 / 2;
            let angleLimitBottom = -angleLimitTop;

            for (let i = angleLimitBottom; i <= angleLimitTop; i += C_GAMESCENE.BULLET_BOSS_1_ANGLE_DELTA_PATTERN_1) {

                // 弾をボスの位置から生成
                let bullet = this.bossBullets.create(
                    boss.x,
                    boss.y,
                    C_ASSETS.IMAGE_KEY_BULLET_BOSS_1
                );
                bullet.setScale(C_GAMESCENE.BULLET_BOSS_1_SIZE_RATE_PATTERN_1);
                bullet.body.setSize(bullet.width * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE, bullet.height * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE);

                // 弾をプレイヤーの位置に向かって発射
                let angle = Phaser.Math.Angle.Between(
                    boss.x, boss.y,
                    this.player.x, this.player.y
                ) + Phaser.Math.DegToRad(i);

                // 弾の角度＋速度設定
                bullet.setVelocity(
                    Math.cos(angle) * C_GAMESCENE.BULLET_BOSS_1_SPEED_PATTERN_1,
                    Math.sin(angle) * C_GAMESCENE.BULLET_BOSS_1_SPEED_PATTERN_1
                );
            }

            // 効果音の再生
            this.playSound(C_ASSETS.MUSIC_KEY_SHOOT_1, 1.75, 0.5);
        }

        // パターン2の場合、またはパターン3の場合
        if (boss.firePattern == C_GAMESCENE.BOSS_FIRE_PATTERN_2
            || boss.firePattern == C_GAMESCENE.BOSS_FIRE_PATTERN_3) {

            for (let i = 0; i < 360; i += C_GAMESCENE.BULLET_BOSS_1_ANGLE_DELTA_PATTERN_2) {

                // 弾をボスの位置から生成
                let bullet = this.bossBullets.create(
                    boss.x,
                    boss.y,
                    C_ASSETS.IMAGE_KEY_BULLET_BOSS_1
                );
                bullet.setScale(C_GAMESCENE.BULLET_BOSS_1_SIZE_RATE_PATTERN_2);
                bullet.body.setSize(bullet.width * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE, bullet.height * C_GAMESCENE.BULLET_COLLIDE_SIZE_RATE);

                // 弾を指定の角度に向かって発射
                let angle = Phaser.Math.DegToRad(boss.fireAnglePattern2 + i);

                // 弾の角度＋速度設定
                bullet.setVelocity(
                    Math.cos(angle) * C_GAMESCENE.BULLET_BOSS_1_SPEED_PATTERN_2,
                    Math.sin(angle) * C_GAMESCENE.BULLET_BOSS_1_SPEED_PATTERN_2
                );
            }

            // 弾の角度調整
            boss.fireAnglePattern2 += C_GAMESCENE.BULLET_BOSS_1_ANGLE_SPAN_PATTERN_2;

            // 効果音の再生
            this.playSound(C_ASSETS.MUSIC_KEY_SHOOT_1, 1.5, 0.75);
        }
    }


    /** プレイヤーの位置更新 */
    movePlayer() {
        // マウスカーソルの位置を追跡
        this.input.on('pointermove', (pointer) => {
            if (this.deviceIsPC) {
                // PCの場合

                // マウスの座標=プレイヤーの座標
                this.player.x = pointer.x;
                this.player.y = pointer.y;
            } else {
                // PC以外の場合

                // タッチの座標からずれた分だけプレイヤーを移動
                this.player.x = this.playerBaseX + pointer.x - this.pointerBaseX;
                this.player.y = this.playerBaseY + pointer.y - this.pointerBaseY;
            }
        });
    }

    /** ボスの更新処理 */
    updateBoss() {
        // ボスが存在しない場合
        if (this.bosses.getChildren().length == 0) {
            // 処理を終了する
            return;
        }

        this.bosses.getChildren().forEach(boss => {

            // ボスの移動処理
            boss.updateMove();

            console.log(boss.hp);

            // 弾発射パターンの変更
            if (boss.firePattern == C_GAMESCENE.BOSS_FIRE_PATTERN_1
                && boss.hp < C_GAMESCENE.BOSS_1_FIRE_PATTERN_1_HP) {

                // 弾発射イベントを削除
                boss.bulletTimer.remove();

                // パターンを変更
                boss.firePattern = C_GAMESCENE.BOSS_FIRE_PATTERN_2;

                // 一定の時間ごとに弾を発射
                boss.bulletTimer = this.time.addEvent({
                    delay: C_GAMESCENE.BULLET_BOSS_1_FIRE_SPAN_PATTERN_2,
                    callback: () => this.fireBossBullet(boss),
                    callbackScope: this,
                    loop: true
                });

            }

            // 弾発射パターンの変更
            if (boss.firePattern == C_GAMESCENE.BOSS_FIRE_PATTERN_2
                && boss.hp < C_GAMESCENE.BOSS_1_FIRE_PATTERN_2_HP) {

                // 弾発射イベントを削除
                boss.bulletTimer.remove();

                // パターンを変更
                boss.firePattern = C_GAMESCENE.BOSS_FIRE_PATTERN_3;

                // 一定の時間ごとに弾を発射
                boss.bulletTimer = this.time.addEvent({
                    delay: C_GAMESCENE.BULLET_BOSS_1_FIRE_SPAN_PATTERN_2,
                    callback: () => this.fireBossBullet(boss),
                    callbackScope: this,
                    loop: true
                });

            }
        });
    }

    /** HPゲージを描画する
     * ボスがいない場合は非表示
     */
    drawBossHpGuage() {
        // ボスが存在しない場合はゲージ描画をしない
        if (this.bosses.getChildren().length == 0) {
            this.bossHpBar.clear();
            return;
        }
        this.bossHpBar.clear();

        // 赤ゲージを描画
        this.bossHpBar.fillStyle(C_GAMESCENE.HPBAR_BOSS_COLOR_NOLIFE, 1);

        // 画面上部の指定位置に表示
        this.bossHpBar.fillRect(
            C_GAMESCENE.HPBAR_BOSS_POS_X,
            C_GAMESCENE.HPBAR_BOSS_POS_Y,
            C_GAMESCENE.HPBAR_BOSS_WIDTH,
            C_GAMESCENE.HPBAR_BOSS_HEIGHT
        );

        // 緑ゲージを描画
        this.bossHpBar.fillStyle(C_GAMESCENE.HPBAR_BOSS_COLOR_LIFE, 1);
        // 画面上部の指定位置に表示
        let hpRate = this.bosses.getChildren()[0].hp / C_GAMESCENE.BOSS_1_HP;

        this.bossHpBar.fillRect(
            C_GAMESCENE.HPBAR_BOSS_POS_X,
            C_GAMESCENE.HPBAR_BOSS_POS_Y,
            hpRate * C_GAMESCENE.HPBAR_BOSS_WIDTH,
            C_GAMESCENE.HPBAR_BOSS_HEIGHT
        );

    }

    /** 敵とプレイヤーの衝突判定 */
    collidePlayerAndEnemy(player, enemy) {
        // 敵を消滅させる
        enemy.destroy();
        // プレイヤーの体力を減らす
        // ゲームオーバーフラグの設定
        this.gameOverFlg = true;
    }

    /** ボスとプレイヤーの衝突処理 */
    collidePlayerAndBoss(player, boss) {
        // ボスの体力を減らす
        boss.hp--;
        // hpが0になった場合消滅させる
        if (boss.hp <= 0) {
            boss.destroy();
        }

        // プレイヤーの体力を減らす
        // ゲームオーバーフラグの設定
        this.gameOverFlg = true;
    }

    /** 敵とプレイヤーの弾の衝突判定 */
    collidePlayerBulletAndEnemy(bullet, enemy) {
        // 敵を消滅させる
        enemy.destroy();
        // 撃墜数を更新
        this.scoreInfo.enemiesDefeated++;

        // 弾を消滅させる
        bullet.destroy();
    }

    /** ボスとプレイヤーの弾の衝突判定 */
    collidePlayerBulletAndBoss(bullet, boss) {
        // ボスのHP減らす
        boss.hp--;
        // hpが0になった場合消滅させる
        if (boss.hp <= 0) {
            boss.destroy();
            // 敵撃墜数を更新
            this.scoreInfo.bossDefeated++;
        }

        // 弾を消滅させる
        bullet.destroy();
    }

    /** 敵の弾とプレイヤーの衝突判定 */
    collidePlayerAndEnemyBullet(player, bullet) {
        // 弾を消滅させる
        bullet.destroy();

        // プレイヤーの体力を減らす
        // ゲームオーバーフラグの設定
        this.gameOverFlg = true;
    }

    /** ボスの弾とプレイヤーの衝突判定 */
    collidePlayerAndBossBullet(player, bullet) {
        // 弾を消滅させる
        bullet.destroy();

        // プレイヤーの体力を減らす
        // ゲームオーバーフラグの設定
        this.gameOverFlg = true;
    }

    /** 音声再生
     * @param {string} soundKey 音声キー
     * @param {float} vol 音量
     * @param {float} dur 音声の長さ
     */
    playSound(soundKey, vol = 1, dur = 1) {
        let sound = this.sound.add(soundKey);
        sound.setVolume(vol);
        sound.setRate(dur);
        sound.play();

        sound.on('complete', () => {
            // 音声オブジェクトを削除
            sound.destroy();
        });
    }
}