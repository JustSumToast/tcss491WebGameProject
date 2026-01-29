class GoalCircle extends Entity {
  constructor(game, x, y, radius = 30) {
    super(game, x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.updateBoundingCircle();
  }

  updateBoundingCircle() {
    this.boundingCircle = new BoundingCircle(this.x, this.y, this.radius);
  }

  update() {
    for (let entity of this.game.entities) {
      if (entity instanceof PlayerShip) {
        if (this.boundingCircle.contains(entity.boundingCircle)) {
          if (this.game.gameState !== "won") {
            // prevent multiple triggers
            this.game.gameState = "won";
            this.game.message = "YOU WIN!";
            entity.speed = 0;
            setTimeout(() => resetLevel(this.game), 2000);
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
