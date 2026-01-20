class Background {
    constructor(game) {
        this.game = game;
        this.stars = [];
        this.STAR_COUNT = 150;

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
        // no movement for now
    }

    draw(ctx) {
        // IMPORTANT: never mess up the ctx state for other entities
        ctx.save();

        // Do NOT clearRect or fillRect the whole screen here.
        // Only draw stars.
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = "white";
        for (const s of this.stars) {
            // integer positions reduce blur on some browsers
            ctx.fillRect((s.x | 0), (s.y | 0), s.size, s.size);
        }

        ctx.restore();
    }
}