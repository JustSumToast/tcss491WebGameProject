class Wall extends Entity {
    constructor(game, x, y, width, height) {
        super(game, x, y);

        this.width = width;
        this.height = height;

        this.sprite = ASSET_MANAGER.getAsset("./images/spacewalltexture.jpg");
        this.pattern = null;

        this.boundingCircle = {
            x: this.x,
            y: this.y,
            radius: 1
        };

        this.boundingRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    update() {
        this.boundingCircle.x = this.x;
        this.boundingCircle.y = this.y;

        this.boundingRect.x = this.x;
        this.boundingRect.y = this.y;
    }

    draw(ctx) {
        ctx.save();

        const left = this.x - this.width / 2;
        const top = this.y - this.height / 2;

        if (this.sprite && this.sprite.complete && this.sprite.naturalWidth > 0) {

            if (!this.pattern) {
                this.pattern = ctx.createPattern(this.sprite, "repeat");
            }

            if (this.pattern) {
                ctx.fillStyle = this.pattern;
                ctx.fillRect(left, top, this.width, this.height);
            }
        }

        if (this.game.options.debugging) {
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(left, top, this.width, this.height);
        }

        ctx.restore();
    }
}
