class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('runner', '../assets/runner.gif')
    }

    create() {
        // Parameters
        this.obstacleSpeed = -450;
        this.obstacleSpeedCap = -1000;
        this.distance = 0;
        this.reverse = false;

        /* River variable settings:
         * 0 = Acheron
         * 1 = Cocytus
         * 2 = Phlegathon
         * 3 = Styx
         * 4 = Lethe
         */ 
        this.river = 0; 

        /*
        Status effects on player?
        this.stygianSlow;
        this.cocytusFrostbite;
        this.phlegathonFire;
        this.letheBleed; // Warrior hits runner
        */

        // Audio below this

        // Particles
        this.acheronColors = [0x000]; // ???
        this.cocytusColors = []; // Snow
        this.phlegathonColors = []; // lava
        this.stygianColors = []; // icky green shit idk
        this.letheColors = []; // not sure
        
        this.landingPoof = this.particleManager.createEmitter({
            lifespan: 300,
            alpha: {start: 0.7, end: 0.1},
            // tint varies based on location
            tint: this.acheronColors,
            // Idk how to use emitZone yet
            blendMode: 'ADD'
        });

        // Setting up runner
        this.runner = this.physics.add.sprite(32, 0, 'runner').setOrigin(0.5);
        // Reference alien sim for more

        // Hurdle group
        this.hurdleGroup = this.add.group({
            runChildUpdate: true
        })

        this.hurdleSpawn = 0;
        this.gameOver = false;
        this.distTimer = 0;
    }

    // Hurdle obstacle
    addHurdle() {

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
        this.runner.speed /= 2;
    }

    // Triggers when player fails to jump over long-jump
    jumpCollision() {
        this.runner.speed = 0;
        this.gameOver == true;
        // play sinking into longjump anim
    }

    // Triggers when player falls below an arbitrary speed for too long
    hadesVibeCheck() {
        this.runner.speed = 0;
        this.gameOver == true;
        // Play hades checking your vibe animation
    }

    riverChange() {
        // Update to also change parallax background and track color.
        // Sprite changes optional
        // I imagine a gradual change as well for the sprite changes.
        switch(this.river){
            case 0:
                this.landingPoof.tint = this.acheronColors;
                break;
            case 1:
                this.landingPoof.tint = this.cocytusColors;
                break;
            case 2:
                this.landingPoof.tint = this.phlegathonColors;
                break;
            case 3:
                this.landingPoof.tint = this.stygianColors;
                break;
            case 4:
                this.landingPoof.tint = this.letheColors;
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
            this.distTimer += delta;
            if(this.distTimer >= 1000){
                this.distTimer -= 1000;
                this.distance++;
            }
            if(this.hurdleSpawn == 0){
                this.hurdleSpawn = Math.random() * 300 + 200; // between 0.5 and 0.2s per spawn
            }
            else{
                this.hurdleSpawn -= delta;
                if(this.hurdleSpawn <= 0){
                    console.log("Spawning hurdle!");
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