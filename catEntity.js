class CatEntity extends Entity {
    constructor(game, x, y, size) {
        super(game, x, y, size, size);

        this.setupSprite({
            path: "./images/nyan_cat.png",
            frameWidth: 150,
            frameHeight: 105,
            frameCount: 6,
            scale: size / 100
        });

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.12;

        // hitbox
        this.radius = 60;
        this.updateBoundingCircle();
    }

    update() {

        // animation
        this.frameTimer += this.game.clockTick;
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer -= this.frameDuration;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
        

        this.updateBoundingCircle();
    }

    draw(ctx) {
        this.drawSprite(ctx, this.x, this.y, 0, this.currentFrame);

    }
}