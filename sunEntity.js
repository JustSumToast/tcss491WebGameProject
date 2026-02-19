// Animated Sun entity - reusable across levels

class Sun extends Entity {
    constructor(game, x, y, size) {
        super(game, x, y, size, size);

        this.setupSprite({
            path: "./images/sun.png",
            frameWidth: 800,
            frameHeight: 450,
            frameCount: 3,
            scale: size / 450,
        });

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.2;
        this.removeFromWorld = false;
        // no boundingCircle = no collision
        this.boundingCircle = null;

        // asteroid spawning
        this.spawnTimer = 0;
        this.spawnInterval = 1.5; // seconds between spawns
    }

    update() {
        this.frameTimer += this.game.clockTick;
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer -= this.frameDuration;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }

        // spawn fire asteroids
        this.spawnTimer += this.game.clockTick;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer -= this.spawnInterval;
            const count = 3 + Math.floor(Math.random() * 3); // 3-5 fireballs
            const baseAngle = Math.random() * Math.PI * 2;
            for (let i = 0; i < count; i++) {
                const angle = baseAngle + (Math.PI * 2 / count) * i + (Math.random() * 0.3 - 0.15);
                const speed = 120 + Math.random() * 80;
                this.game.addEntity(new FireAsteroid(
                    this.game, this.x, this.y, angle, speed,
                    "./images/fireball1.png", 800, 450, 3, 0.175
                ));
            }
        }
    }

    draw(ctx) {
        this.drawSprite(ctx, this.x, this.y, 0, this.currentFrame);
    }
}
