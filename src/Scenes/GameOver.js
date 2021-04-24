class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    preload() {

    }

    create() {
        
    }

    update() {
        this.scene.start('playScene');
    }
}