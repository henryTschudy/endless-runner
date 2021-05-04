const tileSize = 35;

let config = {
    type: Phaser.WEBGL,
    width: 840,
    height: 524,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 1200
            }
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//let borderUISize = game.config.height / 15;
//let borderPadding = borderUISize / 3;

let keySPACE, keyUP, keyDOWN, keyR;