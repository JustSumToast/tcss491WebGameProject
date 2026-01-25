class EnemyShip extends Entity {
    constructor(game, x, y, angle = 0, image = null, spriteX = 0, spriteY = 0, spriteWidth = null, spriteHeight = null) {
        super(game, x, y, 40, 20);
        this.angle = angle;

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
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.image) {
            ctx.drawImage(
                this.image,
                this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight,
                -this.width / 2, -this.height / 2, this.width, this.height
            );
        } else {
            ctx.strokeStyle = 'gray';
            ctx.fillStyle = 'rgba(128,128,128,0.5)';
            ctx.lineWidth = 2;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

            ctx.fillStyle = 'darkgray';
            ctx.beginPath();
            ctx.moveTo(this.width / 2, 0);
            ctx.lineTo(this.width / 2 - 10, -5);
            ctx.lineTo(this.width / 2 - 10, 5);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

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
