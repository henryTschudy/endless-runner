class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, playerslot){
        super(scene, x, y, texture, frame);

        // add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);       // add to physics system
        this.setPushable(false);
        
    }

    update() {
        
    }
}