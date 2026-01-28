class Wall extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y);
        this.width = width;
        this.height = height;
        this.sprite = this.sprite;

        this.boundingCircle = {
            x: this.x,
            y: this.y,
            radius: 1
        }

        this.boundingRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        
    }

    

    update() {
        // keep colliders in sync
        this.boundingCircle.x = this.x;
        this.boundingCircle.y = this.y;

        this.boundingRect.x = this.x;
        this.boundingRect.y = this.y;
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

        // 🔍 Debug outline colliders
        if (this.game.options.debugging) {
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }

        ctx.restore();
    }
}