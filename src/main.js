const tileSize = 35;

let config = {
    type: Phaser.WEBGL,
    width: 840,
    height: 525,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 1800
            }
        }
    },
    scene: [Menu, Play, GameOver] //Added Game Over scene//-Anthony
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keySPACE, keyUP, keyDOWN, keyR;