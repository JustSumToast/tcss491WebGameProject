class FireAsteroid extends Entity {
    constructor(game, x, y, angle, speed, spritePath, spriteWidth, spriteHeight, frameCount, scale) {
        const hitSize = spriteHeight * scale * 0.35;
        super(game, x, y, hitSize, hitSize);
        this.angle = angle;
        this.speed = speed;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;

        this.setupSprite({
            path: spritePath,
            frameWidth: spriteWidth,
            frameHeight: spriteHeight,
            frameCount: frameCount,
            scale: scale,
        });

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.15;

        this.updateBoundingCircle();
    }

    update() {
        this.x += this.vx * this.game.clockTick;
        this.y += this.vy * this.game.clockTick;
        this.updateBoundingCircle();

        // animate frames
        if (this.frameCount > 1) {
            this.frameTimer += this.game.clockTick;
            if (this.frameTimer >= this.frameDuration) {
                this.frameTimer -= this.frameDuration;
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            }
        }

        // remove when off screen
        const canvas = this.game.ctx.canvas;
        if (this.x < -50 || this.x > canvas.width + 50 ||
            this.y < -50 || this.y > canvas.height + 50) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        // sprite faces left, so add Math.PI to face movement direction
        this.drawSprite(ctx, this.x, this.y, this.angle + Math.PI, this.currentFrame);
        this.boundingCircle.draw(ctx);
    }
}
