class Background {
    constructor(game) {
        this.game = game;
        this.stars = [];
        this.STAR_COUNT = 150;
        this.speedX = 0.2; // horizontal speed (pixels per frame)
        this.speedY = 0.3; // vertical speed (pixels per frame)

        this.makeStars();
    }

    makeStars() {
        const w = this.game.ctx.canvas.width;
        const h = this.game.ctx.canvas.height;

        this.stars = [];
        for (let i = 0; i < this.STAR_COUNT; i++) {
            this.stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() < 0.85 ? 1 : 2
            });
        }
    }

    update() {
        const w = this.game.ctx.canvas.width;
        const h = this.game.ctx.canvas.height;

        for (const s of this.stars) {
            s.x += this.speedX;
            s.y += this.speedY;

            // wrap around horizontally
            if (s.x > w) s.x = 0;
            if (s.x < 0) s.x = w;

            // wrap around vertically
            if (s.y > h) s.y = 0;
            if (s.y < 0) s.y = h;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = "white";
        for (const s of this.stars) {
            ctx.fillRect((s.x | 0), (s.y | 0), s.size, s.size);
        }

        ctx.restore();
    }
}
