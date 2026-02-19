class Fog {
    constructor(game, radius = 180) {
        this.game = game;
        this.radius = radius; // visible area around player
    }

    update() {}

    draw(ctx) {
        const canvas = this.game.ctx.canvas;

        // Find player
        let player = null;
        for (let i = 0; i < this.game.entities.length; i++) {
            if (this.game.entities[i] instanceof PlayerShip) {
                player = this.game.entities[i];
                break;
            }
        }

        // If player not found, don't draw fog
        if (!player) return;

        const x = player.x;
        const y = player.y;
        const r = this.radius;

        ctx.save();

        // Create gradient: clear center → black outside
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.6, "rgba(0,0,0,0.7)");
        gradient.addColorStop(1, "rgba(0,0,0,1)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.restore();
    }
}