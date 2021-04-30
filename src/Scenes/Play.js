class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('runner', './assets/runner.png');
        this.load.image('floor', '../assets/floor.png');
        this.load.image('hurdle', './assets/hurdle.png');
        this.load.image('killHurdle', '../assets/killHurdle.png');
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
        this.scrollDeathSpeed = this.scrollSpeedCap / 2.5; //Anthony//
        this.canDie = false; //Anthony//
        this.initInvuln = 10000; // Anthony//
        this.time.delayedCall(this.initInvuln, () => { this.canDie = true;}); //Anthony//
        

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
        this.runner = this.physics.add.sprite(200, game.config.height - tileSize * 2, 'runner').setOrigin(0.5);
        
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
        this.hurdleKillGroup = this.add.group({
            runChildUpdate: true
        });
        this.time.delayedCall(1500, () => { 
            this.addHurdle(); 
            this.time.delayedCall(1500, () => {
                this.addKillHurdle();
            });
        });
        
        this.bushwhack = this.physics.add.collider(this.runner, this.hurdleGroup);
        this.physics.add.collider(this.hurdleGroup, this.ground);
        this.physics.add.collider(this.hurdleKillGroup, this.ground);
        this.gameOver = false;
        this.distTimer = 0;

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Hurdle obstacle
    addHurdle() {
        let hurdle = new Hurdle(this, -this.scrollSpeed * 30, 'hurdle');
        hurdle.setGravityY(0);
        this.hurdleGroup.add(hurdle);
    }
    addKillHurdle() {
        let killHurdle = new KillHurdle(this, -this.scrollSpeed * 30, 'killHurdle');
        killHurdle.setGravityY(0);
        this.hurdleKillGroup.add(killHurdle);
    }
    ifuckinghatephaser3rightaboutnow(runner){
        runner.setVelocityX(0);
    }

    // Long Jump obstacle
    addJump(){

    }

    // Instakill obstacle
    // addInstakill() {}

    // Triggers when player fails to jump over hurdle
    hurdleCollision(hurdle) {
        hurdle.destroyed = true;
        hurdle.destroy();

        if(Math.random() > 0.9){
            this.addHurdle();
        }

        // An attempt at creating I-frames so that the player is less likely to die
        // simply because theyve been slowed down too much to jump over other hurdles
        this.bushwhack.active = false;
        this.time.delayedCall(2000, () => {this.bushwhack.active = true;});

        console.log('poof!')
        // Concurrently play runner tripping animation
        this.scrollSpeed /= 3;
        this.scrollSpeed *= 2;
        if(this.scrollSpeed < this.scrollSpeedCap / 3){
            this.scrollSpeed = this.scrollSpeedCap / 3;
        }
    }
    killHurdleCollision(killHurdle){
        killHurdle.destroyed = true;
        killHurdle.destroy();
        this.gameOver = true;
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
        this.timer -= delta;
        if(this.gameOver & this.canDie){ // Dead :(
            // oh shit he dead
            this.time.delayedCall(2000, () => { this.scene.start('gameOverScene'); });
        }
        else{ // Not dead yet, poggers
            if(this.scrollSpeed < this.scrollDeathSpeed & this.canDie){
                console.log ('gameOverScene')
                this.gameOver = true;
                // this.timer += delta * 2;
                // if(this.timer > 10){
                //     this.hadesVibeCheck(); // You're too slow!
                // }
            }
            this.floor.tilePositionX += this.scrollSpeed / 2;
            this.groundScroll.tilePositionX += this.scrollSpeed;
            this.physics.world.collide(this.hurdleGroup, this.runner, this.hurdleCollision, null, this);
            this.physics.world.collide(this.hurdleKillGroup, this.runner, this.killHurdleCollision, null, this);
            if(this.runner.x < 100){
                this.runner.x = 200;
                this.ifuckinghatephaser3rightaboutnow(this.runner); // I dont know why i cant just
                                                                    // this.runner.setVelocityX(0)
                                                                    // but this fucking works because okay.
            }
            if(this.runner.y > game.config.height){
                this.runner.y = game.config.height - tileSize * 2;
            }

            if(this.scrollSpeed < this.scrollSpeedCap){
                this.scrollSpeed += .001 * (this.scrollSpeedCap - this.scrollSpeed) - 0.0001;
                if(this.scrollSpeed > this.scrollSpeedCap) {this.scrollSpeed = this.scrollSpeedCap}
            }

            // reset jumps
            if(this.runner.body.touching.down) {
                //this.runner.anims.play('walk', true);
                this.jumping = false;
            } else {
                //this.runner.anims.play('jump');
            }

            if(Phaser.Input.Keyboard.DownDuration(keySPACE, 150) && !this.jumping) {
                this.runner.body.velocity.y = this.jumpSpeed;
                this.jumping = true;
                if(Phaser.Input.Keyboard.DownDuration(keySPACE, 450)) {
                    this.runner.body.velocity.y = this.jumpSpeed;
                } 
            } 
            
            // How to make short hop vs long jump?

            this.distTimer += delta;
            if(this.distTimer >= 1000){
                this.distTimer -= 1000;
                this.distance += Math.round(this.scrollSpeed);
                console.log(this.distance);
            }

            this.hurdleSpawn -= delta;
            if(this.hurdleSpawn <= 0){
                this.addHurdle();
                this.hurdleSpawn += Math.random() * 600 + 400; // between 0.5 and 0.2s per spawn
            }
            
            // Make the game slightly faster when switching between areas
            if(this.distance % 25 == 0){ // 1000 m when ship
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
                if(this.scrollSpeedCap < -2500){this.scrollSpeedCap -= 100;}

            }
        }
        if(!this.canDie) {
            this.gameOver = false;
        }     
    }
}