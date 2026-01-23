/**
 * Bounding Circle class for collision detection
 * Works well with rotating objects since circles have no orientation
 */
class BoundingCircle {
    constructor(x, y, radius) {
        this.x = x;      // center x
        this.y = y;      // center y
        this.radius = radius;
    }

    /**
     * Check if this circle collides with another circle
     * @param {BoundingCircle} other The other bounding circle
     * @returns {boolean} True if collision detected
     */
    collide(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }

    /**
     * Draw the bounding circle for debugging
     * @param {CanvasRenderingContext2D} ctx The canvas context
     * @param {string} color The stroke color (default: lime)
     */
    draw(ctx, color = "lime") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}
