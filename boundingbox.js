/**
 * Bounding Circle class for collision detection
 * Works well with rotating objects since circles have no orientation
 */
class BoundingCircle {
  constructor(x, y, radius, game = null) {
    this.x = x;        // center x
    this.y = y;        // center y
    this.radius = radius;
    this.game = game;  // reference to the game engine for debug toggle
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
   * Check if the outer circle contains an inner circle
   * @param {BoundingCircle} inner The inner bounding circle
   * @returns {boolean} True if this circle completely contains the inner circle
   */
  contains(inner) {
    const outerLimitX = this.x + this.radius;
    const outerLimitY = this.y + this.radius;
    const innerLimitX = inner.x + inner.radius;
    const innerLimitY = inner.y + inner.radius;
    const innerMinX = inner.x - inner.radius;
    const innerMinY = inner.y - inner.radius;
    const outerMinX = this.x - this.radius;
    const outerMinY = this.y - this.radius;

    return (
      outerLimitX > innerLimitX &&
      outerLimitY > innerLimitY &&
      outerMinX < innerMinX &&
      outerMinY < innerMinY
    );
  }

  /**
   * Draw the bounding circle for debugging
   * Only draws if debug mode is ON
   * @param {CanvasRenderingContext2D} ctx The canvas context
   * @param {string} color The stroke color (default: lime)
   */
  draw(ctx, color = "lime") {
    // Only draw if debug mode is enabled
    if (!this.game || !this.game.showBoundingCircles) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}
