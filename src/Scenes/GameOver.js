class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    preload() {

    }
// Game Over Config//-Anthony
    create() {
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
    // Game Over Text//-Anthony
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 
        'Hades has claimed your soul forever', menuConfig).setOrigin(0.5);
              menuConfig.backgroundColor = '#1C6728';
              menuConfig.color = '#090000';
              this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 
        'Press SPACE to Retry', menuConfig).setOrigin(0.5);
       
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
        this.scene.start('playScene');
        }
    }
}