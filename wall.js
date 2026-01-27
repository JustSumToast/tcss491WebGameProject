class Wall extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y);
        this.width = width;
        this.height = height;
        this.sprite = this.sprite;
        
    }

    

    update() {
        //nothing yet
    }

    draw(ctx) {
        ctx.save();

        if (this.sprite) {
            // Draw sprite centered
            ctx.drawImage(
                this.sprite,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback rectangle (debug / placeholder)
            ctx.fillStyle = "gray";
            ctx.fillRect(
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }

        ctx.restore();
    }
}