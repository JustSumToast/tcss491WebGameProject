class Interactable extends Entity {
  constructor(game, x, y, type) {
    const size = 14; // <-- pick any size you want (30-60 is fine)
    super(game, x, y, size, size);
    this.type = type;
  }

  update() {
    this.updateBoundingCircle();

    // Better (and faster): check only the player
    const player = this.game.entities.find(e => e instanceof PlayerShip);
    if (!player || !player.boundingCircle) return;

    if (this.boundingCircle.collide(player.boundingCircle)) {
      this.activate(player);
    }
  }

  activate(player) {
    this.removeFromWorld = true;

    if (this.type === "shield") {
      player.shieldActive = true;
      player.shieldAcquireSound.currentTime = 0;
      player.shieldAcquireSound.play().catch(() => {});
      //console.log("Shield activated")
    } 

    if (this.type === "squid") {
        player.applyInk();
        //console.log("squid deployed");
    }

    if (this.type === "poptart") {
      this.game.poptartCount += 1;
      player.poptartSound.currentTime = 0;
      player.poptartSound.play().catch(() => {});
      //console.log("Total poptarts:", this.game.poptartCount);
      this.removeFromWorld = true;
    }
  }

  draw(ctx) {
    if (!this.time) this.time = 0;
    this.time += this.game.clockTick;

    // Shield
    if (this.type === "shield") {

        const flicker = 0.75 + Math.sin(this.time * 6 + Math.PI / 2) * 0.15;

        const glow = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );

        glow.addColorStop(0, `rgba(80, 160, 255, ${0.6 * flicker})`);
        glow.addColorStop(0.6, `rgba(40, 120, 255, ${0.25 * flicker})`);
        glow.addColorStop(1, "rgba(40, 120, 255, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(120, 190, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Squid
    else if (this.type === "squid") {

        const flicker = 0.7 + Math.sin(this.time * 8 + Math.PI / 2) * 0.15;

        const glow = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );

        glow.addColorStop(0, `rgba(80, 255, 120, ${0.6 * flicker})`);
        glow.addColorStop(0.6, `rgba(40, 255, 100, ${0.25 * flicker})`);
        glow.addColorStop(1, "rgba(40, 255, 100, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(120, 255, 150, 0.9)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    //Poptart
    else if (this.type === "poptart") {

    if (!this.time) this.time = 0;
    this.time += this.game.clockTick;

    const flicker = 0.85 + Math.sin(this.time * 6) * 0.15;

    const glow = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius * 3
    );

    // Soft pink glow
    glow.addColorStop(0, `rgba(255, 150, 200, ${0.6 * flicker})`);
    glow.addColorStop(0.6, `rgba(255, 80, 160, ${0.3 * flicker})`);
    glow.addColorStop(1, "rgba(255, 80, 160, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Bright pink core
    ctx.fillStyle = "rgba(255, 180, 220, 0.9)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
}
  }
}
