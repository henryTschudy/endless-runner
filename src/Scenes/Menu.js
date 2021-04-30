class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        // menu text config- Anthony//
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#1C6728',
            color: '#F8F7F7',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
    }
    // menu text-Anthony//
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 
        'Obstaclese', menuConfig).setOrigin(0.5);
              this.add.text(game.config.width/2, game.config.height/2, 
        'Controls: SPACE = JUMP', menuConfig).setOrigin(0.5);
              menuConfig.backgroundColor = '#1C6728';
              menuConfig.color = '#090000';
              this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 
        'Press SPACE to begin playing', menuConfig).setOrigin(0.5);
       
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 

    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
        this.scene.start('playScene');
    }
}
}