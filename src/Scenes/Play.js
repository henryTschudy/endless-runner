class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //this.load.bitmapFont('font', './assets/font.png', './assets/font.xml');

        this.load.atlas('runner', './assets/obstacleseComposite.png', './assets/obstacleseComposite.json');
        this.load.image('floor', './assets/Foreground.png');
        this.load.image('hurdle', './assets/Rubble1.png');
        this.load.image('background', './assets/BackgroundGradient.png');
        this.load.image('foregroundStones', './assets/ForegroundStones.png');
        this.load.image('backgroundPillars', './assets/BackgroundPillars.png');
        this.load.image('spikes', './assets/Spikes.png');
        this.load.image('shore', './assets/Shore.png');
        this.load.image('shoreReflection', './assets/ShoreReflection.png');
        this.load.image('pillarReflection', './assets/PillarReflection.png');
        this.load.image('river', './assets/River.png');
        this.load.spritesheet('hades', './assets/hades.png', {frameWidth: 440, frameHeight: 416, startFrame: 0, endFrame: 3});
        this.load.audio('sfx_jump', './assets/jump.wav')
        this.load.audio('sfx_step', './assets/step.wav')
        this.load.audio('sfx_trip', './assets/trip.wav')
        
    }

    create() {
        
        // Parameters
        // this.obstacleSpeed = -450;
        // this.obstacleSpeedCap = -1000;
        this.distance = 0;
        this.reverse = false;
        this.jumpSpeed = -650;
        this.scrollSpeed = 8;
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
        this.runner = this.physics.add.sprite(300, game.config.height - tileSize * 4, 'runner').setOrigin(0.5);
        this.anims.create({
            key: 'run',
            frames:this.anims.generateFrameNames('runner', { prefix: 'run', end: 7, zeroPad: 0}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames:this.anims.generateFrameNames('runner', { prefix: 'jump'})
        });
        this.anims.create({
            key: 'trip',
            frames:this.anims.generateFrameNames('runner', { prefix: 'trip'})
        })
        // Setting up Hades
        this.hades = this.physics.add.sprite(50, game.config.height - tileSize * 10, 'hades').setOrigin(0.5);
        this.hades.scale = 0.6;
        this.anims.create({
            key: 'hades',
            frames:this.anims.generateFrameNumbers('hades', {start: 0, end: 3, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        // Setting up audio objects that rely on overlap
        this.trip_sfx = this.sound.add('sfx_trip');
        this.step_sfx = this.sound.add('sfx_step');



        // Setting up background elements
        this.background = this.add.tileSprite(0,0,game.width, game.height,'background').setOrigin(0,0).setDepth(-7);
        this.river = this.add.tileSprite(0,0,game.width, game.height,'river').setOrigin(0,0).setDepth(-3);
        this.foregroundStones = this.add.tileSprite(0,0,game.width, game.height,'foregroundStones').setOrigin(0,0).setDepth(-1);
        this.backgroundPillars = this.add.tileSprite(0,0,game.width, game.height,'backgroundPillars').setOrigin(0,0).setDepth(-5);
        this.spikes = this.add.tileSprite(0,0,game.width, game.height,'spikes').setOrigin(0,0).setDepth(-6);
        this.shore = this.add.tileSprite(0,0,game.width, game.height,'shore').setOrigin(0,0).setDepth(-2);
        this.shoreReflection = this.add.tileSprite(0,0,game.width, game.height,'shoreReflection').setOrigin(0,0).setDepth(-2);
        this.pillarReflection = this.add.tileSprite(0,0,game.width, game.height,'pillarReflection').setOrigin(0,0).setDepth(-2);
        
        // Setting up tiles - using heavy reference from Endless Strollin to get things preliminarily set up
        this.floor = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'floor').setOrigin(0).setDepth(-1);

        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'runner', 'block').setOrigin(0).setDepth(-8);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, 'groundScroll').setOrigin(0).setDepth(-8);

        // Runner collides with ground
        this.physics.add.collider(this.runner, this.ground);
        // Hades collides with ground
        this.physics.add.collider(this.hades, this.ground);

        // Hurdle group
        this.hurdleGroup = this.add.group({
            runChildUpdate: true
        })

        this.time.delayedCall(1500, () => { 
            this.addHurdle(this, -this.scrollSpeed); 
        });
        
        this.bushwhack = this.physics.add.collider(this.runner, this.hurdleGroup);
        this.bushwhack.overlapOnly = true;
        this.physics.add.collider(this.hurdleGroup, this.ground);
        this.gameOver = false;
        this.distTimer = 0;
        this.timer = 0;

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Hurdle obstacle
    addHurdle() {
        this.time.delayedCall(1000 + Math.random() * 1000, () => {
            let hurdle = new Hurdle(this, 0, 'hurdle');
            //hurdle.setGravityY(0);
            hurdle.scale = 0.75;
            this.hurdleGroup.add(hurdle);
            this.children.bringToTop(this.runner)
        });
    }

    // Note : The runner doesn't move, the world around them does. What is this function for?
    setRunnerVelocity(runner){
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
        // hurdle.destroy(); // Hurdles persist with collision disabled
        // get oofed m8
        this.cameras.main.shake(100, 0.01);
        if (this.trip_sfx.isPlaying == false){
            this.trip_sfx.play();
        }

        // An attempt at creating I-frames so that the player is less likely to die
        // simply because theyve been slowed down too much to jump over other hurdles
        // this.bushwhack.active = false;
        // this.time.delayedCall(2000, () => {this.bushwhack.active = true;});

        //console.log('poof!')
        this.scrollSpeed /= 3;
        this.scrollSpeed *= 2;
        if(this.scrollSpeed < this.scrollSpeedCap / 3){
            this.scrollSpeed = this.scrollSpeedCap / 3;
        }
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

    distext(){
        // let distext = this.make.bitmapText({
        //     x: 5 * game.config.width / 8,
        //     y: game.config.height / 2,
        //     text: `${this.distance}`,
        //     font: 'font',
        //     size: false,
        //     align: 0,
        //     // origin: {x: 0.5, y: 0.5},
        //     add: true
        // }).setOrigin(0, 0.5);
        // distext.setBlendMode('ADD').setTint(0xfff);
        // this.tweens.add({
        //     targets: [distext],
        //     duration: 500,
        //     x: { from: 5 * game.config.width / 8, to: 3 * game.config.width / 8 },
        //     alpha: { from: 1, to: 0 },
        //     onComplete: function() {
        //         distext.destroy();
        //     }
        // });
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
            this.physics.world.overlap(this.hurdleGroup, this.runner, this.hurdleCollision, null, this);

            // if(this.runner.x < 100){
            //     this.runner.x = 200;
            //     this.setRunnerVelocity(this.runner); // I dont know why i cant just
            //                                                         // this.runner.setVelocityX(0)
            //                                                         // but this works because okay.
            // }

            // Only I say if you can fall through the earth, Boy
            if(this.runner.y > game.config.height){
                this.runner.y = game.config.height - tileSize * 2;
            }

            if(this.scrollSpeed < this.scrollSpeedCap){
                this.scrollSpeed += .005 * (this.scrollSpeedCap - this.scrollSpeed) - 0.0001;
                if(this.scrollSpeed > this.scrollSpeedCap) {this.scrollSpeed = this.scrollSpeedCap}
            }
            this.hades.anims.play('hades', true)

            // reset jumps
            if(this.physics.world.overlap(this.runner, this.hurdleGroup)){
                this.runner.anims.play('trip', true)
            }
            else if(this.runner.body.touching.down) {
                this.runner.anims.play('run', true);
                if (!this.step_sfx.isPlaying){
                    this.step_sfx.play()
                }
                this.jumping = false;
            } else {
                this.runner.anims.play('jump', true);
            }

            if(Phaser.Input.Keyboard.DownDuration(keySPACE, 150) && !this.jumping) {
                this.runner.body.velocity.y = this.jumpSpeed;
                this.jumping = true;
                this.sound.play('sfx_jump');
                if(Phaser.Input.Keyboard.DownDuration(keySPACE, 450)) {
                    this.runner.body.velocity.y = this.jumpSpeed;
                } 
            }
            
            // Parallax
            this.foregroundStones.tilePositionX += this.scrollSpeed;
            this.backgroundPillars.tilePositionX += this.scrollSpeed / 4;
            this.spikes.tilePositionX += this.scrollSpeed / 6;
            this.shore.tilePositionX += this.scrollSpeed / 2;
            this.shoreReflection.tilePositionX += this.scrollSpeed / 2;
            this.pillarReflection.tilePositionX += this.scrollSpeed / 4;
            
            // How to make short hop vs long jump?

            this.distTimer += delta;
            if(this.distTimer >= 1000){
                this.distTimer -= 1000;
                this.distance += Math.round(this.scrollSpeed);

                // Absolutely not ripped off of Nathan's code, nope. It totally is.
                this.distext()
                //console.log(this.distance);
            }

            // this.hurdleSpawn -= delta;
            // if(this.hurdleSpawn <= 0){
            //     this.addHurdle();
            //     this.hurdleSpawn += Math.random() * 600 + 400; // between 0.5 and 0.2s per spawn
            // }
            
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
        
    }
}