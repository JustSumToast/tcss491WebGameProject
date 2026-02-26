// Animated Sun entity - reusable across levels

class Sun extends Entity {
    constructor(game, x, y, size) {
        super(game, x, y, size, size);

        this.setupSprite({
            path: "./images/sun.png",
            frameWidth: 800,
            frameHeight: 450,
            frameCount: 3,
            scale: size / 450,
        });

        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDuration = 0.2;
        this.removeFromWorld = false;
        this.radius = (size / 2) * 0.85;
        this.updateBoundingCircle();

        // burn countdown
        this.burnDuration = 10;
        this.burnTimer = this.burnDuration;

        // asteroid spawning
        this.spawnTimer = 0;
        this.spawnInterval = 1.5; // seconds between spawns
    }

    update() {
        this.frameTimer += this.game.clockTick;
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer -= this.frameDuration;
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }

        // countdown burn timer
        if (this.game.gameState === "playing") {
            this.burnTimer -= this.game.clockTick;
            if (this.burnTimer <= 0) {
                this.burnTimer = 0;
                this.game.gameState = "lost";
                this.game.message = "YOU BURNED!";
                setTimeout(() => resetLevel(this.game), 2000);
            }
        }

        // spawn fire asteroids
        this.spawnTimer += this.game.clockTick;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer -= this.spawnInterval;
            const count = 3 + Math.floor(Math.random() * 3); // 3-5 fireballs
            const baseAngle = Math.random() * Math.PI * 2;
            for (let i = 0; i < count; i++) {
                const angle = baseAngle + (Math.PI * 2 / count) * i + (Math.random() * 0.3 - 0.15);
                const speed = 120 + Math.random() * 80;
                this.game.addEntity(new FireAsteroid(
                    this.game, this.x, this.y, angle, speed,
                    "./images/fireball1.png", 800, 450, 3, 0.175
                ));
            }
        }
    }

    draw(ctx) {
        this.drawSprite(ctx, this.x, this.y, 0, this.currentFrame);
        this.drawHeatBar(ctx);
    }

    drawHeatBar(ctx) {
        const canvas = ctx.canvas;
        const barW = 200;
        const barH = 16;
        const barX = (canvas.width - barW) / 2;
        const barY = 58;
        // filled proportion grows from 0 (full time) to 1 (burned)
        const filled = 1 - (this.burnTimer / this.burnDuration);
        // color fades from dark grey (empty) to bright red (full)
        const red = Math.round(filled * 255);
        ctx.save();

        // background
        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, barW, barH);

        // heat fill
        ctx.fillStyle = `rgb(${red}, 0, 0)`;
        ctx.fillRect(barX, barY, barW * filled, barH);

        // border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // label
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`HEAT: ${Math.ceil(this.burnTimer)}s`, canvas.width / 2, barY + barH / 2);

        ctx.restore();
    }
}
