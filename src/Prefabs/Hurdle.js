class Hurdle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, sprite) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width,
                game.config.height * 2/3, sprite); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add to physics system
        this.setVelocityX(velocity);            // make it go!
        
        this.newHurdle = true;                 // custom property to control barrier spawning
    }

    update() {
        if(this.newHurdle && this.x < 2 * game.config.width / 3) {
            this.newHurdle = false;
            // (recursively) call parent scene method from this context
            this.scene.time.delayedCall(1000 + Math.random() * 1000, () => {
                this.scene.addHurdle();
            })
        }

        this.setVelocityX(-this.scene.scrollSpeed * 30);

        // destroy hurdle if it reaches the left edge of the screen
        if(this.x < -150) {
            this.destroy();
        }
    }
}