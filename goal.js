class GoalCircle extends Entity {
  constructor(game, x, y, radius = 30) {
    super(game, x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.holdTime = 0;
    this.winThreshold = 2000; // milliseconds required to hold [5s]
    this.updateBoundingCircle();
    this.meterRadius = 2.5;
  }

  updateBoundingCircle() {
    this.boundingCircle = new BoundingCircle(this.x, this.y, this.radius);
  }

  update() {
    for (let entity of this.game.entities) {
      if (entity instanceof PlayerShip) {
        const isHolding = this.boundingCircle.contains(entity.boundingCircle);
        if (isHolding) {
          this.holdTime += this.game.clockTick * 1000; // convert to milliseconds
          if (this.holdTime >= this.winThreshold) {
            this.triggerWin(entity);
          }
        } else {
          this.holdTime = 0; // reset hold time if not holding
        }
      }
    }
  }

  triggerWin(entity) {
    if (this.game.gameState !== "won") {
      this.game.gameState = "won";
      this.game.message = "YOU WIN!";
      entity.speed = 0;
      setTimeout(() => nextLevel(this.game), 2000);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.stroke();
    if (this.holdTime > 0) {
      const progress = Math.min(this.holdTime / this.winThreshold, 1);
      const radGoalStart = this.radius * this.meterRadius;
      const radGoalEnd =
        this.radius + (radGoalStart - this.radius) * (1 - progress);
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        Math.min(radGoalStart, radGoalEnd),
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
}
