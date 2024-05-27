class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(1);
        this.speed = Phaser.Math.Between(50, 100);
    }

    update() {
        this.setVelocityY(this.speed);
        if (this.y > scene.sys.game.config.height) {
            this.destroy();
        }
    }
}