class Interactable extends Entity {
  constructor(game, x, y, type) {
    const size = 40; // <-- pick any size you want (30-60 is fine)
    super(game, x, y, size, size);
    this.type = type;
  }

  update() {
    this.updateBoundingCircle();

    // Better (and faster): check only the player
    const player = this.game.entities.find(e => e instanceof PlayerShip);
    if (!player || !player.boundingCircle) return;

    if (this.boundingCircle.collide(player.boundingCircle)) {
      this.activate();
    }
  }

  activate() {
    this.removeFromWorld = true;

    if (this.type === "shield") {
      console.log("Shield deployed");
    } else if (this.type === "bug") {
      console.log("Bug deployed");
    } else {
      console.log("Interactable activated:", this.type);
    }
  }

  draw(ctx) {
    // Temporary visual so you can see it
    ctx.fillStyle = (this.type === "shield") ? "cyan"
                 : (this.type === "bug") ? "green"
                 : "white";

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Debug collision circle
    if (this.boundingCircle) this.boundingCircle.draw(ctx, "yellow");
  }
}