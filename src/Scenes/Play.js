class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('runner', './assets/runner.png');
        this.load.image('floor', './assets/floor.png');
    }

    create() {
        //this.add.text(game.config.width/2, 30, 'Play', { font: '28px Futura', fill: '#FFF' }).setOrigin(0.5);

        // Parameters
        this.obstacleSpeed = -450;
        this.obstacleSpeedCap = -1000;
        this.distance = 0;
        this.reverse = false;
        this.jumpSpeed = -600;
        this.scrollSpeed = 4;
        this.scrollSpeedCap = this.scrollSpeed * 3;

        /* River variable settings:
         * 0 = Acheron
         * 1 = Cocytus
         * 2 = Phlegathon
         * 3 = Styx
         * 4 = Lethe
         */ 
        this.river = 0; 

        //Status effects on player?
        //this.stygianSlow;
        //this.cocytusFrostbite;
        //this.phlegathonFire;
        //this.letheBleed; // Warrior hits runner


        // Audio below this

        // Particles
        this.acheronColors = [0x000]; // ???
        this.cocytusColors = []; // Snow
        this.phlegathonColors = []; // lava
        this.stygianColors = []; // icky green shit idk
        this.letheColors = []; // not sure
        
        /*  Placeholder for particles
        this.landingPoof = this.particleManager.createEmitter({
            lifespan: 300,
            alpha: {start: 0.7, end: 0.1},
            // tint varies based on location
            tint: this.acheronColors,
            // Idk how to use emitZone yet
            blendMode: 'ADD'
        });
        */

        // Setting up runner
        this.runner = this.physics.add.sprite(200, game.config.height/2-tileSize, 'runner').setOrigin(0.5);
        
        // Setting up tiles - using heavy reference from Endless Strollin to get things preliminarily set up
        this.floor = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'floor').setOrigin(0);

        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'runner', 'block').setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, 'groundScroll').setOrigin(0);

        // Runner collides with ground
        this.physics.add.collider(this.runner, this.ground);

        // Hurdle group
        this.hurdleGroup = this.add.group({
            runChildUpdate: true
        })

        this.hurdleSpawn = 0;
        this.gameOver = false;
        this.distTimer = 0;

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Hurdle obstacle
    addHurdle() {
        console.log("Spawning hurdle!");
    }

    // Long Jump obstacle
    addJump(){

    }

    // Instakill obstacle
    // addInstakill() {}

    // Triggers when player fails to jump over hurdle
    hurdleCollision(hurdle) {
        // Play hurdle tipping over animation here
        hurdle.destroy();

        // Concurrently play runner tripping animation
        this.scrollSpeed /= 2;
    }

    // Triggers when player fails to jump over long-jump
    jumpCollision() {
        this.scrollSpeed = 0;
        this.gameOver == true;
        // play sinking into longjump anim
    }

    // Triggers when player falls below an arbitrary speed for too long
    hadesVibeCheck() {
        this.scrollSpeed = 0;
        this.gameOver == true;
        // Play hades checking your vibe animation
    }

    riverChange() {
        // Update to also change parallax background and track color.
        // Sprite changes optional
        // I imagine a gradual change as well for the sprite changes.
        switch(this.river){
            case 0:
                //this.landingPoof.tint = this.acheronColors;
                break;
            case 1:
                //this.landingPoof.tint = this.cocytusColors;
                break;
            case 2:
                //this.landingPoof.tint = this.phlegathonColors;
                break;
            case 3:
                //this.landingPoof.tint = this.stygianColors;
                break;
            case 4:
                //this.landingPoof.tint = this.letheColors;
                break;
        }
    }

    update(time, delta) {
        // short-hop vs long-jump is main decision
        // Speed determines if long-jumps are passable
        if(this.gameOver){ // Dead :(
            // oh shit he dead
        }
        else{ // Not dead yet, poggers
            this.floor.tilePositionX += this.scrollSpeed;
            this.groundScroll.tilePositionX += this.scrollSpeed;
            if(this.scrollSpeed <= this.scrollSpeedCap){
                this.scrollSpeed += .1 * (this.scrollSpeedCap - this.scrollSpeed);
            }

            // reset jumps
            if(this.runner.body.touching.down) {
                console.log('grounded')
                //this.runner.anims.play('walk', true);
                this.jumping = false;
            } else {
                //this.runner.anims.play('jump');
            }

            if(Phaser.Input.Keyboard.DownDuration(keySPACE, 150) && !this.jumping) {
                this.runner.body.velocity.y = this.jumpSpeed;
                console.log('jumping');
                this.jumping = true;
                if(Phaser.Input.Keyboard.DownDuration(keySPACE, 450)) {
                    this.runner.body.velocity.y = this.jumpSpeed;
                    console.log('long jumping');
                } 
            } 
            
            // How to make short hop vs long jump?

            this.distTimer += delta;
            if(this.distTimer >= 1000){
                this.distTimer -= 1000;
                this.distance++;
            }
            if(this.hurdleSpawn == 0){
                this.hurdleSpawn = Math.random() * 600 + 2400; // between 0.5 and 0.2s per spawn
            }
            else{
                this.hurdleSpawn -= delta;
                if(this.hurdleSpawn <= 0){
                    this.addHurdle();
                }
            }

            // Make the game slightly faster when switching between areas
            if(this.distance % 125 == 0){
                if(this.reverse){
                    this.river--;
                }
                else{
                    this.river++;
                }

                if(this.river == 0 || this.river == 4){
                    this.reverse = !this.reverse;
                }
                this.riverChange();
            }
        }
        
    }
}