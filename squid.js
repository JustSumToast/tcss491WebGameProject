class Squid extends Entity {
    constructor(game, x, y, direction) {
        super(game, x, y, 80, 80);

        this.direction = direction; // 1 = right, -1 = left
        this.speed = 250;

        this.sprite = new Image();
        this.sprite.src = "./images/minecraftsquid.png";

        this.frames = [
            { x: 9, y: 17, w: 50, h: 46 },
            { x: 9, y: 80, w: 50, h: 48 },
            { x: 9, y: 141, w: 50, h: 47 },
            { x: 9, y: 201, w: 50, h: 53 },
            { x: 9, y: 265, w: 50, h: 50 },
            { x: 9, y: 329, w: 50, h: 49 },
            { x: 9, y: 385, w: 50, h: 59 },
            { x: 9, y: 452, w: 50, h: 64 },
            { x: 9, y: 521, w: 50, h: 54 },
            { x: 5, y: 589, w: 54, h: 50 }
        ];

        this.frameIndex = 0;
        this.frameTimer = 0;
        this.frameSpeed = 0.08;
    }

    update() {
        const dt = this.game.clockTick;

        this.x += this.direction * this.speed * dt;

        this.frameTimer += this.game.clockTick;

        if (this.frameTimer > this.frameSpeed) {
            this.frameIndex++;
            this.frameIndex %= this.frames.length;
            this.frameTimer = 0;
        }

        // Remove when off screen
        if (this.x < -200 || this.x > this.game.ctx.canvas.width + 200) {
            this.removeFromWorld = true;
        }
    }

    draw(ctx) {
        const frame = this.frames[this.frameIndex];

        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            this.sprite,
            frame.x, frame.y,
            frame.w, frame.h,
            -frame.w / 2,
            -frame.h / 2,
            frame.w * 2,
            frame.h * 2
        );

        ctx.restore();
    }
}