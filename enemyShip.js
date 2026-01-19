class EnemyShip {
    constructor(game, x, y, angle = 0, image = null, spriteX = 0, spriteY = 0, spriteWidth = null, spriteHeight = null) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle; // rotation in radians
        this.width = 40;
        this.height = 20;
        this.removeFromWorld = false;

        // Image and sprite support
        this.image = image;
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.spriteWidth = spriteWidth || this.width;
        this.spriteHeight = spriteHeight || this.height;
    }

    update() {
        // Static enemy - no movement
    }

    draw(ctx) {
        ctx.save();

        // Move to enemy position and rotate
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Draw image if available, otherwise draw placeholder
        if (this.image) {
            // Draw sprite from spritesheet or full image
            ctx.drawImage(
                this.image,
                this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight,
                -this.width/2, -this.height/2, this.width, this.height
            );
        } else {
            // Draw placeholder rectangle
            ctx.strokeStyle = 'gray';
            ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
            ctx.lineWidth = 2;
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);

            // Draw a simple direction indicator
            ctx.fillStyle = 'darkgray';
            ctx.beginPath();
            ctx.moveTo(this.width/2, 0);
            ctx.lineTo(this.width/2 - 10, -5);
            ctx.lineTo(this.width/2 - 10, 5);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}
