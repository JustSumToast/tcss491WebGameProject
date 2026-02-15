class EnemyShip extends Entity {
    constructor(game, x, y, angle = 0, image = null, spriteX = 0, spriteY = 0, spriteWidth = null, spriteHeight = null) {
        super(game, x, y, 40, 20);
        this.angle = angle;

        // REPLACE ONCE SPRITES ARE IN!
        this.setupSprite({
            path: "./images/playership.png",
            frameWidth: 969,
            frameHeight: 422,
            frameCount: 2,
            scale: 0.07,
        });

        // Image and sprite support
        this.image = image;
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.spriteWidth = spriteWidth || this.width;
        this.spriteHeight = spriteHeight || this.height;

        this.occupied = false; // track if player has parked
        this.updateBoundingCircle();
    }

    update() {
        this.updateBoundingCircle(); // in case enemy moves in future
    }
    

    draw(ctx) {
        // Use frame 0 (idle frame) for enemies
        this.drawSprite(ctx, this.x, this.y, this.angle, 0);

        // Draw bounding circle
        this.boundingCircle.draw(ctx);
    }
    

    isPlayerParked(player) {
        const left = this.x - this.width / 2;
        const right = this.x + this.width / 2;
        const top = this.y - this.height / 2;
        const bottom = this.y + this.height / 2;

        const cx = player.boundingCircle.x;
        const cy = player.boundingCircle.y;
        const r = player.boundingCircle.radius;

        return cx - r >= left && cx + r <= right && cy - r >= top && cy + r <= bottom;
    }
}
