class KillHurdle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, sprite) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width * Phaser.Math.Between(1.1, 1.4),
                game.config.height - tileSize * 2, sprite); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
        this.setVelocityX(velocity);            // make it go!
        
        this.newKillHurdle = true;                 // custom property to control barrier spawning
    }

    update() {
        if(this.newKillHurdle && this.x < 2 * game.config.width / 3) {
            this.newKillHurdle = false;
            // (recursively) call parent scene method from this context
            this.scene.addKillHurdle(this.parent, this.velocity);
        }

        this.setVelocityX(-this.scene.scrollSpeed * 30);

        // destroy hurdle if it reaches the left edge of the screen
        if(this.x < 0) {
            this.destroy();
        }
    }
}