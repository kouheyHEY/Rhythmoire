class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDepth(1);

        this.speed = C_GAMESCENE.PLAYER_SPEED;

        this.setScale(C_GAMESCENE.PLAYER_SIZE_RATE);
        
        this.body.setSize(this.width * C_GAMESCENE.PLAYER_COLLIDE_SIZE_RATE, this.height * C_GAMESCENE.PLAYER_COLLIDE_SIZE_RATE)
    }

    update() {
    }
}