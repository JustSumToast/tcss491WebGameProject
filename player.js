class PlayerShip extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 40, 20);

        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.maxSpeed = 200;
        this.acceleration = 300;
        this.deceleration = 200;
        this.turnSpeed = 3;
        this.HP = 1;

        //shield variables
        this.shieldActive = false;
        this.prevX = this.x; //player colliding with walls
        this.prevY = this.y; 
        this.invulnerable = false;
        this.invulnTimer = 0;
        this.knockbackX = 0;
        this.knockbackY = 0; 
        this.time = 0; // for shield animation
        this.prevDir = null;

        // Shield sounds
        this.shieldAcquireSound = new Audio("./sounds/shieldAcquireSound.mp3");
        this.shieldAcquireSound.volume = 0.6;
        this.shieldBreakSound = new Audio("./sounds/shieldBreakSound.mp3");
        this.shieldBreakSound.volume = 0.6;

        // Rocket moving sound
        this.rocketSound = new Audio("./sounds/rocketmovingnoise.mp3");
        this.rocketSound.loop = true;
        this.rocketSound.volume = 0.2;
        this.isRocketPlaying = false;

        // **Lose sound**
        this.loseSound = new Audio("./sounds/losenoise.mp3");
        this.loseSound.volume = 0.5;

        //Squid ink
        this.inked = false;
        this.inkTimer = 0;
        this.inkDuration = 6;
        this.inkSprite = new Image();
        this.inkSprite.src = "./images/greenink.png";
        this.inkFrameCount = 4;
        this.inkFrames = [
            { x: 0,   y: 0, w: 58, h: 56 },
            { x: 61,  y: 1, w: 65, h: 76 },
            { x: 128, y: 1, w: 40, h: 72 },
            { x: 172, y: 1, w: 38, h: 76 }
        ];

        this.inkSplats = [];

        //Squid attacks
        this.squidAttached = false;
        this.squidTimer = 0;
        this.squidDuration = 2.5; // seconds

        this.squidSprite = new Image();
        this.squidSprite.src = "./images/minecraftsquid.png";

        this.squidFrames = [
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

        this.squidFrameIndex = 0;
        this.squidFrameTimer = 0;
        this.squidFrameSpeed = 0.08;
        this.squidSpin = 0;          // current spin angle
        this.squidSpinSpeed = 6.0;   // radians/sec (tune)
        this.squidWiggleSpeed = 10;  // wiggles/sec (tune)
        this.squidWiggleAmp = 6;     // pixels (tune)

        //Squid sounds
        this.squidSound = new Audio("./sounds/squidsound.mp3");
        this.squidSound.volume = 0.7;

        // Poptart sound
        this.poptartSound = new Audio("./sounds/poptartsound.mp3");
        this.poptartSound.volume = 0.7;

        // Sprite setup
        this.setupSprite({
            path: "./images/playership.png",
            frameWidth: 969,
            frameHeight: 422,
            frameCount: 2,
            scale: 0.07,
        });

        this.isMoving = false;
        this.updateBoundingCircle();
    }

    update() {
        const dt = this.game.clockTick;
        this.time += this.game.clockTick;
        if (this.game.gameState !== "playing") {
            this.stopRocketSound();
            return;
        }
        //save previous position
        this.prevX = this.x;
        this.prevY = this.y;

        // Input
        let accelerate = 0;
        let turn = 0;

        if (this.game.keys["w"] || this.game.keys["W"]) {
            accelerate = 1;
            this.prevDir = accelerate;
        }
        if (this.game.keys["s"] || this.game.keys["S"]) {
            accelerate = -1;
            this.prevDir = accelerate;
        }
        if (this.game.keys["a"] || this.game.keys["A"]) turn = -1;
        if (this.game.keys["d"] || this.game.keys["D"]) turn = 1;

        if (turn !== 0 && accelerate === 0) accelerate = this.prevDir || 1;

        // Apply acceleration/deceleration
        if (accelerate !== 0) {
            this.speed += accelerate * this.acceleration * dt;
            this.speed = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.speed));
        } else {
            if (this.speed > 0) this.speed = Math.max(0, this.speed - this.deceleration * dt);
            else if (this.speed < 0) this.speed = Math.min(0, this.speed + this.deceleration * dt);
        }

        // Track if ship is moving for animation
        this.isMoving = Math.abs(this.speed) > 5;

        // Play or stop rocket sound based on movement
        if (this.isMoving) this.playRocketSound();
        else this.stopRocketSound();

        // Turning
        this.angle += turn * this.turnSpeed * dt;

        // Update velocity & position
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Apply gravity based on distance from goal
        if (this.game.gravityType === "distanceFromGoal") {
            const goal = this.game.entities.find(e => e instanceof GoalCircle);
            if (goal) {
                const dx = this.x - goal.x;
                const dy = this.y - goal.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const canvas = this.game.ctx.canvas;
                const maxDistance = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                let factor = distance / maxDistance;
                factor = factor * factor;
                const minG = this.game.minGravity || 0;
                const maxG = this.game.maxGravity || 0;
                const strength = minG + factor * (maxG - minG);
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * strength * this.game.clockTick;
                this.vy += Math.sin(angle) * strength * this.game.clockTick;
            }
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Keep inside canvas
        this.x = Math.max(this.width / 2, Math.min(this.game.ctx.canvas.width - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(this.game.ctx.canvas.height - this.height / 2, this.y));

        this.updateBoundingCircle();

        if (this.inked) {
            this.inkTimer -= this.game.clockTick;

            if (this.inkTimer <= 0) {
                this.inked = false;
            }
        }

        if (this.squidAttached) {

            this.squidTimer -= dt;

            // animate frames
            this.squidFrameTimer += dt;
            if (this.squidFrameTimer > this.squidFrameSpeed) {
                this.squidFrameIndex++;
                this.squidFrameIndex %= this.squidFrames.length;
                this.squidFrameTimer = 0;
            }

            // spin
            this.squidSpin += this.squidSpinSpeed * dt;

            if (this.squidTimer <= 0) {
                this.squidAttached = false;
                this.squidSpin - 0;
            }
        }

        // shield invulnerability timer
        if (this.invulnerable) {
            this.invulnTimer -= this.game.clockTick;
            if (this.invulnTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // shield knockback movement
        if (this.knockbackX !== 0 || this.knockbackY !== 0) {
            this.x += this.knockbackX * this.game.clockTick;
            this.y += this.knockbackY * this.game.clockTick;

            this.knockbackX *= 0.9;
            this.knockbackY *= 0.9;

            if (Math.abs(this.knockbackX) < 1) this.knockbackX = 0;
            if (Math.abs(this.knockbackY) < 1) this.knockbackY = 0;
        }

        // Collisions
        for (let entity of this.game.entities) {
            if (entity === this) continue;

            // Circle collision
            if (entity.boundingCircle &&
        this.boundingCircle.collide(entity.boundingCircle)) {
                if (entity instanceof EnemyShip || entity instanceof FireAsteroid || entity instanceof Sun) {
                    const dx = this.x - entity.x;
                    const dy = this.y - entity.y;
                    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
                    // immediate separation
                    this.x += (dx / mag) * 10;
                    this.y += (dy / mag) * 10;

                    // bounce velocity
                    this.knockbackX = (dx / mag) * 300;
                    this.knockbackY = (dy / mag) * 300;

                    if (!this.invulnerable) {

                        if (this.shieldActive) {
                            // shield absorbs hit
                            this.shieldActive = false;

                            this.shieldBreakSound.currentTime = 0;
                            this.shieldBreakSound.play().catch(() => {});

                            this.invulnerable = true;
                            this.invulnTimer = 1;

                            console.log("Shield broke!");
                        }
                        else {
                            // normal damage
                            this.HP -= 1;

                            console.log("Player damaged! HP:", this.HP);

                            if (this.HP <= 0) {
                                this.game.gameState = "lost";
                                this.game.message = "YOU LOSE!";
                                this.speed = 0;
                                this.stopRocketSound();
                                this.loseSound.play().catch(() => {});
                                setTimeout(() => resetLevel(this.game), 2000);
                                gameEngine.poptartCount = gameEngine.prevPopCount;
                                return;
                            }
                        }
                    }
                }
            }
            // Wall collision
            if (entity.boundingRect &&
        this.circleRectCollide(this.boundingCircle, entity.boundingRect) &&
        entity instanceof Wall) {

                console.log("Wall collision detected");

                this.x = this.prevX;
                this.y = this.prevY;
                this.updateBoundingCircle();

                // Stop forward movement
                this.speed = 0;
                this.vx = 0;
                this.vy = 0;

                // Apply bounce opposite facing direction
                this.knockbackX = -Math.cos(this.angle) * 200;
                this.knockbackY = -Math.sin(this.angle) * 200;

                if (!this.invulnerable) {

                    if (this.shieldActive) {
                        this.shieldActive = false;
                        this.shieldBreakSound.currentTime = 0;
                        this.shieldBreakSound.play().catch(() => {});
                        this.invulnerable = true;
                        this.invulnTimer = 1;
                        //console.log("Shield broke on wall!");
                    } else {
                        this.HP -= 1;
                        console.log("Hit wall! HP:", this.HP);

                        if (this.HP <= 0) {
                            this.game.gameState = "lost";
                            this.game.message = "YOU LOSE!";
                            this.speed = 0;
                            this.stopRocketSound();
                            this.loseSound.play().catch(() => {});
                            setTimeout(() => resetLevel(this.game), 2000);
                            setTimeout(() => gameEngine.poptartCount = gameEngine.prevPopCount, 1999);
                            return;
                        }
                    }
                }
            }
        }
    }


    draw(ctx) {
        let drawShip = true;

        if (this.invulnerable) {
            // Blink 10 times per second
            const blink = Math.floor(this.time * 20) % 2;
            drawShip = blink === 0;
        }

        if (drawShip) {
            // Draw sprite: frame 0 = idle, frame 1 = moving
            this.drawSprite(ctx, this.x, this.y, this.angle, this.isMoving ? 1 : 0);
        }

        // Direction triangle
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2 - 10, -5);
        ctx.lineTo(this.width / 2 - 10, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw bounding circle
        this.boundingCircle.draw(ctx);

        if (this.shieldActive) {

        const flicker = 0.85 + Math.sin(this.time * 6) * 0.1;

        const glow = ctx.createRadialGradient(
            this.x, this.y, this.radius,
            this.x, this.y, this.radius * 2.2
        );

        glow.addColorStop(0, "rgba(0, 0, 255, 0)");
        glow.addColorStop(0.5, `rgba(80, 160, 255, ${0.3 * flicker})`);
        glow.addColorStop(1, `rgba(40, 120, 255, ${0.6 * flicker})`);

        ctx.strokeStyle = glow;
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.8, 0, Math.PI * 2);
        ctx.stroke();
        }

        // Optional velocity vector
        if (this.game.options.debugging) {
            ctx.strokeStyle = "green";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.vx * 0.1, this.y + this.vy * 0.1);
            ctx.stroke();
        }

        if (this.squidAttached) {
            const frame = this.squidFrames[this.squidFrameIndex];

            // wiggle offsets in ship-space
            const wiggleX = Math.sin(this.time * this.squidWiggleSpeed) * this.squidWiggleAmp;
            const wiggleY = Math.cos(this.time * (this.squidWiggleSpeed * 0.8)) * (this.squidWiggleAmp * 0.6);

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle); // stick to ship orientation

            // position squid slightly above the ship center + wiggle
            ctx.translate(wiggleX, -10 + wiggleY);

            // spin the squid itself (on top of ship rotation)
            ctx.rotate(this.squidSpin);

            ctx.drawImage(
                this.squidSprite,
                frame.x, frame.y, frame.w, frame.h,
                -frame.w / 2, -frame.h / 2,
                frame.w * 1.6, frame.h * 1.6
            );

            ctx.restore();
        }

        //Drawing Ink
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

        if (this.inked) {

            const alpha = this.inkTimer / this.inkDuration;
            ctx.globalAlpha = alpha;

            for (let splat of this.inkSplats) {

                const frame = this.inkFrames[splat.frame];

                ctx.save();

                ctx.translate(splat.x, splat.y);
                ctx.rotate(splat.rotation);
                ctx.scale(splat.scale, splat.scale);

                ctx.drawImage(
                    this.inkSprite,
                    frame.x, frame.y,
                    frame.w, frame.h,
                    -frame.w / 2,
                    -frame.h / 2,
                    frame.w,
                    frame.h
                );

                ctx.restore();
            }
        }
        ctx.restore();
    }

    playRocketSound() {
        if (!this.isRocketPlaying) {
            this.rocketSound.currentTime = 0;
            this.rocketSound.play().catch(() => {});
            this.isRocketPlaying = true;
        }
    }

    stopRocketSound() {
        if (this.isRocketPlaying) {
            this.rocketSound.pause();
            this.rocketSound.currentTime = 0;
            this.isRocketPlaying = false;
        }
    }

    // Helper function to detect circle-rectangle collision
    circleRectCollide(circle, rect) {
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;
        const left = rect.x - halfW;
        const right = rect.x + halfW;
        const top = rect.y - halfH;
        const bottom = rect.y + halfH;
        const cx = circle.x;
        const cy = circle.y;
        const r = circle.radius;
        const closestX = Math.max(left, Math.min(cx, right));
        const closestY = Math.max(top, Math.min(cy, bottom));
        const dx = cx - closestX;
        const dy = cy - closestY;
        return dx * dx + dy * dy <= r * r;
    }

    applyInk() {
        console.log("INK APPLIED");
        this.inked = true;
        this.inkTimer = this.inkDuration;
        this.inkSplats = [];

        const splatCount = 20;

        for (let i = 0; i < splatCount; i++) {
            this.inkSplats.push({
                frame: Math.floor(Math.random() * this.inkFrames.length),
                x: Math.random() * this.game.ctx.canvas.width,
                y: Math.random() * this.game.ctx.canvas.height,
                rotation: Math.random() * Math.PI * 2,
                scale: 2.5 + Math.random() * 3
            });
        }
        this.squidAttached = true;
        this.squidTimer = this.squidDuration;
        this.squidSound.currentTime = 0;
        this.squidSound.play().catch(() => {});
    }
}