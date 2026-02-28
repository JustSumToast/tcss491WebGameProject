class GoalCircle extends Entity {
  constructor(game, x, y, radius = 30) {
    super(game, x, y, radius * 2, radius * 2);

    this.radius = radius;
    this.size = radius * 2;

    this.holdTime = 0;
    this.winThreshold = 1500; // milliseconds required to hold
    this.meterScale = 2.5; // how far out meter starts

    // Texture
    this.sprite = ASSET_MANAGER.getAsset("./images/parkingptexture.png");

    // **Win sound**
    this.winSound = new Audio("./sounds/winnoise.mp3");
    this.winSound.volume = 0.5;

    this.updateBoundingCircle();
  }

  // Update the bounding circle for collision detection
  updateBoundingCircle() {
    this.boundingCircle = new BoundingCircle(this.x, this.y, this.radius);
  }

  update() {
    // Check all entities for interaction with goal
    for (let entity of this.game.entities) {
        if (entity instanceof PlayerShip) {
            // checking if speed is low/stopped
            const lowSpeedThreshold = 15; // adjust as needed
            const isSlow = Math.abs(entity.speed) <= lowSpeedThreshold;

            // goal handling: player must be within circle and moving slowly
            const isHolding = this.boundingCircle.collide(entity.boundingCircle) && isSlow;

            if (isHolding) {
                // increment hold time while staying in position
                this.holdTime += this.game.clockTick * 1000;

                // trigger win if holdTime exceeds threshold
                if (this.holdTime >= this.winThreshold) {
                    this.triggerWin(entity);
                }
            } else {
                // reset hold time if player moves away
                this.holdTime = 0;
            }
        }
    }
  }

  // Called when player wins
  triggerWin(entity) {
    if (this.game.gameState !== "won") {
      this.game.gameState = "won";
      this.game.message = "YOU WIN!";
      entity.speed = 0;

      // **Play win sound**
      this.winSound.play().catch(() => {});

      // Proceed to next level after 2 seconds
      setTimeout(() => {
        this.game.elapsedTime = 0;
        nextLevel(this.game);
      }, 2000);
    }
  }

  draw(ctx) {
    ctx.save();

    const left = this.x - this.size / 2;
    const top = this.y - this.size / 2;

    // Draw texture for square
    if (this.sprite && this.sprite.complete) {
      ctx.drawImage(
        this.sprite,
        left,
        top,
        this.size,
        this.size
      );
    } else {
      ctx.fillStyle = "blue";
      ctx.fillRect(left, top, this.size, this.size);
    }
    

    // animated shrinking square meter
    if (this.holdTime > 0) {
      const progress = Math.min(this.holdTime / this.winThreshold, 1);

      const startSize = this.size * this.meterScale;
      const currentSize =
        this.size + (startSize - this.size) * (1 - progress);

      const meterLeft = this.x - currentSize / 2;
      const meterTop = this.y - currentSize / 2;

      ctx.strokeStyle = "goldenrod";
      ctx.lineWidth = 4;
      ctx.strokeRect(meterLeft, meterTop, currentSize, currentSize);
    }

    ctx.restore();
  }
}