class Runner extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, playerslot){
        super(scene, x, y, texture, frame);

        // add to scene
        scene.add.existing(this);
        
    }

    update() {

    }
}