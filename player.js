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
    this.prevDir = null;

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

    if (this.game.gameState !== "playing") return;

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
      this.speed = Math.max(
        -this.maxSpeed,
        Math.min(this.maxSpeed, this.speed),
      );
    } else {
      if (this.speed > 0)
        this.speed = Math.max(0, this.speed - this.deceleration * dt);
      else if (this.speed < 0)
        this.speed = Math.min(0, this.speed + this.deceleration * dt);
    }

    // Track if ship is moving for animation
    this.isMoving = Math.abs(this.speed) > 5;

    // Turning
    this.angle += turn * this.turnSpeed * dt;

    // Update velocity & position
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Keep inside canvas
    this.x = Math.max(
      this.width / 2,
      Math.min(this.game.ctx.canvas.width - this.width / 2, this.x),
    );
    this.y = Math.max(
      this.height / 2,
      Math.min(this.game.ctx.canvas.height - this.height / 2, this.y),
    );

    this.updateBoundingCircle();

    // Collisions and parking
    for (let entity of this.game.entities) {
      if (entity === this || !entity.boundingCircle) continue;

      // Lose condition
      if (this.boundingCircle.collide(entity.boundingCircle)) {
        if (entity instanceof EnemyShip || entity instanceof FireAsteroid) {
          this.HP -= 1;
          console.log("You collided with an enemy! HP:", this.HP);
          if (this.HP <= 0) {
            this.game.gameState = "lost";
            this.game.message = "YOU LOSE!";
            this.speed = 0;
            setTimeout(() => resetLevel(this.game), 2000);
            return;
          }
        }
      }

      if (entity.boundingRect) {
        if (this.circleRectCollide(this.boundingCircle, entity.boundingRect)) {
          if (entity instanceof Wall) {
            this.HP -= 1;
            console.log("You collided with an enemy! HP:", this.HP);
            if (this.HP <= 0) {
              this.game.gameState = "lost";
              this.game.message = "YOU LOSE!";
              this.speed = 0;
              setTimeout(() => resetLevel(this.game), 2000);
              return;
            }
          }
        }
      }
    }
  }

  draw(ctx) {
    // Draw sprite: frame 0 = idle, frame 1 = moving
    this.drawSprite(ctx, this.x, this.y, this.angle, this.isMoving ? 1 : 0);

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

    // Draw message if game over/win
    if (this.game.gameState !== "playing") {
      ctx.save();
      ctx.fillStyle = "yellow";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        this.game.message,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2,
      );
      ctx.restore();
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
  }

  // helper function to help collide with walls
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
}
