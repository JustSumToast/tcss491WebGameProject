class PlayerShip extends Entity {
  constructor(game, x, y) {
    super(game, x, y, 40, 20); // Call Entity constructor with width=40, height=20

    this.angle = 0; // rotation in radians
    this.vx = 0; // velocity x
    this.vy = 0; // velocity y
    this.speed = 0; // current speed
    this.maxSpeed = 200; // pixels per second
    this.acceleration = 300; // acceleration rate
    this.deceleration = 200; // deceleration rate
    this.turnSpeed = 3; // radians per second
    this.HP = 1; // set health point = 1 for now will increase in future
    this.prevDir = null;
  }

  update() {
    const dt = this.game.clockTick;

    // Handle input
    let accelerate = 0;
    let turn = 0;

    if (this.game.keys["w"] || this.game.keys["W"]) {
      accelerate = 1; // forward
      this.prevDir = accelerate;
    }
    if (this.game.keys["s"] || this.game.keys["S"]) {
      accelerate = -1; // reverse
      this.prevDir = accelerate;
    }
    if (this.game.keys["a"] || this.game.keys["A"]) {
      turn = -1; // left
      // Only accelerate with A if W/S are not pressed
      if (
        !(
          this.game.keys["w"] ||
          this.game.keys["W"] ||
          this.game.keys["s"] ||
          this.game.keys["S"]
        )
      ) {
        // A makes it go only when not using W/S
        if (this.prevDir) {
          accelerate = this.prevDir;
        } else {
          accelerate = 1;
          this.prevDir = accelerate;
        }
      }
    }
    if (this.game.keys["d"] || this.game.keys["D"]) {
      turn = 1; // right
      // Only accelerate with D if W/S are not pressed
      if (
        !(
          this.game.keys["w"] ||
          this.game.keys["W"] ||
          this.game.keys["s"] ||
          this.game.keys["S"]
        )
      ) {
        if (this.prevDir) {
          accelerate = this.prevDir;
        } else {
          accelerate = 1;
          this.prevDir = accelerate;
        } // D makes it go only when not using W/S
      }
    }

    // Apply acceleration/deceleration
    if (accelerate !== 0) {
      this.speed += accelerate * this.acceleration * dt;
      this.speed = Math.max(
        -this.maxSpeed,
        Math.min(this.maxSpeed, this.speed),
      );
    } else {
      // Decelerate when no input
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.deceleration * dt);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.deceleration * dt);
      }
    }

    // Apply turning
    if (turn !== 0) {
      this.angle += turn * this.turnSpeed * dt;
    }

    // Update velocity based on angle and speed
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Keep within canvas bounds (simple boundary)
    this.x = Math.max(
      this.width / 2,
      Math.min(this.game.ctx.canvas.width - this.width / 2, this.x),
    );
    this.y = Math.max(
      this.height / 2,
      Math.min(this.game.ctx.canvas.height - this.height / 2, this.y),
    );

    // Update bounding circle after position changes
    this.updateBoundingCircle();

    // Check collisions with other entities
    for (let entity of this.game.entities) {
      // Skip self and entities without bounding circles
      if (entity === this || !entity.boundingCircle) continue;

      if (this.boundingCircle.collide(entity.boundingCircle)) {
        // Collision detected! Handle it here
        if (entity instanceof EnemyShip) {
          this.HP -= 1;
          console.log("Collision with enemy! HP:", this.HP);

          // Check if player is dead
          if (this.HP <= 0) {
            resetLevel();
            return; // Stop update since level is resetting
          }
        }
      }
    }

    // Debug output
    if (this.game.options.debugging) {
      console.log(
        `Position: (${this.x.toFixed(1)}, ${this.y.toFixed(1)}), Speed: ${this.speed.toFixed(1)}, Angle: ${((this.angle * 180) / Math.PI).toFixed(1)}°`,
      );
    }
  }

  draw(ctx) {
    ctx.save();

    // Move to ship position and rotate
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw bounding box (rectangle)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw a simple direction indicator (triangle at front)
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2 - 10, -5);
    ctx.lineTo(this.width / 2 - 10, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw bounding circle (shows actual collision area)
    this.boundingCircle.draw(ctx);

    // Optional: Draw velocity vector for debugging
    if (this.game.options.debugging) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 0.1, this.y + this.vy * 0.1);
      ctx.stroke();
    }
  }
}
